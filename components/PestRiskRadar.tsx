import React, { useState } from 'react';
import { ShieldAlert, Thermometer, Droplets, Bug, AlertTriangle, CheckCircle2, RefreshCw, Sparkles, Wind, Crosshair } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface PestRiskRadarProps {
  lang: Language;
}

interface DiseaseRisk {
  name: string;
  crop: string;
  riskScore: number; // 0 - 100
  riskLevel: 'HIGH' | 'MODERATE' | 'LOW';
  triggerCondition: string;
  chemicalAdvisory: string;
  organicAdvisory: string;
}

export const PestRiskRadar: React.FC<PestRiskRadarProps> = ({ lang }) => {
  const t = (key: string) => getTranslation(lang, key);

  const [temp, setTemp] = useState<number>(18);
  const [humidity, setHumidity] = useState<number>(88);
  const [rainfall, setRainfall] = useState<number>(15);
  const [selectedCrop, setSelectedCrop] = useState<string>('all');

  // Epidemiological Algorithm to compute Risk Scores
  const calculateRisks = (): DiseaseRisk[] => {
    const list: DiseaseRisk[] = [];

    // 1. Potato / Tomato Late Blight
    let lateBlightScore = 15;
    if (temp >= 10 && temp <= 24 && humidity > 80) {
      lateBlightScore += 50;
      if (humidity > 90) lateBlightScore += 25;
      if (rainfall > 10) lateBlightScore += 10;
    }
    lateBlightScore = Math.min(100, lateBlightScore);

    list.push({
      name: 'Late Blight (पछेता झुलसा)',
      crop: 'Potato & Tomato (आलू / टमाटर)',
      riskScore: lateBlightScore,
      riskLevel: lateBlightScore > 70 ? 'HIGH' : lateBlightScore > 40 ? 'MODERATE' : 'LOW',
      triggerCondition: 'Favored by cool temperature (10-24°C) and high humidity (>80%).',
      chemicalAdvisory: 'Spray Mancozeb 75% WP @ 2.5g/L or Cymoxanil + Mancozeb @ 2g/L.',
      organicAdvisory: 'Spray Copper Oxychloride @ 3g/L + Neem Oil (10,000 ppm) @ 3ml/L.'
    });

    // 2. Apple Scab & Fruit Rot
    let appleScabScore = 20;
    if (temp >= 12 && temp <= 22 && humidity > 75) {
      appleScabScore += 45;
      if (rainfall > 5) appleScabScore += 25;
    }
    appleScabScore = Math.min(100, appleScabScore);

    list.push({
      name: 'Apple Scab & Rot (सेब स्कैब)',
      crop: 'Hill Apple (सेब)',
      riskScore: appleScabScore,
      riskLevel: appleScabScore > 70 ? 'HIGH' : appleScabScore > 40 ? 'MODERATE' : 'LOW',
      triggerCondition: 'Continuous leaf wetness for >9 hours at 15-20°C.',
      chemicalAdvisory: 'Spray Difenoconazole 25% EC @ 0.5ml/L or Captan 50% WP @ 2.5g/L.',
      organicAdvisory: 'Spray Liquid Lime Sulphur 1% or Trichoderma viride bio-fungicide.'
    });

    // 3. Powdery Mildew
    let mildewScore = 10;
    if (temp >= 20 && temp <= 30 && humidity < 60) {
      mildewScore += 55;
    }
    mildewScore = Math.min(100, mildewScore);

    list.push({
      name: 'Powdery Mildew (चूर्णिल आसिता)',
      crop: 'Pulses, Peas & Vegetables (मटर / दालें)',
      riskScore: mildewScore,
      riskLevel: mildewScore > 70 ? 'HIGH' : mildewScore > 40 ? 'MODERATE' : 'LOW',
      triggerCondition: 'Warm dry days (20-30°C) with low relative humidity.',
      chemicalAdvisory: 'Spray Sulfex (Wettable Sulphur 80% WP) @ 3g/L or Hexaconazole @ 1ml/L.',
      organicAdvisory: 'Spray Cow milk whey solution (1:9 water) or Potassium Bicarbonate @ 4g/L.'
    });

    // 4. Aphid & Sucking Pest Swarm
    let aphidScore = 15;
    if (temp >= 15 && temp <= 25 && humidity >= 60 && humidity <= 80) {
      aphidScore += 40;
      if (rainfall === 0) aphidScore += 25;
    }
    aphidScore = Math.min(100, aphidScore);

    list.push({
      name: 'Aphids & Thrips Infestation (चेपा / माहू)',
      crop: 'Mustard, Wheat & Vegetables (सरसों / गेहूं)',
      riskScore: aphidScore,
      riskLevel: aphidScore > 70 ? 'HIGH' : aphidScore > 40 ? 'MODERATE' : 'LOW',
      triggerCondition: 'Dry cloudy weather with zero rain at 15-25°C.',
      chemicalAdvisory: 'Spray Imidacloprid 17.8% SL @ 0.5ml/L or Thiamethoxam 25% WG @ 0.3g/L.',
      organicAdvisory: 'Spray Yellow Sticky Traps @ 20/acre + Neemseed Kernel Extract (NSKE 5%).'
    });

    return list;
  };

  const allRisks = calculateRisks();
  const filteredRisks = selectedCrop === 'all' 
    ? allRisks 
    : allRisks.filter(r => r.crop.toLowerCase().includes(selectedCrop.toLowerCase()));

  const highRiskCount = allRisks.filter(r => r.riskLevel === 'HIGH').length;

  return (
    <div className="bg-white border border-cement-200 rounded-2xl shadow-sm overflow-hidden p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cement-100 pb-6 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Epidemiological Risk Model (No API Key)
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-cement-900 flex items-center gap-2">
            <Crosshair className="w-6 h-6 text-red-600" />
            Smart Pest Outbreak & Disease Risk Radar
          </h2>
          <p className="text-xs md:text-sm text-cement-500 mt-1">
            Real-time weather epidemiology engine predicting fungal, bacterial, and pest infestation risks.
          </p>
        </div>

        {/* Live Risk Counter Badge */}
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-2 rounded-xl text-xs font-bold text-red-700 self-start md:self-auto">
          <ShieldAlert className="w-4 h-4 text-red-600 animate-pulse" />
          <span>{highRiskCount} High Risk Outbreaks Detected</span>
        </div>
      </div>

      {/* Main Layout: Weather Controllers + Radar Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weather Controllers */}
        <div className="lg:col-span-4 bg-cement-50/80 p-5 rounded-2xl border border-cement-200 space-y-5">
          <h3 className="text-xs font-bold text-cement-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-cement-200 pb-2">
            <Thermometer className="w-4 h-4 text-blue-600" /> Live Climate Parameters
          </h3>

          {/* Temperature Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-cement-700 mb-1">
              <span>Temperature</span>
              <span className="text-blue-600 font-bold">{temp}°C</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={temp}
              onChange={(e) => setTemp(parseInt(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          {/* Humidity Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-cement-700 mb-1">
              <span>Relative Humidity</span>
              <span className="text-cyan-600 font-bold">{humidity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={humidity}
              onChange={(e) => setHumidity(parseInt(e.target.value))}
              className="w-full accent-cyan-600"
            />
          </div>

          {/* Rainfall Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-cement-700 mb-1">
              <span>Recent Rainfall</span>
              <span className="text-indigo-600 font-bold">{rainfall} mm</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={rainfall}
              onChange={(e) => setRainfall(parseInt(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          {/* Crop Filter */}
          <div>
            <label htmlFor="pest-crop-filter" className="block text-xs font-bold text-cement-700 uppercase mb-1">Filter By Crop</label>
            <select
              id="pest-crop-filter"
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 border border-cement-200 rounded-xl text-xs bg-white font-medium"
            >
              <option value="all">All Hill Crops (सभी फसलें)</option>
              <option value="potato">Potato & Tomato (आलू / टमाटर)</option>
              <option value="apple">Apple (सेब)</option>
              <option value="pulses">Pulses & Peas (मटर / दालें)</option>
              <option value="mustard">Mustard & Wheat (सरसों / गेहूं)</option>
            </select>
          </div>
        </div>

        {/* Radar Risk Cards */}
        <div className="lg:col-span-8 space-y-4">
          {filteredRisks.map((risk, idx) => (
            <div key={idx} className="bg-white border border-cement-200 rounded-xl p-5 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cement-400">
                    Target: {risk.crop}
                  </span>
                  <h4 className="text-base font-bold text-cement-900 mt-0.5">{risk.name}</h4>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  risk.riskLevel === 'HIGH' 
                    ? 'bg-red-100 text-red-700 border border-red-300' 
                    : risk.riskLevel === 'MODERATE' 
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-green-100 text-green-700 border border-green-300'
                }`}>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{risk.riskLevel} RISK ({risk.riskScore}%)</span>
                </div>
              </div>

              {/* Risk Progress Bar */}
              <div className="w-full bg-cement-100 rounded-full h-2 overflow-hidden mb-3">
                <div 
                  style={{ width: `${risk.riskScore}%` }} 
                  className={`h-full rounded-full transition-all duration-500 ${
                    risk.riskLevel === 'HIGH' ? 'bg-red-600' : risk.riskLevel === 'MODERATE' ? 'bg-amber-500' : 'bg-green-500'
                  }`}
                />
              </div>

              <p className="text-xs text-cement-500 mb-3 italic">{risk.triggerCondition}</p>

              {/* Chemical vs Organic Spray Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-cement-100">
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                  <strong className="text-blue-900 font-bold block mb-1">Chemical Preventive Spray:</strong>
                  <span className="text-cement-700 leading-relaxed">{risk.chemicalAdvisory}</span>
                </div>
                <div className="p-3 bg-green-50/60 rounded-xl border border-green-100">
                  <strong className="text-green-900 font-bold block mb-1">Organic & Biological Remedy:</strong>
                  <span className="text-cement-700 leading-relaxed">{risk.organicAdvisory}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
