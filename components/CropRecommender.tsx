import React, { useState } from 'react';
import { Sprout, TestTube, CloudSun, Droplets, Sparkles, CheckCircle2, RotateCcw, Thermometer, ShieldAlert, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';
import { fetchLocalWeather } from '../services/weatherService';

interface CropRecommenderProps {
  lang: Language;
}

interface PredictionResponse {
  recommendedCrop: string;
  confidence: number;
  topRecommendations: { crop: string; score: number }[];
  idealConditions: {
    N: number;
    P: number;
    K: number;
    temperature: number;
    humidity: number;
    ph: number;
    rainfall: number;
  };
}

export const CropRecommender: React.FC<CropRecommenderProps> = ({ lang }) => {
  const t = (key: string) => getTranslation(lang, key);

  const [form, setForm] = useState({
    N: 90,
    P: 42,
    K: 43,
    temperature: 24,
    humidity: 80,
    ph: 6.5,
    rainfall: 200
  });

  const [loading, setLoading] = useState(false);
  const [fetchingWeather, setFetchingWeather] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleAutoDetectWeather = async () => {
    setFetchingWeather(true);
    setError(null);
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser.');
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const data = await fetchLocalWeather(position.coords.latitude, position.coords.longitude);
            setForm(prev => ({
              ...prev,
              temperature: Math.round(data.temp * 10) / 10,
              humidity: Math.round(data.humidity)
            }));
          } catch (err: any) {
            setError(err.message || 'Failed to fetch weather');
          } finally {
            setFetchingWeather(false);
          }
        },
        () => {
          // Default to mountain region coordinates if blocked
          fetchLocalWeather(30.3165, 78.0322).then(data => {
            setForm(prev => ({
              ...prev,
              temperature: Math.round(data.temp * 10) / 10,
              humidity: Math.round(data.humidity)
            }));
          }).finally(() => setFetchingWeather(false));
        }
      );
    } catch (err: any) {
      setError(err.message || 'Failed to auto-detect weather.');
      setFetchingWeather(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to predict crop recommendation');
      }

      const data: PredictionResponse = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      N: 90,
      P: 42,
      K: 43,
      temperature: 24,
      humidity: 80,
      ph: 6.5,
      rainfall: 200
    });
    setResult(null);
    setError(null);
  };

  return (
    <div className="bg-white border border-cement-200 rounded-2xl shadow-sm overflow-hidden p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cement-100 pb-6 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Machine Learning Powered
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-cement-900 flex items-center gap-2">
            <Sprout className="w-6 h-6 text-green-600" />
            Soil-Based Crop Recommender
          </h2>
          <p className="text-xs md:text-sm text-cement-500 mt-1">
            Input soil nutrients (N-P-K), pH, and climate parameters to predict the most suitable crop for your land.
          </p>
        </div>

        <button
          onClick={handleAutoDetectWeather}
          disabled={fetchingWeather}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-cement-50 hover:bg-green-50 text-cement-700 hover:text-green-700 border border-cement-200 hover:border-green-300 rounded-xl text-xs font-medium transition-colors disabled:opacity-50 self-start md:self-auto"
        >
          <CloudSun className={`w-4 h-4 text-green-600 ${fetchingWeather ? 'animate-spin' : ''}`} />
          {fetchingWeather ? 'Detecting...' : 'Auto-fill Weather Data'}
        </button>
      </div>

      {/* Main Grid: Form + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="lg:col-span-6 space-y-5">
          {/* Soil Nutrients Section */}
          <div className="bg-cement-50/70 p-4 rounded-xl border border-cement-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-cement-500 mb-3 flex items-center gap-1.5">
              <TestTube className="w-4 h-4 text-amber-600" />
              Soil Nutrient Profile (N - P - K)
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label htmlFor="rec-input-N" className="block text-xs font-medium text-cement-700 mb-1">Nitrogen (N)</label>
                <input
                  id="rec-input-N"
                  type="number"
                  name="N"
                  min="0"
                  max="300"
                  value={form.N}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white border border-cement-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="rec-input-P" className="block text-xs font-medium text-cement-700 mb-1">Phosphorus (P)</label>
                <input
                  id="rec-input-P"
                  type="number"
                  name="P"
                  min="0"
                  max="300"
                  value={form.P}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white border border-cement-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="rec-input-K" className="block text-xs font-medium text-cement-700 mb-1">Potassium (K)</label>
                <input
                  id="rec-input-K"
                  type="number"
                  name="K"
                  min="0"
                  max="300"
                  value={form.K}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white border border-cement-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Climate & Environmental Parameters */}
          <div className="bg-cement-50/70 p-4 rounded-xl border border-cement-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-cement-500 mb-3 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-blue-600" />
              Climate & Soil Properties
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="rec-input-temp" className="block text-xs font-medium text-cement-700 mb-1">Temperature (°C)</label>
                <input
                  id="rec-input-temp"
                  type="number"
                  name="temperature"
                  step="0.1"
                  min="-10"
                  max="60"
                  value={form.temperature}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white border border-cement-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="rec-input-humidity" className="block text-xs font-medium text-cement-700 mb-1">Humidity (%)</label>
                <input
                  id="rec-input-humidity"
                  type="number"
                  name="humidity"
                  step="0.1"
                  min="0"
                  max="100"
                  value={form.humidity}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white border border-cement-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="rec-input-ph" className="block text-xs font-medium text-cement-700 mb-1">Soil pH (0 - 14)</label>
                <input
                  id="rec-input-ph"
                  type="number"
                  name="ph"
                  step="0.1"
                  min="0"
                  max="14"
                  value={form.ph}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white border border-cement-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="rec-input-rainfall" className="block text-xs font-medium text-cement-700 mb-1">Annual Rainfall (mm)</label>
                <input
                  id="rec-input-rainfall"
                  type="number"
                  name="rainfall"
                  step="0.1"
                  min="0"
                  max="1000"
                  value={form.rainfall}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white border border-cement-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing ML Model...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Predict Optimal Crop
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-2.5 bg-cement-100 hover:bg-cement-200 text-cement-600 rounded-xl text-sm transition-colors"
              title="Reset Form"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
        </form>

        {/* Prediction Output Section */}
        <div className="lg:col-span-6 flex flex-col">
          {result ? (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 flex-1 flex flex-col justify-between animate-fade-in">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-green-700 bg-green-100/80 px-2.5 py-1 rounded-md">
                    Top Recommendation
                  </span>
                  <span className="text-xs font-semibold text-green-800 bg-white/80 border border-green-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    {result.confidence}% Match Confidence
                  </span>
                </div>

                <div className="text-center my-6">
                  <h3 className="text-3xl font-extrabold text-green-900 tracking-tight">
                    🌾 {result.recommendedCrop}
                  </h3>
                  <p className="text-xs text-green-700 mt-1">
                    Highly suitable for your current soil & climate conditions.
                  </p>
                </div>

                {/* Top 3 Rankings */}
                <div className="bg-white/80 backdrop-blur border border-green-200/70 rounded-xl p-4 mb-4">
                  <h4 className="text-xs font-bold text-cement-800 uppercase tracking-wider mb-2.5">
                    Alternative Compatible Crops
                  </h4>
                  <div className="space-y-2">
                    {result.topRecommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="font-medium text-cement-800 flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-green-100 text-green-700 text-[10px] flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          {rec.crop}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-cement-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-green-600 h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(rec.score, 5)}%` }}
                            />
                          </div>
                          <span className="font-semibold text-cement-600 w-8 text-right">{rec.score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ideal Conditions Reference */}
                <div className="bg-white/80 backdrop-blur border border-green-200/70 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-cement-800 uppercase tracking-wider mb-2">
                    Ideal Optimal Conditions for {result.recommendedCrop}
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-cement-600">
                    <div>Nitrogen (N): <strong className="text-cement-800">{result.idealConditions.N}</strong></div>
                    <div>Phosphorus (P): <strong className="text-cement-800">{result.idealConditions.P}</strong></div>
                    <div>Potassium (K): <strong className="text-cement-800">{result.idealConditions.K}</strong></div>
                    <div>Temp: <strong className="text-cement-800">{result.idealConditions.temperature}°C</strong></div>
                    <div>Humidity: <strong className="text-cement-800">{result.idealConditions.humidity}%</strong></div>
                    <div>pH Level: <strong className="text-cement-800">{result.idealConditions.ph}</strong></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-cement-50 border border-dashed border-cement-200 rounded-2xl p-8 flex-1 flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-white rounded-2xl shadow-sm text-green-600 mb-4 border border-cement-100">
                <Sprout className="w-10 h-10" />
              </div>
              <h4 className="text-base font-semibold text-cement-800 mb-1">
                No Prediction Yet
              </h4>
              <p className="text-xs text-cement-500 max-w-xs mb-4">
                Fill in your soil N-P-K parameters and click <strong>"Predict Optimal Crop"</strong> to run the Gaussian Naive Bayes ML model.
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                <span>Model accuracy: 99.3%</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
