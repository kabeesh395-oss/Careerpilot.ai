import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, AlertCircle, CheckCircle2, Zap, Target, BookOpen, Sparkles } from 'lucide-react';
import { CareerPillars, PillarWeights } from './careerTypes';
import { getCareerEnergyTier } from './CareerEnergyGauge';

interface ScoreDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  overallScore: number;
  targetRole: string;
  targetCompany: string;
  pillars: CareerPillars;
  weights: PillarWeights;
  biggestGap: { skill: string; reason: string; impact: string };
  nextBestAction: { title: string; route: string; description: string };
  onNavigateAction: (route: string) => void;
}

export const ScoreDiagnosisModal: React.FC<ScoreDiagnosisModalProps> = ({
  isOpen,
  onClose,
  overallScore,
  targetRole,
  targetCompany,
  pillars,
  weights,
  biggestGap,
  nextBestAction,
  onNavigateAction
}) => {
  if (!isOpen) return null;

  const energy = getCareerEnergyTier(overallScore);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
        
        {/* Modal Container */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-lg bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl p-4 max-h-[85vh] overflow-y-auto space-y-3.5 shadow-2xl text-xs select-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Target className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Why this Readiness Score?</h3>
                <p className="text-[10px] text-slate-400">Mathematical & Evidence Diagnostic Breakdown</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current Tier Banner */}
          <div className={`p-3 rounded-2xl bg-gradient-to-r ${energy.bgColor} border ${energy.borderColor} flex items-center justify-between`}>
            <div>
              <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold">Current Alignment</span>
              <span className={`text-base font-black font-mono ${energy.textColor}`}>
                {overallScore}/100 ⚡ ({energy.label})
              </span>
              <p className="text-[10px] text-slate-300 mt-0.5">
                Targeting <strong>{targetRole}</strong> at <strong>{targetCompany}</strong>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[9px] bg-slate-950/80 text-slate-300 px-2 py-1 rounded-lg border border-slate-800 font-mono">
                Role Model
              </span>
            </div>
          </div>

          {/* 4 Pillars Contribution Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider font-mono">
                4-Pillar Weighted Contribution
              </span>
              <span className="text-[9px] text-slate-400 font-mono">Total = 100%</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Skills */}
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 font-mono">1. Skills ({Math.round(weights.skills * 100)}% wt)</span>
                  <span className="font-bold text-emerald-400 font-mono">{pillars.skills}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pillars.skills}%` }} />
                </div>
                <span className="text-[9px] text-slate-400 block">
                  Contribution: +{(pillars.skills * weights.skills).toFixed(1)} pts
                </span>
              </div>

              {/* Projects */}
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 font-mono">2. Projects ({Math.round(weights.projects * 100)}% wt)</span>
                  <span className="font-bold text-amber-400 font-mono">{pillars.projects}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pillars.projects}%` }} />
                </div>
                <span className="text-[9px] text-slate-400 block">
                  Contribution: +{(pillars.projects * weights.projects).toFixed(1)} pts
                </span>
              </div>

              {/* Resume */}
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 font-mono">3. Resume ({Math.round(weights.resume * 100)}% wt)</span>
                  <span className="font-bold text-indigo-400 font-mono">{pillars.resume}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pillars.resume}%` }} />
                </div>
                <span className="text-[9px] text-slate-400 block">
                  Contribution: +{(pillars.resume * weights.resume).toFixed(1)} pts
                </span>
              </div>

              {/* Interview */}
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 font-mono">4. Interview ({Math.round(weights.interview * 100)}% wt)</span>
                  <span className="font-bold text-cyan-400 font-mono">{pillars.interview}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${pillars.interview}%` }} />
                </div>
                <span className="text-[9px] text-slate-400 block">
                  Contribution: +{(pillars.interview * weights.interview).toFixed(1)} pts
                </span>
              </div>
            </div>
          </div>

          {/* Biggest Detected Gap Card */}
          <div className="bg-rose-950/20 border border-rose-500/30 p-3 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-1.5 text-rose-400 font-bold text-[11px]">
              <AlertCircle className="w-4 h-4" />
              <span>BIGGEST DETECTED GAP: {biggestGap.skill}</span>
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed">
              {biggestGap.reason}
            </p>
            <div className="text-[9px] font-mono text-rose-300 bg-rose-950/50 p-1.5 rounded-lg border border-rose-500/20">
              ⚡ Impact on Score: {biggestGap.impact}
            </div>
          </div>

          {/* Next Best Action Card with Direct Launch */}
          <div className="bg-indigo-950/30 border border-indigo-500/40 p-3.5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> RECOMMENDED NEXT BEST ACTION
              </span>
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-mono font-bold">
                High ROI
              </span>
            </div>
            <h4 className="text-xs font-bold text-white">{nextBestAction.title}</h4>
            <p className="text-[10px] text-slate-300 leading-relaxed">
              {nextBestAction.description}
            </p>
            <button
              onClick={() => {
                onClose();
                onNavigateAction(nextBestAction.route);
              }}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition"
            >
              <span>Execute Action Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
