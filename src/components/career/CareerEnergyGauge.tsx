import React from 'react';
import { motion } from 'motion/react';
import { Zap, HelpCircle, AlertTriangle, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { CareerEnergyTier } from './careerTypes';

interface CareerEnergyGaugeProps {
  score: number; // 0 - 100
  targetRole: string;
  isDarkMode: boolean;
  onOpenDiagnosis: () => void;
}

export const getCareerEnergyTier = (score: number): {
  tier: CareerEnergyTier;
  label: string;
  sublabel: string;
  colorName: string;
  strokeColor: string;
  glowColor: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  badgeBg: string;
} => {
  if (score < 60) {
    return {
      tier: 'danger',
      label: 'DANGER — HIGH GAPS',
      sublabel: 'Critical role gaps detected. Focus on core requirements.',
      colorName: 'Red',
      strokeColor: '#EF4444', // Red-500
      glowColor: 'rgba(239, 68, 68, 0.4)',
      bgColor: 'from-rose-950/40 via-slate-900 to-slate-950',
      borderColor: 'border-rose-500/40',
      textColor: 'text-rose-400',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
    };
  } else if (score < 75) {
    return {
      tier: 'average',
      label: 'AVERAGE — MODERATE FIT',
      sublabel: 'Foundational baseline present. 2-3 key skills need projects.',
      colorName: 'Amber',
      strokeColor: '#F59E0B', // Amber-500
      glowColor: 'rgba(245, 158, 11, 0.4)',
      bgColor: 'from-amber-950/30 via-slate-900 to-slate-950',
      borderColor: 'border-amber-500/40',
      textColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    };
  } else if (score < 88) {
    return {
      tier: 'good',
      label: 'GOOD — STRONG ALIGNMENT',
      sublabel: 'Solid competitive profile. On track for standard technical screens.',
      colorName: 'Green',
      strokeColor: '#10B981', // Emerald-500
      glowColor: 'rgba(16, 185, 129, 0.4)',
      bgColor: 'from-emerald-950/30 via-slate-900 to-slate-950',
      borderColor: 'border-emerald-500/40',
      textColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    };
  } else {
    return {
      tier: 'gold',
      label: 'HIGH MATCH POTENTIAL',
      sublabel: 'Outstanding profile alignment across all 4 career pillars.',
      colorName: 'Gold',
      strokeColor: '#EAB308', // Yellow-500 / Gold
      glowColor: 'rgba(234, 179, 8, 0.5)',
      bgColor: 'from-yellow-950/40 via-purple-950/20 to-slate-950',
      borderColor: 'border-yellow-500/50',
      textColor: 'text-yellow-300',
      badgeBg: 'bg-gradient-to-r from-yellow-500/20 to-amber-500/30 text-yellow-200 border-yellow-500/40'
    };
  }
};

export const CareerEnergyGauge: React.FC<CareerEnergyGaugeProps> = ({
  score,
  targetRole,
  isDarkMode,
  onOpenDiagnosis
}) => {
  const energy = getCareerEnergyTier(score);
  const size = 96;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div
      onClick={onOpenDiagnosis}
      className={`relative bg-gradient-to-br ${energy.bgColor} border ${energy.borderColor} p-3.5 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] overflow-hidden group`}
    >
      {/* Subtle Energy Ambient Glow */}
      <div 
        className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-all duration-500"
        style={{ backgroundColor: energy.glowColor }}
      />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-indigo-400 fill-indigo-400" /> Career Energy & Alignment
            </span>
          </div>
          <h3 className="text-xs font-black text-white flex items-center gap-1.5">
            Target: <span className="text-indigo-300 font-bold">{targetRole}</span>
          </h3>
        </div>

        {/* Tier Status Badge */}
        <div className="flex items-center gap-1">
          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${energy.badgeBg}`}>
            {energy.tier === 'danger' && <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />}
            {energy.tier === 'average' && <TrendingUp className="w-2.5 h-2.5 text-amber-400" />}
            {energy.tier === 'good' && <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />}
            {energy.tier === 'gold' && <Sparkles className="w-2.5 h-2.5 text-yellow-300 animate-pulse" />}
            {energy.label}
          </span>
        </div>
      </div>

      {/* Main Gauge + Diagnosis Summary */}
      <div className="mt-3 flex items-center gap-3.5 bg-slate-950/80 p-3 rounded-xl border border-slate-800/90 relative z-10">
        
        {/* Animated Radial SVG Gauge */}
        <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={isDarkMode ? '#1E293B' : '#CBD5E1'}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Animated Energy Stroke */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={energy.strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              strokeLinecap="round"
              fill="transparent"
              style={{ filter: `drop-shadow(0px 0px 6px ${energy.glowColor})` }}
            />
          </svg>

          {/* Center Score & Lightning Icon */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
            <span className={`text-xl font-black font-mono leading-none tracking-tight ${energy.textColor}`}>
              {score}
            </span>
            <span className="text-[9px] font-mono text-slate-400 uppercase font-bold tracking-tighter">
              /100 ⚡
            </span>
          </div>
        </div>

        {/* Diagnostic Rationale */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-200">Role Alignment Diagnostic</span>
            <span className="text-[10px] text-indigo-400 group-hover:text-indigo-300 font-semibold flex items-center gap-0.5">
              Why this score? <HelpCircle className="w-3 h-3 text-indigo-400" />
            </span>
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed">
            {energy.sublabel}
          </p>
          <div className="pt-1 flex items-center gap-2">
            <span className="text-[9px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
              Role-Weighted 4 Pillars
            </span>
            <span className="text-[9px] text-indigo-300 font-medium">Tap to view gap breakdown →</span>
          </div>
        </div>
      </div>
    </div>
  );
};
