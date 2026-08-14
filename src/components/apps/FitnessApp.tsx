import React, { useState, useEffect } from 'react';
import { Activity, Flame, Droplets, Heart, Footprints, Plus, Minus, Play, Pause, RefreshCw } from 'lucide-react';

export const FitnessApp: React.FC = () => {
  const [steps, setSteps] = useState(8420);
  const [goal] = useState(10000);
  const [waterCount, setWaterCount] = useState(5);
  const [heartRate, setHeartRate] = useState(72);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutSeconds, setWorkoutSeconds] = useState(0);

  // Heartbeat pulse effect
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.min(130, Math.max(60, prev + delta));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Workout timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isWorkoutActive) {
      timer = setInterval(() => {
        setWorkoutSeconds(s => s + 1);
        setSteps(s => s + 2);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isWorkoutActive]);

  const stepPercent = Math.min(100, Math.round((steps / goal) * 100));
  const caloriesBurned = Math.round(steps * 0.04);
  const kmDistance = (steps * 0.00078).toFixed(2);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-y-auto pb-12">
      {/* App Top Bar */}
      <div className="p-4 bg-emerald-950/80 backdrop-blur sticky top-0 z-10 border-b border-emerald-800/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-emerald-300 leading-tight">FitPulse</h1>
            <p className="text-[11px] text-emerald-400/70">Material You Fitness</p>
          </div>
        </div>
        <button 
          onClick={() => { setSteps(0); setWaterCount(0); setWorkoutSeconds(0); }}
          className="p-1.5 rounded-full hover:bg-emerald-900/50 text-emerald-400 text-xs flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Main Step Ring Card */}
        <div className="bg-gradient-to-br from-emerald-900/40 via-slate-900 to-slate-900 rounded-3xl p-5 border border-emerald-500/30 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Footprints className="w-4 h-4" /> Daily Step Count
            </span>
            <span className="text-xs text-slate-400">{stepPercent}% completed</span>
          </div>

          <div className="flex items-center justify-around my-2">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400 transition-all duration-500 ease-out"
                  strokeDasharray={`${stepPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center flex flex-col items-center">
                <span className="text-2xl font-extrabold tracking-tight text-white">{steps.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400">/ {goal.toLocaleString()} steps</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/50 flex items-center gap-3">
                <Flame className="w-4 h-4 text-orange-400" />
                <div>
                  <div className="text-xs text-slate-400">Burned</div>
                  <div className="text-sm font-bold text-white">{caloriesBurned} kcal</div>
                </div>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/50 flex items-center gap-3">
                <Activity className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="text-xs text-slate-400">Distance</div>
                  <div className="text-sm font-bold text-white">{kmDistance} km</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSteps(s => s + 250)}
            className="w-full mt-2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs transition flex items-center justify-center gap-1.5 shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" /> Simulate +250 Steps
          </button>
        </div>

        {/* Live Heart Rate Sensor & Active Workout */}
        <div className="grid grid-cols-2 gap-3">
          {/* Heart Rate Card */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Heart Rate</span>
              <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-black text-white flex items-baseline gap-1">
                {heartRate} <span className="text-xs font-normal text-rose-400">BPM</span>
              </div>
              <p className="text-[10px] text-slate-400">Real-time PPG sensor</p>
            </div>
            {/* Waveform graphic */}
            <div className="h-6 flex items-end gap-1 opacity-70">
              <div className="w-1 bg-rose-500/30 rounded-full h-2 animate-pulse"></div>
              <div className="w-1 bg-rose-500/60 rounded-full h-4 animate-pulse"></div>
              <div className="w-1 bg-rose-500 rounded-full h-6 animate-pulse"></div>
              <div className="w-1 bg-rose-500/40 rounded-full h-3"></div>
              <div className="w-1 bg-rose-500/80 rounded-full h-5 animate-pulse"></div>
              <div className="w-1 bg-rose-500/30 rounded-full h-2"></div>
            </div>
          </div>

          {/* Active Workout Tracker */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Workout Session</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <div>
              <div className="text-xl font-bold text-emerald-400">{formatTime(workoutSeconds)}</div>
              <p className="text-[10px] text-slate-400">{isWorkoutActive ? 'Cardio Workout Running' : 'Session Paused'}</p>
            </div>
            <button
              onClick={() => setIsWorkoutActive(!isWorkoutActive)}
              className={`w-full py-2 rounded-2xl text-xs font-bold flex items-center justify-center gap-1 transition ${
                isWorkoutActive 
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30' 
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
              }`}
            >
              {isWorkoutActive ? <><Pause className="w-3.5 h-3.5" /> Pause</> : <><Play className="w-3.5 h-3.5" /> Start Workout</>}
            </button>
          </div>
        </div>

        {/* Hydration Tracker */}
        <div className="bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-800/30 p-4 rounded-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Hydration Tracker</div>
              <div className="text-xs text-cyan-300/70">{waterCount} Glasses ({(waterCount * 0.25).toFixed(2)}L)</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWaterCount(w => Math.max(0, w - 1))}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center border border-slate-700 active:scale-90 transition"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center font-bold text-sm text-cyan-400">{waterCount}</span>
            <button
              onClick={() => setWaterCount(w => w + 1)}
              className="w-8 h-8 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center font-bold active:scale-90 transition shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
