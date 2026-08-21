import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, CheckCircle2, ArrowRight, ShieldCheck, 
  Target, Code, BookOpen, Layers, Zap, 
  HelpCircle, ChevronRight, RefreshCw, AlertCircle, 
  Flame, Award, Edit3, Compass
} from 'lucide-react';
import { AiCareerAnalysisResult, UserProfile } from './careerTypes';
import { CareerPilotLogo, CareerPilotSymbol } from './CareerPilotLogo';

interface AiCareerAnalysisViewProps {
  analysis: AiCareerAnalysisResult;
  profile: UserProfile;
  isDarkMode: boolean;
  onProceedToDashboard: () => void;
  onEditProfile: () => void;
}

export const AiCareerAnalysisView: React.FC<AiCareerAnalysisViewProps> = ({
  analysis,
  profile,
  isDarkMode,
  onProceedToDashboard,
  onEditProfile
}) => {
  return (
    <div className={`h-full flex flex-col overflow-y-auto font-sans p-4 space-y-4 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Top Banner Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <CareerPilotSymbol variant="dark" size={26} />
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-black tracking-tight text-white">
                Career<span className="text-blue-400">Pilot</span> Analysis
              </h2>
              <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/30 px-1.5 py-0.2 rounded-full font-mono font-bold">
                Synthesized
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Generated strictly from your verified profile inputs</p>
          </div>
        </div>

        <button
          onClick={onEditProfile}
          className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white' : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900'
          }`}
        >
          <Edit3 className="w-3 h-3 text-indigo-400" />
          <span>Edit Later</span>
        </button>
      </div>

      {/* Hero Match & Level Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-950/80 via-purple-950/50 to-slate-900 border border-indigo-500/40 p-4 rounded-3xl shadow-xl space-y-3 relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> 1. CAREER MATCH EVALUATION
            </span>
            <h3 className="text-base font-extrabold text-white mt-0.5">
              {analysis.careerMatch.targetRole}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {analysis.careerMatch.summary}
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0 bg-slate-950/60 p-3 rounded-2xl border border-indigo-500/30">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {analysis.careerMatch.percentage}%
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Match</span>
            </div>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
              Level: {analysis.currentSkillLevel.level}
            </span>
          </div>
        </div>

        {/* 2. CURRENT SKILL LEVEL EXPLANATION */}
        <div className="pt-2 border-t border-indigo-500/20 text-xs">
          <div className="flex items-start gap-2 text-indigo-200">
            <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong className="text-white">2. Current Skill Level:</strong> {analysis.currentSkillLevel.explanation}
            </p>
          </div>
        </div>
      </motion.div>

      {/* 3. STRONG SKILLS & 4. SKILL GAPS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        
        {/* Strong Skills */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-4 rounded-2xl border space-y-2.5 ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> 3. Strong Identified Skills
            </h4>
            <span className="text-[10px] font-mono text-slate-400">{analysis.strongSkills.length} Verified</span>
          </div>
          <div className="space-y-2">
            {analysis.strongSkills.map((sk, i) => (
              <div 
                key={i} 
                className={`p-2.5 rounded-xl border text-xs space-y-0.5 ${
                  isDarkMode ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{sk.name}</span>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                    Strength
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">{sk.whyStrong}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Skill Gaps */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`p-4 rounded-2xl border space-y-2.5 ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Target className="w-4 h-4" /> 4. Key Skill Gaps to Bridge
            </h4>
            <span className="text-[10px] font-mono text-slate-400">{analysis.skillGaps.length} Target Areas</span>
          </div>
          <div className="space-y-2">
            {analysis.skillGaps.map((gap, i) => (
              <div 
                key={i} 
                className={`p-2.5 rounded-xl border text-xs space-y-0.5 ${
                  isDarkMode ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{gap.name}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                    gap.priority === 'High' 
                      ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' 
                      : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                  }`}>
                    {gap.priority} Priority
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">{gap.whyNeeded}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 5. RECOMMENDED NEXT SKILL (#1 High Priority) */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`p-4 rounded-2xl border ${
          isDarkMode ? 'bg-gradient-to-r from-amber-950/30 to-slate-900 border-amber-500/30' : 'bg-amber-50/50 border-amber-200'
        } space-y-2.5`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> 5. RECOMMENDED NEXT SKILL (HIGHEST LEVERAGE)
          </span>
          <span className="text-[10px] font-mono text-slate-400">Est. {analysis.recommendedNextSkill.estimatedTimeToLearn}</span>
        </div>
        
        <div>
          <h4 className="text-sm font-extrabold text-white">{analysis.recommendedNextSkill.name}</h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            <strong className="text-amber-300">Why recommended:</strong> {analysis.recommendedNextSkill.whyRecommended}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
          <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span><strong className="text-white">Actionable First Task:</strong> {analysis.recommendedNextSkill.actionableTask}</span>
        </div>
      </motion.div>

      {/* 6. FIRST PROJECT RECOMMENDATION */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className={`p-4 rounded-2xl border space-y-2.5 ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
            <Code className="w-3.5 h-3.5" /> 6. FIRST PROJECT RECOMMENDATION
          </span>
          <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold">
            {analysis.firstProjectRecommendation.difficulty} &bull; {analysis.firstProjectRecommendation.estimatedDuration}
          </span>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white">{analysis.firstProjectRecommendation.title}</h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{analysis.firstProjectRecommendation.description}</p>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {analysis.firstProjectRecommendation.technologies.map((tech, i) => (
            <span key={i} className="text-[10px] font-mono bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-lg">
              {tech}
            </span>
          ))}
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 space-y-1">
          <p><strong className="text-cyan-300">Why recommended:</strong> {analysis.firstProjectRecommendation.whyRecommended}</p>
          <p><strong className="text-emerald-400">Resume Impact:</strong> "{analysis.firstProjectRecommendation.resumeImpact}"</p>
        </div>
      </motion.div>

      {/* 7. LEARNING ROADMAP */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`p-4 rounded-2xl border space-y-3 ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> 7. SEQUENTIAL LEARNING ROADMAP
          </span>
          <span className="text-[10px] font-mono text-slate-400">{analysis.learningRoadmap.length} Sequential Phases</span>
        </div>

        <div className="space-y-2.5">
          {analysis.learningRoadmap.map((phase) => (
            <div 
              key={phase.phaseNumber}
              className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                isDarkMode ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold font-mono text-[10px] flex items-center justify-center">
                    {phase.phaseNumber}
                  </span>
                  <h5 className="font-bold text-white text-xs">{phase.title}</h5>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{phase.duration}</span>
              </div>

              <p className="text-[11px] text-slate-300 pl-7">{phase.focus}</p>
              
              <div className="pl-7 text-[10px] text-slate-400 space-y-0.5">
                <p>🏆 <strong className="text-slate-300">Phase Milestone:</strong> {phase.milestone}</p>
                <p>💡 <strong className="text-slate-300">Why important:</strong> {phase.whyImportant}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 8. INTERVIEW PREPARATION STARTING POINT */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className={`p-4 rounded-2xl border space-y-2.5 ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> 8. INTERVIEW PREPARATION STARTING POINT
          </span>
          <span className="text-[10px] font-mono text-slate-400">Core Foundations</span>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white">{analysis.interviewPrepStartingPoint.coreTopic}</h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            <strong className="text-purple-300">Why start here:</strong> {analysis.interviewPrepStartingPoint.whyRecommended}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1 font-mono">
          <span className="text-[10px] text-indigo-400 font-bold uppercase block">Sample First Screening Question:</span>
          <p className="text-slate-200 font-normal leading-relaxed">"{analysis.interviewPrepStartingPoint.sampleStarterQuestion}"</p>
          <span className="text-[10px] text-slate-400 block pt-1">
            Key Concepts: {analysis.interviewPrepStartingPoint.keyConceptToMaster}
          </span>
        </div>
      </motion.div>

      {/* Responsible AI Disclaimer */}
      <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-start gap-2.5 text-[10px] text-slate-400 leading-relaxed">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p>{analysis.disclaimer}</p>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2 pb-4">
        <button
          onClick={onProceedToDashboard}
          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition active:scale-98"
        >
          <span>Enter My Personalized Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
