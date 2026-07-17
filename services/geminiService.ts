import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PlantAnalysis, ChatMessage, FeatureReport, RegionAnalysis, Language } from "../types";

const getGenAI = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Missing NEXT_PUBLIC_GEMINI_API_KEY");
  }
  return new GoogleGenAI({ apiKey: apiKey || "dummy-key" });
};

const regionAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    soilPotential: { type: Type.STRING },
    climateSuitability: { type: Type.STRING },
    waterSources: { type: Type.STRING },
    overallRating: { type: Type.STRING, enum: ['Excellent', 'Good', 'Average', 'Poor'] }
  },
  required: ['soilPotential', 'climateSuitability', 'waterSources', 'overallRating']
};

/**
 * @deprecated Use `/api/ai/analyse` endpoint instead.
 */
export const analyzePlantImage = async (base64Image: string, lang: Language): Promise<PlantAnalysis> => {
  throw new Error("DEPRECATED: Use /api/ai/analyse endpoint instead.");
};

/**
 * @deprecated Use `/api/ai/chat` endpoint instead.
 */
export const chatWithAgriBot = async (history: ChatMessage[], newMessage: string, lang: Language, context?: PlantAnalysis): Promise<string> => {
  throw new Error("DEPRECATED: Use /api/ai/chat endpoint instead.");
};

/**
 * @deprecated Use `/api/ai/summarise` endpoint instead.
 */
export const generateFeatureReport = async (featureId: string, context: { plant?: string, location?: string, soil?: string }, lang: Language): Promise<FeatureReport> => {
  throw new Error("DEPRECATED: Use /api/ai/summarise endpoint instead.");
};

export const analyzeRegion = async (lat: number, lon: number, lang: Language, areaData?: any): Promise<RegionAnalysis> => {
  try {
    let analysisPrompt = `Analyze the agricultural potential for the coordinates ${lat}, ${lon} in ${lang} language.`;
    
    if (areaData) {
      analysisPrompt += ` This is a selected land area for detailed agricultural analysis.`;
    }
    
    analysisPrompt += ` Provide detailed analysis on: 1. Soil potential and characteristics for this specific region 2. Climate suitability for various crops 3. Water sources and irrigation potential 4. Overall agricultural rating with specific recommendations.`;

    const response = await getGenAI().models.generateContent({
      model: "gemini-1.5-flash",
      contents: {
        parts: [
          {
            text: analysisPrompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: regionAnalysisSchema
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text) as RegionAnalysis;
  } catch (error) {
    console.error("Region analysis error", error);
    throw error;
  }
}