import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ShieldCheck, TrendingUp, AlertTriangle, CheckCircle2, 
  Sparkles, ArrowRight, Zap, Target, BarChart3, HelpCircle
} from 'lucide-react';
import { ComprehensiveReadinessBreakdown } from './careerTypes';

interface ComprehensiveReadinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  overallScore: number;
  targetRole: string;
  breakdown: ComprehensiveReadinessBreakdown;
  weakestArea: { name: string; score: number; reason: string; fix: string };
  nextBestAction: { title: string; description: string; expectedGain: string; route: string };
  isDarkMode: boolean;
  onNavigateToTab?: (tab: string, subTab?: string) => void;
}

export const ComprehensiveReadinessModal: React.FC<ComprehensiveReadinessModalProps> = ({
  isOpen,
  onClose,
  overallScore,
  targetRole,
  breakdown,
  weakestArea,
  nextBestAction,
  isDarkMode,
  onNavigateToTab
}) => {
  if (!isOpen) return null;

  const pillars = [
    { label: 'Technical Skills Alignment', score: breakdown.technicalSkills, weight: '22%', color: 'from-blue-500 to-indigo-500', note: 'Core languages & frameworks' },
    { label: 'Data Structures & Algorithms', score: breakdown.dsa, weight: '18%', color: 'from-indigo-500 to-purple-500', note: 'LeetCode & time complexity' },
    { label: 'Project Portfolio & MLOps', score: breakdown.projects, weight: '20%', color: 'from-purple-500 to-pink-500', note: 'Full-stack & production code' },
    { label: 'ATS Resume Strength', score: breakdown.resume, weight: '12%', color: 'from-emerald-500 to-teal-500', note: 'Action verbs & metrics' },
    { label: 'Technical Interview Defense', score: breakdown.interview, weight: '10%', color: 'from-amber-500 to-orange-500', note: 'System design & STAR responses' },
    { label: 'GitHub Repos & CI/CD', score: breakdown.github, weight: '8%', color: 'from-teal-500 to-cyan-500', note: 'Public code & READMEs' },
    { label: 'Quantitative Aptitude', score: breakdown.aptitude, weight: '4%', color: 'from-cyan-500 to-blue-500', note: 'Logical reasoning speed' },
    { label: 'Communication & Soft Skills', score: breakdown.communication, weight: '4%', color: 'from-pink-500 to-rose-500', note: 'Clarity & conciseness' },
    { label: 'LinkedIn Recruiter Presence', score: breakdown.linkedin, weight: '2%', color: 'from-blue-600 to-indigo-600', note: 'Keyword-optimized profile' }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl p-6 ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold tracking-tight">
                  Transparent 9-Pillar Career Readiness Diagnosis
                </h3>
                <p className="text-xs text-slate-400">
                  Target Role: <span className="font-semibold text-indigo-400">{targetRole}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Overall Score Summary */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/30 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
                Composite Career Readiness Score
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold font-mono text-white">{overallScore}</span>
                <span className="text-sm font-semibold text-slate-400">/ 100</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 ml-2">
                  Strong Trajectory
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Evaluated dynamically against 1,000+ real job descriptions and ATS screening models.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs shrink-0 max-w-xs">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                Primary Bottleneck Detected:
              </span>
              <p className="text-slate-300 leading-snug">
                <strong className="text-white">{weakestArea.name}:</strong> {weakestArea.reason}
              </p>
            </div>
          </div>

          {/* 9 Pillars Grid */}
          <div className="space-y-3 mb-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Dimensional Breakdown & Weightings
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {pillars.map((p, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-2xl border ${
                    isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-200 truncate pr-2">{p.label}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-mono text-slate-500">wt: {p.weight}</span>
                      <span className={`font-mono font-bold ${p.score >= 75 ? 'text-emerald-400' : p.score >= 55 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {p.score}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${p.color}`}
                      style={{ width: `${p.score}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">{p.note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Action CTA */}
          <div className="p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Next High-Yield Action:
              </span>
              <p className="text-xs text-slate-200 leading-snug">
                {nextBestAction.title} ({nextBestAction.expectedGain})
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                if (onNavigateToTab) onNavigateToTab(nextBestAction.route);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shrink-0 shadow"
            >
              Start Action <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
