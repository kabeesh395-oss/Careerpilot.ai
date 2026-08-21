import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ArrowRight, ArrowLeft, Check, CheckCircle2, 
  Compass, Code, BookOpen, Clock, Target, Rocket, 
  HelpCircle, User, Award, ShieldCheck, Zap, Layers,
  ChevronRight, RefreshCw, X, Plus, Search, Building2,
  GraduationCap, Briefcase, Calendar, Star
} from 'lucide-react';
import { UserProfile, SkillWithLevel, CareerDiscoveryOption } from './careerTypes';
import { CareerRecommendationEngine } from '../../services/careerRecommendationEngine';
import { AnalyticsService } from '../../services/analyticsService';
import { CareerPilotLogo, CareerPilotSymbol } from './CareerPilotLogo';

interface FreshUserOnboardingModalProps {
  isOpen: boolean;
  isDarkMode: boolean;
  onCompleteOnboarding: (completedProfile: UserProfile) => void;
  onSkipOnboarding: () => void;
}

const COMMON_SKILLS = [
  'Python', 'JavaScript', 'TypeScript', 'C++', 'Java', 'SQL', 
  'HTML/CSS', 'React', 'Node.js', 'Git', 'FastAPI', 'Pandas', 
  'Linux Basics', 'Docker', 'Tailwind CSS', 'PostgreSQL'
];

const COMMON_INTERESTS = [
  'Building Web Apps', 'Artificial Intelligence & ML', 'Cloud & DevOps', 
  'Data Analytics & BI', 'System Design & APIs', 'Competitive Programming / DSA',
  'Mobile App Development', 'Cybersecurity'
];

const POPULAR_ROLES = [
  'Full Stack Web Developer',
  'AI / Machine Learning Engineer',
  'Backend & Cloud Systems Engineer',
  'Data Analyst & Business Intelligence',
  'Frontend Developer',
  'Software Engineer (Generalist)'
];

const DEGREE_OPTIONS = [
  'B.Tech / B.S. Computer Science',
  'B.E. / B.Tech Information Technology',
  'B.S. / M.S. Data Science & AI',
  'BCA / MCA Computer Applications',
  'B.E. Electronics & Communication',
  'Other Technical Degree / Self-Taught'
];

const YEAR_OPTIONS = [
  '1st Year / Freshman',
  '2nd Year / Sophomore',
  '3rd Year / Junior',
  'Final Year / Senior',
  'Recent Graduate',
  'Self-Taught / Bootcamp'
];

export const FreshUserOnboardingModal: React.FC<FreshUserOnboardingModalProps> = ({
  isOpen,
  isDarkMode,
  onCompleteOnboarding,
  onSkipOnboarding
}) => {
  // 5 Essential Onboarding Steps:
  // 1: Profile Setup | 2: Skills & Skill Level | 3: Interests | 4: Career Goal | 5: Experience & Daily Time
  const [step, setStep] = useState<number>(1);
  const totalSteps = 5;

  // 1. Profile Setup Fields
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('B.Tech / B.S. Computer Science');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('2nd Year / Sophomore');

  // 2. Skills & Skill Level Fields
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillsWithLevel, setSkillsWithLevel] = useState<SkillWithLevel[]>([]);
  const [overallSkillLevel, setOverallSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [isZeroSkills, setIsZeroSkills] = useState(false);

  // 3. Interests Fields
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // 4. Career Goal Fields
  const [goalMode, setGoalMode] = useState<'select' | 'explore'>('select');
  const [targetRole, setTargetRole] = useState('Full Stack Web Developer');
  const [customTargetRole, setCustomTargetRole] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [selectedDiscoveredRole, setSelectedDiscoveredRole] = useState<string | null>(null);

  // 5. Experience & Daily Time Fields
  const [experienceLevel, setExperienceLevel] = useState<'Zero Experience' | 'Student / Aspiring Intern' | 'Early Career'>('Zero Experience');
  const [projectExperienceNotes, setProjectExperienceNotes] = useState('');
  const [dailyTimeBudget, setDailyTimeBudget] = useState<'30m' | '1h' | '2h' | '3h+'>('1h');

  if (!isOpen) return null;

  // Skill management helpers
  const toggleSkill = (skill: string) => {
    setIsZeroSkills(false);
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
      setSkillsWithLevel(skillsWithLevel.filter(s => s.name !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
      setSkillsWithLevel([...skillsWithLevel, { name: skill, level: overallSkillLevel }]);
    }
  };

  const handleSetSkillLevel = (skillName: string, level: 'Beginner' | 'Intermediate' | 'Advanced') => {
    setSkillsWithLevel(prev => 
      prev.map(s => s.name === skillName ? { ...s, level } : s)
    );
  };

  const handleZeroSkillsToggle = () => {
    setIsZeroSkills(true);
    setSelectedSkills([]);
    setSkillsWithLevel([]);
    setOverallSkillLevel('Beginner');
    setExperienceLevel('Zero Experience');
  };

  const addCustomSkill = () => {
    if (customSkillInput.trim() && !selectedSkills.includes(customSkillInput.trim())) {
      setIsZeroSkills(false);
      const skillName = customSkillInput.trim();
      setSelectedSkills([...selectedSkills, skillName]);
      setSkillsWithLevel([...skillsWithLevel, { name: skillName, level: overallSkillLevel }]);
      setCustomSkillInput('');
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      AnalyticsService.track('onboarding_step_viewed', { step: step + 1 });
    } else {
      finalizeAndSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const finalizeAndSubmit = () => {
    let finalRole = targetRole;
    if (goalMode === 'explore' && selectedDiscoveredRole) {
      finalRole = selectedDiscoveredRole;
    } else if (customTargetRole.trim()) {
      finalRole = customTargetRole.trim();
    }

    const newProfile: UserProfile = {
      name: name.trim() || 'New Explorer',
      college: college.trim() || 'Tech University',
      degree: degree || 'B.Tech / B.S. Computer Science',
      department: department.trim() || 'Computer Science',
      year: year || '2nd Year / Sophomore',
      currentSkills: selectedSkills.length > 0 ? selectedSkills : ['Curiosity & Learning'],
      skillsWithLevel: skillsWithLevel.length > 0 ? skillsWithLevel : [{ name: 'Curiosity & Learning', level: 'Beginner' }],
      overallSkillLevel,
      programmingLanguages: selectedSkills.filter(s => ['Python', 'JavaScript', 'TypeScript', 'C++', 'Java', 'SQL'].includes(s)),
      interests: selectedInterests.length > 0 ? selectedInterests : ['Building Web Apps'],
      experienceLevel,
      projectExperienceNotes: projectExperienceNotes.trim(),
      targetRole: finalRole,
      targetCompany: targetCompany.trim() || 'Tech Startups & Product Companies',
      github: '',
      linkedin: '',
      leetcode: '',
      streak: 1,
      xp: 150,
      dailyTimeBudget,
      isOnboarded: true,
      isZeroExperience: isZeroSkills || experienceLevel === 'Zero Experience' || selectedSkills.length === 0,
      isUnsureCareer: goalMode === 'explore',
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    };

    AnalyticsService.track('onboarding_completed', { 
      role: finalRole, 
      isZeroExp: newProfile.isZeroExperience,
      timeBudget: dailyTimeBudget 
    });
    
    onCompleteOnboarding(newProfile);
  };

  // Discovered Careers suggestions based on selected interests/skills
  const discoveredCareers = CareerRecommendationEngine.getDiscoveredCareers(selectedInterests, selectedSkills);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className={`w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <CareerPilotSymbol variant="dark" size={24} />
            <div>
              <h2 className="text-xs font-black tracking-tight text-white flex items-center gap-1.5">
                Career<span className="text-blue-400">Pilot</span> <span className="text-[10px] text-blue-400 font-mono font-normal">Fresh Onboarding</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-slate-400">
              Step {step} of {totalSteps}
            </span>
            <button
              onClick={() => {
                AnalyticsService.track('onboarding_skipped');
                onSkipOnboarding();
              }}
              className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded-lg transition"
            >
              Skip (Edit Later)
            </button>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-slate-950 h-1 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Dynamic Step Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <AnimatePresence mode="wait">
            
            {/* ==================================================== */}
            {/* STEP 1: PROFILE SETUP */}
            {/* ==================================================== */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20 font-mono">
                    <User className="w-3 h-3 text-amber-300" /> Stage 1: Profile Setup
                  </div>
                  <h3 className="text-lg font-extrabold text-white">Tell us about your background</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    We only collect essential academic info to tailor your career analysis.
                  </p>
                </div>

                <div className="space-y-3 pt-1 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500 transition"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">College or University</label>
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. State Institute of Technology / MIT"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500 transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Degree Program</label>
                      <select
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500 transition"
                      >
                        {DEGREE_OPTIONS.map(d => (
                          <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Department / Branch</label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. Computer Science, IT, ECE"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500 transition"
                      >
                      </input>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Current Academic Year</label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500 transition"
                    >
                      {YEAR_OPTIONS.map(y => (
                        <option key={y} value={y} className="bg-slate-900 text-white">{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ==================================================== */}
            {/* STEP 2: SKILLS & SKILL LEVEL */}
            {/* ==================================================== */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20 font-mono">
                    <Code className="w-3 h-3 text-cyan-400" /> Stage 2: Skills & Proficiency
                  </div>
                  <h3 className="text-lg font-extrabold text-white">What skills do you currently have?</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Select technologies you're familiar with, or tap "Zero technical skills" to begin from absolute scratch.
                  </p>
                </div>

                {/* Zero Skills Quick Button */}
                <button
                  type="button"
                  onClick={handleZeroSkillsToggle}
                  className={`w-full p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition ${
                    isZeroSkills 
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>I am starting completely fresh (Zero technical skills)</span>
                  </div>
                  {isZeroSkills && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>

                {/* Overall Skill Level Selector */}
                {!isZeroSkills && (
                  <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                    <label className="text-[11px] font-bold text-slate-300 block">
                      Overall Skill Proficiency Level:
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                      {(['Beginner', 'Intermediate', 'Advanced'] as const).map(lvl => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setOverallSkillLevel(lvl)}
                          className={`py-2 px-2 rounded-xl border text-center transition ${
                            overallSkillLevel === lvl
                              ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Skill Tags */}
                {!isZeroSkills && (
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-300 block">
                      Select Familiar Technologies ({selectedSkills.length} selected):
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COMMON_SKILLS.map(skill => {
                        const isSelected = selectedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                              isSelected
                                ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 shadow-sm'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-indigo-400" />}
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Custom Skill Input */}
                {!isZeroSkills && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSkillInput}
                      onChange={(e) => setCustomSkillInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill(); } }}
                      placeholder="Add another skill (e.g. Flutter, Rust)..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-indigo-500 transition"
                    />
                    <button
                      type="button"
                      onClick={addCustomSkill}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                )}

                {/* Selected Skills with Level Tuning */}
                {selectedSkills.length > 0 && !isZeroSkills && (
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 max-h-36 overflow-y-auto">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                      Tune Individual Skill Levels:
                    </span>
                    <div className="space-y-1.5">
                      {selectedSkills.map(skillName => {
                        const currentLvl = skillsWithLevel.find(s => s.name === skillName)?.level || overallSkillLevel;
                        return (
                          <div key={skillName} className="flex items-center justify-between text-xs py-1 border-b border-slate-900 last:border-0">
                            <span className="font-semibold text-slate-200">{skillName}</span>
                            <div className="flex gap-1">
                              {(['Beginner', 'Intermediate', 'Advanced'] as const).map(lvl => (
                                <button
                                  key={lvl}
                                  type="button"
                                  onClick={() => handleSetSkillLevel(skillName, lvl)}
                                  className={`text-[9px] px-2 py-0.5 rounded-lg border font-mono transition ${
                                    currentLvl === lvl
                                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold'
                                      : 'bg-slate-900 border-slate-800 text-slate-500'
                                  }`}
                                >
                                  {lvl[0]}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ==================================================== */}
            {/* STEP 3: INTERESTS */}
            {/* ==================================================== */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20 font-mono">
                    <Sparkles className="w-3 h-3 text-amber-300" /> Stage 3: Interests & Curiosity
                  </div>
                  <h3 className="text-lg font-extrabold text-white">What engineering domains excite you?</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Select 1 or more domains to help us map the highest-match career recommendations.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {COMMON_INTERESTS.map(interest => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                          isSelected
                            ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-xs font-bold">{interest}</span>
                        {isSelected ? (
                          <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ==================================================== */}
            {/* STEP 4: CAREER GOAL (Or Explore Careers) */}
            {/* ==================================================== */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20 font-mono">
                    <Target className="w-3 h-3 text-rose-400" /> Stage 4: Preferred Career
                  </div>
                  <h3 className="text-lg font-extrabold text-white">What role are you targeting?</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Choose a preferred career goal, or explore personalized paths if you're not sure yet.
                  </p>
                </div>

                {/* Mode Switcher */}
                <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setGoalMode('select')}
                    className={`py-2 rounded-xl transition ${
                      goalMode === 'select'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    I have a target role
                  </button>
                  <button
                    type="button"
                    onClick={() => setGoalMode('explore')}
                    className={`py-2 rounded-xl transition flex items-center justify-center gap-1 ${
                      goalMode === 'explore'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5 text-amber-300" /> Explore Careers
                  </button>
                </div>

                {/* Direct Selection Mode */}
                {goalMode === 'select' ? (
                  <div className="space-y-3 pt-1">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-300 block">
                        Popular Engineering Career Tracks:
                      </label>
                      <div className="space-y-1.5">
                        {POPULAR_ROLES.map(role => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => { setTargetRole(role); setCustomTargetRole(''); }}
                            className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between text-xs font-bold transition ${
                              targetRole === role && !customTargetRole
                                ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-md'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <span>{role}</span>
                            {targetRole === role && !customTargetRole && (
                              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        Or specify a custom role:
                      </label>
                      <input
                        type="text"
                        value={customTargetRole}
                        onChange={(e) => setCustomTargetRole(e.target.value)}
                        placeholder="e.g. Site Reliability Engineer, iOS Developer..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500 transition"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        Target Dream Company / Industry (Optional)
                      </label>
                      <input
                        type="text"
                        value={targetCompany}
                        onChange={(e) => setTargetCompany(e.target.value)}
                        placeholder="e.g. Google, Stripe, Fast-growth AI startups..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>
                ) : (
                  /* Explore Careers Mode */
                  <div className="space-y-3 pt-1">
                    <div className="p-2.5 bg-indigo-950/30 rounded-xl border border-indigo-500/20 text-xs text-slate-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>Career recommendations matched to your declared skills & interests:</span>
                    </div>

                    <div className="space-y-2.5">
                      {discoveredCareers.map(opt => {
                        const isSelected = selectedDiscoveredRole === opt.role;
                        return (
                          <div
                            key={opt.role}
                            onClick={() => setSelectedDiscoveredRole(opt.role)}
                            className={`p-3.5 rounded-2xl border text-left cursor-pointer space-y-2 transition ${
                              isSelected
                                ? 'bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500 text-white shadow-lg'
                                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-xs font-extrabold text-white">{opt.role}</h4>
                                <p className="text-[11px] text-slate-400">{opt.tagline}</p>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
                                {opt.suitabilityScore}% Match
                              </span>
                            </div>

                            <p className="text-[11px] text-indigo-200">
                              <strong className="text-white">Why good fit:</strong> {opt.whyGoodFit}
                            </p>

                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {opt.starterStack.map((tech, i) => (
                                <span key={i} className="text-[9px] font-mono bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.2 rounded">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ==================================================== */}
            {/* STEP 5: EXPERIENCE & DAILY TIME BUDGET */}
            {/* ==================================================== */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20 font-mono">
                    <Clock className="w-3 h-3 text-emerald-400" /> Stage 5: Experience & Study Time
                  </div>
                  <h3 className="text-lg font-extrabold text-white">How much time can you invest?</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Set your practical standing and daily available study time for realistic roadmap pacing.
                  </p>
                </div>

                {/* Experience Tier Selector */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-300 block">
                    Your Practical Experience Tier:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'Zero Experience', label: 'Zero Experience', desc: 'Starting from scratch' },
                      { id: 'Student / Aspiring Intern', label: 'Student / Fresher', desc: 'Built 1-2 small projects' },
                      { id: 'Early Career', label: 'Early Builder', desc: 'Active coder / junior dev' }
                    ].map(exp => (
                      <button
                        key={exp.id}
                        type="button"
                        onClick={() => setExperienceLevel(exp.id as any)}
                        className={`p-3 rounded-2xl border text-left transition ${
                          experienceLevel === exp.id
                            ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <h5 className="text-xs font-bold text-white">{exp.label}</h5>
                        <p className="text-[10px] text-slate-400 mt-0.5">{exp.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Projects / Notes */}
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Past Projects or Coursework (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={projectExperienceNotes}
                    onChange={(e) => setProjectExperienceNotes(e.target.value)}
                    placeholder="e.g. Built a simple calculator app in Python, took college database course..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500 transition resize-none"
                  />
                </div>

                {/* Daily Available Time Budget */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-300 block">
                    Daily Available Time for Career Building:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: '30m', label: '30 min', sub: 'Light' },
                      { id: '1h', label: '1 hour', sub: 'Balanced' },
                      { id: '2h', label: '2 hours', sub: 'Accelerated' },
                      { id: '3h+', label: '3+ hrs', sub: 'Intensive' }
                    ].map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setDailyTimeBudget(t.id as any)}
                        className={`py-2.5 px-2 rounded-2xl border text-center transition ${
                          dailyTimeBudget === t.id
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="text-xs font-bold">{t.label}</div>
                        <div className="text-[9px] text-slate-300 font-mono">{t.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    Ready! We will immediately compute your personalized AI Career Analysis and configure your first dashboard.
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-5 py-3.5 border-t border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-950/60">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-3.5 py-2 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : (
              <div />
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-95"
            >
              <span>{step === totalSteps ? 'Generate AI Career Analysis' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
