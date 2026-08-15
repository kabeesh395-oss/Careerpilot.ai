import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Trash2, Download, X, Lock, CheckCircle2, AlertTriangle } from 'lucide-react';

interface PrivacySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearResume: () => void;
  onResetAllData: () => void;
  onExportData: () => void;
}

export const PrivacySettingsModal: React.FC<PrivacySettingsModalProps> = ({
  isOpen,
  onClose,
  onClearResume,
  onResetAllData,
  onExportData
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl p-4 max-h-[85vh] overflow-y-auto space-y-3.5 shadow-2xl text-xs select-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Lock className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Privacy & Local Data Control</h3>
                <p className="text-[10px] text-slate-400">Transparent on-device data sovereignty</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Privacy Guarantees */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Privacy Architecture
            </span>
            <div className="space-y-1 text-[10px] text-slate-300 leading-relaxed">
              <p>• <strong>100% Client-Side Storage:</strong> All profile inputs, resume text, task progress, and application records remain in your browser's local sandbox.</p>
              <p>• <strong>No Data Brokering:</strong> We do not sell, scrape, or retain your personal resumes or career telemetry on external tracking servers.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Data Operations</span>
            
            {/* Export */}
            <button
              onClick={onExportData}
              className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2 text-left">
                <Download className="w-4 h-4 text-indigo-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Export Career Data (JSON)</h4>
                  <p className="text-[10px] text-slate-400">Download backup of all scores, tasks & applications</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-indigo-400">JSON</span>
            </button>

            {/* Clear Resume */}
            <button
              onClick={() => {
                if (confirm('Clear saved resume text from local memory?')) {
                  onClearResume();
                  alert('Resume text successfully cleared.');
                }
              }}
              className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2 text-left">
                <Trash2 className="w-4 h-4 text-amber-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Delete Resume Text</h4>
                  <p className="text-[10px] text-slate-400">Wipes parsed resume text from active local memory</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-amber-400">Wipe</span>
            </button>

            {/* Reset All */}
            <button
              onClick={() => {
                if (confirm('Permanently reset all local career data and restore defaults?')) {
                  onResetAllData();
                  alert('All local profile data reset.');
                  onClose();
                }
              }}
              className="w-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 p-2.5 rounded-xl flex items-center justify-between transition text-rose-400"
            >
              <div className="flex items-center gap-2 text-left">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <div>
                  <h4 className="text-xs font-bold text-rose-300">Reset Entire Profile & Data</h4>
                  <p className="text-[10px] text-rose-400/80">Wipes local database and reloads clean workspace</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-rose-400">Reset</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
