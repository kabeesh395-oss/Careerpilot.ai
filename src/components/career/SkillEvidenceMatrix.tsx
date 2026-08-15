import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, HelpCircle, Sparkles, Filter } from 'lucide-react';
import { SkillEvidenceItem } from './careerTypes';

interface SkillEvidenceMatrixProps {
  skills: SkillEvidenceItem[];
  targetRole: string;
  onUpdateSkillStatus: (id: string, newStatus: 'strong' | 'partial' | 'not_detected') => void;
}

export const SkillEvidenceMatrix: React.FC<SkillEvidenceMatrixProps> = ({
  skills,
  targetRole,
  onUpdateSkillStatus
}) => {
  const getStatusBadge = (status: SkillEvidenceItem['status']) => {
    switch (status) {
      case 'strong':
        return (
          <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> Strong Evidence
          </span>
        );
      case 'partial':
        return (
          <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <HelpCircle className="w-2.5 h-2.5 text-amber-400" /> Partial Evidence
          </span>
        );
      case 'not_detected':
        return (
          <span className="text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <AlertCircle className="w-2.5 h-2.5 text-rose-400" /> Not Detected
          </span>
        );
    }
  };

  return (
    <div className="space-y-3 text-xs">
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-2 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase">Evidence Matrix</span>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" /> Verified Skill Evidence
            </h3>
          </div>
          <span className="text-[9px] text-slate-400 font-mono">
            {skills.filter(s => s.status === 'strong').length}/{skills.length} Strong
          </span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          Objective evidence breakdown based on code repositories, coursework, and resume verification.
        </p>
      </div>

      <div className="space-y-2">
        {skills.map(skill => (
          <div
            key={skill.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1.5 transition hover:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono text-slate-400 uppercase">{skill.category}</span>
                <h4 className="text-xs font-bold text-white">{skill.name}</h4>
              </div>
              {getStatusBadge(skill.status)}
            </div>

            {skill.evidenceSource && (
              <p className="text-[10px] text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800/80 leading-relaxed font-sans">
                <strong>Evidence Source:</strong> {skill.evidenceSource}
              </p>
            )}

            <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[9px] font-mono">
              <span className="text-indigo-300">Importance: {skill.importance}</span>
              
              {/* Quick Status Adjuster */}
              <div className="flex gap-1">
                <button
                  onClick={() => onUpdateSkillStatus(skill.id, 'strong')}
                  className={`px-1.5 py-0.5 rounded ${skill.status === 'strong' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-950 text-slate-400'}`}
                >
                  Verified
                </button>
                <button
                  onClick={() => onUpdateSkillStatus(skill.id, 'partial')}
                  className={`px-1.5 py-0.5 rounded ${skill.status === 'partial' ? 'bg-amber-600 text-white font-bold' : 'bg-slate-950 text-slate-400'}`}
                >
                  Partial
                </button>
                <button
                  onClick={() => onUpdateSkillStatus(skill.id, 'not_detected')}
                  className={`px-1.5 py-0.5 rounded ${skill.status === 'not_detected' ? 'bg-rose-600 text-white font-bold' : 'bg-slate-950 text-slate-400'}`}
                >
                  Gap
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
