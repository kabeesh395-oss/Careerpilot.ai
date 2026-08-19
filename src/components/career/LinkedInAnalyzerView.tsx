import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Linkedin, Search, CheckCircle2, Copy, Check, 
  Sparkles, RefreshCw, UserCheck, Award, FileText, ArrowRight
} from 'lucide-react';
import { LinkedInAuditResult } from './careerTypes';
import { CareerRecommendationEngine } from '../../services/careerRecommendationEngine';
import { AnalyticsService } from '../../services/analyticsService';

interface LinkedInAnalyzerViewProps {
  initialProfileUrl: string;
  targetRole: string;
  isDarkMode: boolean;
}

export const LinkedInAnalyzerView: React.FC<LinkedInAnalyzerViewProps> = ({
  initialProfileUrl,
  targetRole,
  isDarkMode
}) => {
  const [profileInput, setProfileInput] = useState(initialProfileUrl || 'alex-chen-tech');
  const [isAuditing, setIsAuditing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<LinkedInAuditResult>(() =>
    CareerRecommendationEngine.auditLinkedInProfile(initialProfileUrl || 'alex-chen-tech', targetRole)
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunAudit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!profileInput.trim()) return;

    setIsAuditing(true);
    AnalyticsService.track('linkedin_analyzed', { profile: profileInput.trim() });

    setTimeout(() => {
      const result = CareerRecommendationEngine.auditLinkedInProfile(profileInput.trim(), targetRole);
      setAuditResult(result);
      setIsAuditing(false);
    }, 600);
  };

  return (
    <div className="space-y-4">
      {/* Header & Input */}
      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Linkedin className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              LinkedIn Profile & Recruiter Visibility Optimizer
            </h3>
            <p className="text-xs text-slate-400">
              Evaluates headline keyword density, summary readability, and recruiter search discoverability.
            </p>
          </div>
        </div>

        <form onSubmit={handleRunAudit} className="flex gap-2">
          <div className="relative flex-1">
            <Linkedin className="w-4 h-4 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={profileInput}
              onChange={(e) => setProfileInput(e.target.value)}
              placeholder="LinkedIn username or profile URL (e.g. alex-chen-tech)"
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border font-mono transition outline-none ${
                isDarkMode 
                  ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-blue-500' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={isAuditing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow-sm disabled:opacity-50"
          >
            {isAuditing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Analyzing...
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" /> Analyze Profile
              </>
            )}
          </button>
        </form>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Completeness</span>
            <span className="text-xs font-mono font-bold text-blue-400">{auditResult.completenessScore}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-400 h-full rounded-full" style={{ width: `${auditResult.completenessScore}%` }} />
          </div>
        </div>

        <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Headline Impact</span>
            <span className="text-xs font-mono font-bold text-amber-400">{auditResult.headlineScore}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${auditResult.headlineScore}%` }} />
          </div>
        </div>

        <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Skills Section</span>
            <span className="text-xs font-mono font-bold text-emerald-400">{auditResult.skillsScore}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${auditResult.skillsScore}%` }} />
          </div>
        </div>
      </div>

      {/* High-Impact Headline Options */}
      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} space-y-3`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Recommended High-Conversion Headlines for {targetRole}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Select & Copy</span>
        </div>

        <div className="space-y-2">
          {auditResult.recommendedHeadlines.map((headline, idx) => (
            <div 
              key={idx} 
              className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 ${
                isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <p className="text-xs text-slate-200 font-mono leading-relaxed flex-1">
                "{headline}"
              </p>
              <button
                onClick={() => handleCopy(headline, `hl_${idx}`)}
                className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/10 transition shrink-0"
                title="Copy headline"
              >
                {copiedId === `hl_${idx}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended About Summary Template */}
      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} space-y-2.5`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <FileText className="w-4 h-4" /> Recruiter-Tuned "About" Section Template
          </span>
          <button
            onClick={() => handleCopy(auditResult.recommendedAboutTemplate, 'about_tmpl')}
            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition"
          >
            {copiedId === 'about_tmpl' ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Entire About Section
              </>
            )}
          </button>
        </div>

        <pre className={`p-3 rounded-xl border text-[11px] font-mono leading-relaxed whitespace-pre-wrap ${
          isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}>
          {auditResult.recommendedAboutTemplate}
        </pre>
      </div>

      {/* Actionable Checklist */}
      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} space-y-2.5`}>
        <span className="text-xs font-bold text-slate-300">
          LinkedIn Optimization Checklist
        </span>
        <div className="space-y-2">
          {auditResult.actionableChecklist.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className={`w-4 h-4 ${item.done ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>{item.task}</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                {item.impact}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
