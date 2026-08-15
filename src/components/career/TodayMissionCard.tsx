import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Clock, Flame, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { DailyMission } from './careerTypes';

interface TodayMissionCardProps {
  mission: DailyMission;
  onToggleComplete: (id: string) => void;
  onNavigate: (route: string) => void;
}

export const TodayMissionCard: React.FC<TodayMissionCardProps> = ({
  mission,
  onToggleComplete,
  onNavigate
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 p-3.5 rounded-2xl shadow-md space-y-2.5 relative overflow-hidden">
      
      {/* Top Banner with Lightning Icon */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Zap className="w-3 h-3 fill-amber-400" />
          </span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">
            TODAY'S MISSION ⚡
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800">
            <Clock className="w-3 h-3 text-indigo-400" /> ~{mission.estimatedMinutes} mins
          </span>
          <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
            +{mission.xpReward} XP
          </span>
        </div>
      </div>

      {/* Title & Interactive Toggle */}
      <div className="flex items-start gap-2.5">
        <button
          onClick={() => onToggleComplete(mission.id)}
          className="mt-0.5 text-slate-400 hover:text-emerald-400 transition shrink-0"
          title={mission.completed ? 'Mark uncompleted' : 'Mark completed'}
        >
          {mission.completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
          ) : (
            <Circle className="w-5 h-5 text-slate-500 hover:text-indigo-400" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h4 className={`text-xs font-bold leading-snug ${mission.completed ? 'line-through text-slate-400' : 'text-white'}`}>
            {mission.title}
          </h4>
          <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">
            <strong className="text-indigo-300">Why it matters:</strong> {mission.whyItMatters}
          </p>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <span className="text-[9px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
          Unlocks: <strong className="text-emerald-400">{mission.skillUnlocked}</strong>
        </span>

        <button
          onClick={() => onNavigate(mission.actionRoute)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-lg shrink-0 flex items-center gap-1 transition shadow-sm active:scale-95"
        >
          <span>{mission.completed ? 'Review' : 'Start Mission'}</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
