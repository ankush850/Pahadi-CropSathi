import React, { useState } from 'react';
import { Scan, Upload, Sparkles, AlertTriangle, ShieldCheck, Bug, RefreshCw, Scissors, Layers, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface CropDetectionScannerProps {
  lang: Language;
}

interface CropDetectionResult {
  cropCoverage: number;
  weedInfestation: number;
  bareSoil: number;
  detectedCrops: string[];
  detectedWeeds: {
    name: string;
    severity: 'High' | 'Medium' | 'Low';
    recommendation: string;
  }[];
  weedActionPlan: string;
}

export const CropDetectionScanner: React.FC<CropDetectionScannerProps> = ({ lang }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CropDetectionResult | null>(null);
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
      const response = await fetch('/api/ai/crop-detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ image: base64Image, lang })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to analyze field crop & weed image');
      }

      const data: CropDetectionResult = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error("Crop & weed detection error:", err);
      setError(err.message || 'Field analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoPreset = (type: 'sugarbeet' | 'carrot' | 'clean' | 'weedy') => {
    setError(null);

    const presets: Record<string, CropDetectionResult> = {
      sugarbeet: {
        cropCoverage: 62,
        weedInfestation: 24,
        bareSoil: 14,
        detectedCrops: ['Sugarbeet (Beta vulgaris)'],
        detectedWeeds: [
          { name: 'Wild Mustard (Sinapis arvensis)', severity: 'High', recommendation: 'Inter-row mechanical hoeing or targeted post-emergence selective herbicide.' },
          { name: 'Redroot Pigweed (Amaranthus retroflexus)', severity: 'Medium', recommendation: 'Hand weeding around crown or organic straw mulching.' }
        ],
        weedActionPlan: 'High weed encroachment between sugarbeet rows. Perform inter-row cultivation within 5 days to prevent nutrient competition.'
      },
      carrot: {
        cropCoverage: 45,
        weedInfestation: 41,
        bareSoil: 14,
        detectedCrops: ['Carrot (Daucus carota)'],
        detectedWeeds: [
          { name: 'Nut Sedge (Cyperus rotundus)', severity: 'High', recommendation: 'Deep soil cultivation and solarization before sowing.' },
          { name: 'Dandelion (Taraxacum officinale)', severity: 'Medium', recommendation: 'Manual taproot extraction.' }
        ],
        weedActionPlan: 'Critical weed density threatening carrot taproot expansion. Immediate hand-weeding recommended.'
      },
      clean: {
        cropCoverage: 82,
        weedInfestation: 5,
        bareSoil: 13,
        detectedCrops: ['Wheat (Triticum aestivum)'],
        detectedWeeds: [
          { name: 'Isolated Clover (Trifolium repens)', severity: 'Low', recommendation: 'No immediate chemical action required.' }
        ],
        weedActionPlan: 'Healthy dense crop canopy suppressive to weed growth. Maintain regular field scouting.'
      },
      weedy: {
        cropCoverage: 30,
        weedInfestation: 55,
        bareSoil: 15,
        detectedCrops: ['Mixed Vegetables (Beans, Spinach)'],
        detectedWeeds: [
          { name: 'Parthenium (Congress Grass)', severity: 'High', recommendation: 'Uproot before flowering stage with protective gloves.' },
          { name: 'Barnyard Grass (Echinochloa crus-galli)', severity: 'High', recommendation: 'Apply selective grass herbicide or shallow tillage.' }
        ],
        weedActionPlan: 'Severe weed infestation covering over half of the plot. Execute immediate mechanical weeding and apply organic mulch.'
      }
    };

    setResult(presets[type]);
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
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Field Canopy & Weed Vision Model
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-cement-900 flex items-center gap-2">
          <Scan className="w-6 h-6 text-green-600" />
          Field Crop & Weed Density Detector
        </h2>
        <p className="text-xs md:text-sm text-cement-500 mt-1">
          Upload top-down field or garden photos to analyze Crop Canopy %, Weed Infestation %, Bare Soil ratio, and target weed eradication strategies.
        </p>
      </div>

      {/* Quick Demo Presets */}
      <div className="mb-6">
        <span className="block text-xs font-semibold text-cement-600 uppercase tracking-wider mb-2">
          Quick Field Demo Presets (Or Upload Field Photo Below):
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleDemoPreset('sugarbeet')}
            className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 rounded-lg text-xs font-medium transition-colors"
          >
            🌱 Sugarbeet Plot (24% Weeds)
          </button>
          <button
            onClick={() => handleDemoPreset('carrot')}
            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-medium transition-colors"
          >
            🥕 Carrot Patch (41% Weeds)
          </button>
          <button
            onClick={() => handleDemoPreset('clean')}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium transition-colors"
          >
            🌾 Clean Wheat Canopy (5% Weeds)
          </button>
          <button
            onClick={() => handleDemoPreset('weedy')}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-lg text-xs font-medium transition-colors"
          >
            ⚠️ Heavy Infestation (55% Weeds)
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Area */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="relative border-2 border-dashed border-cement-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-cement-50/50 hover:bg-green-50/30 transition-colors h-64">
            {selectedImage ? (
              <div className="relative w-full h-full rounded-xl overflow-hidden group">
                <img src={selectedImage} alt="Field Aerial View" className="w-full h-full object-cover" />
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
                <div className="p-3 bg-green-100 text-green-700 rounded-full mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-medium text-cement-700 mb-1">
                  Upload Top-Down Garden / Field Image
                </p>
                <p className="text-[11px] text-cement-400 mb-4">PNG, JPG, or WEBP up to 10MB</p>
                <label className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-sm">
                  Browse Field Image
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </>
            )}

            {loading && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-green-700 text-xs font-medium gap-2">
                <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                Analyzing Field Canopy & Weed Density...
              </div>
            )}
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Results Card */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="bg-gradient-to-br from-green-50/60 to-emerald-50/60 border border-green-200/80 rounded-2xl p-6 space-y-5 animate-fade-in">
              {/* Canopy Breakdown Metrics */}
              <div>
                <h4 className="text-xs font-bold text-cement-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-green-600" />
                  Field Canopy Ratio Breakdown
                </h4>

                <div className="space-y-2.5 bg-white/90 backdrop-blur border border-green-200/60 rounded-xl p-4">
                  {/* Crop Coverage */}
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-green-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Healthy Crop Cover:
                      </span>
                      <span className="font-bold text-green-700">{result.cropCoverage}%</span>
                    </div>
                    <div className="w-full bg-cement-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-green-600 h-full rounded-full transition-all duration-500" style={{ width: `${result.cropCoverage}%` }} />
                    </div>
                  </div>

                  {/* Weed Infestation */}
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-red-700 flex items-center gap-1">
                        <Bug className="w-3.5 h-3.5 text-red-600" /> Weed Infestation:
                      </span>
                      <span className="font-bold text-red-700">{result.weedInfestation}%</span>
                    </div>
                    <div className="w-full bg-cement-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-red-500 h-full rounded-full transition-all duration-500" style={{ width: `${result.weedInfestation}%` }} />
                    </div>
                  </div>

                  {/* Bare Soil */}
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-cement-600">Bare Uncovered Soil:</span>
                      <span className="font-bold text-cement-700">{result.bareSoil}%</span>
                    </div>
                    <div className="w-full bg-cement-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${result.bareSoil}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cultivated Crops Identified */}
              {result.detectedCrops && result.detectedCrops.length > 0 && (
                <div className="text-xs">
                  <span className="font-bold text-cement-800 mr-2">Cultivated Crops Identified:</span>
                  <span className="inline-flex flex-wrap gap-1.5 mt-1">
                    {result.detectedCrops.map((crop, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 bg-white border border-green-200 text-green-800 rounded-md font-semibold">
                        {crop}
                      </span>
                    ))}
                  </span>
                </div>
              )}

              {/* Identified Weeds List */}
              {result.detectedWeeds && result.detectedWeeds.length > 0 && (
                <div className="bg-white/90 backdrop-blur border border-red-200/60 rounded-xl p-4 text-xs space-y-2">
                  <h5 className="font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Scissors className="w-4 h-4 text-red-600" /> Identified Weed Species & Controls:
                  </h5>
                  <div className="space-y-2">
                    {result.detectedWeeds.map((weed, idx) => (
                      <div key={idx} className="border-b border-cement-100 pb-2 last:border-0 last:pb-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-semibold text-cement-900">{weed.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            String(weed.severity).toLowerCase().includes('high') ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {weed.severity} Severity
                          </span>
                        </div>
                        <p className="text-cement-600 text-[11px]">{weed.recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Overall Weed Action Plan */}
              {result.weedActionPlan && (
                <div className="bg-white/90 backdrop-blur border border-green-200/60 rounded-xl p-4 text-xs">
                  <strong className="text-green-900 block mb-1">Targeted Weeding Strategy:</strong>
                  <p className="text-cement-700 leading-relaxed font-medium">{result.weedActionPlan}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-cement-50 border border-dashed border-cement-200 rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-white rounded-2xl shadow-sm text-green-600 mb-3 border border-cement-100">
                <Scan className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-semibold text-cement-800 mb-1">No Field Image Analyzed</h4>
              <p className="text-xs text-cement-500 max-w-xs">
                Upload an aerial/top-down field photo or select a quick demo preset above to run the weed density detector.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
