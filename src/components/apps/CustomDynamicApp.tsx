import React, { useState } from 'react';
import { CustomAppSpec } from '../../types';
import { Sparkles, CheckCircle, ToggleLeft, ToggleRight, ArrowRight, Activity, MessageSquare } from 'lucide-react';

interface Props {
  spec: CustomAppSpec;
}

export const CustomDynamicApp: React.FC<Props> = ({ spec }) => {
  const [toggleStates, setToggleStates] = useState<Record<number, boolean>>({});
  const [activeItems, setActiveItems] = useState<Record<number, boolean>>({});
  const [chatInputs, setChatInputs] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');

  const toggleSwitch = (idx: number) => {
    setToggleStates(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleListItem = (idx: number) => {
    setActiveItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="h-full bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-y-auto pb-12">
      {/* Top Bar */}
      <div className="p-4 bg-slate-900/90 backdrop-blur sticky top-0 z-10 border-b border-indigo-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-indigo-300 leading-tight">{spec.title || 'Generated AI App'}</h1>
            <p className="text-[10px] text-slate-400">Jetpack Compose Dynamic Preview</p>
          </div>
        </div>
        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30 font-mono">
          Gemini Generated
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30 p-5 rounded-3xl space-y-1 shadow-lg">
          <h2 className="text-xl font-black text-white">{spec.headerTitle}</h2>
          <p className="text-xs text-indigo-300/80">{spec.subtitle}</p>
          {spec.description && (
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 mt-2">{spec.description}</p>
          )}
        </div>

        {/* Render Generated Features */}
        <div className="space-y-3">
          {spec.features.map((feat, idx) => {
            if (feat.type === 'stat_card') {
              return (
                <div key={idx} className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">{feat.label}</span>
                    <div className="text-xl font-bold text-indigo-400 mt-0.5">{feat.value}</div>
                  </div>
                  <Activity className="w-5 h-5 text-indigo-400" />
                </div>
              );
            }

            if (feat.type === 'toggle_switch') {
              const isOn = toggleStates[idx] ?? true;
              return (
                <div
                  key={idx}
                  onClick={() => toggleSwitch(idx)}
                  className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-3xl flex items-center justify-between cursor-pointer hover:border-slate-700 transition"
                >
                  <span className="text-xs font-semibold text-slate-200">{feat.label}</span>
                  {isOn ? (
                    <ToggleRight className="w-8 h-8 text-indigo-400" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-600" />
                  )}
                </div>
              );
            }

            if (feat.type === 'list_item') {
              const isChecked = activeItems[idx] ?? false;
              return (
                <div
                  key={idx}
                  onClick={() => toggleListItem(idx)}
                  className={`p-3.5 rounded-3xl border transition flex items-center justify-between cursor-pointer ${
                    isChecked ? 'bg-indigo-950/40 border-indigo-500/40 opacity-70' : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className={`w-4 h-4 ${isChecked ? 'text-indigo-400' : 'text-slate-600'}`} />
                    <span className={`text-xs font-semibold ${isChecked ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                      {feat.label}
                    </span>
                  </div>
                  {feat.value && <span className="text-xs font-bold text-indigo-300">{feat.value}</span>}
                </div>
              );
            }

            if (feat.type === 'action_button') {
              return (
                <button
                  key={idx}
                  onClick={() => alert(`Triggered action: ${feat.label}`)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
                >
                  {feat.label} <ArrowRight className="w-4 h-4" />
                </button>
              );
            }

            if (feat.type === 'chat_input') {
              return (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-3 rounded-3xl space-y-2">
                  <div className="text-xs font-semibold text-indigo-300 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" /> {feat.label}
                  </div>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {chatInputs.map((c, i) => (
                      <div key={i} className="bg-slate-950 p-2 rounded-xl text-xs text-slate-300">{c}</div>
                    ))}
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!inputText.trim()) return;
                      setChatInputs([...chatInputs, inputText.trim()]);
                      setInputText('');
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button type="submit" className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                      Send
                    </button>
                  </form>
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
};
