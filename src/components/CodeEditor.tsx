import React, { useState, useEffect } from 'react';
import { FileCode, Copy, Check, Download, Play, Search, Folder, ChevronRight, FileText } from 'lucide-react';
import { AndroidApp } from '../types';

interface CodeEditorProps {
  app: AndroidApp;
  onCodeChange?: (newCode: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ app, onCodeChange }) => {
  const [selectedFile, setSelectedFile] = useState<'kotlin' | 'manifest' | 'gradle' | 'strings'>('kotlin');
  const [codeContent, setCodeContent] = useState(app.kotlinCode);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync state when app changes
  useEffect(() => {
    switch (selectedFile) {
      case 'kotlin':
        setCodeContent(app.kotlinCode);
        break;
      case 'manifest':
        setCodeContent(app.xmlManifest);
        break;
      case 'gradle':
        setCodeContent(app.gradleCode);
        break;
      case 'strings':
        setCodeContent(app.stringsXml);
        break;
    }
  }, [app, selectedFile]);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = selectedFile === 'kotlin' ? 'MainActivity.kt' : selectedFile === 'manifest' ? 'AndroidManifest.xml' : selectedFile === 'gradle' ? 'build.gradle.kts' : 'strings.xml';
    const blob = new Blob([codeContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const lines = codeContent.split('\n');

  return (
    <div className="h-full bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-xl text-slate-100 font-sans">
      {/* IDE Top Bar / Navigation */}
      <div className="bg-slate-950 border-b border-slate-800 p-3 flex flex-wrap items-center justify-between gap-2">
        {/* File Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedFile('kotlin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              selectedFile === 'kotlin' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" /> MainActivity.kt
          </button>

          <button
            onClick={() => setSelectedFile('manifest')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              selectedFile === 'manifest' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" /> AndroidManifest.xml
          </button>

          <button
            onClick={() => setSelectedFile('gradle')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              selectedFile === 'gradle' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-400" /> build.gradle.kts
          </button>

          <button
            onClick={() => setSelectedFile('strings')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              selectedFile === 'strings' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-rose-400" /> strings.xml
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area with Line Numbers */}
      <div className="flex-1 flex overflow-hidden bg-slate-950 font-mono text-xs relative">
        {/* Line Numbers Column */}
        <div className="py-3 px-3 bg-slate-900/60 border-r border-slate-800 text-slate-600 select-none text-right shrink-0">
          {lines.map((_, i) => (
            <div key={i} className="leading-6">{i + 1}</div>
          ))}
        </div>

        {/* Code View / Edit Textarea */}
        <textarea
          value={codeContent}
          onChange={(e) => {
            setCodeContent(e.target.value);
            if (onCodeChange && selectedFile === 'kotlin') {
              onCodeChange(e.target.value);
            }
          }}
          spellCheck={false}
          className="flex-1 p-3 bg-transparent text-indigo-100 focus:outline-none resize-none leading-6 font-mono whitespace-pre overflow-x-auto selection:bg-indigo-500/30"
        />
      </div>

      {/* Footer Status Bar */}
      <div className="bg-slate-950 border-t border-slate-800 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Kotlin 2.0.21
          </span>
          <span>UTF-8</span>
          <span>{lines.length} lines</span>
        </div>
        <span>Package: {app.id === 'custom_ai' ? 'com.example.custom' : `com.example.${app.id}`}</span>
      </div>
    </div>
  );
};
