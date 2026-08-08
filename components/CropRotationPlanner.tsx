import React, { useState } from 'react';
import { RotateCw, Sprout, ShieldCheck, TrendingUp, Sparkles, AlertCircle, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface CropRotationPlannerProps {
  lang: Language;
}

interface RotationPlan {
  currentCrop: string;
  season1: { crop: string; family: string; benefit: string; nBenefit: string };
  season2: { crop: string; family: string; benefit: string; nBenefit: string };
  season3: { crop: string; family: string; benefit: string; nBenefit: string };
  yieldBoost: string;
  pestSuppressionScore: number;
}

const ROTATION_DATABASE: Record<string, RotationPlan> = {
  potato: {
    currentCrop: 'Potato / Tomato (Solanaceae - नाइटशेड कुल)',
    season1: { crop: 'Field Pea / Beans (मटर / फ़्रांस बीन)', family: 'Fabaceae (Legume)', benefit: 'Fixes atmospheric Nitrogen (50-70 kg/ha) into soil naturally.', nBenefit: '+65 kg/ha Nitrogen' },
    season2: { crop: 'Maize / Sorghum (मक्का / चरी)', family: 'Poaceae (Cereal)', benefit: 'Deep root system absorbs residual P & K while breaking potato wilt fungus.', nBenefit: 'Balanced P & K uptake' },
    season3: { crop: 'Mustard / Radish (सरसों / मूली)', family: 'Brassicaceae', benefit: 'Bio-fumigant root exudates suppress soil Nematodes & Rhizoctonia.', nBenefit: 'Nematode Control' },
    yieldBoost: '+28% Higher Yield',
    pestSuppressionScore: 92
  },
  wheat: {
    currentCrop: 'Wheat / Barley (Poaceae - अगेती अनाज)',
    season1: { crop: 'Chickpea / Lentil (चना / मसूर)', family: 'Fabaceae (Legume)', benefit: 'Restores organic matter & enriches soil rhizobia bacteria.', nBenefit: '+55 kg/ha Nitrogen' },
    season2: { crop: 'Cotton / Sesame (कपास / तिल)', family: 'Malvaceae / Pedaliaceae', benefit: 'Breaks cereal rust and aphid breeding cycles.', nBenefit: 'Rust Suppression' },
    season3: { crop: 'Fodder Cowpea (लोबिया चारा)', family: 'Fabaceae (Legume)', benefit: 'High biomass green manure restores soil tilth.', nBenefit: '+45 kg/ha Organic Carbon' },
    yieldBoost: '+24% Higher Yield',
    pestSuppressionScore: 88
  },
  apple: {
    currentCrop: 'Apple Orchard Intercropping (सेब बागान)',
    season1: { crop: 'Red Clover / White Clover (कलोवर घास)', family: 'Fabaceae (Legume)', benefit: 'Perennial groundcover prevents soil erosion on slopes & fixes Nitrogen.', nBenefit: '+80 kg/ha Nitrogen' },
    season2: { crop: 'Garlic / Wild Onion (लहसुन)', family: 'Amaryllidaceae', benefit: 'Sulphur root exudates suppress apple root rot and voles/rodents.', nBenefit: 'Root Rot Protection' },
    season3: { crop: 'Buckwheat / Kuttu (कुट्टू / फाफड़ा)', family: 'Polygonaceae', benefit: 'Fast growing summer cover crop mobilizes insoluble soil Phosphorus.', nBenefit: 'Phosphorus Mobilization' },
    yieldBoost: '+35% Orchard Health',
    pestSuppressionScore: 95
  },
  maize: {
    currentCrop: 'Maize (Poaceae - मक्का)',
    season1: { crop: 'Soybean / Black Gram (सोयाबीन / उड़द)', family: 'Fabaceae (Legume)', benefit: 'Replenishes soil Nitrogen depleted by heavy-feeding maize.', nBenefit: '+60 kg/ha Nitrogen' },
    season2: { crop: 'Potato / Turnip (आलू / शलगम)', family: 'Solanaceae / Brassicaceae', benefit: 'Utilizes deep soil moisture and loose soil structure.', nBenefit: 'Soil Structure Boost' },
    season3: { crop: 'Wheat (गेहूं)', family: 'Poaceae (Cereal)', benefit: 'Rotational cereal with minimal pest crossover.', nBenefit: 'Stable Carbon Balance' },
    yieldBoost: '+22% Higher Yield',
    pestSuppressionScore: 85
  }
};

export const CropRotationPlanner: React.FC<CropRotationPlannerProps> = ({ lang }) => {
  const t = (key: string) => getTranslation(lang, key);
  const [selectedCrop, setSelectedCrop] = useState<string>('potato');

  const plan = ROTATION_DATABASE[selectedCrop] || ROTATION_DATABASE['potato'];

  return (
    <div className="bg-white border border-cement-200 rounded-2xl shadow-sm overflow-hidden p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cement-100 pb-6 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Agronomic Matrix Engine (No API Key)
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-cement-900 flex items-center gap-2">
            <RotateCw className="w-6 h-6 text-teal-600" />
            Smart 3-Season Crop Rotation & Soil Matrix
          </h2>
          <p className="text-xs md:text-sm text-cement-500 mt-1">
            Design multi-season crop sequences to naturally fix Nitrogen, break pest cycles, and prevent soil exhaustion.
          </p>
        </div>

        {/* Selector */}
        <div className="self-start md:self-auto">
          <label htmlFor="rot-crop-select" className="block text-[11px] font-bold text-cement-500 uppercase mb-1">Current Primary Crop</label>
          <select
            id="rot-crop-select"
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-4 py-2 border border-cement-200 rounded-xl text-xs bg-white font-bold text-cement-800 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          >
            <option value="potato">Potato / Tomato (आलू / टमाटर)</option>
            <option value="wheat">Wheat / Barley (गेहूं / जौ)</option>
            <option value="apple">Apple Orchard Intercrop (सेब बागान)</option>
            <option value="maize">Maize (मक्का)</option>
          </select>
        </div>
      </div>

      {/* Main Layout: Overview + 3-Season Blueprint */}
      <div className="space-y-6">
        {/* Banner Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl flex items-center gap-3">
            <div className="p-3 bg-teal-100 text-teal-700 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-teal-900">{plan.yieldBoost}</div>
              <div className="text-xs text-teal-700 font-medium">Estimated Yield Increase</div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-3">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-emerald-900">{plan.pestSuppressionScore}% Score</div>
              <div className="text-xs text-emerald-700 font-medium">Pest & Pathogen Break Rating</div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center gap-3">
            <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-blue-900">Natural Fixation</div>
              <div className="text-xs text-blue-700 font-medium">Zero Synthetic N Exhaustion</div>
            </div>
          </div>
        </div>

        {/* 3-Season Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Season 1 */}
          <div className="bg-white border-2 border-teal-200 rounded-2xl p-5 relative shadow-xs hover:shadow-md transition-shadow">
            <div className="absolute -top-3 left-4 bg-teal-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
              Season 1 (Rabi / Winter)
            </div>
            <div className="mt-2">
              <h4 className="text-base font-bold text-teal-950 mb-1">{plan.season1.crop}</h4>
              <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                Family: {plan.season1.family}
              </span>
              <p className="text-xs text-cement-600 leading-relaxed mt-3 mb-4">
                {plan.season1.benefit}
              </p>
              <div className="p-2.5 bg-teal-50 border border-teal-100 rounded-xl text-xs font-bold text-teal-800 flex items-center justify-between">
                <span>Soil Nutrient Output:</span>
                <span className="text-teal-600">{plan.season1.nBenefit}</span>
              </div>
            </div>
          </div>

          {/* Season 2 */}
          <div className="bg-white border-2 border-emerald-200 rounded-2xl p-5 relative shadow-xs hover:shadow-md transition-shadow">
            <div className="absolute -top-3 left-4 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
              Season 2 (Kharif / Monsoon)
            </div>
            <div className="mt-2">
              <h4 className="text-base font-bold text-emerald-950 mb-1">{plan.season2.crop}</h4>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Family: {plan.season2.family}
              </span>
              <p className="text-xs text-cement-600 leading-relaxed mt-3 mb-4">
                {plan.season2.benefit}
              </p>
              <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-800 flex items-center justify-between">
                <span>Soil Nutrient Output:</span>
                <span className="text-emerald-600">{plan.season2.nBenefit}</span>
              </div>
            </div>
          </div>

          {/* Season 3 */}
          <div className="bg-white border-2 border-purple-200 rounded-2xl p-5 relative shadow-xs hover:shadow-md transition-shadow">
            <div className="absolute -top-3 left-4 bg-purple-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
              Season 3 (Zaid / Summer)
            </div>
            <div className="mt-2">
              <h4 className="text-base font-bold text-purple-950 mb-1">{plan.season3.crop}</h4>
              <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                Family: {plan.season3.family}
              </span>
              <p className="text-xs text-cement-600 leading-relaxed mt-3 mb-4">
                {plan.season3.benefit}
              </p>
              <div className="p-2.5 bg-purple-50 border border-purple-100 rounded-xl text-xs font-bold text-purple-800 flex items-center justify-between">
                <span>Soil Nutrient Output:</span>
                <span className="text-purple-600">{plan.season3.nBenefit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
