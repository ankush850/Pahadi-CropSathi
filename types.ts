export type Language = 'en' | 'hi' | 'pa' | 'ta' | 'te' | 'mr';

export interface WeatherData {
  temp: number;
  humidity: number;
  precipitation: number;
  conditionCode: number; // WMO Weather interpretation code
  isDay: boolean;
  alerts: {
    type: 'drought' | 'flood' | 'heat' | 'freeze' | 'none';
    level: 'low' | 'medium' | 'high';
    message: string;
  }[];
}

export interface CropRecommendation {
  name: string;
  suitability: 'Highly Suitable' | 'Suitable' | 'Moderately Suitable';
}

export interface PlantAnalysis {
  plantName: string;
  diseaseName: string;
  confidence: number;
  severity: number; // 0-100
  treatments: string[];
  isHealthy: boolean;
  pestsDetected: boolean;
  pestDetails?: string;
  detectedPests?: { name: string; description?: string }[]; // Structured pest data
  nutrientDeficiency: boolean;
  deficiencyDetails?: string;
  weedDetected: boolean;
  yieldPrediction?: string;
  soilTypeRecommendation: string;
  soilExplanation: string;
  recommendedCrops: CropRecommendation[];
}

export interface FeaturePlaceholder {
  id: string;
  name: string; // Key for translation
  icon: string;
  status: 'Coming Soon' | 'Beta' | 'Explore' | 'Live';
  description: string; // Key for translation
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface FeatureReport {
  title: string;
  content: string; // Markdown or HTML formatted string from Gemini
  dataPoints?: { label: string; value: string }[];
}

export interface RegionAnalysis {
  soilPotential: string;
  climateSuitability: string;
  waterSources: string;
  overallRating: 'Excellent' | 'Good' | 'Average' | 'Poor';
  areaSize?: string;
  coordinates?: string;
}