import React, { useEffect, useState } from 'react';
import { WeatherData } from '../types';
import { fetchLocalWeather, getWeatherDescription } from '../services/weatherService';
import { CloudRain, Sun, Droplets, MapPin, AlertTriangle, Loader2, Moon, CloudFog, CloudLightning, Snowflake } from 'lucide-react';

export const WeatherPanel: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState("Locating...");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            setLocationName(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
            const data = await fetchLocalWeather(latitude, longitude);
            setWeather(data);
          } catch (err) {
            setError("Weather unavailable");
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          setError("Location access denied");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported");
      setLoading(false);
    }
  }, []);

  const getWeatherIcon = (code: number, isDay: boolean) => {
    if (code >= 95) return <CloudLightning className="w-8 h-8 text-purple-500" />;
    if (code >= 71) return <Snowflake className="w-8 h-8 text-blue-300" />;
    if (code >= 51) return <CloudRain className="w-8 h-8 text-blue-500" />;
    if (code >= 45) return <CloudFog className="w-8 h-8 text-cement-400" />;
    if (code <= 3 && !isDay) return <Moon className="w-8 h-8 text-indigo-400" />;
    return <Sun className="w-8 h-8 text-amber-500" />;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-cement-200 h-full flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
          <span className="text-xs text-cement-500">Fetching local weather...</span>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-cement-200 h-full flex items-center justify-center p-6">
        <div className="text-center">
          <MapPin className="w-6 h-6 text-cement-400 mx-auto mb-2" />
          <p className="text-sm text-cement-500">{error || "Weather data unavailable"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-cement-200 overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-cement-100 bg-cement-50/50 flex justify-between items-center">
        <div className="flex items-center gap-1.5">
           <MapPin className="w-3.5 h-3.5 text-cement-400" />
           <h3 className="text-xs font-semibold text-cement-600">{locationName}</h3>
        </div>
        <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full uppercase tracking-wide">Live</span>
      </div>
      
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-4xl font-bold text-cement-900">{weather.temp}°C</span>
            <p className="text-cement-500 text-sm font-medium mt-1 flex items-center gap-1">
              {getWeatherDescription(weather.conditionCode)}
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded-full">
            {getWeatherIcon(weather.conditionCode, weather.isDay)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-cement-50 p-3 rounded-lg border border-cement-100">
            <div className="flex items-center gap-2 mb-1 text-cement-500">
              <Droplets className="w-3.5 h-3.5" />
              <span className="text-xs font-medium uppercase">Humidity</span>
            </div>
            <span className="text-lg font-semibold text-cement-800">{weather.humidity}%</span>
          </div>
           <div className="bg-cement-50 p-3 rounded-lg border border-cement-100">
            <div className="flex items-center gap-2 mb-1 text-cement-500">
              <CloudRain className="w-3.5 h-3.5" />
              <span className="text-xs font-medium uppercase">Precip</span>
            </div>
            <span className="text-lg font-semibold text-cement-800">{weather.precipitation}mm</span>
          </div>
        </div>

        {/* Alerts */}
        {weather.alerts.map((alert, idx) => (
          alert.type !== 'none' && (
            <div key={idx} className={`rounded-lg p-3 border flex items-start gap-3 ${
              alert.level === 'high' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'
            }`}>
              <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
                alert.level === 'high' ? 'text-red-500' : 'text-amber-500'
              }`} />
              <div>
                <p className={`text-xs font-bold uppercase mb-0.5 ${
                   alert.level === 'high' ? 'text-red-700' : 'text-amber-700'
                }`}>{alert.type} Warning</p>
                <p className={`text-xs leading-tight ${
                   alert.level === 'high' ? 'text-red-600' : 'text-amber-600'
                }`}>{alert.message}</p>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};