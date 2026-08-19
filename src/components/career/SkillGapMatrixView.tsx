import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, AlertTriangle, XCircle, Award, 
  Sparkles, BookOpen, Code, ArrowRight, Filter, Search
} from 'lucide-react';
import { SkillGapItem, SkillGapStatus } from './careerTypes';
import { CareerRecommendationEngine } from '../../services/careerRecommendationEngine';

interface SkillGapMatrixViewProps {
  targetRole: string;
  userSkills: string[];
  isDarkMode: boolean;
  onSelectPractice?: (task: string) => void;
}

export const SkillGapMatrixView: React.FC<SkillGapMatrixViewProps> = ({
  targetRole,
  userSkills,
  isDarkMode,
  onSelectPractice
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const items: SkillGapItem[] = CareerRecommendationEngine.getSkillGapMatrix(targetRole, userSkills);

  const filteredItems = items.filter(item => {
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch = !searchQuery.trim() || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: SkillGapStatus) => {
    switch (status) {
      case 'strong':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-mono">
            <CheckCircle2 className="w-3 h-3" /> Strong (Verified)
          </span>
        );
      case 'needs_improvement':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 font-mono">
            <AlertTriangle className="w-3 h-3" /> Needs Improvement
          </span>
        );
      case 'missing':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1 font-mono">
            <XCircle className="w-3 h-3" /> Missing (Critical Gap)
          </span>
        );
      case 'advanced':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1 font-mono">
            <Award className="w-3 h-3 text-amber-300" /> Advanced Competitive
          </span>
        );
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Header Banner */}
      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Skill Gap & Competency Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Color-coded classification of your target role competencies for <strong className="text-indigo-400">{targetRole}</strong>.
            </p>
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="space-y-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills (e.g. PyTorch, Docker, SQL)..."
            className={`w-full px-3 py-2 text-xs rounded-xl border transition outline-none ${
              isDarkMode 
                ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-indigo-500' 
                : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
            }`}
          />

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
            {[
              { id: 'all', label: 'All Competencies' },
              { id: 'missing', label: '🔴 Missing' },
              { id: 'needs_improvement', label: '🟡 Needs Work' },
              { id: 'strong', label: '🟢 Strong' },
              { id: 'advanced', label: '⭐ Advanced' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1 rounded-lg shrink-0 transition ${
                  filterStatus === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isDarkMode 
                      ? 'bg-slate-950 text-slate-400 border border-slate-800' 
                      : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition ${
              isDarkMode ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    {item.category} • Priority #{item.recommendedOrder}
                  </span>
                  {getStatusBadge(item.status)}
                </div>
                <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {item.name}
                </h4>
              </div>

              {/* Proficiency score */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400">Coverage:</span>
                <span className="text-xs font-mono font-bold text-indigo-400">{item.currentProficiency}%</span>
              </div>
            </div>

            {/* Why it matters */}
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              <strong className="text-slate-200">Why it matters:</strong> {item.whyItMatters}
            </p>

            {/* Practice Task & Project Idea Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1 font-mono">
                  <Code className="w-3.5 h-3.5" /> PRACTICE TASK
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">{item.practiceTask}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold text-cyan-400 flex items-center gap-1 font-mono">
                  <Sparkles className="w-3.5 h-3.5" /> FLAGSHIP CAPSTONE IDEA
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">{item.projectIdea}</p>
              </div>
            </div>

            {/* Footer Resource & Milestone */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-slate-500" /> Resource: <strong className="text-slate-300">{item.learningResource}</strong>
              </span>
              <span className="text-emerald-400 font-medium">
                🎯 {item.milestone}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
