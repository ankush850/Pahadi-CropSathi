import React from 'react';
import { FeaturePlaceholder, Language } from '../types';
import { CloudSun, Droplet, TrendingUp, DollarSign, Satellite, ShieldAlert, BrainCircuit, Users, Lock } from 'lucide-react';
import { getTranslation } from '../utils/translations';

export const FEATURES: FeaturePlaceholder[] = [
  { id: '1', name: 'feat_weather', icon: 'weather', status: 'Live', description: 'feat_weather_desc' },
  { id: '2', name: 'feat_water', icon: 'water', status: 'Live', description: 'feat_water_desc' },
  { id: '3', name: 'feat_trend', icon: 'trend', status: 'Live', description: 'feat_trend_desc' },
  { id: '4', name: 'feat_finance', icon: 'finance', status: 'Live', description: 'feat_finance_desc' },
  { id: '5', name: 'feat_sat', icon: 'sat', status: 'Live', description: 'feat_sat_desc' },
  { id: '6', name: 'feat_risk', icon: 'risk', status: 'Live', description: 'feat_risk_desc' },
  { id: '7', name: 'feat_security', icon: 'security', status: 'Live', description: 'feat_security_desc' },
  { id: '8', name: 'feat_comm', icon: 'community', status: 'Live', description: 'feat_comm_desc' },
];

const IconMap: Record<string, React.ReactNode> = {
  weather: <CloudSun className="w-6 h-6" />,
  water: <Droplet className="w-6 h-6" />,
  trend: <TrendingUp className="w-6 h-6" />,
  finance: <DollarSign className="w-6 h-6" />,
  sat: <Satellite className="w-6 h-6" />,
  risk: <ShieldAlert className="w-6 h-6" />,
  security: <Lock className="w-6 h-6" />,
  community: <Users className="w-6 h-6" />,
};

interface FeatureGridProps {
  onFeatureClick: (feature: FeaturePlaceholder) => void;
  lang: Language;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ onFeatureClick, lang }) => {
  const t = (key: string) => getTranslation(lang, key);

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4 px-1">
        <BrainCircuit className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-cement-800">{t('modules')}</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map((feature) => (
          <div 
            key={feature.id} 
            onClick={() => onFeatureClick(feature)}
            className="bg-white border border-cement-200 rounded-xl p-4 flex items-center gap-4 hover:shadow-lg hover:border-green-300 transition-all cursor-pointer group"
          >
            <div className="p-3 rounded-lg bg-cement-50 text-cement-500 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
              {IconMap[feature.icon]}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-cement-900 text-sm group-hover:text-green-700 transition-colors">{t(feature.name)}</h4>
              <p className="text-xs text-cement-400 mt-0.5 line-clamp-1">{t(feature.description)}</p>
            </div>
            <div className="text-cement-300 group-hover:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <TrendingUp className="w-4 h-4 rotate-45" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};