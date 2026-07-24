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
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await fetch('/api/ai/region', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ lat, lon, lang, areaData })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to analyze region');
    }

    return await response.json() as RegionAnalysis;
  } catch (error) {
    console.error("Region analysis error", error);
    throw error;
  }
};