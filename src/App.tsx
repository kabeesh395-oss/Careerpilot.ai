import React, { useState } from 'react';
import { 
  Smartphone, Code2, Sparkles, Layers, Terminal, 
  Download, Play, CheckCircle2, ChevronRight, Activity, 
  Music, CheckSquare, CloudSun, Bot, Utensils, Wand2, Shield, Github
} from 'lucide-react';
import { SAMPLE_APPS } from './data/sampleAppsData';
import { AppId, AndroidApp, CustomAppSpec } from './types';
import { DeviceEmulator } from './components/DeviceEmulator';
import { CodeEditor } from './components/CodeEditor';
import { AiAppGenerator } from './components/AiAppGenerator';
import { Material3Showcase } from './components/Material3Showcase';
import { BuildConsole } from './components/BuildConsole';

export default function App() {
  const [selectedAppId, setSelectedAppId] = useState<AppId | 'home'>('career_guidance');
  const [activeTab, setActiveTab] = useState<'emulator' | 'code' | 'generator' | 'm3' | 'console'>('emulator');
  const [customSpec, setCustomSpec] = useState<CustomAppSpec | null>(null);
  const [appsList, setAppsList] = useState<AndroidApp[]>(SAMPLE_APPS);

  const activeApp = appsList.find(a => a.id === selectedAppId) || appsList[0];

  const handleGeneratedApp = (spec: CustomAppSpec) => {
    setCustomSpec(spec);
    setSelectedAppId('custom_ai');
    setActiveTab('emulator');
  };

  const handleCodeChange = (newCode: string) => {
    setAppsList(prev => prev.map(a => a.id === selectedAppId ? { ...a, kotlinCode: newCode } : a));
  };

  const exportFullProject = () => {
    const projectContent = JSON.stringify({
      app: activeApp,
      customSpec,
      exportedAt: new Date().toISOString(),
      sdk: 'Android 15 (API 35)',
      framework: 'Jetpack Compose + Material 3'
    }, null, 2);

    const blob = new Blob([projectContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeApp.id}-android-project.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Studio Navigation Top Header */}
      <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-rose-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-400">
                <Smartphone className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-white tracking-tight">Android App Studio</h1>
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  Kotlin & Compose
                </span>
              </div>
              <p className="text-xs text-slate-400">Interactive Device Emulator & Gemini AI Builder</p>
            </div>
          </div>

          {/* Quick Studio View Switcher Tabs */}
          <div className="hidden md:flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('emulator')}
              className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition ${
                activeTab === 'emulator' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4" /> Device Preview
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition ${
                activeTab === 'code' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-4 h-4 text-amber-400" /> Kotlin IDE
            </button>

            <button
              onClick={() => setActiveTab('generator')}
              className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition ${
                activeTab === 'generator' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wand2 className="w-4 h-4 text-rose-400" /> AI Generator
            </button>

            <button
              onClick={() => setActiveTab('m3')}
              className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition ${
                activeTab === 'm3' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4 text-purple-400" /> Material 3
            </button>

            <button
              onClick={() => setActiveTab('console')}
              className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition ${
                activeTab === 'console' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-4 h-4 text-emerald-400" /> Logcat
            </button>
          </div>

          {/* Export Project Button */}
          <button
            onClick={exportFullProject}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-2xl text-xs flex items-center gap-2 shadow-lg active:scale-95 transition"
          >
            <Download className="w-4 h-4" /> Export Android Project
          </button>
        </div>

        {/* Mobile View Switcher Tabs */}
        <div className="flex md:hidden bg-slate-950 p-2 overflow-x-auto gap-2 border-t border-slate-800 text-xs font-semibold no-scrollbar">
          <button
            onClick={() => setActiveTab('emulator')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${activeTab === 'emulator' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            📱 Device
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${activeTab === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            💻 IDE Code
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${activeTab === 'generator' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            🪄 AI Generator
          </button>
          <button
            onClick={() => setActiveTab('m3')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${activeTab === 'm3' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            🎨 Material 3
          </button>
          <button
            onClick={() => setActiveTab('console')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${activeTab === 'console' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            📟 Logcat
          </button>
        </div>
      </header>

      {/* Main Studio Work Environment */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Workspace / Main Studio View (7 cols on LG) */}
        <div className="lg:col-span-7 space-y-6">
          {activeTab === 'emulator' && (
            <div className="flex flex-col items-center justify-center p-4 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur shadow-xl min-h-[720px]">
              <div className="mb-4 text-center">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Streaming Device Preview
                </span>
                <p className="text-xs text-slate-400 mt-0.5">Pixel 9 Pro • Android 15 • Jetpack Compose Runtime</p>
              </div>

              <DeviceEmulator
                currentAppId={selectedAppId}
                onSelectApp={(id) => setSelectedAppId(id)}
                appsList={appsList}
                customSpec={customSpec}
              />
            </div>
          )}

          {activeTab === 'code' && (
            <div className="h-[720px]">
              <CodeEditor app={activeApp} onCodeChange={handleCodeChange} />
            </div>
          )}

          {activeTab === 'generator' && (
            <div className="space-y-6">
              <AiAppGenerator onGeneratedApp={handleGeneratedApp} />
            </div>
          )}

          {activeTab === 'm3' && (
            <Material3Showcase />
          )}

          {activeTab === 'console' && (
            <BuildConsole />
          )}
        </div>

        {/* Right Column: App Selector, Code Details & Features Panel (5 cols on LG) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* AI App Generator Mini Banner */}
          <div className="bg-gradient-to-r from-indigo-900/50 via-purple-900/40 to-slate-900 border border-indigo-500/30 p-4 rounded-3xl shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Gemini AI Studio</h3>
                <p className="text-xs text-slate-300">Generate Jetpack Compose apps from text</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('generator')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 active:scale-95 transition"
            >
              Open <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pre-Built Featured Android Apps Selector */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Android App Gallery</h2>
              <span className="text-[10px] text-slate-400 font-mono">{appsList.length} Apps Included</span>
            </div>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {appsList.map(app => {
                const isSelected = app.id === selectedAppId;
                return (
                  <div
                    key={app.id}
                    onClick={() => {
                      setSelectedAppId(app.id);
                      if (activeTab !== 'emulator' && activeTab !== 'code') setActiveTab('emulator');
                    }}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected 
                        ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md' 
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
                        style={{ backgroundColor: app.color }}
                      >
                        {app.name.substring(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-sm leading-tight flex items-center gap-1.5">
                          {app.name}
                          {isSelected && <span className="text-[10px] bg-indigo-500/30 text-indigo-300 px-2 py-0.2 rounded-full font-mono">Active</span>}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{app.category}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAppId(app.id);
                          setActiveTab('code');
                        }}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition"
                        title="View Kotlin Code"
                      >
                        <Code2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAppId(app.id);
                          setActiveTab('emulator');
                        }}
                        className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white transition"
                        title="Run in Device Emulator"
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Custom AI App if available */}
              {customSpec && (
                <div
                  onClick={() => {
                    setSelectedAppId('custom_ai');
                    setActiveTab('emulator');
                  }}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    selectedAppId === 'custom_ai' 
                      ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-md' 
                      : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      AI
                    </div>
                    <div>
                      <div className="font-bold text-sm leading-tight text-indigo-300 flex items-center gap-1.5">
                        {customSpec.title}
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">Gemini Generated</div>
                    </div>
                  </div>
                  <Play className="w-4 h-4 text-indigo-400 fill-current" />
                </div>
              )}
            </div>
          </div>

          {/* Architecture & Tech Stack Card */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-400" /> Tech Stack & Architecture
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono">UI Framework</span>
                <p className="font-bold text-indigo-300">Jetpack Compose 1.7</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono">Design System</span>
                <p className="font-bold text-purple-300">Material Design 3</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono">Concurrency</span>
                <p className="font-bold text-emerald-300">Kotlin Coroutines</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono">AI Provider</span>
                <p className="font-bold text-amber-300">Gemini 2.5 Flash</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
