import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Briefcase, Building, MapPin, Calendar, CheckCircle2, AlertCircle, Plus, Bookmark, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import { OpportunityMatch, TrackedApplication } from './careerTypes';

interface OpportunityMatchingViewProps {
  opportunities: OpportunityMatch[];
  targetRole: string;
  onTrackApplication: (opp: OpportunityMatch) => void;
  onAddCustomApp: () => void;
}

export const OpportunityMatchingView: React.FC<OpportunityMatchingViewProps> = ({
  opportunities,
  targetRole,
  onTrackApplication,
  onAddCustomApp
}) => {
  const [filterType, setFilterType] = useState<'All' | 'Internship' | 'New Grad'>('All');
  const [trackedIds, setTrackedIds] = useState<string[]>([]);

  const handleTrack = (opp: OpportunityMatch) => {
    onTrackApplication(opp);
    setTrackedIds(prev => [...prev, opp.id]);
  };

  const filtered = opportunities.filter(o => filterType === 'All' || o.type === filterType);

  return (
    <div className="space-y-3.5 text-xs">
      
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-2.5 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase">Market Alignment</span>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-emerald-400" /> Opportunities Matched to Your Profile
            </h3>
          </div>
          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full font-bold">
            {filtered.length} Active
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5">
          {(['All', 'Internship', 'New Grad'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-xl text-[10px] font-bold transition ${
                filterType === type
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Realistic Disclaimer Notice */}
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-400 leading-tight">
            <strong>Algorithmic Alignment:</strong> Alignment percentages reflect keyword and prerequisite coverage against published job postings. Hiring decisions remain independent.
          </p>
        </div>
      </div>

      {/* Opportunity Cards List */}
      <div className="space-y-3">
        {filtered.map(opp => {
          const isTracked = trackedIds.includes(opp.id) || opp.applied;

          return (
            <div
              key={opp.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2.5 shadow-sm hover:border-slate-700 transition"
            >
              <div className="flex justify-between items-start">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                      {opp.type}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">&bull; {opp.postedDate}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-snug">{opp.title}</h4>
                  <p className="text-[11px] text-indigo-300 font-semibold flex items-center gap-1 mt-0.5">
                    <Building className="w-3 h-3" /> {opp.company} &bull; <span className="text-slate-400 font-normal">{opp.location}</span>
                  </p>
                </div>

                {/* Alignment Score Badge */}
                <div className="text-right shrink-0 pl-2">
                  <span className="text-base font-black text-emerald-400 font-mono">
                    {opp.alignmentScore}%
                  </span>
                  <span className="text-[8px] text-slate-400 block font-mono">Profile Match</span>
                </div>
              </div>

              {/* Match Rationale */}
              <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                <strong className="text-indigo-300">Match Rationale:</strong> {opp.whyMatch}
              </p>

              {/* Skills Match Matrix */}
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-slate-950 p-2 rounded-lg border border-emerald-500/20 space-y-1">
                  <span className="text-emerald-400 font-bold block flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Matching ({opp.matchingSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {opp.matchingSkills.map((s, i) => (
                      <span key={i} className="text-[9px] text-emerald-300 bg-emerald-950/50 px-1 py-0.5 rounded font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 p-2 rounded-lg border border-rose-500/20 space-y-1">
                  <span className="text-rose-400 font-bold block flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Missing ({opp.missingSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {opp.missingSkills.map((s, i) => (
                      <span key={i} className="text-[9px] text-rose-300 bg-rose-950/50 px-1 py-0.5 rounded font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-1 flex items-center justify-between gap-2 border-t border-slate-800">
                <span className="text-[9px] font-mono text-slate-400">
                  Deadline: <strong className="text-slate-200">{opp.deadline}</strong>
                </span>

                <button
                  onClick={() => handleTrack(opp)}
                  disabled={isTracked}
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition ${
                    isTracked 
                      ? 'bg-slate-800 text-slate-400 cursor-default' 
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 active:scale-95'
                  }`}
                >
                  {isTracked ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Tracking in Pipeline</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3 h-3" />
                      <span>Track in Pipeline</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
