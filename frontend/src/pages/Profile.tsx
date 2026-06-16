import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import type { SoilType } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { User, Mountain, Save, MapPin, Compass, CheckCircle } from 'lucide-react';

export const Profile: React.FC = () => {
  const { farmProfile, updateFarmProfile, t } = useSettings();
  const { user, signup } = useAuth(); // use signup/register mock behavior to update auth details
  
  // Profile settings state
  const [displayName, setDisplayName] = useState(user?.displayName || 'Kundan Singh');
  const [elevation, setElevation] = useState(farmProfile.elevation);
  const [soilType, setSoilType] = useState<SoilType>(farmProfile.soilType);
  const [location, setLocation] = useState(farmProfile.location);
  
  // Checkbox crop state
  const cropsList = ['Apple', 'Ginger', 'Potato', 'Off-season Peas', 'Garlic', 'Plums', 'Saffron', 'Rice'];
  const [selectedCrops, setSelectedCrops] = useState<string[]>(farmProfile.primaryCrops);

  const [saved, setSaved] = useState(false);

  const handleCropToggle = (cropName: string) => {
    setSelectedCrops(prev => 
      prev.includes(cropName)
        ? prev.filter(c => c !== cropName)
        : [...prev, cropName]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);

    // Save settings locally
    updateFarmProfile({
      elevation,
      soilType,
      primaryCrops: selectedCrops,
      location
    });

    // Save auth display name/location if user exists
    if (user) {
      await signup(
        displayName, 
        user.email, 
        user.role, 
        location, 
        user.phoneNumber || ''
      );
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Determine hill climate category
  const getElevationCategory = (alt: number) => {
    if (alt < 1000) return { title: 'Sub-Tropical (Valley Plain)', desc: 'Optimal for Basmati, Ginger, Turmeric.' };
    if (alt >= 1000 && alt <= 2000) return { title: 'Temperate (Mid Hills)', desc: 'Optimal for Potatoes, Peas, Garlic, Plums.' };
    return { title: 'High-Temperate / Alpine Heights', desc: 'Optimal for Apples, Saffron, Apricots.' };
  };

  const climateCat = getElevationCategory(elevation);

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
      
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
              {t('profile')}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
              Customize climate parameters to optimize AI advisor suggestions.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Farm & User Information */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-lg rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/60 pb-3">
            Farmer Identity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                Farmer Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors font-semibold text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                Location Region / Valley
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors font-semibold text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Climate & Terrain settings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-lg rounded-3xl p-6 space-y-6">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/60 pb-3">
            Terrain & Soil Configuration
          </h3>

          {/* Elevation Altitude Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400">
              <span className="uppercase tracking-wider">Elevation (Altitude)</span>
              <span className="text-emerald-600 dark:text-emerald-400 text-sm font-extrabold flex items-center">
                <Mountain className="w-4 h-4 mr-1 text-slate-500" />
                {elevation} meters
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="3000"
              step="50"
              value={elevation}
              onChange={(e) => setElevation(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            
            {/* Elevation helper flag */}
            <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-start space-x-2 mt-2">
              <Compass className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-500" />
              <div className="text-xs">
                <p className="font-extrabold text-emerald-700 dark:text-emerald-400">
                  {climateCat.title}
                </p>
                <p className="mt-0.5 text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                  {climateCat.desc}
                </p>
              </div>
            </div>
          </div>

          {/* Soil Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Soil Type
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value as SoilType)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500 transition-colors text-slate-700 dark:text-slate-200"
            >
              <option value="sandy_loam">Sandy Loam (Sandy Soil, loose drainage)</option>
              <option value="clay_loam">Clay Loam (Retains water well)</option>
              <option value="red_acidic">Red Acidic Soil (Typical of high mountain slopes)</option>
              <option value="rocky_gravel">Rocky Gravel (Great drainage, porous margins)</option>
            </select>
          </div>
        </div>

        {/* Crops Selection Checklist */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-lg rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/60 pb-3">
            Primary Crops Cultivated
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cropsList.map((cropName) => {
              const isChecked = selectedCrops.includes(cropName);
              return (
                <button
                  type="button"
                  key={cropName}
                  onClick={() => handleCropToggle(cropName)}
                  className={`p-3 border rounded-2xl flex items-center justify-between font-bold text-xs transition-all ${
                    isChecked 
                      ? 'border-emerald-500 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400' 
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate pr-1">{cropName}</span>
                  <div className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center ${
                    isChecked ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300'
                  }`}>
                    {isChecked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Save button controls */}
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-600/10 flex items-center space-x-2 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>

          {saved && (
            <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center animate-pulse">
              <CheckCircle className="w-4.5 h-4.5 mr-1" />
              Settings updated successfully!
            </span>
          )}
        </div>

      </form>

    </div>
  );
};
