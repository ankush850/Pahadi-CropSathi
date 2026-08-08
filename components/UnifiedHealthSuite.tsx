import React, { useState } from 'react';
import { Crosshair, Stethoscope, Scan, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { PestRiskRadar } from './PestRiskRadar';
import { ArecanutDiagnostic } from './ArecanutDiagnostic';
import { CropDetectionScanner } from './CropDetectionScanner';

interface UnifiedHealthSuiteProps {
  lang: Language;
}

export const UnifiedHealthSuite: React.FC<UnifiedHealthSuiteProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'radar' | 'arecanut' | 'weedScanner'>('radar');

  const tabs = [
    { id: 'radar', label: 'Pest Outbreak Risk Radar (कीट/बीमारी अलर्ट)', icon: Crosshair },
    { id: 'arecanut', label: 'Arecanut Supari Advisor (सुपारी रोग सलाहकार)', icon: Stethoscope },
    { id: 'weedScanner', label: 'Field Weed & Canopy Scanner (खरपतवार जाँच)', icon: Scan }
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
    <div className="bg-white border-2 border-red-200/80 rounded-2xl shadow-sm overflow-hidden">
      {/* Category Header Bar */}
      <div className="bg-gradient-to-r from-rose-600 via-red-600 to-emerald-600 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 backdrop-blur rounded-xl">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Pest Risk & Plant Health Vision Suite</h2>
            <p className="text-xs text-rose-100">Epidemiological disease forecasting, specialized palm diagnostics & weed scanners</p>
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
                  ? 'border-rose-600 text-rose-900 bg-white shadow-2xs'
                  : 'border-transparent text-cement-600 hover:text-cement-900 hover:bg-cement-100/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-rose-600' : 'text-cement-400'}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tool Content Container */}
      <div className="p-2 md:p-4">
        {activeTab === 'radar' && <PestRiskRadar lang={lang} />}
        {activeTab === 'arecanut' && <ArecanutDiagnostic lang={lang} />}
        {activeTab === 'weedScanner' && <CropDetectionScanner lang={lang} />}
      </div>
    </div>
  );
};
