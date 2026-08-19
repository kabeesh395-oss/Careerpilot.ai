import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, Clock, CheckCircle2, Circle, Flame, 
  RotateCcw, Sparkles, Plus, Check, ChevronRight, Zap, Target
} from 'lucide-react';
import { DailyStudyBlock } from './careerTypes';
import { CareerRecommendationEngine } from '../../services/careerRecommendationEngine';
import { AnalyticsService } from '../../services/analyticsService';

interface DailyCareerPlannerViewProps {
  streak: number;
  isDarkMode: boolean;
  onAwardXP?: (amount: number) => void;
}

export const DailyCareerPlannerView: React.FC<DailyCareerPlannerViewProps> = ({
  streak,
  isDarkMode,
  onAwardXP
}) => {
  const [studyHours, setStudyHours] = useState<number>(2);
  const [blocks, setBlocks] = useState<DailyStudyBlock[]>(() => {
    try {
      const saved = localStorage.getItem('careerpilot_daily_study_blocks');
      return saved ? JSON.parse(saved) : CareerRecommendationEngine.getDailyPlan(2);
    } catch {
      return CareerRecommendationEngine.getDailyPlan(2);
    }
  });

  const handleStudyHoursChange = (hours: number) => {
    setStudyHours(hours);
    const newPlan = CareerRecommendationEngine.getDailyPlan(hours);
    setBlocks(newPlan);
    localStorage.setItem('careerpilot_daily_study_blocks', JSON.stringify(newPlan));
  };

  const handleToggleBlock = (id: string) => {
    const updated = blocks.map(b => {
      if (b.id === id) {
        const nextStatus: 'pending' | 'completed' | 'skipped' = b.status === 'completed' ? 'pending' : 'completed';
        if (nextStatus === 'completed' && onAwardXP) {
          onAwardXP(b.xp);
          AnalyticsService.track('task_completed', { taskId: id, taskTitle: b.title });
        }
        return { ...b, status: nextStatus };
      }
      return b;
    });
    setBlocks(updated);
    localStorage.setItem('careerpilot_daily_study_blocks', JSON.stringify(updated));
  };

  const completedCount = blocks.filter(b => b.status === 'completed').length;
  const progressPercent = Math.round((completedCount / (blocks.length || 1)) * 100);

  const daysOfWeek = [
    { day: 'Mon', active: true, count: 3 },
    { day: 'Tue', active: true, count: 4 },
    { day: 'Wed', active: true, count: 2 },
    { day: 'Thu', active: true, count: 3 },
    { day: 'Fri', active: true, count: 4 },
    { day: 'Sat', active: true, count: 5 },
    { day: 'Sun', active: true, count: completedCount }
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner & Hours Selector */}
      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Personalized Daily Career Planner
              </h3>
              <p className="text-xs text-slate-400">
                Time-boxed study sessions tailored to your available hours today.
              </p>
            </div>
          </div>

          {/* Current Streak */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold shrink-0 font-mono">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{streak} Day Streak</span>
          </div>
        </div>

        {/* Study Hours Switcher */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Select Today's Available Study Time:
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((hr) => (
              <button
                key={hr}
                onClick={() => handleStudyHoursChange(hr)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  studyHours === hr
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : isDarkMode 
                      ? 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" /> {hr} {hr === 1 ? 'Hour' : 'Hours'} / Day
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar & Weekly Rhythm */}
      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} space-y-3`}>
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-amber-400" /> Today's Completion Rhythm
          </span>
          <span className="font-mono font-bold text-amber-400">
            {completedCount}/{blocks.length} Completed ({progressPercent}%)
          </span>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 h-full rounded-full transition-all duration-500" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>

        {/* Weekly Activity Bubbles */}
        <div className="pt-2 border-t border-slate-800/60">
          <span className="text-[11px] text-slate-400 font-medium block mb-2">Weekly Consistency Rhythm</span>
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {daysOfWeek.map((d, idx) => (
              <div key={idx} className="space-y-1">
                <div className={`h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition ${
                  d.count > 0 
                    ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300' 
                    : 'bg-slate-800/40 text-slate-500'
                }`}>
                  {d.count > 0 ? `+${d.count}` : '-'}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Study Blocks List */}
      <div className="space-y-2.5">
        {blocks.map((block) => {
          const isDone = block.status === 'completed';
          return (
            <div
              key={block.id}
              onClick={() => handleToggleBlock(block.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                isDone 
                  ? isDarkMode ? 'bg-slate-950/60 border-emerald-500/30' : 'bg-emerald-50/50 border-emerald-200' 
                  : isDarkMode ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="pt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-500 hover:text-amber-400 transition" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {block.timeSlot}
                  </span>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {block.category}
                  </span>
                  <span className="text-[10px] font-bold font-mono text-emerald-400 ml-auto">
                    +{block.xp} XP
                  </span>
                </div>

                <h4 className={`text-xs font-bold leading-snug ${isDone ? 'line-through text-slate-400' : isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {block.title}
                </h4>

                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  {block.description}
                </p>

                <div className="mt-2 text-[10px] font-mono text-slate-300 bg-slate-950/50 p-1.5 rounded-lg border border-slate-800/80">
                  <strong className="text-amber-300">Target Goal:</strong> {block.targetGoal}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
