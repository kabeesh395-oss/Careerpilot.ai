import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ArrowRight, ArrowLeft, Check, CheckCircle2, 
  Compass, Code, BookOpen, Clock, Target, Rocket, 
  HelpCircle, User, Award, ShieldCheck, Zap, Layers,
  ChevronRight, RefreshCw, X
} from 'lucide-react';
import { UserProfile, CareerDiscoveryOption } from './careerTypes';
import { CareerRecommendationEngine } from '../../services/careerRecommendationEngine';
import { AnalyticsService } from '../../services/analyticsService';

interface FreshUserOnboardingModalProps {
  isOpen: boolean;
  isDarkMode: boolean;
  onCompleteOnboarding: (completedProfile: UserProfile) => void;
  onSkipOnboarding: () => void;
}

const COMMON_SKILLS = [
  'Python', 'JavaScript', 'C++', 'Java', 'SQL', 'HTML/CSS', 
  'React', 'Node.js', 'Git', 'FastAPI', 'Pandas', 'Linux Basics'
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
  'Frontend Developer'
];

export const FreshUserOnboardingModal: React.FC<FreshUserOnboardingModalProps> = ({
  isOpen,
  isDarkMode,
  onCompleteOnboarding,
  onSkipOnboarding
}) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 8;

  // Form State
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('B.Tech / B.S. Computer Science');
  const [department, setDepartment] = useState('Computer Science');
  const [year, setYear] = useState('2nd Year / Sophomore');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Building Web Apps']);
  const [targetRole, setTargetRole] = useState('Full Stack Web Developer');
  const [isUnsureRole, setIsUnsureRole] = useState(false);
  const [selectedDiscoveredRole, setSelectedDiscoveredRole] = useState<string | null>(null);
  const [targetCompany, setTargetCompany] = useState('Google / Top Tech');
  const [experienceLevel, setExperienceLevel] = useState<'Zero Experience' | 'Student / Aspiring Intern' | 'Early Career'>('Zero Experience');
  const [dailyTimeBudget, setDailyTimeBudget] = useState<'30m' | '1h' | '2h' | '3h+'>('1h');
  const [isGeneratingSnapshot, setIsGeneratingSnapshot] = useState(false);

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (step < totalSteps) {
      const nextStep = step + 1;
      setStep(nextStep);
      AnalyticsService.track('onboarding_step_viewed', { step: nextStep });
      if (nextStep === totalSteps) {
        setIsGeneratingSnapshot(true);
        setTimeout(() => setIsGeneratingSnapshot(false), 900);
      }
    } else {
      finalizeProfile();
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const addCustomSkill = () => {
    if (customSkillInput.trim() && !selectedSkills.includes(customSkillInput.trim())) {
      setSelectedSkills([...selectedSkills, customSkillInput.trim()]);
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

  const finalizeProfile = () => {
    const finalRole = selectedDiscoveredRole || (isUnsureRole ? 'Full Stack Web Developer' : targetRole);

    const newProfile: UserProfile = {
      name: name.trim() || 'New Explorer',
      college: college.trim() || 'Tech University',
      degree: degree || 'B.Tech / B.S. Computer Science',
      department: department || 'Engineering',
      year: year || 'Undergraduate',
      currentSkills: selectedSkills.length > 0 ? selectedSkills : ['Problem Solving', 'Learning Mindset'],
      programmingLanguages: selectedSkills.filter(s => ['Python', 'JavaScript', 'C++', 'Java', 'SQL'].includes(s)),
      interests: selectedInterests,
      experienceLevel,
      targetRole: finalRole,
      targetCompany: targetCompany.trim() || 'Tech Innovators',
      github: '',
      linkedin: '',
      leetcode: '',
      streak: 1,
      xp: 150,
      dailyTimeBudget,
      isOnboarded: true,
      isZeroExperience: experienceLevel === 'Zero Experience' || selectedSkills.length === 0,
      isUnsureCareer: isUnsureRole,
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

  // Discovered Careers suggestions
  const discoveredCareers = CareerRecommendationEngine.getDiscoveredCareers(selectedInterests, selectedSkills);

  // Snapshot data for Step 8
  const snapshotData = CareerRecommendationEngine.generateFreshUserSnapshot({
    name: name.trim() || 'Student',
    targetRole: selectedDiscoveredRole || targetRole,
    currentSkills: selectedSkills,
    experienceLevel
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-black tracking-tight text-white flex items-center gap-1.5">
                CareerPilot AI <span className="text-[10px] text-indigo-400 font-mono font-normal">Setup Wizard</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
              Skip
            </button>
          </div>
        </div>

        {/* Progress Line */}
        <div className="w-full bg-slate-950 h-1 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Dynamic Step Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: WELCOME & BASICS */}
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
                    <Sparkles className="w-3 h-3 text-amber-300" /> Welcome to your career copilot
                  </div>
                  <h3 className="text-lg font-extrabold text-white">Let's craft your personalized roadmap</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    CareerPilot AI adapts completely to your background — whether you're starting with zero experience or preparing for internships.
                  </p>
                </div>

                <div className="space-y-3 pt-1 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">What's your name?</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Chen"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500 transition"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">College or University (Optional)</label>
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. State University or Self-taught"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>

                <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-[11px]">
                    Your data stays 100% private in your local browser sandbox. No account creation or password required.
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 2: EDUCATION & CURRENT YEAR */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-4 text-xs"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">Academic Stage</span>
                  <h3 className="text-base font-extrabold text-white">Where are you in your studies?</h3>
                  <p className="text-xs text-slate-400">This helps calibrate project difficulty and timeline targets.</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Current Academic Year</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        '1st Year / Freshman',
                        '2nd Year / Sophomore',
                        '3rd Year / Junior',
                        'Final Year / Senior',
                        'Recent Graduate',
                        'Self-Taught / Bootcamp'
                      ].map((y) => (
                        <button
                          key={y}
                          type="button"
                          onClick={() => setYear(y)}
                          className={`p-2.5 rounded-xl border text-left text-xs transition ${
                            year === y 
                              ? 'bg-indigo-600 border-indigo-500 text-white font-bold shadow-md' 
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Field of Study / Department</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Computer Science, Information Tech, Electrical"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: CURRENT SKILLS */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-4 text-xs"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">Skills Inventory</span>
                  <h3 className="text-base font-extrabold text-white">What technologies do you currently know?</h3>
                  <p className="text-xs text-slate-400">Select any you have used. If you are starting fresh with zero skills, tap "I'm starting fresh".</p>
                </div>

                {/* Zero skills button */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSkills([]);
                    setExperienceLevel('Zero Experience');
                    handleNextStep();
                  }}
                  className="w-full p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-between hover:bg-amber-500/20 transition"
                >
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> I am starting completely fresh (Zero technical skills)
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Common Skill Chips */}
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1.5">Tap skills you have basic familiarity with:</label>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_SKILLS.map((sk) => {
                      const isSelected = selectedSkills.includes(sk);
                      return (
                        <button
                          key={sk}
                          type="button"
                          onClick={() => toggleSkill(sk)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                            isSelected 
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' 
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}{sk}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom skill add */}
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomSkill()}
                    placeholder="Add other skill (e.g. Docker, Rust)..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={addCustomSkill}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
                  >
                    Add
                  </button>
                </div>

                {selectedSkills.length > 0 && (
                  <p className="text-[11px] text-emerald-400 font-mono">
                    Selected {selectedSkills.length} skills: {selectedSkills.join(', ')}
                  </p>
                )}
              </motion.div>
            )}

            {/* STEP 4: INTERESTS */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-4 text-xs"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">Interests & Curiosity</span>
                  <h3 className="text-base font-extrabold text-white">What areas sound exciting to you?</h3>
                  <p className="text-xs text-slate-400">Choose one or more domains to guide your career recommendations.</p>
                </div>

                <div className="space-y-2">
                  {COMMON_INTERESTS.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <div
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                          isSelected 
                            ? 'bg-indigo-950/60 border-indigo-500/60 text-white' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xs font-semibold">{interest}</span>
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-indigo-600 text-white' : 'border border-slate-700'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 5: CAREER GOAL OR DISCOVERY MODE */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-4 text-xs"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">Target Ambition</span>
                  <h3 className="text-base font-extrabold text-white">What role are you targeting?</h3>
                  <p className="text-xs text-slate-400">Not sure yet? Choose "I'm not sure" to see matched paths based on your interests.</p>
                </div>

                {/* "I'm unsure" toggle */}
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUnsureRole(false);
                      AnalyticsService.track('career_selected', { type: 'known' });
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                      !isUnsureRole ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    I have a goal in mind
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUnsureRole(true);
                      AnalyticsService.track('career_discovery_triggered');
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                      isUnsureRole ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🔍 Discover paths for me
                  </button>
                </div>

                {!isUnsureRole ? (
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-300 block">Select or type your target role:</label>
                    <div className="space-y-1.5">
                      {POPULAR_ROLES.map(role => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setTargetRole(role)}
                          className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                            targetRole === role 
                              ? 'bg-indigo-600/30 border-indigo-500 text-white' 
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span>{role}</span>
                          {targetRole === role && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2">
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Target Companies (Dream Goal)</label>
                      <input
                        type="text"
                        value={targetCompany}
                        onChange={(e) => setTargetCompany(e.target.value)}
                        placeholder="e.g. Google, Stripe, High-growth Startups"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                ) : (
                  /* CAREER DISCOVERY MODE VIEW */
                  <div className="space-y-2.5">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Best Matches based on your profile:
                    </span>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {discoveredCareers.map((disc) => (
                        <div
                          key={disc.role}
                          onClick={() => {
                            setSelectedDiscoveredRole(disc.role);
                            setTargetRole(disc.role);
                          }}
                          className={`p-3 rounded-2xl border cursor-pointer transition ${
                            (selectedDiscoveredRole || targetRole) === disc.role
                              ? 'bg-indigo-950/80 border-indigo-500'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-xs font-bold text-white">{disc.role}</h4>
                            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                              {disc.suitabilityScore}% Match
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 mb-1.5">{disc.tagline}</p>
                          <div className="text-[10px] text-slate-400 space-y-0.5">
                            <p>💡 <strong className="text-slate-300">Why good fit:</strong> {disc.whyGoodFit}</p>
                            <p>🚀 <strong className="text-slate-300">Starter project:</strong> {disc.firstMiniProject}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 6: EXPERIENCE LEVEL */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-4 text-xs"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">Experience Baseline</span>
                  <h3 className="text-base font-extrabold text-white">How much project/work experience do you have?</h3>
                  <p className="text-xs text-slate-400">Zero experience is completely normal and welcomed. We tailor the starting steps accordingly.</p>
                </div>

                <div className="space-y-2.5">
                  {[
                    {
                      id: 'Zero Experience',
                      title: '🌱 Complete Beginner / 0 Prior Experience',
                      desc: 'No portfolio, no resume yet. Need clear, step-by-step guidance from hello-world to first project.'
                    },
                    {
                      id: 'Student / Aspiring Intern',
                      title: '💻 Student with 1-2 Small Projects',
                      desc: 'Know programming basics and built simple classroom or personal scripts. Targeting internships.'
                    },
                    {
                      id: 'Early Career',
                      title: '🚀 Active Builder / Preparing for Full-Time',
                      desc: 'Have 2+ projects or internship experience. Focusing on ATS optimization and interview mastery.'
                    }
                  ].map((exp) => (
                    <div
                      key={exp.id}
                      onClick={() => setExperienceLevel(exp.id as any)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                        experienceLevel === exp.id
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <h4 className="text-xs font-bold mb-1">{exp.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{exp.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 7: DAILY TIME COMMITMENT */}
            {step === 7 && (
              <motion.div
                key="step7"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-4 text-xs"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">Study Rhythm</span>
                  <h3 className="text-base font-extrabold text-white">How much time can you spend daily?</h3>
                  <p className="text-xs text-slate-400">Consistency beats cramming. The Daily Career Planner will chunk your study sessions to match this goal.</p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: '30m', label: '30 min / day', desc: 'Micro-learning (1 concept + 1 quiz)' },
                    { id: '1h', label: '1 hour / day', desc: 'Steady pace (Theory + coding practice)' },
                    { id: '2h', label: '2 hours / day', desc: 'Accelerated (Project + DSA deep dive)' },
                    { id: '3h+', label: '3+ hours / day', desc: 'Intensive internship / interview sprint' }
                  ].map((time) => (
                    <button
                      key={time.id}
                      type="button"
                      onClick={() => setDailyTimeBudget(time.id as any)}
                      className={`p-3 rounded-2xl border text-left transition ${
                        dailyTimeBudget === time.id
                          ? 'bg-indigo-600 border-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-300" />
                        <span className="text-xs font-bold">{time.label}</span>
                      </div>
                      <p className="text-[10px] text-slate-300 font-normal leading-tight">{time.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 8: SYNTHESIS & PERSONALIZED SNAPSHOT */}
            {step === 8 && (
              <motion.div
                key="step8"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-3.5 text-xs"
              >
                {isGeneratingSnapshot ? (
                  <div className="py-12 text-center space-y-3">
                    <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                    <h3 className="text-sm font-bold text-white">Synthesizing Your Career Blueprint...</h3>
                    <p className="text-xs text-slate-400">Computing 9-pillar readiness & sequencing dynamic roadmap</p>
                  </div>
                ) : (
                  <>
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-purple-950/50 to-slate-900 border border-indigo-500/40 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono text-indigo-300 uppercase font-bold">Personalized Snapshot</span>
                          <h3 className="text-sm font-black text-white">{name || 'Explorer'}'s Career Blueprint</h3>
                          <p className="text-xs text-cyan-300 font-medium">Target: {selectedDiscoveredRole || targetRole}</p>
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-base font-black text-emerald-400">{snapshotData.readinessScore}%</span>
                          <span className="text-[9px] text-slate-400 block">Baseline Readiness</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono pt-1">
                        <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                          <span className="text-slate-400 block">Baseline Level</span>
                          <span className="text-white font-bold">{snapshotData.skillLevel}</span>
                        </div>
                        <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                          <span className="text-slate-400 block">Daily Budget</span>
                          <span className="text-amber-400 font-bold">{dailyTimeBudget} / day</span>
                        </div>
                      </div>
                    </div>

                    {/* Next Best Action & Starter Project */}
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                      <span className="text-[10px] font-mono font-bold text-amber-400 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> FIRST RECOMMENDED ACTION
                      </span>
                      <p className="text-xs font-bold text-white">{snapshotData.nextBestAction.title}</p>
                      <p className="text-[11px] text-slate-300 leading-relaxed">{snapshotData.nextBestAction.description}</p>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 flex items-center gap-1">
                        <Code className="w-3 h-3" /> STARTER CAPSTONE PROJECT
                      </span>
                      <p className="text-xs font-bold text-white">{snapshotData.firstProject.title}</p>
                      <p className="text-[11px] text-slate-300">{snapshotData.firstProject.description}</p>
                    </div>
                  </>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Bottom Action Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white transition flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNextStep}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition active:scale-95"
          >
            <span>{step === totalSteps ? 'Launch Dashboard 🚀' : 'Continue'}</span>
            {step < totalSteps && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
