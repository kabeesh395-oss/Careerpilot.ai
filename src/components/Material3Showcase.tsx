import React, { useState } from 'react';
import { Layers, Palette, Check, Sliders, ToggleLeft, ToggleRight, Sparkles, AlertCircle } from 'lucide-react';

export const Material3Showcase: React.FC = () => {
  const [sliderVal, setSliderVal] = useState(65);
  const [switch1, setSwitch1] = useState(true);
  const [switch2, setSwitch2] = useState(false);
  const [selectedChip, setSelectedChip] = useState('Compose');
  const [inputText, setInputText] = useState('Material 3 Dynamic');

  const chips = ['Jetpack', 'Compose', 'Material You', 'Kotlin 2.0'];

  const colorPalette = [
    { name: 'Primary', hex: '#6750A4', text: '#FFFFFF', desc: 'Key brand accent' },
    { name: 'Primary Container', hex: '#EADDFF', text: '#21005D', desc: 'Prominent containers' },
    { name: 'Secondary', hex: '#625B71', text: '#FFFFFF', desc: 'Less prominent elements' },
    { name: 'Tertiary', hex: '#7D5260', text: '#FFFFFF', desc: 'Contrasting accent' },
    { name: 'Surface', hex: '#FEF7FF', text: '#1D1B20', desc: 'Cards, sheets, menus' },
    { name: 'Error', hex: '#B3261E', text: '#FFFFFF', desc: 'Errors and warnings' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-6 text-slate-100 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Material Design 3 UI Kit</h2>
            <p className="text-[11px] text-slate-400">Jetpack Compose Material 3 standard component guidelines</p>
          </div>
        </div>
        <span className="text-[10px] bg-purple-500/20 text-purple-300 font-mono px-2.5 py-1 rounded-full border border-purple-500/30">
          M3 System v1.3
        </span>
      </div>

      {/* Buttons & Action Controls */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">1. Buttons & Floating Action Buttons</h3>
        <div className="flex flex-wrap items-center gap-3">
          <button className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2 rounded-2xl text-xs shadow-md transition active:scale-95">
            Filled Button
          </button>
          <button className="bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold px-4 py-2 rounded-2xl text-xs border border-purple-500/30 shadow transition active:scale-95">
            Elevated Button
          </button>
          <button className="border border-slate-700 hover:border-purple-400 text-slate-200 font-semibold px-4 py-2 rounded-2xl text-xs transition active:scale-95">
            Outlined Button
          </button>
          <button className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-lg active:scale-90 transition">
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selection Chips */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">2. Filter & Input Chips</h3>
        <div className="flex flex-wrap gap-2">
          {chips.map(chip => {
            const isSel = selectedChip === chip;
            return (
              <button
                key={chip}
                onClick={() => setSelectedChip(chip)}
                className={`px-3 py-1.5 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  isSel ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {isSel && <Check className="w-3.5 h-3.5" />}
                {chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Controls & Toggles */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">3. Form Inputs, Switches & Sliders</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-medium">Outlined Text Field</label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-medium">Slider ({sliderVal}%)</label>
            <input
              type="range"
              min={0}
              max={100}
              value={sliderVal}
              onChange={(e) => setSliderVal(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between col-span-1 sm:col-span-2 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-4">
              <button onClick={() => setSwitch1(!switch1)} className="flex items-center gap-2 text-xs text-slate-300">
                {switch1 ? <ToggleRight className="w-6 h-6 text-purple-400" /> : <ToggleLeft className="w-6 h-6 text-slate-600" />}
                Dark Mode
              </button>
              <button onClick={() => setSwitch2(!switch2)} className="flex items-center gap-2 text-xs text-slate-300">
                {switch2 ? <ToggleRight className="w-6 h-6 text-purple-400" /> : <ToggleLeft className="w-6 h-6 text-slate-600" />}
                Dynamic Haptics
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Color Palette */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5" /> 4. Material You Tonal Palette
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {colorPalette.map(c => (
            <div
              key={c.name}
              className="p-3 rounded-2xl flex flex-col justify-between h-20 shadow border border-white/10"
              style={{ backgroundColor: c.hex, color: c.text }}
            >
              <div className="font-bold text-xs leading-tight">{c.name}</div>
              <div className="text-[10px] opacity-80 font-mono">{c.hex}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
