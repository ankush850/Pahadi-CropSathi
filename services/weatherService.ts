import { WeatherData } from '../types';

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation: number;
    weather_code: number;
    is_day: number;
  };
}

export const fetchLocalWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,is_day&timezone=auto`
    );

    if (!response.ok) {
      throw new Error('Weather data fetch failed');
    }

    const data: OpenMeteoResponse = await response.json();
    const current = data.current;

    // Simple logic to generate alerts based on data
    const alerts: WeatherData['alerts'] = [];
    
    if (current.temperature_2m > 35) {
      alerts.push({ type: 'heat', level: 'high', message: 'Extreme heat detected. Irrigation required.' });
    } else if (current.temperature_2m > 30) {
      alerts.push({ type: 'heat', level: 'medium', message: 'High temperature. Monitor crops.' });
    } else if (current.temperature_2m < 0) {
      alerts.push({ type: 'freeze', level: 'high', message: 'Freeze warning. Protect sensitive crops.' });
    }

    if (current.relative_humidity_2m < 30 && current.precipitation === 0) {
      alerts.push({ type: 'drought', level: 'medium', message: 'Low humidity. Drought risk increasing.' });
    }

    if (current.precipitation > 10) {
      alerts.push({ type: 'flood', level: 'medium', message: 'Heavy rain detected. Check drainage.' });
    }

    return {
      temp: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      precipitation: current.precipitation,
      conditionCode: current.weather_code,
      isDay: current.is_day === 1,
      alerts: alerts.length > 0 ? alerts : [{ type: 'none', level: 'low', message: 'Weather conditions are stable.' }]
    };
  } catch (error) {
    console.error("Weather API Error:", error);
    throw error;
  }
};

export const getWeatherDescription = (code: number): string => {
  // WMO Weather interpretation codes
  // https://open-meteo.com/en/docs
  if (code === 0) return 'Clear Sky';
  if (code >= 1 && code <= 3) return 'Partly Cloudy';
  if (code >= 45 && code <= 48) return 'Foggy';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 61 && code <= 65) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Variable';
};