import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Search, TrendingUp, TrendingDown, Scale, MapPin, AlertCircle } from 'lucide-react';

interface MandiCrop {
  name: string;
  mandi: string;
  price: number; // Current rate
  prevPrice: number; // Yesterday rate
  unit: string;
  trend: 'up' | 'down' | 'stable';
  sparkline: number[]; // Percentage prices over last 5 days
}

export const MandiPrices: React.FC = () => {
  const { t } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');

  const mandiCrops: MandiCrop[] = [
    { name: 'Royal Apple (सेब)', mandi: 'Shimla Mandi', price: 145, prevPrice: 138, unit: 'kg', trend: 'up', sparkline: [120, 125, 132, 138, 145] },
    { name: 'Himalayan Ginger (अदरक)', mandi: 'Almora Mandi', price: 92, prevPrice: 95, unit: 'kg', trend: 'down', sparkline: [102, 100, 97, 95, 92] },
    { name: 'Off-season Peas (मटर)', mandi: 'Haldwani Mandi', price: 78, prevPrice: 70, unit: 'kg', trend: 'up', sparkline: [62, 65, 68, 70, 78] },
    { name: 'Hill Potato (पहाड़ी आलू)', mandi: 'Dehradun Mandi', price: 34, prevPrice: 34, unit: 'kg', trend: 'stable', sparkline: [33, 34, 34, 34, 34] },
    { name: 'Himalayan Garlic (लहसुन)', mandi: 'Almora Mandi', price: 185, prevPrice: 178, unit: 'kg', trend: 'up', sparkline: [160, 168, 172, 178, 185] },
    { name: 'Saffron (केसर)', mandi: 'Srinagar Mandi (J&K)', price: 320, prevPrice: 325, unit: 'gram', trend: 'down', sparkline: [335, 330, 328, 325, 320] },
    { name: 'Plums (पुलम)', mandi: 'Solan Mandi', price: 110, prevPrice: 110, unit: 'kg', trend: 'stable', sparkline: [105, 110, 110, 110, 110] },
  ];

  const filteredCrops = mandiCrops.filter(crop => 
    crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crop.mandi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Search and Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center">
            <Scale className="w-5.5 h-5.5 text-emerald-500 mr-2" />
            {t('mandiTitle')}
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
            Real-time wholesale market rates for mountain organic produce.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80 flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 focus-within:border-emerald-500 transition-colors">
          <Search className="w-4.5 h-4.5 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder={t('searchCrop')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2.5 bg-transparent text-xs text-slate-800 dark:text-slate-100 focus:outline-none placeholder-slate-400 font-bold"
          />
        </div>
      </div>

      {/* Main Rates Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-lg rounded-3xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-medium">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Produce Name</th>
                <th className="py-3 px-4">Mandi Center</th>
                <th className="py-3 px-4">Today's Rate</th>
                <th className="py-3 px-4">Price Shift</th>
                <th className="py-3 px-4">5-Day Sparkline</th>
                <th className="py-3 px-4 text-right">Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredCrops.map((crop, idx) => {
                const diff = crop.price - crop.prevPrice;
                const percentage = ((diff / crop.prevPrice) * 100).toFixed(1);
                
                // Find min/max for sparkline scaling
                const minVal = Math.min(...crop.sparkline);
                const maxVal = Math.max(...crop.sparkline);
                const valRange = maxVal - minVal || 1;

                return (
                  <tr key={idx} className="text-slate-700 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    {/* Crop Name */}
                    <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-100">
                      {crop.name}
                    </td>

                    {/* Mandi Center */}
                    <td className="py-4 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center mt-2.5">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {crop.mandi}
                    </td>

                    {/* Today's price */}
                    <td className="py-4 px-4 font-extrabold text-base text-slate-900 dark:text-white">
                      ₹{crop.price}
                    </td>

                    {/* Price Shift */}
                    <td className="py-4 px-4">
                      {crop.trend === 'up' && (
                        <span className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <TrendingUp className="w-4.5 h-4.5 mr-1" />
                          +{percentage}% (+₹{diff})
                        </span>
                      )}
                      {crop.trend === 'down' && (
                        <span className="flex items-center text-xs font-bold text-red-600 dark:text-red-400">
                          <TrendingDown className="w-4.5 h-4.5 mr-1" />
                          {percentage}% (-₹{Math.abs(diff)})
                        </span>
                      )}
                      {crop.trend === 'stable' && (
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                          Stable (₹0)
                        </span>
                      )}
                    </td>

                    {/* Sparkline visualization */}
                    <td className="py-4 px-4">
                      <div className="flex items-end space-x-1.5 h-8 w-28">
                        {crop.sparkline.map((val, i) => {
                          // Scale height between 15% and 100%
                          const ht = 15 + ((val - minVal) / valRange) * 85;
                          return (
                            <div 
                              key={i}
                              className={`w-3.5 rounded-xs transition-all ${
                                crop.trend === 'up' 
                                  ? 'bg-emerald-500/20 dark:bg-emerald-500/30 border-t-2 border-emerald-500' 
                                  : crop.trend === 'down'
                                  ? 'bg-red-500/20 dark:bg-red-500/30 border-t-2 border-red-500'
                                  : 'bg-slate-400/25 border-t-2 border-slate-400'
                              }`}
                              style={{ height: `${ht}%` }}
                              title={`Rate: ₹${val}`}
                            />
                          );
                        })}
                      </div>
                    </td>

                    {/* Unit */}
                    <td className="py-4 px-4 text-right text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      per {crop.unit}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advisory Warning footer */}
      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-xs text-amber-700 dark:text-amber-400 flex items-start space-x-2">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Mountain Logistics Advisory:</p>
          <p className="mt-0.5 leading-relaxed text-slate-600 dark:text-slate-300 font-semibold">
            Road closures at national highway link coordinates may occur due to monsoon showers. Plan transportation of perishable items (Plums, green peas) during morning hours.
          </p>
        </div>
      </div>

    </div>
  );
};
