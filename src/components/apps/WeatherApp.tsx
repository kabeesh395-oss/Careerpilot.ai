import React, { useState } from 'react';
import { CloudSun, Sun, CloudRain, Wind, Droplets, Compass, MapPin, Eye } from 'lucide-react';

interface CityData {
  name: string;
  temp: number;
  condition: string;
  high: number;
  low: number;
  humidity: number;
  wind: number;
  uv: number;
  bgGradient: string;
  hourly: { time: string; temp: number; icon: 'sun' | 'cloud' | 'rain' }[];
}

const CITIES: Record<string, CityData> = {
  'San Francisco': {
    name: 'San Francisco',
    temp: 72,
    condition: 'Partly Cloudy',
    high: 76,
    low: 58,
    humidity: 64,
    wind: 12,
    uv: 6,
    bgGradient: 'from-sky-900 via-indigo-950 to-slate-950',
    hourly: [
      { time: 'Now', temp: 72, icon: 'cloud' },
      { time: '1 PM', temp: 74, icon: 'sun' },
      { time: '2 PM', temp: 76, icon: 'sun' },
      { time: '3 PM', temp: 75, icon: 'cloud' },
      { time: '4 PM', temp: 71, icon: 'rain' },
      { time: '5 PM', temp: 68, icon: 'cloud' }
    ]
  },
  'Tokyo': {
    name: 'Tokyo',
    temp: 84,
    condition: 'Sunny & Clear',
    high: 88,
    low: 74,
    humidity: 50,
    wind: 8,
    uv: 9,
    bgGradient: 'from-amber-900 via-rose-950 to-slate-950',
    hourly: [
      { time: 'Now', temp: 84, icon: 'sun' },
      { time: '1 PM', temp: 86, icon: 'sun' },
      { time: '2 PM', temp: 88, icon: 'sun' },
      { time: '3 PM', temp: 87, icon: 'sun' },
      { time: '4 PM', temp: 83, icon: 'cloud' },
      { time: '5 PM', temp: 79, icon: 'sun' }
    ]
  },
  'London': {
    name: 'London',
    temp: 61,
    condition: 'Light Showers',
    high: 64,
    low: 52,
    humidity: 82,
    wind: 16,
    uv: 3,
    bgGradient: 'from-slate-900 via-cyan-950 to-slate-950',
    hourly: [
      { time: 'Now', temp: 61, icon: 'rain' },
      { time: '1 PM', temp: 62, icon: 'rain' },
      { time: '2 PM', temp: 64, icon: 'cloud' },
      { time: '3 PM', temp: 63, icon: 'rain' },
      { time: '4 PM', temp: 60, icon: 'rain' },
      { time: '5 PM', temp: 58, icon: 'cloud' }
    ]
  }
};

export const WeatherApp: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('San Francisco');
  const city = CITIES[selectedCity];

  return (
    <div className={`h-full bg-gradient-to-b ${city.bgGradient} text-slate-100 flex flex-col font-sans select-none overflow-y-auto pb-12 transition-all duration-700`}>
      {/* Top Bar */}
      <div className="p-4 bg-black/20 backdrop-blur sticky top-0 z-10 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-black/40 text-white font-bold text-sm border border-white/20 rounded-xl px-2.5 py-1 focus:outline-none cursor-pointer"
          >
            {Object.keys(CITIES).map(c => (
              <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>
            ))}
          </select>
        </div>
        <span className="text-xs text-white/70 font-mono">Live Radar</span>
      </div>

      <div className="p-5 flex flex-col items-center space-y-6">
        {/* Main Temperature Display */}
        <div className="text-center relative py-4">
          <div className="w-24 h-24 mx-auto mb-2 relative flex items-center justify-center">
            {city.condition.includes('Sunny') ? (
              <Sun className="w-20 h-20 text-amber-400 animate-spin-slow" />
            ) : city.condition.includes('Rain') ? (
              <CloudRain className="w-20 h-20 text-cyan-400 animate-bounce" />
            ) : (
              <CloudSun className="w-20 h-20 text-sky-300" />
            )}
          </div>
          <h1 className="text-6xl font-black tracking-tight text-white">{city.temp}°</h1>
          <p className="text-base font-medium text-cyan-200 mt-1">{city.condition}</p>
          <p className="text-xs text-white/60 mt-1 font-mono">
            H: {city.high}°  L: {city.low}°
          </p>
        </div>

        {/* Hourly Forecast Row */}
        <div className="w-full bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-4">
          <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-3">Hourly Forecast</div>
          <div className="flex justify-between items-center overflow-x-auto gap-3">
            {city.hourly.map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-2 bg-white/5 p-2.5 rounded-2xl min-w-[56px] border border-white/10">
                <span className="text-[10px] text-white/70 font-mono">{h.time}</span>
                {h.icon === 'sun' ? <Sun className="w-4 h-4 text-amber-400" /> : h.icon === 'rain' ? <CloudRain className="w-4 h-4 text-cyan-400" /> : <CloudSun className="w-4 h-4 text-sky-300" />}
                <span className="text-xs font-bold text-white">{h.temp}°</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Metrics Grid */}
        <div className="w-full grid grid-cols-2 gap-3">
          <div className="bg-white/5 backdrop-blur border border-white/10 p-3.5 rounded-3xl flex items-center gap-3">
            <Wind className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-[10px] text-white/60">Wind Speed</div>
              <div className="text-sm font-bold text-white">{city.wind} mph</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur border border-white/10 p-3.5 rounded-3xl flex items-center gap-3">
            <Droplets className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-[10px] text-white/60">Humidity</div>
              <div className="text-sm font-bold text-white">{city.humidity}%</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur border border-white/10 p-3.5 rounded-3xl flex items-center gap-3">
            <Compass className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-[10px] text-white/60">UV Index</div>
              <div className="text-sm font-bold text-white">{city.uv} (Moderate)</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur border border-white/10 p-3.5 rounded-3xl flex items-center gap-3">
            <Eye className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-[10px] text-white/60">Visibility</div>
              <div className="text-sm font-bold text-white">10 mi</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
