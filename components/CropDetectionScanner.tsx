import React, { useState } from 'react';
import { Scan, Upload, Sparkles, AlertTriangle, ShieldCheck, Bug, RefreshCw, Scissors, Layers, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

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
  const t = (key: string) => getTranslation(lang, key);

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
          {t('fieldWeedTitle')}
        </h2>
        <p className="text-xs md:text-sm text-cement-500 mt-1">
          {t('fieldWeedDesc')}
        </p>
      </div>

      {/* Quick Demo Presets */}
      <div className="mb-6">
        <span className="block text-xs font-semibold text-cement-600 uppercase tracking-wider mb-2">
          {t('quickFieldDemo')}
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleDemoPreset('sugarbeet')}
            className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 rounded-lg text-xs font-medium transition-colors"
          >
            🌱 {t('sugarbeetPlot')}
          </button>
          <button
            onClick={() => handleDemoPreset('carrot')}
            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-medium transition-colors"
          >
            🥕 {t('carrotPatch')}
          </button>
          <button
            onClick={() => handleDemoPreset('clean')}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium transition-colors"
          >
            🌾 {t('cleanWheat')}
          </button>
          <button
            onClick={() => handleDemoPreset('weedy')}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-lg text-xs font-medium transition-colors"
          >
            ⚠️ {t('heavyInfestation')}
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
                  {t('uploadFieldImage')}
                </p>
                <p className="text-[11px] text-cement-400 mb-4">PNG, JPG, or WEBP up to 10MB</p>
                <label className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-sm">
                  {t('browseFieldImage')}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </>
            )}

            {loading && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-green-700 text-xs font-medium gap-2">
                <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                Analyzing Field & Weed Infestation...
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

        {/* Results Area */}
        <div className="lg:col-span-7 flex flex-col">
          {result ? (
            <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 rounded-2xl p-6 flex-1 space-y-4 animate-fade-in">
              {/* Coverage Breakdown */}
              <div className="bg-white/90 backdrop-blur border border-green-200/60 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-cement-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-green-600" /> Field Area Density Breakdown:
                </h4>
                
                {/* Visual Bar */}
                <div className="h-4 bg-cement-200 rounded-full overflow-hidden flex text-[10px] font-bold text-white text-center">
                  <div style={{ width: `${result.cropCoverage}%` }} className="bg-green-600 flex items-center justify-center" title="Crop Coverage">
                    {result.cropCoverage > 10 && `${result.cropCoverage}%`}
                  </div>
                  <div style={{ width: `${result.weedInfestation}%` }} className="bg-red-500 flex items-center justify-center" title="Weed Infestation">
                    {result.weedInfestation > 10 && `${result.weedInfestation}%`}
                  </div>
                  <div style={{ width: `${result.bareSoil}%` }} className="bg-amber-600 flex items-center justify-center" title="Bare Soil">
                    {result.bareSoil > 10 && `${result.bareSoil}%`}
                  </div>
                </div>

                <div className="flex justify-between text-xs pt-1">
                  <span className="flex items-center gap-1 text-green-700 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block" /> Crop Canopy ({result.cropCoverage}%)
                  </span>
                  <span className="flex items-center gap-1 text-red-700 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Weed Infestation ({result.weedInfestation}%)
                  </span>
                  <span className="flex items-center gap-1 text-amber-800 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" /> Bare Soil ({result.bareSoil}%)
                  </span>
                </div>
              </div>

              {/* Detected Crops */}
              {result.detectedCrops && result.detectedCrops.length > 0 && (
                <div className="bg-white/90 backdrop-blur border border-green-200/60 rounded-xl p-3.5 text-xs">
                  <strong className="text-green-900 block mb-1">Identified Cultivated Crops:</strong>
                  <div className="flex flex-wrap gap-1.5">
                    {result.detectedCrops.map((crop, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-green-100 text-green-800 font-medium rounded-lg">
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Detected Weeds */}
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
              <h4 className="text-sm font-semibold text-cement-800 mb-1">{t('noFieldImage')}</h4>
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
