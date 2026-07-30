import React, { useState } from 'react';
import { Stethoscope, Upload, AlertCircle, CheckCircle2, ShieldCheck, Pill, Leaf, Sparkles, RefreshCw } from 'lucide-react';
import { Language } from '../types';
import { ARECANUT_DISEASES, ArecanutDiseaseInfo } from '../lib/arecanutData';

interface ArecanutDiagnosticProps {
  lang: Language;
}

interface DiagnosisResult {
  conditionKey: string;
  diseaseName: string;
  confidence: number;
  affectedPart: 'Leaf' | 'Nut' | 'Trunk' | 'Foot' | 'Bud';
  symptoms: string;
  chemicalRemedy: string;
  organicRemedy: string;
  preventionTips?: string[];
}

export const ArecanutDiagnostic: React.FC<ArecanutDiagnosticProps> = ({ lang }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size exceeds 10MB limit.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        analyzeImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64Image: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const response = await fetch('/api/ai/arecanut', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ image: base64Image, lang })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to analyze Arecanut image');
      }

      const data: DiagnosisResult = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error("Arecanut diagnosis error:", err);
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (conditionKey: string) => {
    const info = ARECANUT_DISEASES[conditionKey];
    if (!info) return;

    setError(null);
    setResult({
      conditionKey: info.id,
      diseaseName: info.name,
      confidence: 0.94,
      affectedPart: info.affectedPart,
      symptoms: info.symptoms,
      chemicalRemedy: info.chemicalRemedy,
      organicRemedy: info.organicRemedy,
      preventionTips: [info.prevention]
    });
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="bg-white border border-cement-200 rounded-2xl shadow-sm overflow-hidden p-6 md:p-8">
      {/* Header */}
      <div className="border-b border-cement-100 pb-6 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Arecanut Specialized AI Model
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-cement-900 flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-emerald-600" />
          Arecanut (Supari) Disease & Remedy Advisor
        </h2>
        <p className="text-xs md:text-sm text-cement-500 mt-1">
          Detect Koleroga (Fruit Rot), Stem Bleeding, Bud Borer, and Yellow Leaf Disease with exact chemical dosage and organic prescriptions.
        </p>
      </div>

      {/* Quick Presets Bar */}
      <div className="mb-6">
        <span className="block text-xs font-semibold text-cement-600 uppercase tracking-wider mb-2">
          Quick Demo Diagnoses (Or Upload Palm Image Below):
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSelectPreset('Mahali_Koleroga')}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-medium transition-colors"
          >
            🍎 Koleroga / Mahali (Fruit Rot)
          </button>
          <button
            onClick={() => handleSelectPreset('Stem_bleeding')}
            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-medium transition-colors"
          >
            🪵 Stem Bleeding
          </button>
          <button
            onClick={() => handleSelectPreset('bud_borer')}
            className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg text-xs font-medium transition-colors"
          >
            🐛 Bud Borer Pest
          </button>
          <button
            onClick={() => handleSelectPreset('yellow leaf disease')}
            className="px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-lg text-xs font-medium transition-colors"
          >
            🍃 Yellow Leaf Disease
          </button>
          <button
            onClick={() => handleSelectPreset('Healthy_Nut')}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium transition-colors"
          >
            ✅ Healthy Nut / Leaf
          </button>
        </div>
      </div>

      {/* Main Grid: Upload + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Area */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="relative border-2 border-dashed border-cement-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-cement-50/50 hover:bg-emerald-50/30 transition-colors h-64">
            {selectedImage ? (
              <div className="relative w-full h-full rounded-xl overflow-hidden group">
                <img src={selectedImage} alt="Arecanut Sample" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={handleReset}
                    className="px-3 py-1.5 bg-white text-cement-900 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-md"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Change Photo
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-full mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-medium text-cement-700 mb-1">
                  Upload Arecanut Leaf, Nut, or Trunk Photo
                </p>
                <p className="text-[11px] text-cement-400 mb-4">PNG, JPG, or WEBP up to 10MB</p>
                <label className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-sm">
                  Browse File
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </>
            )}

            {loading && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-emerald-700 text-xs font-medium gap-2">
                <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                Analyzing Arecanut Disease...
              </div>
            )}
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Results Card */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="bg-gradient-to-br from-emerald-50/60 to-teal-50/60 border border-emerald-200/80 rounded-2xl p-6 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-md">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  {result.diseaseName}
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-white px-2.5 py-1 rounded-md border border-emerald-200 shadow-xs">
                  {Math.round(result.confidence * 100)}% Confidence
                </span>
              </div>

              {/* Affected Part Badge */}
              <div className="text-xs text-cement-600 flex items-center gap-2">
                <span className="font-semibold text-cement-800">Target Area:</span>
                <span className="px-2.5 py-0.5 bg-white rounded-full border border-cement-200 text-cement-700 font-medium">
                  {result.affectedPart}
                </span>
              </div>

              {/* Symptoms */}
              {result.symptoms && (
                <div className="bg-white/90 backdrop-blur border border-emerald-100 rounded-xl p-3.5 text-xs">
                  <strong className="text-cement-800 block mb-1">Symptoms Identified:</strong>
                  <p className="text-cement-600 leading-relaxed">{result.symptoms}</p>
                </div>
              )}

              {/* Chemical Prescription */}
              <div className="bg-white/90 backdrop-blur border border-red-200/60 rounded-xl p-3.5 text-xs">
                <div className="flex items-center gap-1.5 text-red-700 font-bold mb-1">
                  <Pill className="w-4 h-4" />
                  Prescribed Chemical Treatment & Dosage:
                </div>
                <p className="text-cement-700 font-medium">{result.chemicalRemedy}</p>
              </div>

              {/* Organic Remedy */}
              <div className="bg-white/90 backdrop-blur border border-green-200/60 rounded-xl p-3.5 text-xs">
                <div className="flex items-center gap-1.5 text-green-700 font-bold mb-1">
                  <Leaf className="w-4 h-4" />
                  Organic & Biological Solution:
                </div>
                <p className="text-cement-700 font-medium">{result.organicRemedy}</p>
              </div>

              {/* Prevention */}
              {result.preventionTips && result.preventionTips.length > 0 && (
                <div className="bg-white/90 backdrop-blur border border-emerald-200/60 rounded-xl p-3.5 text-xs">
                  <strong className="text-emerald-900 block mb-1">Preventive Practices:</strong>
                  <ul className="list-disc list-inside text-cement-600 space-y-1">
                    {result.preventionTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-cement-50 border border-dashed border-cement-200 rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-white rounded-2xl shadow-sm text-emerald-600 mb-3 border border-cement-100">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-semibold text-cement-800 mb-1">No Arecanut Diagnosis Selected</h4>
              <p className="text-xs text-cement-500 max-w-xs">
                Upload a photo or click one of the quick preset demo buttons above to inspect Arecanut palm health.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
