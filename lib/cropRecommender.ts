import cropModelData from './crop_model.json';

export interface CropInputFeatures {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

export interface CropPredictionResult {
  recommendedCrop: string;
  confidence: number;
  topRecommendations: { crop: string; score: number }[];
  idealConditions?: {
    N: number;
    P: number;
    K: number;
    temperature: number;
    humidity: number;
    ph: number;
    rainfall: number;
  };
}

interface CropModel {
  classes: string[];
  class_prior: number[];
  theta: number[][]; // means per class per feature
  var: number[][];   // variances per class per feature
  features: string[];
}

const model: CropModel = cropModelData as CropModel;

export function predictCrop(input: CropInputFeatures): CropPredictionResult {
  const x = [
    input.N,
    input.P,
    input.K,
    input.temperature,
    input.humidity,
    input.ph,
    input.rainfall
  ];

  const logLikelihoods: { crop: string; classIdx: number; logProb: number }[] = [];

  for (let c = 0; c < model.classes.length; c++) {
    const prior = model.class_prior[c];
    let logProb = Math.log(prior);

    for (let f = 0; f < 7; f++) {
      const mean = model.theta[c][f];
      const variance = model.var[c][f];
      const val = x[f];

      // Gaussian log probability density function
      const logDensity = -0.5 * Math.log(2 * Math.PI * variance) - (Math.pow(val - mean, 2) / (2 * variance));
      logProb += logDensity;
    }

    logLikelihoods.push({
      crop: model.classes[c],
      classIdx: c,
      logProb
    });
  }

  // Sort by log likelihood descending
  logLikelihoods.sort((a, b) => b.logProb - a.logProb);

  // Softmax to normalize probabilities for relative confidence
  const maxLogProb = logLikelihoods[0].logProb;
  const expScores = logLikelihoods.map(item => Math.exp(item.logProb - maxLogProb));
  const sumExp = expScores.reduce((a, b) => a + b, 0);
  const normalizedProbabilities = expScores.map(score => score / sumExp);

  const topRecommendations = logLikelihoods.slice(0, 3).map((item, idx) => ({
    crop: item.crop.charAt(0).toUpperCase() + item.crop.slice(1),
    score: Math.round(normalizedProbabilities[idx] * 100)
  }));

  const winnerIdx = logLikelihoods[0].classIdx;
  const winnerMeans = model.theta[winnerIdx];

  return {
    recommendedCrop: topRecommendations[0].crop,
    confidence: topRecommendations[0].score,
    topRecommendations,
    idealConditions: {
      N: Math.round(winnerMeans[0]),
      P: Math.round(winnerMeans[1]),
      K: Math.round(winnerMeans[2]),
      temperature: Number(winnerMeans[3].toFixed(1)),
      humidity: Number(winnerMeans[4].toFixed(1)),
      ph: Number(winnerMeans[5].toFixed(1)),
      rainfall: Number(winnerMeans[6].toFixed(1))
    }
  };
}
