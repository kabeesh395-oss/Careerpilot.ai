import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, Search, Star, ExternalLink, CheckCircle2, 
  Clock, Award, Sparkles, Filter, Check, Tag
} from 'lucide-react';
import { LearningResource } from './careerTypes';
import { CareerRecommendationEngine } from '../../services/careerRecommendationEngine';
import { AnalyticsService } from '../../services/analyticsService';

interface LearningEngineViewProps {
  targetRole: string;
  isDarkMode: boolean;
  onAwardXP?: (amount: number) => void;
}

export const LearningEngineView: React.FC<LearningEngineViewProps> = ({
  targetRole,
  isDarkMode,
  onAwardXP
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('careerpilot_completed_resources');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const resources: LearningResource[] = useMemo(() => {
    return CareerRecommendationEngine.getCuratedLearningResources(targetRole);
  }, [targetRole]);

  const categories = ['All', 'Programming', 'DSA', 'AI/ML', 'Cloud & DevOps', 'Web Development'];

  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      const matchesCategory = selectedCategory === 'All' || res.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesSearch = !searchQuery.trim() || 
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.skillsTaught.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        res.instructorOrOrg.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [resources, selectedCategory, searchQuery]);

  const toggleComplete = (id: string) => {
    const updated = completedIds.includes(id) 
      ? completedIds.filter(i => i !== id) 
      : [...completedIds, id];
    setCompletedIds(updated);
    localStorage.setItem('careerpilot_completed_resources', JSON.stringify(updated));

    if (!completedIds.includes(id)) {
      AnalyticsService.track('learning_resource_opened', { resourceId: id });
      if (onAwardXP) onAwardXP(100);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Personalized Learning & Curriculum Engine
              </h3>
              <p className="text-xs text-slate-400">
                Verified high-quality resources tagged with FREE / PAID and Certificate indicators.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Category Pills */}
        <div className="space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, skill, or instructor (e.g. PyTorch, NeetCode, CS50)..."
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border transition outline-none ${
                isDarkMode 
                  ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-emerald-500' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600'
              }`}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg shrink-0 transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : isDarkMode 
                      ? 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800' 
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resource Cards */}
      <div className="space-y-3">
        {filteredResources.map((res) => {
          const isDone = completedIds.includes(res.id);
          return (
            <div
              key={res.id}
              className={`p-4 rounded-2xl border transition-all ${
                isDone 
                  ? isDarkMode ? 'bg-slate-950/60 border-emerald-500/30' : 'bg-emerald-50/50 border-emerald-200' 
                  : isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 mb-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                      {res.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                      res.pricing === 'FREE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {res.pricing}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {res.certification}
                    </span>
                  </div>
                  <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {res.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Platform: <span className="text-slate-300 font-medium">{res.platform}</span> • Instructor: <span className="text-slate-300 font-medium">{res.instructorOrOrg}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleComplete(res.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                      isDone 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isDone ? 'text-white' : 'text-slate-400'}`} />
                    {isDone ? 'Completed (+100 XP)' : 'Mark Done'}
                  </button>
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {res.summary}
              </p>

              {/* WHY Recommended Box */}
              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 mb-3 flex items-start gap-2 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">
                  <strong className="text-emerald-300 font-semibold">Why this is recommended:</strong> {res.whyRecommended}
                </span>
              </div>

              {/* Footer Meta & Skills Chips */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 font-mono">SKILLS:</span>
                  {res.skillsTaught.map((skill, idx) => (
                    <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-500" /> ~{res.estimatedHours}h
                  </span>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold text-xs transition"
                  >
                    Open Course <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
