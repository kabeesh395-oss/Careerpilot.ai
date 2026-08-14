import React, { useState, useEffect } from 'react';
import { 
  Wifi, Signal, Battery, Search, Mic, Camera, 
  ChevronLeft, Circle, Square, Sun, Moon, Bluetooth, 
  Flashlight, Bell, RotateCcw, Smartphone
} from 'lucide-react';
import { AppId, AndroidApp, CustomAppSpec } from '../types';
import { FitnessApp } from './apps/FitnessApp';
import { MusicApp } from './apps/MusicApp';
import { TaskApp } from './apps/TaskApp';
import { WeatherApp } from './apps/WeatherApp';
import { AiChatApp } from './apps/AiChatApp';
import { FoodDeliveryApp } from './apps/FoodDeliveryApp';
import { CareerGuidanceApp } from './apps/CareerGuidanceApp';
import { CustomDynamicApp } from './apps/CustomDynamicApp';

interface DeviceEmulatorProps {
  currentAppId: AppId | 'home';
  onSelectApp: (id: AppId | 'home') => void;
  appsList: AndroidApp[];
  customSpec?: CustomAppSpec | null;
}

export const DeviceEmulator: React.FC<DeviceEmulatorProps> = ({
  currentAppId,
  onSelectApp,
  appsList,
  customSpec
}) => {
  const [time, setTime] = useState('09:41');
  const [showNotificationShade, setShowNotificationShade] = useState(false);
  const [wifiOn, setWifiOn] = useState(true);
  const [bluetoothOn, setBluetoothOn] = useState(true);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [navMode, setNavMode] = useState<'gesture' | 'buttons'>('gesture');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const renderActiveApp = () => {
    switch (currentAppId) {
      case 'career_guidance':
        return <CareerGuidanceApp />;
      case 'fitpulse':
        return <FitnessApp />;
      case 'harmonix':
        return <MusicApp />;
      case 'focuslist':
        return <TaskApp />;
      case 'auraweather':
        return <WeatherApp />;
      case 'gemini_assistant':
        return <AiChatApp />;
      case 'bitedash':
        return <FoodDeliveryApp />;
      case 'custom_ai':
        return customSpec ? <CustomDynamicApp spec={customSpec} /> : <FitnessApp />;
      default:
        return null;
    }
  };

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* External Device Frame Shadow */}
      <div className="relative w-[340px] sm:w-[360px] h-[700px] bg-slate-900 rounded-[50px] p-3 shadow-2xl border-4 border-slate-700/80 ring-1 ring-white/10 flex flex-col">
        {/* Physical Side Buttons */}
        <div className="absolute -left-[7px] top-28 w-[3px] h-12 bg-slate-700 rounded-l-sm"></div>
        <div className="absolute -left-[7px] top-44 w-[3px] h-12 bg-slate-700 rounded-l-sm"></div>
        <div className="absolute -right-[7px] top-32 w-[3px] h-16 bg-slate-700 rounded-r-sm"></div>

        {/* Screen Bezel & Container */}
        <div className="relative w-full h-full bg-slate-950 rounded-[40px] overflow-hidden flex flex-col border border-slate-800">
          
          {/* Top Status Bar & Camera Punch Hole */}
          <div className="relative z-30 h-10 px-6 bg-slate-950/80 backdrop-blur text-slate-200 flex items-center justify-between text-xs font-semibold shrink-0">
            {/* Clock */}
            <span className="font-mono text-xs">{time}</span>

            {/* Camera Punch Hole */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-4 h-4 rounded-full bg-black border border-slate-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
            </div>

            {/* Status Icons */}
            <div className="flex items-center gap-2">
              <Wifi className={`w-3.5 h-3.5 ${wifiOn ? 'text-slate-200' : 'text-slate-600'}`} />
              <Signal className="w-3.5 h-3.5 text-slate-200" />
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono">85%</span>
                <Battery className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
              </div>
            </div>
          </div>

          {/* Expandable Notification & Quick Settings Shade */}
          {showNotificationShade && (
            <div className="absolute inset-x-0 top-10 bottom-12 z-40 bg-slate-950/95 backdrop-blur-md p-4 text-white space-y-4 animate-in slide-in-from-top duration-200">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-300">Quick Settings</span>
                <button
                  onClick={() => setShowNotificationShade(false)}
                  className="text-xs text-indigo-400 font-semibold"
                >
                  Close
                </button>
              </div>

              {/* Quick Toggles Grid */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => setWifiOn(!wifiOn)}
                  className={`p-3 rounded-2xl flex flex-col items-center gap-1 transition ${wifiOn ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                >
                  <Wifi className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Wi-Fi</span>
                </button>

                <button
                  onClick={() => setBluetoothOn(!bluetoothOn)}
                  className={`p-3 rounded-2xl flex flex-col items-center gap-1 transition ${bluetoothOn ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                >
                  <Bluetooth className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Bluetooth</span>
                </button>

                <button
                  onClick={() => setFlashlightOn(!flashlightOn)}
                  className={`p-3 rounded-2xl flex flex-col items-center gap-1 transition ${flashlightOn ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
                >
                  <Flashlight className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Torch</span>
                </button>

                <button
                  onClick={() => setNavMode(navMode === 'gesture' ? 'buttons' : 'gesture')}
                  className="p-3 bg-slate-900 text-slate-300 rounded-2xl flex flex-col items-center gap-1"
                >
                  <Smartphone className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{navMode}</span>
                </button>
              </div>

              {/* Notifications */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Notifications</span>
                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-xs space-y-1">
                  <div className="flex justify-between font-bold text-indigo-300">
                    <span>Android System</span>
                    <span className="text-[10px] text-slate-500">Just now</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">Material You theme dynamic palette applied successfully.</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Settings Pull Handle Button */}
          <button
            onClick={() => setShowNotificationShade(!showNotificationShade)}
            className="absolute top-10 left-1/2 -translate-x-1/2 z-30 w-12 h-1 bg-slate-700 hover:bg-indigo-400 rounded-full transition"
            title="Toggle Quick Settings Panel"
          ></button>

          {/* Main Display Area (Home Screen vs Running App) */}
          <div className="relative flex-1 w-full overflow-hidden bg-slate-950">
            {currentAppId === 'home' ? (
              /* Android 15 Home Screen */
              <div className="h-full w-full bg-gradient-to-b from-indigo-950 via-slate-950 to-slate-950 p-4 flex flex-col justify-between overflow-y-auto">
                {/* Clock & Weather Widget */}
                <div className="pt-4 space-y-2">
                  <div className="bg-white/5 backdrop-blur border border-white/10 p-4 rounded-3xl text-center shadow-lg">
                    <div className="text-4xl font-black text-white tracking-tight">{time}</div>
                    <div className="text-xs text-indigo-200 mt-1 font-medium">Thursday, Aug 13 • 72°F Partly Cloudy</div>
                  </div>

                  {/* Google Search Widget */}
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-full flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-2 px-2 text-slate-400 text-xs font-medium">
                      <Search className="w-4 h-4 text-indigo-400" />
                      <span>Search apps or web...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-rose-400" />
                      <Camera className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
                </div>

                {/* App Grid */}
                <div className="grid grid-cols-3 gap-4 my-auto py-4">
                  {appsList.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => onSelectApp(app.id)}
                      className="flex flex-col items-center gap-2 group active:scale-95 transition"
                    >
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all group-hover:scale-110 border border-white/20"
                        style={{ backgroundColor: app.color }}
                      >
                        <span className="text-xl font-bold">{app.name.substring(0, 2)}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-200 truncate w-20 text-center leading-tight">
                        {app.name}
                      </span>
                    </button>
                  ))}

                  {/* Custom AI App Icon if generated */}
                  {customSpec && (
                    <button
                      onClick={() => onSelectApp('custom_ai')}
                      className="flex flex-col items-center gap-2 group active:scale-95 transition"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl transition-all group-hover:scale-110 border border-white/30">
                        <span className="text-xl font-bold">AI</span>
                      </div>
                      <span className="text-[11px] font-semibold text-indigo-300 truncate w-20 text-center leading-tight">
                        {customSpec.title}
                      </span>
                    </button>
                  )}
                </div>

                {/* Bottom App Dock */}
                <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-2.5 rounded-3xl flex justify-around items-center">
                  <button onClick={() => onSelectApp('gemini_assistant')} className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <span className="font-bold text-xs">AI</span>
                  </button>
                  <button onClick={() => onSelectApp('harmonix')} className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                    <span className="font-bold text-xs">🎶</span>
                  </button>
                  <button onClick={() => onSelectApp('fitpulse')} className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <span className="font-bold text-xs">🏃</span>
                  </button>
                  <button onClick={() => onSelectApp('bitedash')} className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                    <span className="font-bold text-xs">🍔</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Active Application Container */
              <div className="h-full w-full">
                {renderActiveApp()}
              </div>
            )}
          </div>

          {/* Android Navigation Bar (Gesture Bar or 3-Button Navigation) */}
          <div className="h-12 bg-slate-950 text-slate-400 flex items-center justify-center shrink-0 border-t border-slate-900 z-30">
            {navMode === 'gesture' ? (
              <button
                onClick={() => onSelectApp('home')}
                className="w-28 h-1.5 bg-slate-400 hover:bg-indigo-400 rounded-full transition active:scale-90"
                title="Swipe Home"
              ></button>
            ) : (
              <div className="w-full px-8 flex justify-between items-center text-slate-400">
                <button onClick={() => onSelectApp('home')} className="p-2 hover:text-white transition">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => onSelectApp('home')} className="p-2 hover:text-white transition">
                  <Circle className="w-4 h-4" />
                </button>
                <button onClick={() => alert('Android Recents overview')} className="p-2 hover:text-white transition">
                  <Square className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
