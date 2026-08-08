import React, { useState } from 'react';
import { Droplets, RotateCw, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { Language } from '../types';
import { IrrigationScheduler } from './IrrigationScheduler';
import { CropRotationPlanner } from './CropRotationPlanner';

interface UnifiedPlanningSuiteProps {
  lang: Language;
}

export const UnifiedPlanningSuite: React.FC<UnifiedPlanningSuiteProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'irrigation' | 'rotation'>('irrigation');

  const tabs = [
    { id: 'irrigation', label: 'Drip Irrigation & Water Scheduler (सिंचाई शेड्यूल)', icon: Droplets },
    { id: 'rotation', label: '3-Season Crop Rotation Matrix (फसल चक्र)', icon: RotateCw }
  ];

  const handleNext = () => {
    setActiveTab(prev => (prev === 'irrigation' ? 'rotation' : 'irrigation'));
  };

  const handlePrev = () => {
    setActiveTab(prev => (prev === 'irrigation' ? 'rotation' : 'irrigation'));
  };

  return (
    <div className="bg-white border-2 border-teal-200/80 rounded-2xl shadow-sm overflow-hidden">
      {/* Category Header Bar */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 backdrop-blur rounded-xl">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Water & Field Planning Suite</h2>
            <p className="text-xs text-teal-100">Evapotranspiration irrigation schedules & multi-season crop rotation matrices</p>
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
            {activeTab === 'irrigation' ? '1 / 2' : '2 / 2'}
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
                  ? 'border-teal-600 text-teal-900 bg-white shadow-2xs'
                  : 'border-transparent text-cement-600 hover:text-cement-900 hover:bg-cement-100/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-cement-400'}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tool Content Container */}
      <div className="p-2 md:p-4">
        {activeTab === 'irrigation' && <IrrigationScheduler lang={lang} />}
        {activeTab === 'rotation' && <CropRotationPlanner lang={lang} />}
      </div>
    </div>
  );
};
