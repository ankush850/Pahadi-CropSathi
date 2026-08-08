import React, { useState } from 'react';
import { Droplets, Clock, CloudRain, ShieldCheck, Sparkles, Scale, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface IrrigationSchedulerProps {
  lang: Language;
}

interface CropKc {
  initial: number;
  dev: number;
  mid: number;
  late: number;
}

const CROP_KC: Record<string, CropKc> = {
  apple: { initial: 0.5, dev: 0.8, mid: 1.15, late: 0.8 },
  potato: { initial: 0.5, dev: 0.8, mid: 1.15, late: 0.75 },
  tomato: { initial: 0.6, dev: 0.85, mid: 1.15, late: 0.8 },
  wheat: { initial: 0.4, dev: 0.7, mid: 1.15, late: 0.4 },
  paddy: { initial: 1.05, dev: 1.15, mid: 1.2, late: 0.9 },
  maize: { initial: 0.4, dev: 0.8, mid: 1.2, late: 0.6 }
};

export const IrrigationScheduler: React.FC<IrrigationSchedulerProps> = ({ lang }) => {
  const t = (key: string) => getTranslation(lang, key);

  const [crop, setCrop] = useState<string>('apple');
  const [stage, setStage] = useState<'initial' | 'dev' | 'mid' | 'late'>('mid');
  const [soilType, setSoilType] = useState<'sandy' | 'loam' | 'clay'>('loam');
  const [systemType, setSystemType] = useState<'drip' | 'sprinkler' | 'flood'>('drip');
  const [landAcres, setLandAcres] = useState<number>(1);
  const [temp, setTemp] = useState<number>(24);

  // Evapotranspiration ET0 approximation formula based on temperature
  const et0 = Math.max(2, (temp * 0.18) + 1.2);
  const kc = CROP_KC[crop]?.[stage] || 1.0;
  const etc = et0 * kc; // Crop evapotranspiration in mm/day

  // Efficiency factors
  const efficiency = systemType === 'drip' ? 0.90 : systemType === 'sprinkler' ? 0.75 : 0.50;

  // Water Volume Calculation
  // 1 mm depth on 1 acre = 4,046.86 Liters
  const rawLitersPerAcre = etc * 4046.86;
  const totalLitersPerDay = Math.round((rawLitersPerAcre / efficiency) * landAcres);

  // Drip runtime assuming 4 LPH drippers spaced for the land
  const dripRuntimeHours = (totalLitersPerDay / (landAcres * 1200)).toFixed(1);

  // Soil Interval Days
  const soilIntervalDays = soilType === 'sandy' ? 2 : soilType === 'loam' ? 4 : 6;

  // Water Savings vs Flood
  const floodLiters = Math.round((rawLitersPerAcre / 0.50) * landAcres);
  const waterSavingsPct = Math.round(((floodLiters - totalLitersPerDay) / floodLiters) * 100);

  return (
    <div className="bg-white border border-cement-200 rounded-2xl shadow-sm overflow-hidden p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cement-100 pb-6 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Hydro-Agronomy ETc Model (No API Key)
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-cement-900 flex items-center gap-2">
            <Droplets className="w-6 h-6 text-cyan-600" />
            Smart Water & Drip Irrigation Scheduler
          </h2>
          <p className="text-xs md:text-sm text-cement-500 mt-1">
            Calculate precise crop water requirements, irrigation runtime, and watering intervals based on local climate & soil profile.
          </p>
        </div>

        {/* System Selector */}
        <div className="flex items-center bg-cement-100 p-1 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setSystemType('drip')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              systemType === 'drip' ? 'bg-cyan-600 text-white shadow-xs' : 'text-cement-600 hover:text-cement-900'
            }`}
          >
            Drip (ड्रिप)
          </button>
          <button
            onClick={() => setSystemType('sprinkler')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              systemType === 'sprinkler' ? 'bg-white text-cement-900 shadow-xs' : 'text-cement-600 hover:text-cement-900'
            }`}
          >
            Sprinkler (स्प्रिंकलर)
          </button>
          <button
            onClick={() => setSystemType('flood')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              systemType === 'flood' ? 'bg-white text-cement-900 shadow-xs' : 'text-cement-600 hover:text-cement-900'
            }`}
          >
            Flood (पारंपरिक)
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label htmlFor="irrig-crop-select" className="block text-xs font-bold text-cement-700 uppercase mb-1">Select Crop</label>
            <select
              id="irrig-crop-select"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full px-3 py-2 border border-cement-200 rounded-xl text-sm bg-white font-medium"
            >
              <option value="apple">Hill Apple (सेब)</option>
              <option value="potato">Potato (आलू)</option>
              <option value="tomato">Tomato (टमाटर)</option>
              <option value="wheat">Wheat (गेहूं)</option>
              <option value="paddy">Paddy / Rice (धान)</option>
              <option value="maize">Maize (मक्का)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="irrig-stage-select" className="block text-xs font-bold text-cement-700 uppercase mb-1">Growth Stage</label>
              <select
                id="irrig-stage-select"
                value={stage}
                onChange={(e) => setStage(e.target.value as any)}
                className="w-full px-3 py-2 border border-cement-200 rounded-xl text-xs bg-white"
              >
                <option value="initial">Initial Sowing (अंकुरण)</option>
                <option value="dev">Crop Dev (वानस्पतिक)</option>
                <option value="mid">Mid-Season / Flowering (फूल/फल)</option>
                <option value="late">Maturity (पकने का चरण)</option>
              </select>
            </div>

            <div>
              <label htmlFor="irrig-soil-select" className="block text-xs font-bold text-cement-700 uppercase mb-1">Soil Texture</label>
              <select
                id="irrig-soil-select"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value as any)}
                className="w-full px-3 py-2 border border-cement-200 rounded-xl text-xs bg-white"
              >
                <option value="sandy">Sandy Hill Soil (बलुई माटी)</option>
                <option value="loam">Loam / Silt (दोमट माटी)</option>
                <option value="clay">Clay Loam (चिकनी माटी)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="irrig-acres-input" className="block text-xs font-bold text-cement-700 uppercase mb-1">Area (Acres)</label>
              <input
                id="irrig-acres-input"
                type="number"
                min="0.1"
                max="100"
                step="0.1"
                value={landAcres}
                onChange={(e) => setLandAcres(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-cement-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label htmlFor="irrig-temp-input" className="block text-xs font-bold text-cement-700 uppercase mb-1">Avg Temp (°C)</label>
              <input
                id="irrig-temp-input"
                type="number"
                min="5"
                max="45"
                value={temp}
                onChange={(e) => setTemp(parseInt(e.target.value) || 24)}
                className="w-full px-3 py-2 border border-cement-200 rounded-xl text-xs"
              />
            </div>
          </div>
        </div>

        {/* Results Display */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="bg-gradient-to-br from-cyan-50 to-sky-50 border border-cyan-200 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-cyan-200/60 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded">
                  Calculated Hydration Schedule for {landAcres} Acre(s)
                </span>
                <h3 className="text-xl font-bold text-cyan-950 mt-1">Water Requirement: {etc.toFixed(1)} mm/day</h3>
              </div>
              <Droplets className="w-6 h-6 text-cyan-600" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-cyan-200 text-center">
                <span className="text-[11px] text-cement-500 font-medium block mb-1">Daily Volume</span>
                <div className="text-xl font-extrabold text-cyan-950">{totalLitersPerDay.toLocaleString()} <span className="text-xs font-normal">Liters</span></div>
                <span className="text-[10px] text-cyan-700 font-semibold mt-1 block">per day</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-cyan-200 text-center">
                <span className="text-[11px] text-cement-500 font-medium block mb-1">Drip Runtime</span>
                <div className="text-xl font-extrabold text-cyan-950">{dripRuntimeHours} <span className="text-xs font-normal">Hours</span></div>
                <span className="text-[10px] text-cyan-700 font-semibold mt-1 block">daily watering</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-cyan-200 text-center">
                <span className="text-[11px] text-cement-500 font-medium block mb-1">Interval</span>
                <div className="text-xl font-extrabold text-cyan-950">Every {soilIntervalDays} <span className="text-xs font-normal">Days</span></div>
                <span className="text-[10px] text-cyan-700 font-semibold mt-1 block">for {soilType} soil</span>
              </div>
            </div>

            {systemType === 'drip' && waterSavingsPct > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Drip Efficiency Water Savings vs Flood:
                </span>
                <span className="font-extrabold text-emerald-700 text-sm">+{waterSavingsPct}% Saved</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
