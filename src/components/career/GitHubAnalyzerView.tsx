import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Github, Search, CheckCircle2, AlertTriangle, ArrowUpRight, 
  Code, GitBranch, Star, RefreshCw, Terminal, Sparkles, ExternalLink, ShieldAlert
} from 'lucide-react';
import { GitHubAuditResult } from './careerTypes';
import { CareerRecommendationEngine } from '../../services/careerRecommendationEngine';
import { AnalyticsService } from '../../services/analyticsService';

interface GitHubAnalyzerViewProps {
  initialUsername: string;
  isDarkMode: boolean;
  onUpdateGithubUsername?: (username: string) => void;
}

export const GitHubAnalyzerView: React.FC<GitHubAnalyzerViewProps> = ({
  initialUsername,
  isDarkMode,
  onUpdateGithubUsername
}) => {
  const [username, setUsername] = useState(initialUsername || '');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<GitHubAuditResult | null>(() => 
    initialUsername ? CareerRecommendationEngine.auditGitHubProfile(initialUsername) : null
  );

  const handleRunAudit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!username.trim()) return;

    setIsAuditing(true);
    AnalyticsService.track('github_analyzed', { username: username.trim() });

    setTimeout(() => {
      const result = CareerRecommendationEngine.auditGitHubProfile(username.trim());
      setAuditResult(result);
      if (onUpdateGithubUsername) {
        onUpdateGithubUsername(username.trim());
      }
      setIsAuditing(false);
    }, 600);
  };

  return (
    <div className="space-y-4">
      {/* Header & Search Bar */}
      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center border border-slate-700 shadow-inner">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                GitHub Portfolio & Repository Auditor
              </h3>
              <p className="text-xs text-slate-400">
                Audits public repositories, README quality, code languages, and deployment readiness.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleRunAudit} className="flex gap-2">
          <div className="relative flex-1">
            <Github className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username (e.g. torvalds or alexchen-dev)"
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border font-mono transition outline-none ${
                isDarkMode 
                  ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-indigo-500' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={isAuditing}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow-sm disabled:opacity-50"
          >
            {isAuditing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Auditing...
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" /> Run Audit
              </>
            )}
          </button>
        </form>
      </div>

      {!auditResult ? (
        <div className={`p-8 rounded-2xl border text-center space-y-3 ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No GitHub Profile Audited Yet</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Enter your public GitHub username above to analyze project depth, README completeness, commit cadence, and deployment links.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Main Score & Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Score Card */}
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} flex items-center justify-between`}>
              <div>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-0.5">
                  Portfolio Strength
                </span>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-extrabold font-mono ${auditResult.overallScore >= 75 ? 'text-emerald-400' : auditResult.overallScore >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {auditResult.overallScore}/100
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {auditResult.portfolioStrength}
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <GitBranch className="w-5 h-5" />
              </div>
            </div>

            {/* README & Docs Score */}
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  README & Docs Quality
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">{auditResult.readmeQualityScore}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${auditResult.readmeQualityScore}%` }} />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Architecture diagrams & live URLs needed</span>
            </div>

            {/* Commit Cadence */}
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Commit Cadence
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">{auditResult.commitCadenceScore}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${auditResult.commitCadenceScore}%` }} />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Consistent activity in recent months</span>
            </div>
          </div>

          {/* Flagship Repo Recommendation Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 border border-indigo-500/30">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-300">
                  Flagship Repository Strategy for Recruiter Screening
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {auditResult.flagshipRepoSuggestion}
                </p>
              </div>
            </div>
          </div>

          {/* Two-Column Breakdown: Key Findings vs Actionable Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Detected Findings */}
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} space-y-2.5`}>
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-slate-400" /> Detected Profile Audit Findings
              </span>
              <ul className="space-y-2">
                {auditResult.keyFindings.map((finding, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                    <span className="leading-relaxed">{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actionable Recommendations */}
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} space-y-2.5`}>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Actionable Improvements
              </span>
              <ul className="space-y-2">
                {auditResult.recommendedImprovements.map((rec, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/40 p-2 rounded-xl border border-slate-800/60">
                    <span className="text-emerald-400 font-bold shrink-0">#{idx + 1}</span>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
