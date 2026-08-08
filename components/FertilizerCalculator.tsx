import React, { useState } from 'react';
import { Calculator, TestTube, Scale, Calendar, CheckCircle2, RefreshCw, Leaf, Droplets, ShieldAlert, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface FertilizerCalculatorProps {
  lang: Language;
}

interface CropRequirement {
  id: string;
  name: string;
  targetN: number;
  targetP: number;
  targetK: number;
  organicAdvice: string;
}

const CROPS_REQUIREMENTS: CropRequirement[] = [
  { id: 'apple', name: 'Hill Apple (सेब)', targetN: 120, targetP: 60, targetK: 120, organicAdvice: 'Apply 20-25 kg well-decomposed FYM (Farmyard Manure) per tree along with 2 kg Neem Cake.' },
  { id: 'wheat', name: 'Wheat (गेहूं)', targetN: 120, targetP: 60, targetK: 40, organicAdvice: 'Apply Vermicompost @ 2 tonnes/acre during field preparation.' },
  { id: 'potato', name: 'Potato (आलू)', targetN: 150, targetP: 100, targetK: 120, organicAdvice: 'Apply FYM @ 10 tonnes/acre + Bio-fertilizers (Azotobacter & PSB).' },
  { id: 'tomato', name: 'Tomato (टमाटर)', targetN: 100, targetP: 80, targetK: 100, organicAdvice: 'Incorporate Mustard Cake @ 200 kg/acre + Trichoderma enriched compost.' },
  { id: 'maize', name: 'Maize (मक्का)', targetN: 120, targetP: 60, targetK: 50, organicAdvice: 'Use Green Manuring (Dhaincha / Sunhemp) before sowing.' },
  { id: 'paddy', name: 'Paddy / Rice (धान)', targetN: 100, targetP: 50, targetK: 50, organicAdvice: 'Apply Azolla @ 400 kg/acre in standing water as bio-fertilizer.' },
];

export const FertilizerCalculator: React.FC<FertilizerCalculatorProps> = ({ lang }) => {
  const t = (key: string) => getTranslation(lang, key);

  const [selectedCropId, setSelectedCropId] = useState<string>('apple');
  const [landArea, setLandArea] = useState<number>(1); // In acres
  const [currentN, setCurrentN] = useState<number>(70);
  const [currentP, setCurrentP] = useState<number>(30);
  const [currentK, setCurrentK] = useState<number>(40);
  const [farmingType, setFarmingType] = useState<'chemical' | 'organic'>('chemical');

  const selectedCrop = CROPS_REQUIREMENTS.find(c => c.id === selectedCropId) || CROPS_REQUIREMENTS[0];

  // Calculate NPK Deficits
  const defN = Math.max(0, selectedCrop.targetN - currentN);
  const defP = Math.max(0, selectedCrop.targetP - currentP);
  const defK = Math.max(0, selectedCrop.targetK - currentK);

  // Chemical Dosage Formulas (in kg per acre)
  // DAP gives P (46%) and N (18%)
  const dapReq = Math.round((defP / 0.46) * landArea);
  const nFromDap = Math.round(dapReq * 0.18);
  const remainingN = Math.max(0, (defN * landArea) - nFromDap);
  const ureaReq = Math.round(remainingN / 0.46); // Urea is 46% N
  const mopReq = Math.round((defK / 0.60) * landArea); // MOP is 60% K2O

  // Organic Dosage Formulas
  const fymReq = Math.round(landArea * 4); // Tonnes of FYM
  const vermiCompostReq = Math.round(landArea * 1200); // kg of Vermicompost
  const neemCakeReq = Math.round(landArea * 150); // kg of Neem Cake

  const handleReset = () => {
    setSelectedCropId('apple');
    setLandArea(1);
    setCurrentN(70);
    setCurrentP(30);
    setCurrentK(40);
    setFarmingType('chemical');
  };

  return (
    <div className="bg-white border border-cement-200 rounded-2xl shadow-sm overflow-hidden p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cement-100 pb-6 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Agronomy Math Engine (No API Key)
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-cement-900 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-amber-600" />
            Smart Fertilizer & NPK Dosage Calculator
          </h2>
          <p className="text-xs md:text-sm text-cement-500 mt-1">
            Calculate exact Urea, DAP, MOP, or Organic Manure dosage for your target crop yield and soil nutrient profile.
          </p>
        </div>

        {/* Toggle Farming Mode */}
        <div className="flex items-center bg-cement-100 p-1 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setFarmingType('chemical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              farmingType === 'chemical' ? 'bg-white text-cement-900 shadow-xs' : 'text-cement-600 hover:text-cement-900'
            }`}
          >
            Chemical (NPK / Urea)
          </button>
          <button
            onClick={() => setFarmingType('organic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              farmingType === 'organic' ? 'bg-green-600 text-white shadow-xs' : 'text-cement-600 hover:text-cement-900'
            }`}
          >
            Organic (जैविक)
          </button>
        </div>
      </div>

      {/* Inputs + Output Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label htmlFor="fert-crop-select" className="block text-xs font-bold text-cement-700 uppercase mb-1">Select Crop</label>
            <select
              id="fert-crop-select"
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="w-full px-3 py-2 border border-cement-200 rounded-xl text-sm bg-white font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              {CROPS_REQUIREMENTS.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="fert-land-area" className="block text-xs font-bold text-cement-700 uppercase mb-1">Land Area (Acres)</label>
            <input
              id="fert-land-area"
              type="number"
              min="0.1"
              max="100"
              step="0.1"
              value={landArea}
              onChange={(e) => setLandArea(parseFloat(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-cement-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div className="bg-cement-50 p-4 rounded-xl border border-cement-100 space-y-3">
            <h4 className="text-xs font-bold uppercase text-cement-600 flex items-center gap-1.5">
              <TestTube className="w-4 h-4 text-amber-600" /> Current Soil Test Values (kg/ha)
            </h4>
            
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label htmlFor="fert-curr-n" className="block text-[11px] font-semibold text-cement-600">Nitrogen (N)</label>
                <input
                  id="fert-curr-n"
                  type="number"
                  value={currentN}
                  onChange={(e) => setCurrentN(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 border border-cement-200 rounded-lg text-xs bg-white"
                />
              </div>
              <div>
                <label htmlFor="fert-curr-p" className="block text-[11px] font-semibold text-cement-600">Phosphorus (P)</label>
                <input
                  id="fert-curr-p"
                  type="number"
                  value={currentP}
                  onChange={(e) => setCurrentP(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 border border-cement-200 rounded-lg text-xs bg-white"
                />
              </div>
              <div>
                <label htmlFor="fert-curr-k" className="block text-[11px] font-semibold text-cement-600">Potassium (K)</label>
                <input
                  id="fert-curr-k"
                  type="number"
                  value={currentK}
                  onChange={(e) => setCurrentK(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 border border-cement-200 rounded-lg text-xs bg-white"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-2 bg-cement-100 hover:bg-cement-200 text-cement-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Calculator
          </button>
        </div>

        {/* Right Output Recommendations */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="bg-gradient-to-br from-amber-50/70 to-orange-50/70 border border-amber-200 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-amber-200/60 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Calculated Prescription for {landArea} Acre(s)
                </span>
                <h3 className="text-xl font-bold text-amber-950 mt-1">{selectedCrop.name}</h3>
              </div>
              <Scale className="w-6 h-6 text-amber-600" />
            </div>

            {farmingType === 'chemical' ? (
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-amber-200/70 text-center">
                  <span className="text-[11px] text-cement-500 font-medium block mb-1">Urea (यूरिया)</span>
                  <div className="text-2xl font-extrabold text-amber-900">{ureaReq} <span className="text-xs font-normal">kg</span></div>
                  <span className="text-[10px] text-amber-700 font-semibold mt-1 block">46% Nitrogen</span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-amber-200/70 text-center">
                  <span className="text-[11px] text-cement-500 font-medium block mb-1">DAP (डीएपी)</span>
                  <div className="text-2xl font-extrabold text-amber-900">{dapReq} <span className="text-xs font-normal">kg</span></div>
                  <span className="text-[10px] text-amber-700 font-semibold mt-1 block">46% P + 18% N</span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-amber-200/70 text-center">
                  <span className="text-[11px] text-cement-500 font-medium block mb-1">MOP (पोटाश)</span>
                  <div className="text-2xl font-extrabold text-amber-900">{mopReq} <span className="text-xs font-normal">kg</span></div>
                  <span className="text-[10px] text-amber-700 font-semibold mt-1 block">60% Potash</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-green-200 text-center">
                  <span className="text-[11px] text-cement-500 font-medium block mb-1">FYM / गोबर खाद</span>
                  <div className="text-2xl font-extrabold text-green-900">{fymReq} <span className="text-xs font-normal">tonnes</span></div>
                  <span className="text-[10px] text-green-700 font-semibold mt-1 block">Soil Structure</span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-green-200 text-center">
                  <span className="text-[11px] text-cement-500 font-medium block mb-1">Vermicompost</span>
                  <div className="text-2xl font-extrabold text-green-900">{vermiCompostReq} <span className="text-xs font-normal">kg</span></div>
                  <span className="text-[10px] text-green-700 font-semibold mt-1 block">Rich Microbes</span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-green-200 text-center">
                  <span className="text-[11px] text-cement-500 font-medium block mb-1">Neem Cake</span>
                  <div className="text-2xl font-extrabold text-green-900">{neemCakeReq} <span className="text-xs font-normal">kg</span></div>
                  <span className="text-[10px] text-green-700 font-semibold mt-1 block">Nematode Protection</span>
                </div>
              </div>
            )}

            {/* Application Split Schedule */}
            <div className="bg-white/90 backdrop-blur border border-amber-200/80 rounded-xl p-4 space-y-2 text-xs">
              <h4 className="font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-600" /> Recommended Application Split Schedule:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-cement-700">
                <div className="p-2.5 bg-amber-50/50 rounded-lg border border-amber-100">
                  <span className="font-bold text-amber-900 block mb-0.5">1. Basal Dose (At Sowing):</span>
                  <span>100% DAP, 100% MOP, and 50% Urea during ploughing.</span>
                </div>
                <div className="p-2.5 bg-amber-50/50 rounded-lg border border-amber-100">
                  <span className="font-bold text-amber-900 block mb-0.5">2. First Top Dressing (30 Days):</span>
                  <span>25% Urea after first weeding / irrigation.</span>
                </div>
                <div className="p-2.5 bg-amber-50/50 rounded-lg border border-amber-100">
                  <span className="font-bold text-amber-900 block mb-0.5">3. Flowering Stage (60 Days):</span>
                  <span>Remaining 25% Urea before flowering.</span>
                </div>
              </div>
            </div>

            {/* Organic Advisory Note */}
            <div className="bg-green-50/80 border border-green-200 rounded-xl p-3 text-xs text-green-900 flex items-start gap-2">
              <Leaf className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Organic Tip:</strong> {selectedCrop.organicAdvice}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
