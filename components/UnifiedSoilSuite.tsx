import React, { useState } from 'react';
import { Sprout, Calculator, Layers, ChevronLeft, ChevronRight, TestTube } from 'lucide-react';
import { Language, PlantAnalysis } from '../types';
import { CropRecommender } from './CropRecommender';
import { FertilizerCalculator } from './FertilizerCalculator';
import { SoilCrops } from './SoilCrops';

interface UnifiedSoilSuiteProps {
  lang: Language;
  analysis: PlantAnalysis | null;
}

export const UnifiedSoilSuite: React.FC<UnifiedSoilSuiteProps> = ({ lang, analysis }) => {
  const [activeTab, setActiveTab] = useState<'recommender' | 'fertilizer' | 'soilCrops'>('recommender');

  const tabs = [
    { id: 'recommender', label: 'Soil Crop Recommender (फसल सिफारिश)', icon: Sprout },
    { id: 'fertilizer', label: 'Fertilizer & NPK Calculator (खाद कैलकुलेटर)', icon: Calculator },
    ...(analysis ? [{ id: 'soilCrops', label: 'Detected Soil Analysis (माटी रिपोर्ट)', icon: Layers }] : [])
  ];

  const handleNext = () => {
    const ids = tabs.map(t => t.id);
    const currentIndex = ids.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % ids.length;
    setActiveTab(ids[nextIndex] as any);
  };

  const handlePrev = () => {
    const ids = tabs.map(t => t.id);
    const currentIndex = ids.indexOf(activeTab);
    const prevIndex = (currentIndex - 1 + ids.length) % ids.length;
    setActiveTab(ids[prevIndex] as any);
  };

  return (
    <div className="bg-white border-2 border-amber-200/80 rounded-2xl shadow-sm overflow-hidden">
      {/* Category Header Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 backdrop-blur rounded-xl">
            <TestTube className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Soil & Nutrient Intelligence Suite</h2>
            <p className="text-xs text-amber-100">Smart NPK dosage calculations, ML crop predictions & soil recommendations</p>
          </div>
        </div>

        {/* Slide Next/Prev controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handlePrev}
            className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl text-white transition-colors"
            title="Previous Tool"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-semibold px-2">
            {tabs.findIndex(t => t.id === activeTab) + 1} / {tabs.length}
          </span>
          <button
            onClick={handleNext}
            className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl text-white transition-colors"
            title="Next Tool"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex border-b border-cement-200 bg-cement-50 overflow-x-auto">
        {tabs.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-amber-600 text-amber-900 bg-white shadow-2xs'
                  : 'border-transparent text-cement-600 hover:text-cement-900 hover:bg-cement-100/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-cement-400'}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tool Content Container */}
      <div className="p-2 md:p-4">
        {activeTab === 'recommender' && <CropRecommender lang={lang} />}
        {activeTab === 'fertilizer' && <FertilizerCalculator lang={lang} />}
        {activeTab === 'soilCrops' && <SoilCrops analysis={analysis} lang={lang} />}
      </div>
    </div>
  );
};
