import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PlantAnalysis, ChatMessage, FeatureReport, RegionAnalysis, Language } from "../types";

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY in environment variables.");
    throw new Error("Missing GEMINI_API_KEY");
  }
  return new GoogleGenAI({ apiKey });
};

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    plantName: { type: Type.STRING, description: "The common name of the plant identified in the image" },
    diseaseName: { type: Type.STRING, description: "Name of the detected disease or 'Healthy'" },
    confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 1" },
    severity: { type: Type.NUMBER, description: "Severity percentage 0-100" },
    treatments: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3-5 actionable treatment steps"
    },
    isHealthy: { type: Type.BOOLEAN },
    pestsDetected: { type: Type.BOOLEAN },
    pestDetails: { type: Type.STRING, description: "Brief description of pests if found, else empty" },
    detectedPests: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Common name of the specific pest" },
          description: { type: Type.STRING, description: "Very short description of the pest" }
        }
      },
      description: "List of specific pests identified in the image, if any"
    },
    nutrientDeficiency: { type: Type.BOOLEAN },
    deficiencyDetails: { type: Type.STRING, description: "Brief description of deficiency if found, else empty" },
    weedDetected: { type: Type.BOOLEAN },
    yieldPrediction: { type: Type.STRING, description: "Short yield prediction based on health" },
    soilTypeRecommendation: { type: Type.STRING, description: "Detected or recommended soil type for this plant" },
    soilExplanation: { type: Type.STRING, description: "Why this soil is good" },
    recommendedCrops: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          suitability: { type: Type.STRING, enum: ["Highly Suitable", "Suitable", "Moderately Suitable"] }
        }
      }
    }
  },
  required: ["plantName", "diseaseName", "severity", "treatments", "soilTypeRecommendation", "recommendedCrops", "isHealthy"]
};

export const analyseImage = async (base64Image: string, lang: Language): Promise<PlantAnalysis> => {
  try {
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await getGenAI().models.generateContent({
      model: "gemini-1.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          {
            text: `Analyze this agricultural image in ${lang} language. 1. Identify the plant in ${lang}. 2. Detect diseases and specific pests (list names) in ${lang}. 3. Treatments in ${lang}. 4. Soil analysis in ${lang}.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as PlantAnalysis;
  } catch (error: any) {
    console.error("Analysis failed:", error);
    if (error.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    throw error;
  }
};

export const chatResponse = async (history: ChatMessage[], newMessage: string, lang: Language, context?: PlantAnalysis): Promise<string> => {
  try {
    let systemContext = `You are an expert AI Agricultural Advisor. Answer in ${lang} language only. Keep answers concise, simple, and easy to understand for farmers. Use bullet points.`;
    if (context) {
      systemContext += ` The user is currently looking at a ${context.plantName} which is ${context.isHealthy ? 'healthy' : 'unhealthy'}. Disease: ${context.diseaseName}. Soil: ${context.soilTypeRecommendation}.`;
    }

    const response = await getGenAI().models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        { role: 'user', parts: [{ text: systemContext }] },
        ...history.map(msg => ({ role: msg.role, parts: [{ text: msg.text }] })),
        { role: 'user', parts: [{ text: newMessage }] }
      ]
    });

    return response.text || "I'm having trouble connecting to the farm server.";
  } catch (error: any) {
    console.error("Chat error:", error);
    if (error.status === 429) {
      return "Rate limit exceeded. Please try again later.";
    }
    throw error;
  }
};

export const summariseFeature = async (featureId: string, context: { plant?: string, location?: string, soil?: string }, lang: Language): Promise<FeatureReport> => {
  try {
    const baseInstruction = `You are generating a report for a farmer in ${lang} language. Keep the language simple, concise, and actionable. Avoid jargon.`;
    
    const promptMap: Record<string, string> = {
      '1': `${baseInstruction} Generate a simple 3-day weather summary and farm work plan for ${context.plant || 'crops'}. Focus on: 1. Will it rain? 2. Is it safe to spray pesticides? 3. Key tasks to do.`,
      '2': `${baseInstruction} Create a simple watering guide for ${context.plant || 'crops'} on ${context.soil || 'standard'} soil. Tell the farmer exactly when to water (morning/evening) and how to check if the soil needs water.`,
      '3': `${baseInstruction} Analyze market trends for ${context.plant || 'vegetables'}. Simply state if prices are going up or down. Give 3 tips on when to sell for the best profit.`,
      '4': `${baseInstruction} Give a rough financial estimate for a 1-acre ${context.plant || 'crop'} farm. List simple costs (Seeds, Fertilizer, Labor) and expected income. Keep numbers round and simple.`,
      '5': `${baseInstruction} Explain 'Satellite Greenness Index' simply. Pretend you are looking at a satellite map of their farm. Tell them what 'Green' means (Healthy) and what 'Yellow' means (Needs water/fertilizer).`,
      '6': `${baseInstruction} List top 3 risks for farming ${context.plant || 'crops'} right now (e.g., Drought, Pests, Prices). For each risk, give one simple way to protect the farm.`,
      '7': `${baseInstruction} Suggest 3 simple ways to stop theft on the farm. Focus on low-cost ideas like lighting, fences, or community watch.`,
      '8': `${baseInstruction} Summarize a community discussion about ${context.plant || 'farming'}. List the top 3 most helpful tips shared by other farmers recently.`,
    };

    const prompt = promptMap[featureId] || `${baseInstruction} Generate a simple agricultural insight.`;

    const response = await getGenAI().models.generateContent({
      model: "gemini-1.5-flash",
      contents: { parts: [{ text: prompt }] },
    });

    return {
      title: "Generated Insight",
      content: response.text || "No data available."
    };
  } catch (error: any) {
    console.error("Feature generation error:", error);
    if (error.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    throw error;
  }
};
