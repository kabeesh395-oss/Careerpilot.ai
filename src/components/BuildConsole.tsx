import React, { useState, useEffect } from 'react';
import { Terminal, Play, RotateCcw, Cpu, HardDrive, Gauge, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { LogEntry } from '../types';

export const BuildConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'logcat' | 'gradle'>('logcat');
  const [logLevel, setLogLevel] = useState<string>('ALL');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(100);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', timestamp: '09:41:02.102', level: 'I', tag: 'ActivityManager', message: 'Starting activity: com.example.MainActivity' },
    { id: '2', timestamp: '09:41:02.340', level: 'D', tag: 'ComposeRenderer', message: 'Recomposing layout tree for Scaffold node' },
    { id: '3', timestamp: '09:41:02.510', level: 'I', tag: 'Material3Theme', message: 'Material You Dynamic Color scheme generated' },
    { id: '4', timestamp: '09:41:03.012', level: 'V', tag: 'FitPulseSensor', message: 'Step count updated: 8420 steps (delta +12)' },
    { id: '5', timestamp: '09:41:03.880', level: 'D', tag: 'RoomDatabase', message: 'Query completed in 4ms on thread Dispatchers.IO' }
  ]);

  const [fps, setFps] = useState(60);
  const [memoryMB, setMemoryMB] = useState(148);

  // FPS simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setFps(Math.floor(Math.random() * 3) + 59);
      setMemoryMB(145 + Math.floor(Math.random() * 8));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const triggerGradleBuild = () => {
    setIsBuilding(true);
    setBuildProgress(10);
    const buildSteps = [
      'Executing task :app:preBuild...',
      'Executing task :app:compileDebugKotlin (Kotlin 2.0.21)...',
      'Executing task :app:mergeDebugResources...',
      'Executing task :app:packageDebugAPK...',
      'BUILD SUCCESSFUL in 1.42s'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setBuildProgress((currentStep / buildSteps.length) * 100);

      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        level: 'I',
        tag: 'GradleDaemon',
        message: buildSteps[currentStep - 1]
      };

      setLogs(prev => [newLog, ...prev]);

      if (currentStep >= buildSteps.length) {
        clearInterval(interval);
        setIsBuilding(false);
      }
    }, 600);
  };

  const filteredLogs = logLevel === 'ALL' ? logs : logs.filter(l => l.level === logLevel);

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4 text-slate-100 shadow-xl font-sans">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">ADB Logcat & Gradle Build Terminal</h2>
            <p className="text-[11px] text-slate-400">Real-time compilation logs and device diagnostics</p>
          </div>
        </div>

        {/* Diagnostic Chips */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-emerald-400 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
            <Gauge className="w-3.5 h-3.5" /> {fps} FPS
          </span>
          <span className="flex items-center gap-1 text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
            <HardDrive className="w-3.5 h-3.5" /> {memoryMB} MB RAM
          </span>
        </div>
      </div>

      {/* Mode Selectors */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex bg-slate-950 p-1 rounded-2xl text-xs font-semibold border border-slate-800">
          <button
            onClick={() => setActiveTab('logcat')}
            className={`px-3 py-1.5 rounded-xl transition ${activeTab === 'logcat' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}
          >
            ADB Logcat
          </button>
          <button
            onClick={() => setActiveTab('gradle')}
            className={`px-3 py-1.5 rounded-xl transition ${activeTab === 'gradle' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}
          >
            Gradle Terminal
          </button>
        </div>

        {activeTab === 'logcat' && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-mono">Level:</span>
            {['ALL', 'V', 'D', 'I', 'W', 'E'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setLogLevel(lvl)}
                className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition ${
                  logLevel === lvl ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-500 hover:text-slate-300'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'gradle' && (
          <button
            onClick={triggerGradleBuild}
            disabled={isBuilding}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-bold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow active:scale-95 transition"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> ./gradlew assembleDebug
          </button>
        )}
      </div>

      {/* Build Progress Bar */}
      {isBuilding && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-emerald-400 font-mono">
            <span>Compiling Android APK...</span>
            <span>{Math.round(buildProgress)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${buildProgress}%` }}></div>
          </div>
        </div>
      )}

      {/* Log Output Console */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs h-48 overflow-y-auto space-y-1.5">
        {filteredLogs.map(log => (
          <div key={log.id} className="flex items-start gap-2 leading-relaxed">
            <span className="text-slate-500 shrink-0">{log.timestamp}</span>
            <span className={`font-bold shrink-0 ${
              log.level === 'E' ? 'text-rose-400' : log.level === 'W' ? 'text-amber-400' : log.level === 'I' ? 'text-emerald-400' : 'text-cyan-400'
            }`}>
              [{log.level}]
            </span>
            <span className="text-purple-400 font-semibold shrink-0">{log.tag}:</span>
            <span className="text-slate-200">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
