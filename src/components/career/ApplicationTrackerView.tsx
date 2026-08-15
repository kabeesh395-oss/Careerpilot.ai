import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Layers, Plus, Calendar, Building, CheckCircle2, Clock, Trash2, Edit3, Save, X, Sparkles } from 'lucide-react';
import { TrackedApplication, ApplicationStatus } from './careerTypes';

interface ApplicationTrackerViewProps {
  applications: TrackedApplication[];
  onUpdateApplication: (app: TrackedApplication) => void;
  onDeleteApplication: (id: string) => void;
  onAddApplication: (app: TrackedApplication) => void;
}

const STATUS_COLUMNS: ApplicationStatus[] = [
  'Saved',
  'Applied',
  'Assessment',
  'Interview',
  'Offer',
  'Rejected'
];

export const ApplicationTrackerView: React.FC<ApplicationTrackerViewProps> = ({
  applications,
  onUpdateApplication,
  onDeleteApplication,
  onAddApplication
}) => {
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | 'All'>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('Applied');
  const [newNotes, setNewNotes] = useState('');
  const [newMatchScore, setNewMatchScore] = useState(80);

  const handleSaveNew = () => {
    if (!newCompany.trim() || !newRole.trim()) return;
    const created: TrackedApplication = {
      id: 'app_' + Date.now(),
      company: newCompany.trim(),
      role: newRole.trim(),
      status: newStatus,
      appliedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      matchScore: newMatchScore,
      notes: newNotes.trim() || 'Custom tracked role',
      resumeVersion: 'Resume_v1.pdf'
    };
    onAddApplication(created);
    setNewCompany('');
    setNewRole('');
    setNewNotes('');
    setShowAddForm(false);
  };

  const filtered = applications.filter(a => selectedStatus === 'All' || a.status === selectedStatus);

  const getStatusBadgeClass = (st: ApplicationStatus) => {
    switch (st) {
      case 'Saved': return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'Applied': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'Assessment': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Interview': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Offer': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold';
      case 'Rejected': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    }
  };

  return (
    <div className="space-y-3.5 text-xs">
      
      {/* Tracker Header */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-3 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Application Pipeline</h3>
              <p className="text-[10px] text-slate-400">Track candidates status across recruitment funnels</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-md shadow-indigo-600/30 transition active:scale-95"
          >
            <Plus className="w-3 h-3" />
            <span>Add Application</span>
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedStatus('All')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition ${
              selectedStatus === 'All'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            All ({applications.length})
          </button>
          {STATUS_COLUMNS.map(st => {
            const count = applications.filter(a => a.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition flex items-center gap-1 ${
                  selectedStatus === st
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                <span>{st}</span>
                <span className="text-[8px] bg-slate-900 px-1 py-0.2 rounded font-mono">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add New Application Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-indigo-500/40 p-3.5 rounded-2xl space-y-2.5 shadow-lg"
        >
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-indigo-400" /> Track New Opportunity
            </span>
            <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] font-bold text-slate-400 block mb-1">Company</label>
              <input
                type="text"
                value={newCompany}
                onChange={e => setNewCompany(e.target.value)}
                placeholder="e.g. Google, Microsoft"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-400 block mb-1">Role Title</label>
              <input
                type="text"
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                placeholder="e.g. ML Engineer Intern"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] font-bold text-slate-400 block mb-1">Current Status</label>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value as ApplicationStatus)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
              >
                {STATUS_COLUMNS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-400 block mb-1">Match Score (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newMatchScore}
                onChange={e => setNewMatchScore(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[9px] font-bold text-slate-400 block mb-1">Notes & Follow-up Plans</label>
            <input
              type="text"
              value={newNotes}
              onChange={e => setNewNotes(e.target.value)}
              placeholder="e.g. Recruiter screened, OA due next Monday"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
            />
          </div>

          <button
            onClick={handleSaveNew}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-indigo-600/30"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save to Tracker</span>
          </button>
        </motion.div>
      )}

      {/* Applications List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-1.5">
            <p className="text-slate-400 text-xs font-semibold">No applications in this category.</p>
            <p className="text-slate-500 text-[10px]">Track your active job applications to monitor pipeline stages.</p>
          </div>
        ) : (
          filtered.map(app => (
            <div
              key={app.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2.5 shadow-sm transition hover:border-slate-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-white leading-snug">{app.role}</h4>
                  <p className="text-[11px] text-indigo-300 font-semibold flex items-center gap-1 mt-0.5">
                    <Building className="w-3 h-3" /> {app.company}
                  </p>
                </div>

                {/* Status Selector Dropdown */}
                <select
                  value={app.status}
                  onChange={e => onUpdateApplication({ ...app, status: e.target.value as ApplicationStatus })}
                  className={`text-[9px] font-bold font-mono px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${getStatusBadgeClass(app.status)}`}
                >
                  {STATUS_COLUMNS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Notes & Date details */}
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  <strong>Notes:</strong> {app.notes}
                </p>
                {app.interviewDate && (
                  <div className="text-[9px] text-purple-300 font-mono flex items-center gap-1 pt-0.5">
                    <Clock className="w-3 h-3 text-purple-400" /> {app.interviewDate}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono pt-1 border-t border-slate-800/80">
                <span>Applied: {app.appliedDate}</span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">Match: {app.matchScore}%</span>
                  <button
                    onClick={() => onDeleteApplication(app.id)}
                    className="text-slate-500 hover:text-rose-400 transition"
                    title="Delete record"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
