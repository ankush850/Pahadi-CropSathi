import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { 
  CloudRain, 
  CloudSnow, 
  Wind, 
  AlertTriangle, 
  Droplets
} from 'lucide-react';

interface WeatherAlert {
  type: 'frost' | 'landslide' | 'heavy_rain' | 'clear';
  severity: 'low' | 'medium' | 'high';
  message: string;
  pahadiMessage: string;
}

export const WeatherWidget: React.FC = () => {
  const { t, language, farmProfile } = useSettings();

  // Simulated weather data based on elevation
  const getWeatherData = (elevation: number) => {
    if (elevation > 2000) {
      return {
        temp: 14,
        humidity: 65,
        wind: 18,
        condition: 'chilly',
        alerts: [
          {
            type: 'frost',
            severity: 'high',
            message: 'High frost risk overnight. Protect early apple buds and tender seedlings.',
            pahadiMessage: 'आज राति पाला (तुषार) पड़ सकद। स्याउ का ब्वट बच्याओ।'
          },
          {
            type: 'heavy_rain',
            severity: 'medium',
            message: 'Afternoon thunder showers expected. Check terraced drainage lines.',
            pahadiMessage: 'द्वपहर बादि झड़ी पड़ सकद। सारि (सीढ़ीदार खेत) की नाली साफ राखो।'
          }
        ] as WeatherAlert[]
      };
    } else {
      return {
        temp: 22,
        humidity: 78,
        wind: 12,
        condition: 'humid',
        alerts: [
          {
            type: 'landslide',
            severity: 'medium',
            message: 'Continuous rainfall warning. Watch slope stability on terraced borders.',
            pahadiMessage: 'लगातार पाणि पड़णै भै, भिरू (ढलान) मा नजर राखो।'
          }
        ] as WeatherAlert[]
      };
    }
  };

  const weather = getWeatherData(farmProfile.elevation);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Current Conditions Card */}
      <div className="lg:col-span-1 rounded-3xl p-6 glass-panel-elevated bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent flex flex-col justify-between min-h-[180px]">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-slate-400 dark:text-slate-500 font-semibold text-xs tracking-wider uppercase">
              Current Conditions
            </h3>
            <p className="text-slate-700 dark:text-slate-300 font-medium text-sm mt-1">
              Altitude: {farmProfile.elevation}m
            </p>
          </div>
          <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            {weather.temp < 15 ? (
              <CloudSnow className="w-8 h-8 text-sky-500 animate-pulse" />
            ) : (
              <CloudRain className="w-8 h-8 text-teal-500 animate-bounce" />
            )}
          </div>
        </div>

        <div className="my-4">
          <span className="text-5xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            {weather.temp}°C
          </span>
          <span className="text-sm text-slate-400 ml-2 font-medium">
            Feels like {weather.temp - 2}°C
          </span>
        </div>

        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">
          <span className="flex items-center">
            <Droplets className="w-4 h-4 mr-1 text-teal-400" />
            Hum: {weather.humidity}%
          </span>
          <span className="flex items-center">
            <Wind className="w-4 h-4 mr-1 text-blue-400" />
            Wind: {weather.wind} km/h
          </span>
        </div>
      </div>

      {/* Advisory Warnings Card */}
      <div className="lg:col-span-2 rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-lg flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
            {t('weatherAlerts')}
          </h3>
          
          <div className="space-y-3">
            {weather.alerts.map((alert, idx) => (
              <div 
                key={idx}
                className={`p-3.5 rounded-2xl border flex items-start space-x-3 transition-colors ${
                  alert.severity === 'high' 
                    ? 'bg-red-500/5 border-red-500/20 text-red-700 dark:text-red-400' 
                    : 'bg-amber-500/5 border-amber-500/20 text-amber-700 dark:text-amber-400'
                }`}
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-bold">
                    {alert.type === 'frost' ? t('riskFrost') : t('riskLandslide')} ({alert.severity === 'high' ? 'High' : 'Moderate'})
                  </p>
                  <p className="mt-1 font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                    {language === 'pah' ? alert.pahadiMessage : alert.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-2xs font-bold text-slate-400 uppercase tracking-widest flex justify-between items-center">
          <span>Updates every 10 min</span>
          <span className="text-emerald-500 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-ping" />
            Monitoring Live
          </span>
        </div>
      </div>

    </div>
  );
};
