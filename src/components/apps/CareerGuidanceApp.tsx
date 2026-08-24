import React, { useState, useEffect, useMemo } from 'react';
import { motion, animate } from 'motion/react';
import { 
  Compass, Award, CheckCircle2, Circle, Clock, 
  Sparkles, Layers, Code, RefreshCw, HelpCircle, 
  Send, AlertCircle, ArrowRight,
  TrendingUp, Cpu, FileText, 
  ShieldCheck, Trash2, User, Briefcase, 
  Target, CheckSquare, Zap, Flame,
  MessageSquare, Copy, Check, BarChart3, Sun, Moon,
  ChevronRight, FileSearch, Bookmark, Plus, X, Lock, Download, Key,
  Github, Linkedin, BookOpen, Calendar, LogOut
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { AIService, CareerAnalysisResponse } from '../../services/aiService';
import { AnalyticsService } from '../../services/analyticsService';
import { CareerRecommendationEngine } from '../../services/careerRecommendationEngine';

// Career Modules
import { 
  CareerEnergyTier, CareerPillars, PillarWeights, SkillEvidenceItem, 
  DailyMission, OpportunityMatch, TrackedApplication, EnhancedInterviewFeedback,
  RoadmapStage, ProjectItem, MockQuestion, UserProfile
} from '../career/careerTypes';
import { 
  getPillarWeightsForRole, DEFAULT_PROFILE, DEFAULT_STAGES, DEFAULT_PROJECT_ITEMS,
  DEFAULT_SKILL_EVIDENCE, DEFAULT_DAILY_MISSIONS, 
  DEFAULT_OPPORTUNITIES, DEFAULT_APPLICATIONS 
} from '../career/careerConstants';
import { CareerEnergyGauge } from '../career/CareerEnergyGauge';
import { TodayMissionCard } from '../career/TodayMissionCard';
import { JobDescriptionAnalyzer } from '../career/JobDescriptionAnalyzer';
import { OpportunityMatchingView } from '../career/OpportunityMatchingView';
import { ApplicationTrackerView } from '../career/ApplicationTrackerView';
import { SkillEvidenceMatrix } from '../career/SkillEvidenceMatrix';
import { PrivacySettingsModal } from '../career/PrivacySettingsModal';
import { GitHubAnalyzerView } from '../career/GitHubAnalyzerView';
import { LinkedInAnalyzerView } from '../career/LinkedInAnalyzerView';
import { LearningEngineView } from '../career/LearningEngineView';
import { DailyCareerPlannerView } from '../career/DailyCareerPlannerView';
import { SkillGapMatrixView } from '../career/SkillGapMatrixView';
import { ComprehensiveReadinessModal } from '../career/ComprehensiveReadinessModal';
import { AiCareerAssistantModal } from '../career/AiCareerAssistantModal';
import { FreshUserOnboardingModal } from '../career/FreshUserOnboardingModal';
import { AuthWelcomeView, AuthUser } from '../career/AuthWelcomeView';
import { AiCareerAnalysisView } from '../career/AiCareerAnalysisView';
import { ResumeAnalyzerView } from '../career/ResumeAnalyzerView';
import { AiCareerAnalysisResult } from '../career/careerTypes';
import { CareerPilotLogo, CareerPilotSymbol, CareerPilotBrandShowcase } from '../career/CareerPilotLogo';

// --- MOTION ANIMATED SCORE COUNTER & PROGRESS COMPONENTS ---
export const AnimatedScoreCounter: React.FC<{ value: number; duration?: number; delay?: number }> = ({ 
  value, 
  duration = 1.0,
  delay = 0 
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      }
    });
    return () => controls.stop();
  }, [value, duration, delay]);

  return <>{displayValue}</>;
};

export const AnimatedProgressBar: React.FC<{
  percentage: number;
  colorClass?: string;
  duration?: number;
  delay?: number;
  heightClass?: string;
}> = ({
  percentage,
  colorClass = "bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400",
  duration = 0.6,
  delay = 0,
  heightClass = "h-1.5"
}) => {
  return (
    <div className={`w-full bg-slate-900 rounded-full ${heightClass} overflow-hidden`}>
      <motion.div 
        className={`h-full ${colorClass} rounded-full`}
        initial={{ width: "0%" }}
        animate={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
};

const DEFAULT_MOCK_QUESTIONS: MockQuestion[] = [
  {
    id: 'q_tech_1',
    type: 'Technical',
    question: 'How do Python GIL limitations impact multi-threaded CPU-bound operations vs I/O-bound tasks?',
    context: 'Assesses deep Python runtime mechanics, threading versus multiprocessing, and concurrency knowledge.',
    sampleAnswer: 'The Global Interpreter Lock (GIL) ensures only one native thread executes Python bytecode at a time. For CPU-bound tasks (like matrix math), multi-threading suffers from lock contention without parallelism; multiprocessing or C-extensions (NumPy/PyTorch) are required. For I/O-bound tasks (network/disk), threads release the GIL during blocking operations, making async/threading highly effective.',
    keyTopics: ['GIL Mechanics', 'CPU vs I/O Bound', 'Multiprocessing', 'NumPy/PyTorch C-extensions']
  },
  {
    id: 'q_tech_2',
    type: 'Technical',
    question: 'Explain the difference between SQL indexing with B-Trees vs Hash Indexes. When would you choose one over the other?',
    context: 'Evaluates database query optimization, internal indexing structures, and range scan performance.',
    sampleAnswer: 'B-Tree indexes maintain a balanced tree structure supporting both point lookups (O(log N)) and range queries (e.g., BETWEEN, <, >) through ordered leaf nodes. Hash indexes provide O(1) point lookups based on an exact hash match but cannot perform range scans or prefix queries. In production, B-Trees are the default choice for general columns, while Hash indexes are reserved for strictly exact-match equality lookups.',
    keyTopics: ['B-Tree Structure', 'Hash Index O(1)', 'Range Queries', 'Index Optimization']
  },
  {
    id: 'q_hr_1',
    type: 'HR',
    question: 'Why do you want to join our company as an Engineer, and where do you see your career heading in 3 years?',
    context: 'Assesses candidate motivation, growth mindset, and alignment with engineering excellence.',
    sampleAnswer: 'I admire your company\'s commitment to engineering excellence and scalable infrastructure. In my projects, I love building reliable systems and solving complex bottlenecks. In 3 years, my goal is to transition into an autonomous engineer who designs core services, mentors interns, and takes ownership of critical latency metrics.',
    keyTopics: ['Alignment', 'Growth Mindset', 'Ownership', 'Continuous Learning']
  },
  {
    id: 'q_beh_1',
    type: 'Behavioral',
    question: 'Tell me about a time you faced a difficult technical bug under a tight deadline. How did you diagnose and resolve it?',
    context: 'Uses STAR framework to assess problem-solving under pressure and systematic root-cause analysis.',
    sampleAnswer: 'Situation: During a hackathon, our API server started throwing 504 Gateway Timeouts before demo submissions. Task: I needed to isolate whether the issue was database lock contention, memory leak, or unhandled promise. Action: I used server logs to isolate the slow endpoint, identifying an unindexed N+1 query loop. I converted it into a single SQL JOIN with Redis caching. Result: Response times dropped from 4.2s to 38ms, and our team delivered the demo successfully.',
    keyTopics: ['STAR Framework', 'Root Cause Diagnostics', 'Pressure Handling', 'Measurable Impact']
  }
];

export const CareerGuidanceApp: React.FC = () => {
  // Fresh Clean Reset Enforcement: Purge old legacy mock data (e.g. Alex Chen) on fresh boot
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const hasPurged = localStorage.getItem('careerpilot_clean_reset_v4');
      if (!hasPurged) {
        localStorage.clear();
        localStorage.setItem('careerpilot_clean_reset_v4', 'true');
        return null;
      }
      const saved = localStorage.getItem('careerpilot_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Main Navigation Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analyze' | 'roadmap' | 'practice' | 'tracker' | 'profile'>('dashboard');

  // Sub-tabs
  const [analyzeSubTab, setAnalyzeSubTab] = useState<'profiler' | 'job_matcher' | 'ats_resume' | 'github_auditor' | 'linkedin_optimizer'>('profiler');
  const [roadmapSubTab, setRoadmapSubTab] = useState<'stages' | 'skill_gap_matrix' | 'evidence_matrix'>('stages');
  const [practiceSubTab, setPracticeSubTab] = useState<'mock_interview' | 'project_blueprints' | 'learning_engine'>('mock_interview');
  const [trackerSubTab, setTrackerSubTab] = useState<'daily_planner' | 'opportunities' | 'pipeline'>('daily_planner');

  // Candidate Profile State (Scoped to current authenticated user)
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const userId = localStorage.getItem('careerpilot_current_user_id');
      if (userId) {
        const saved = localStorage.getItem(`careerpilot_${userId}_profile`);
        if (saved) return JSON.parse(saved);
      }
      return DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // 4 Pillars Base Scores
  const [pillars, setPillars] = useState<CareerPillars>(() => {
    try {
      const userId = localStorage.getItem('careerpilot_current_user_id');
      if (userId) {
        const saved = localStorage.getItem(`careerpilot_${userId}_pillars`);
        if (saved) return JSON.parse(saved);
      }
      return { skills: 0, projects: 0, resume: 0, interview: 0 };
    } catch {
      return { skills: 0, projects: 0, resume: 0, interview: 0 };
    }
  });

  // Dynamic Weights calculation based on role
  const weights = useMemo(() => {
    return getPillarWeightsForRole(profile.targetRole);
  }, [profile.targetRole]);

  // Dynamic 9-Pillar Readiness Intelligence
  const readinessDiagnosis = useMemo(() => {
    return CareerRecommendationEngine.calculateReadiness(profile, profile.currentSkills);
  }, [profile]);

  // Overall Career Readiness Score
  const readinessOverall = useMemo(() => {
    return readinessDiagnosis.overallScore;
  }, [readinessDiagnosis]);

  // Daily Missions State
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>(() => {
    try {
      const userId = localStorage.getItem('careerpilot_current_user_id');
      if (userId) {
        const saved = localStorage.getItem(`careerpilot_${userId}_missions`);
        if (saved) return JSON.parse(saved);
      }
      return DEFAULT_DAILY_MISSIONS;
    } catch {
      return DEFAULT_DAILY_MISSIONS;
    }
  });

  // Skill Evidence State
  const [skillEvidence, setSkillEvidence] = useState<SkillEvidenceItem[]>(() => {
    try {
      const userId = localStorage.getItem('careerpilot_current_user_id');
      if (userId) {
        const saved = localStorage.getItem(`careerpilot_${userId}_evidence`);
        if (saved) return JSON.parse(saved);
      }
      return DEFAULT_SKILL_EVIDENCE;
    } catch {
      return DEFAULT_SKILL_EVIDENCE;
    }
  });

  // Opportunities & Applications State
  const [opportunities, setOpportunities] = useState<OpportunityMatch[]>(() => {
    try {
      const userId = localStorage.getItem('careerpilot_current_user_id');
      if (userId) {
        const saved = localStorage.getItem(`careerpilot_${userId}_opportunities`);
        if (saved) return JSON.parse(saved);
      }
      return DEFAULT_OPPORTUNITIES;
    } catch {
      return DEFAULT_OPPORTUNITIES;
    }
  });

  const [applications, setApplications] = useState<TrackedApplication[]>(() => {
    try {
      const userId = localStorage.getItem('careerpilot_current_user_id');
      if (userId) {
        const saved = localStorage.getItem(`careerpilot_${userId}_applications`);
        if (saved) return JSON.parse(saved);
      }
      return DEFAULT_APPLICATIONS;
    } catch {
      return DEFAULT_APPLICATIONS;
    }
  });

  // Stages & Dynamic Roadmap State
  const [stages, setStages] = useState<RoadmapStage[]>(() => {
    try {
      const userId = localStorage.getItem('careerpilot_current_user_id');
      if (userId) {
        const saved = localStorage.getItem(`careerpilot_${userId}_stages`);
        if (saved) return JSON.parse(saved);
      }
      return CareerRecommendationEngine.getDynamicRoadmap(profile.targetRole);
    } catch {
      return CareerRecommendationEngine.getDynamicRoadmap(profile.targetRole);
    }
  });

  // Project items
  const projectItems = useMemo(() => {
    return CareerRecommendationEngine.getRecommendedProjects(profile.targetRole);
  }, [profile.targetRole]);

  // Theme & System States
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('careerpilot_theme') !== 'light';
  });
  const [demoMode, setDemoMode] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    try {
      const userId = localStorage.getItem('careerpilot_current_user_id');
      if (userId) {
        return localStorage.getItem(`careerpilot_${userId}_onboarded`) !== 'true';
      }
      return true;
    } catch {
      return true;
    }
  });
  const [showAiCopilot, setShowAiCopilot] = useState(false);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAiAnalysisView, setShowAiAnalysisView] = useState(false);
  const [showBrandShowcase, setShowBrandShowcase] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Starter Fresher Resume Template
  const FRESHER_STARTER_RESUME = `NEW GRADUATE RESUME
Email: student@university.edu | GitHub: github.com/student-dev | LinkedIn: linkedin.com/in/student-profile

EDUCATION
Tech University - B.S. in Computer Science | Expected 2027
Relevant Coursework: Data Structures & Algorithms, Database Systems, Computer Networks, Operating Systems

TECHNICAL SKILLS
Languages: Python, JavaScript, TypeScript, SQL, C++
Frameworks & Libraries: React, Node.js, FastAPI, Tailwind CSS
Tools & Cloud: Git, GitHub Actions, Docker, Linux, PostgreSQL, Postman

ACADEMIC & CAPSTONE PROJECTS
1. Real-Time Distributed Task Engine | React, TypeScript, FastAPI, Redis
- Designed asynchronous task queue handling 5,000 requests/minute with sub-50ms processing latency.
- Built interactive dashboard with client-side caching reducing network round-trips by 40%.

2. Semantic Document Search & Q&A Assistant | Python, ChromaDB, Sentence-Transformers, Docker
- Engineered a hybrid vector search indexing 10,000+ technical documents with 92% retrieval accuracy.
- Containerized microservice with Docker and automated testing suite attaining 95% code coverage.`;

  // Onboarding Handlers
  const handleCompleteOnboarding = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setAnalyzerForm({
      name: newProfile.name,
      college: newProfile.college,
      degree: newProfile.degree,
      department: newProfile.department,
      year: newProfile.year,
      targetRole: newProfile.targetRole,
      targetCompany: newProfile.targetCompany,
      skills: newProfile.currentSkills.join(', '),
      programmingLanguages: newProfile.programmingLanguages.join(', '),
      experienceLevel: newProfile.experienceLevel,
      interests: newProfile.interests.join(', '),
      github: newProfile.github,
      linkedin: newProfile.linkedin,
      leetcode: newProfile.leetcode
    });

    const userId = currentUser?.id || 'guest';
    localStorage.setItem(`careerpilot_${userId}_profile`, JSON.stringify(newProfile));
    localStorage.setItem(`careerpilot_${userId}_onboarded`, 'true');
    setShowOnboarding(false);

    // Sync new dynamic roadmap
    const dynamicStages = CareerRecommendationEngine.getDynamicRoadmap(newProfile.targetRole);
    setStages(dynamicStages);
    localStorage.setItem(`careerpilot_${userId}_stages`, JSON.stringify(dynamicStages));

    // Calculate initial dynamic readiness
    const initialDiag = CareerRecommendationEngine.calculateReadiness(newProfile, newProfile.currentSkills);
    const initialPillars = {
      skills: Math.max(35, initialDiag.breakdown.technicalSkills),
      projects: Math.max(30, initialDiag.breakdown.projects),
      resume: 60,
      interview: 50
    };
    setPillars(initialPillars);
    localStorage.setItem(`careerpilot_${userId}_pillars`, JSON.stringify(initialPillars));

    // Open the comprehensive AI Career Analysis View
    setShowAiAnalysisView(true);

    AnalyticsService.track('first_action_taken', { type: 'onboarding_completed' });
  };

  const handleSkipOnboarding = () => {
    const userId = currentUser?.id || 'guest';
    localStorage.setItem(`careerpilot_${userId}_onboarded`, 'true');
    setShowOnboarding(false);
  };

  const handleLoadFresherResume = () => {
    setResumeText(FRESHER_STARTER_RESUME);
    AnalyticsService.track('first_resume_scanned', { type: 'starter_template' });
  };

  // Auth Handler
  const handleAuthenticate = (user: AuthUser, isNewUser: boolean) => {
    setCurrentUser(user);
    localStorage.setItem('careerpilot_auth_user', JSON.stringify(user));
    localStorage.setItem('careerpilot_current_user_id', user.id);

    const userProfileKey = `careerpilot_${user.id}_profile`;
    const existingProfileRaw = localStorage.getItem(userProfileKey);

    if (existingProfileRaw) {
      try {
        const existingProfile: UserProfile = JSON.parse(existingProfileRaw);
        setProfile(existingProfile);
        setShowOnboarding(!existingProfile.isOnboarded);

        const savedStages = localStorage.getItem(`careerpilot_${user.id}_stages`);
        if (savedStages) {
          setStages(JSON.parse(savedStages));
        } else {
          setStages(CareerRecommendationEngine.getDynamicRoadmap(existingProfile.targetRole));
        }
      } catch {
        // Fallback
      }
    } else {
      const initialProfile: UserProfile = {
        ...DEFAULT_PROFILE,
        name: user.name,
        isOnboarded: false,
        createdAt: new Date().toISOString()
      };
      setProfile(initialProfile);
      setShowOnboarding(true);
      setStages(CareerRecommendationEngine.getDynamicRoadmap(initialProfile.targetRole));
      localStorage.setItem(userProfileKey, JSON.stringify(initialProfile));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('careerpilot_auth_user');
    localStorage.removeItem('careerpilot_current_user_id');
    setCurrentUser(null);
    setProfile(DEFAULT_PROFILE);
    setShowOnboarding(false);
    AnalyticsService.track('user_logged_out');
  };

  // Form State for Profile
  const [analyzerForm, setAnalyzerForm] = useState({
    name: profile.name,
    college: profile.college,
    degree: profile.degree || 'B.Tech / B.S. Computer Science',
    department: profile.department,
    year: profile.year,
    targetRole: profile.targetRole,
    targetCompany: profile.targetCompany,
    skills: profile.currentSkills.join(', '),
    programmingLanguages: profile.programmingLanguages.join(', '),
    experienceLevel: profile.experienceLevel,
    interests: profile.interests.join(', '),
    github: profile.github || '',
    linkedin: profile.linkedin || '',
    leetcode: profile.leetcode || ''
  });

  // Resume Analyzer States
  const [resumeText, setResumeText] = useState('');
  const [atsScore, setAtsScore] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [realAnalysisResult, setRealAnalysisResult] = useState<CareerAnalysisResponse | null>(null);

  // Gemini API Key & Online state
  const [apiKeyInput, setApiKeyInput] = useState(() => AIService.getApiKey());
  const [isApiKeySaved, setIsApiKeySaved] = useState(false);
  const [isOnline, setIsOnline] = useState(() => AIService.isConfigured());

  // AI Mock Interview States
  const [mockQuestions] = useState<MockQuestion[]>(DEFAULT_MOCK_QUESTIONS);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [interviewFeedback, setInterviewFeedback] = useState<EnhancedInterviewFeedback | null>(null);
  const [isGrading, setIsGrading] = useState(false);
  const [interviewTypeFilter, setInterviewTypeFilter] = useState<'Technical' | 'HR' | 'Behavioral'>('Technical');

  // Filtered mock questions
  const filteredQuestions = mockQuestions.filter(q => q.type === interviewTypeFilter);

  // Award XP helper
  const handleAwardXP = (amount: number) => {
    setProfile(p => {
      const updated = { ...p, xp: p.xp + amount };
      if (currentUser?.id) {
        localStorage.setItem(`careerpilot_${currentUser.id}_profile`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Sync to LocalStorage scoped to current user
  useEffect(() => {
    if (currentUser?.id && profile.isOnboarded) {
      localStorage.setItem(`careerpilot_${currentUser.id}_profile`, JSON.stringify(profile));
    }
  }, [profile, currentUser]);

  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem(`careerpilot_${currentUser.id}_pillars`, JSON.stringify(pillars));
    }
  }, [pillars, currentUser]);

  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem(`careerpilot_${currentUser.id}_missions`, JSON.stringify(dailyMissions));
    }
  }, [dailyMissions, currentUser]);

  useEffect(() => {
    localStorage.setItem('careerpilot_evidence', JSON.stringify(skillEvidence));
  }, [skillEvidence]);

  useEffect(() => {
    localStorage.setItem('careerpilot_opportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem('careerpilot_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('careerpilot_stages', JSON.stringify(stages));
  }, [stages]);

  useEffect(() => {
    localStorage.setItem('careerpilot_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Save API Key Handler
  const handleSaveApiKey = () => {
    AIService.setApiKey(apiKeyInput);
    const configured = AIService.isConfigured();
    setIsOnline(configured);
    setDemoMode(!configured);
    setIsApiKeySaved(true);
    AnalyticsService.track('api_key_configured', { configured });
    setTimeout(() => setIsApiKeySaved(false), 2500);
  };

  // Real AI Resume Analysis Handler
  const handleRunAiResumeAnalysis = async () => {
    setIsAnalyzing(true);
    AnalyticsService.track('resume_analyzed', { targetRole: profile.targetRole });

    try {
      const result = await AIService.analyze({
        target_role: profile.targetRole,
        resume_text: resumeText,
        skills: profile.currentSkills
      });
      setRealAnalysisResult(result);

      if (!result.error && result.readiness_score > 0) {
        setAtsScore(result.readiness_score);
        setPillars(prev => ({
          ...prev,
          resume: result.readiness_score,
          skills: Math.min(100, Math.max(35, Math.round(result.readiness_score * 0.9 + (result.strengths?.length || 0) * 2)))
        }));

        if (result.strengths && result.strengths.length > 0) {
          setProfile(p => ({
            ...p,
            xp: p.xp + 120,
            currentSkills: Array.from(new Set([...p.currentSkills, ...result.strengths]))
          }));
        }
      }
    } catch (err) {
      console.error('Error running AI Resume Analysis:', err);
      setRealAnalysisResult({
        readiness_score: 0,
        strengths: [],
        skill_gaps: [],
        recommended_skills: [],
        next_steps: [],
        resume_bullets: [],
        error: "Failed to connect to AI service. Check your internet connection or verify your API key."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle Daily Mission completion
  const handleToggleDailyMission = (id: string) => {
    setDailyMissions(prev => prev.map(m => {
      if (m.id !== id) return m;
      const nextCompleted = !m.completed;
      if (nextCompleted) {
        setProfile(p => ({ ...p, xp: p.xp + m.xpReward }));
        AnalyticsService.track('task_completed', { taskId: id, title: m.title });
        if (m.pillar === 'Projects') setPillars(p => ({ ...p, projects: Math.min(100, p.projects + 5) }));
        if (m.pillar === 'Interview') setPillars(p => ({ ...p, interview: Math.min(100, p.interview + 4) }));
        if (m.pillar === 'Resume') setPillars(p => ({ ...p, resume: Math.min(100, p.resume + 3) }));
        if (m.pillar === 'Skills') setPillars(p => ({ ...p, skills: Math.min(100, p.skills + 4) }));
      }
      return { ...m, completed: nextCompleted };
    }));
  };

  // Toggle Roadmap Task
  const toggleRoadmapTask = (stageId: string, taskId: string) => {
    setStages(prev => prev.map(stage => {
      if (stage.id !== stageId) return stage;
      return {
        ...stage,
        tasks: stage.tasks.map(t => {
          if (t.id !== taskId) return t;
          const updated = !t.completed;
          if (updated) {
            setProfile(p => ({ ...p, xp: p.xp + 50 }));
            setPillars(p => ({ ...p, skills: Math.min(100, p.skills + 2) }));
            AnalyticsService.track('roadmap_stage_completed', { stageId, taskId });
          }
          return { ...t, completed: updated };
        })
      };
    }));
  };

  // Save Profile Handler
  const handleSaveProfile = () => {
    const updated: UserProfile = {
      ...profile,
      name: analyzerForm.name.trim() || profile.name,
      college: analyzerForm.college.trim() || profile.college,
      degree: analyzerForm.degree.trim() || profile.degree,
      department: analyzerForm.department.trim() || profile.department,
      year: analyzerForm.year.trim() || profile.year,
      targetRole: analyzerForm.targetRole.trim() || profile.targetRole,
      targetCompany: analyzerForm.targetCompany.trim() || profile.targetCompany,
      currentSkills: analyzerForm.skills.split(',').map(s => s.trim()).filter(Boolean),
      programmingLanguages: analyzerForm.programmingLanguages.split(',').map(s => s.trim()).filter(Boolean),
      experienceLevel: analyzerForm.experienceLevel,
      interests: analyzerForm.interests.split(',').map(s => s.trim()).filter(Boolean),
      github: analyzerForm.github.trim() || profile.github,
      linkedin: analyzerForm.linkedin.trim() || profile.linkedin,
      leetcode: analyzerForm.leetcode.trim() || profile.leetcode
    };
    setProfile(updated);
    setStages(CareerRecommendationEngine.getDynamicRoadmap(updated.targetRole));
    AnalyticsService.track('profile_updated', { targetRole: updated.targetRole });
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 2500);
  };

  // Track Opportunity into Pipeline
  const handleTrackOpportunity = (opp: OpportunityMatch) => {
    const newApp: TrackedApplication = {
      id: 'app_' + Date.now(),
      company: opp.company,
      role: opp.title,
      status: 'Saved',
      appliedDate: 'Saved Today',
      matchScore: opp.alignmentScore,
      notes: `Matched via CareerPilot alignment (${opp.whyMatch.substring(0, 70)}...)`,
      resumeVersion: 'Resume_v1.pdf'
    };
    setApplications(prev => [newApp, ...prev]);
    setOpportunities(prev => prev.map(o => o.id === opp.id ? { ...o, applied: true } : o));
    AnalyticsService.track('job_applied', { company: opp.company, role: opp.title });
  };

  // Grade Mock Interview
  const handleGradeInterviewAnswer = async () => {
    if (!candidateAnswer.trim()) return;
    setIsGrading(true);
    AnalyticsService.track('mock_interview_started', { type: interviewTypeFilter });

    try {
      const activeQ = filteredQuestions[activeQuestionIdx];
      const apiKey = AIService.getApiKey();

      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are CareerCoach AI.
Target Role: ${profile.targetRole}
Question: ${activeQ.question}
Context: ${activeQ.context}
Candidate Answer: ${candidateAnswer}

Grade the response across 4 dimensions (0-10 each):
1. correctness (0-10)
2. communication (0-10)
3. depth (0-10)
4. problemSolving (0-10)

Provide JSON:
{
  "overallScore": number (0-10),
  "dimensions": {
    "correctness": number,
    "communication": number,
    "depth": number,
    "problemSolving": number
  },
  "strengths": string[],
  "weaknesses": string[],
  "mostImportantImprovement": string,
  "recommendedPracticeTopic": string,
  "benchmarkModelAnswer": string
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });

        const parsed = JSON.parse(response.text || '{}');
        setInterviewFeedback(parsed);
      } else {
        await new Promise(r => setTimeout(r, 600));
        setInterviewFeedback({
          overallScore: 8.5,
          dimensions: { correctness: 9.0, communication: 8.5, depth: 8.0, problemSolving: 8.5 },
          strengths: [
            'Direct, structured articulation of core architectural concepts.',
            'Accurate terminology alignment for runtime memory constraints.'
          ],
          weaknesses: [
            `Could expand more specifically on memory footprint trade-offs for ${activeQ.keyTopics[0]}.`
          ],
          mostImportantImprovement: 'Mention latency degradation under P99 concurrency load.',
          recommendedPracticeTopic: `${activeQ.keyTopics[0]} & Concurrency`,
          benchmarkModelAnswer: activeQ.sampleAnswer
        });
      }

      setPillars(p => ({ ...p, interview: Math.min(100, p.interview + 3) }));
      setProfile(p => ({ ...p, xp: p.xp + 80 }));
      AnalyticsService.track('mock_interview_completed', { score: 8.5 });
    } catch (err) {
      console.warn('Interview grader fallback:', err);
      const activeQ = filteredQuestions[activeQuestionIdx];
      setInterviewFeedback({
        overallScore: 8.0,
        dimensions: { correctness: 8.5, communication: 8.0, depth: 7.5, problemSolving: 8.0 },
        strengths: ['Clear terminology and accurate core concepts.'],
        weaknesses: ['Add concrete edge-case trade-offs.'],
        mostImportantImprovement: 'Structure with the STAR method for behavioral depth.',
        recommendedPracticeTopic: 'System Design & Trade-off Articulation',
        benchmarkModelAnswer: activeQ.sampleAnswer
      });
    } finally {
      setIsGrading(false);
    }
  };

  // Reset All Local Data (Factory Purge)
  const handleResetAllData = () => {
    try {
      localStorage.clear();
      localStorage.setItem('careerpilot_clean_reset_v4', 'true');
      setCurrentUser(null);
      setProfile(DEFAULT_PROFILE);
      setPillars({ skills: 0, projects: 0, resume: 0, interview: 0 });
      setDailyMissions([]);
      setSkillEvidence([]);
      setOpportunities(DEFAULT_OPPORTUNITIES);
      setApplications([]);
      setStages([]);
      setResumeText('');
      setShowOnboarding(false);
      setShowPrivacyModal(false);
      AnalyticsService.track('full_data_purged');
    } catch (e) {
      console.error('Failed to reset all data', e);
    }
  };

  // Export Data JSON
  const handleExportData = () => {
    const exportPayload = {
      profile,
      pillars,
      readinessOverall,
      readinessDiagnosis,
      stages,
      dailyMissions,
      skillEvidence,
      applications,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CareerPilot_Data_${profile.name ? profile.name.replace(/\s+/g, '_') : 'Student'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Global Roadmap Progress
  const totalRoadmapTasks = stages.reduce((acc, s) => acc + s.tasks.length, 0);
  const completedRoadmapTasks = stages.reduce((acc, s) => acc + s.tasks.filter(t => t.completed).length, 0);
  const roadmapPercent = Math.round((completedRoadmapTasks / (totalRoadmapTasks || 1)) * 100);

  const activeMission = dailyMissions.find(m => !m.completed) || dailyMissions[0];

  if (!currentUser) {
    return (
      <AuthWelcomeView
        isDarkMode={isDarkMode}
        onAuthenticate={handleAuthenticate}
      />
    );
  }

  if (showAiAnalysisView) {
    const analysis = CareerRecommendationEngine.generateComprehensiveAiAnalysis(profile);
    return (
      <AiCareerAnalysisView
        analysis={analysis}
        profile={profile}
        isDarkMode={isDarkMode}
        onProceedToDashboard={() => setShowAiAnalysisView(false)}
        onEditProfile={() => {
          setShowAiAnalysisView(false);
          setActiveTab('profile');
        }}
      />
    );
  }

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} overflow-hidden font-sans select-none transition-colors duration-200`}>
      
      {/* Top Header */}
      <header className={`${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'} backdrop-blur border-b px-3.5 py-2 flex items-center justify-between shrink-0 z-20 shadow-sm`}>
        <div className="flex items-center gap-2">
          <CareerPilotLogo variant={isDarkMode ? 'dark' : 'light'} size={28} showBadge badgeText="AI" />
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowBrandShowcase(true)}
            className="text-[10px] font-bold px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition flex items-center gap-1"
            title="Inspect Brand Identity, Logo System & Export SVGs"
          >
            <CareerPilotSymbol variant={isDarkMode ? 'dark' : 'light'} size={12} />
            <span className="hidden sm:inline">Brand System</span>
          </button>

          <button
            onClick={() => setShowAiAnalysisView(true)}
            className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 transition flex items-center gap-1"
            title="View Comprehensive AI Career Analysis"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span className="hidden sm:inline">AI Analysis</span>
          </button>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-1.5 rounded-lg border transition ${isDarkMode ? 'bg-slate-800 border-slate-700 text-amber-300' : 'bg-slate-100 border-slate-200 text-slate-600'}`}
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleLogout}
            className={`p-1.5 rounded-lg border transition ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10' : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50'}`}
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto p-3.5 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800">
        
        {/* ==================================================== */}
        {/* 1. DASHBOARD TAB (Personalized First Dashboard) */}
        {/* ==================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            
            {/* 1. CAREER GOAL BANNER */}
            <div className="bg-gradient-to-r from-indigo-950/80 via-purple-950/50 to-slate-900 border border-indigo-500/30 p-4 rounded-2xl shadow-lg relative overflow-hidden space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-semibold mb-0.5">
                    <span>👋 Hello,</span>
                    <span className="text-white font-bold">{profile.name}</span>
                  </div>
                  <h2 className="text-base font-black text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-rose-400" />
                    <span>Target: <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-cyan-300">{profile.targetRole}</span></span>
                  </h2>
                  <p className="text-[11px] text-slate-300 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>🏢 Aiming for <strong className="text-white">{profile.targetCompany}</strong></span>
                    <span>&bull;</span>
                    <span>🎓 {profile.degree} ({profile.year})</span>
                    <span>&bull;</span>
                    <span>⏱️ {profile.dailyTimeBudget || '1h'}/day</span>
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm font-mono">
                    <Flame className="w-3 h-3 fill-amber-400 text-amber-400" /> {profile.streak} Day Streak
                  </span>
                  <span className="text-[10px] font-mono text-indigo-300 font-bold bg-indigo-900/40 px-2 py-0.5 rounded-full border border-indigo-500/30">
                    ⚡ {profile.xp} XP
                  </span>
                </div>
              </div>

              {/* Action Buttons for Career Goal */}
              <div className="flex items-center gap-2 pt-1 border-t border-indigo-500/20">
                <button
                  onClick={() => setShowAiAnalysisView(true)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>View AI Career Analysis</span>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

            {/* 2. READINESS OVERVIEW */}
            <CareerEnergyGauge
              score={readinessOverall}
              targetRole={profile.targetRole}
              isDarkMode={isDarkMode}
              onOpenDiagnosis={() => setShowDiagnosisModal(true)}
            />

            {/* 4 Role-Weighted Readiness Pillars */}
            <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-2.5 shadow-md`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase">Readiness Overview</span>
                  <h3 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} flex items-center gap-1.5`}>
                    <BarChart3 className="w-3.5 h-3.5 text-indigo-400" /> 4 Career Pillars Breakdown
                  </h3>
                </div>
                <button
                  onClick={() => setShowDiagnosisModal(true)}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5"
                >
                  Full Diagnostic <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div 
                  onClick={() => {
                    setActiveTab('roadmap');
                    setRoadmapSubTab('skill_gap_matrix');
                  }}
                  className={`p-2.5 rounded-xl border space-y-1.5 cursor-pointer transition ${isDarkMode ? 'bg-slate-950 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-mono font-semibold">SKILLS</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      <AnimatedScoreCounter value={pillars.skills} />%
                    </span>
                  </div>
                  <AnimatedProgressBar percentage={pillars.skills} colorClass="bg-emerald-500" />
                </div>

                <div 
                  onClick={() => {
                    setActiveTab('practice');
                    setPracticeSubTab('project_blueprints');
                  }}
                  className={`p-2.5 rounded-xl border space-y-1.5 cursor-pointer transition ${isDarkMode ? 'bg-slate-950 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-mono font-semibold">PROJECTS</span>
                    <span className="font-bold text-amber-400 font-mono">
                      <AnimatedScoreCounter value={pillars.projects} />%
                    </span>
                  </div>
                  <AnimatedProgressBar percentage={pillars.projects} colorClass="bg-amber-500" />
                </div>

                <div 
                  onClick={() => {
                    setActiveTab('analyze');
                    setAnalyzeSubTab('ats_resume');
                  }}
                  className={`p-2.5 rounded-xl border space-y-1.5 cursor-pointer transition ${isDarkMode ? 'bg-slate-950 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-mono font-semibold">RESUME</span>
                    <span className="font-bold text-indigo-400 font-mono">
                      <AnimatedScoreCounter value={pillars.resume} />%
                    </span>
                  </div>
                  <AnimatedProgressBar percentage={pillars.resume} colorClass="bg-indigo-500" />
                </div>

                <div 
                  onClick={() => {
                    setActiveTab('practice');
                    setPracticeSubTab('mock_interview');
                  }}
                  className={`p-2.5 rounded-xl border space-y-1.5 cursor-pointer transition ${isDarkMode ? 'bg-slate-950 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-mono font-semibold">INTERVIEW</span>
                    <span className="font-bold text-cyan-400 font-mono">
                      <AnimatedScoreCounter value={pillars.interview} />%
                    </span>
                  </div>
                  <AnimatedProgressBar percentage={pillars.interview} colorClass="bg-cyan-500" />
                </div>
              </div>
            </div>

            {/* 3. TOP SKILL GAP */}
            {readinessDiagnosis.criticalGaps.length > 0 && (
              <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-2 shadow-md`}>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-rose-400" /> Top Priority Skill Gap
                  </span>
                  <button
                    onClick={() => {
                      setActiveTab('roadmap');
                      setRoadmapSubTab('skill_gap_matrix');
                    }}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    View All Gaps &rarr;
                  </button>
                </div>

                <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-white">
                      {readinessDiagnosis.criticalGaps[0].skill}
                    </h4>
                    <span className="text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30">
                      High Impact
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {readinessDiagnosis.criticalGaps[0].whyCritical}
                  </p>
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Expected Readiness Gain: <strong className="text-emerald-400">+{readinessDiagnosis.criticalGaps[0].weight}%</strong>
                    </span>
                    <button
                      onClick={() => {
                        setActiveTab('roadmap');
                        setRoadmapSubTab('stages');
                      }}
                      className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      Start Learning <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 4. NEXT BEST ACTION */}
            <div 
              onClick={() => {
                setActiveTab('practice');
                setPracticeSubTab('project_blueprints');
              }}
              className="bg-indigo-950/40 border border-indigo-500/40 p-3.5 rounded-2xl flex items-center justify-between gap-2 cursor-pointer hover:border-indigo-500/70 transition group shadow-sm"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30 group-hover:scale-105 transition">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-indigo-300 block">
                    NEXT BEST ACTION
                  </span>
                  <p className="text-xs font-bold text-white truncate">
                    {readinessDiagnosis.nextBestAction.title}
                  </p>
                  <p className="text-[10px] text-slate-300 truncate">
                    {readinessDiagnosis.nextBestAction.expectedGain}
                  </p>
                </div>
              </div>
              <button className="text-[10px] text-indigo-200 font-bold flex items-center gap-0.5 bg-indigo-900/60 px-2.5 py-1.5 rounded-lg shrink-0 border border-indigo-500/40">
                Execute <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* 5. ROADMAP PROGRESS (Active Phase 1) */}
            {stages.length > 0 && (
              <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-3 shadow-md`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase">Learning Roadmap</span>
                    <h3 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} flex items-center gap-1.5`}>
                      <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Phase 1: {stages[0]?.name}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                    {roadmapPercent}% Overall
                  </span>
                </div>

                <div className="space-y-2">
                  {stages[0]?.tasks.slice(0, 3).map(task => (
                    <div
                      key={task.id}
                      onClick={() => toggleRoadmapTask(stages[0].id, task.id)}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition ${
                        task.completed
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                          : isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                        )}
                        <span className={`font-semibold ${task.completed ? 'line-through text-slate-400' : ''}`}>
                          {task.title}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 font-bold">
                        {task.estHours} hrs
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setActiveTab('roadmap');
                    setRoadmapSubTab('stages');
                  }}
                  className="w-full py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-center text-xs font-bold text-slate-300 hover:text-white transition"
                >
                  View Full Roadmap Stages &rarr;
                </button>
              </div>
            )}

            {/* 6. RECOMMENDED FIRST PROJECT */}
            {projectItems.length > 0 && (
              <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-2.5 shadow-md`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-amber-400 font-bold uppercase">Portfolio Blueprint</span>
                    <h3 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} flex items-center gap-1.5`}>
                      <Code className="w-3.5 h-3.5 text-amber-400" /> Recommended First Project
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {projectItems[0].difficulty} &bull; {projectItems[0].estimatedHours}h
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-extrabold text-white">
                    {projectItems[0].title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {projectItems[0].description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {projectItems[0].stack.map((tech, i) => (
                      <span key={i} className="text-[9px] font-mono bg-slate-900 border border-slate-800 text-indigo-300 px-1.5 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="p-2 bg-indigo-950/30 border border-indigo-500/20 rounded-lg text-[10px] text-indigo-200 mt-2">
                    <strong className="text-white">Resume Impact:</strong> {projectItems[0].resumeBullet}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('practice');
                    setPracticeSubTab('project_blueprints');
                  }}
                  className="w-full py-2 bg-indigo-600/20 border border-indigo-500/30 hover:bg-indigo-600/30 text-indigo-200 rounded-xl text-center text-xs font-bold transition"
                >
                  Open Project Blueprint Details &rarr;
                </button>
              </div>
            )}

            {/* 7. TODAY'S TASK */}
            {activeMission && (
              <TodayMissionCard
                mission={activeMission}
                onToggleComplete={handleToggleDailyMission}
                onNavigate={(route) => {
                  if (route === 'projects') {
                    setActiveTab('practice');
                    setPracticeSubTab('project_blueprints');
                  } else if (route === 'interview') {
                    setActiveTab('practice');
                    setPracticeSubTab('mock_interview');
                  } else if (route === 'analyze') {
                    setActiveTab('analyze');
                    setAnalyzeSubTab('ats_resume');
                  }
                }}
              />
            )}

            {/* 4 Quick Hub Launchers */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setActiveTab('tracker');
                  setTrackerSubTab('daily_planner');
                }}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition active:scale-95 ${
                  isDarkMode ? 'bg-slate-900 border-slate-800 hover:bg-slate-850' : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Daily Planner</h4>
                  <p className="text-[10px] text-slate-400">Time-boxed study blocks</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('analyze');
                  setAnalyzeSubTab('github_auditor');
                }}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition active:scale-95 ${
                  isDarkMode ? 'bg-slate-900 border-slate-800 hover:bg-slate-850' : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 border border-slate-700">
                  <Github className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>GitHub Auditor</h4>
                  <p className="text-[10px] text-slate-400">Score public repositories</p>
                </div>
              </button>
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* 2. ANALYZE TAB */}
        {/* ==================================================== */}
        {activeTab === 'analyze' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            
            {/* Sub-navigation Pills */}
            <div className={`flex p-1 rounded-xl border overflow-x-auto no-scrollbar gap-1 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              {[
                { id: 'profiler', label: 'Career Profiler' },
                { id: 'job_matcher', label: 'Job Matcher' },
                { id: 'ats_resume', label: 'ATS Resume' },
                { id: 'github_auditor', label: 'GitHub Audit' },
                { id: 'linkedin_optimizer', label: 'LinkedIn' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAnalyzeSubTab(tab.id as any)}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg whitespace-nowrap transition ${
                    analyzeSubTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* SubTab 1: Career Profiler */}
            {analyzeSubTab === 'profiler' && (
              <div className={`p-4 rounded-2xl border space-y-3.5 text-xs shadow-md ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} flex items-center gap-1.5`}>
                    <Cpu className="w-4 h-4 text-indigo-400" /> Candidate Profile & Target Career
                  </span>
                  <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-mono font-bold border border-indigo-500/20">
                    Active Context
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-1">Target Role</label>
                      <input
                        type="text"
                        value={analyzerForm.targetRole}
                        onChange={e => setAnalyzerForm({ ...analyzerForm, targetRole: e.target.value })}
                        className={`w-full rounded-xl px-2.5 py-1.5 text-xs border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-1">Target Company</label>
                      <input
                        type="text"
                        value={analyzerForm.targetCompany}
                        onChange={e => setAnalyzerForm({ ...analyzerForm, targetCompany: e.target.value })}
                        className={`w-full rounded-xl px-2.5 py-1.5 text-xs border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-1">College / University</label>
                      <input
                        type="text"
                        value={analyzerForm.college}
                        onChange={e => setAnalyzerForm({ ...analyzerForm, college: e.target.value })}
                        className={`w-full rounded-xl px-2.5 py-1.5 text-xs border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-1">Degree & Major</label>
                      <input
                        type="text"
                        value={analyzerForm.degree}
                        onChange={e => setAnalyzerForm({ ...analyzerForm, degree: e.target.value })}
                        className={`w-full rounded-xl px-2.5 py-1.5 text-xs border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-1">Current Technical Skills (Comma-separated)</label>
                    <input
                      type="text"
                      value={analyzerForm.skills}
                      onChange={e => setAnalyzerForm({ ...analyzerForm, skills: e.target.value })}
                      className={`w-full rounded-xl px-2.5 py-1.5 text-xs border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-1">GitHub User</label>
                      <input
                        type="text"
                        value={analyzerForm.github}
                        onChange={e => setAnalyzerForm({ ...analyzerForm, github: e.target.value })}
                        className={`w-full rounded-xl px-2.5 py-1.5 text-xs border outline-none font-mono ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-1">LinkedIn URL</label>
                      <input
                        type="text"
                        value={analyzerForm.linkedin}
                        onChange={e => setAnalyzerForm({ ...analyzerForm, linkedin: e.target.value })}
                        className={`w-full rounded-xl px-2.5 py-1.5 text-xs border outline-none font-mono ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-1">LeetCode User</label>
                      <input
                        type="text"
                        value={analyzerForm.leetcode}
                        onChange={e => setAnalyzerForm({ ...analyzerForm, leetcode: e.target.value })}
                        className={`w-full rounded-xl px-2.5 py-1.5 text-xs border outline-none font-mono ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Synchronize Profile & Dynamic Readiness Engine</span>
                  </button>
                </div>
              </div>
            )}

            {/* SubTab 2: Job Description Matcher */}
            {analyzeSubTab === 'job_matcher' && (
              <JobDescriptionAnalyzer
                userSkills={profile.currentSkills}
                targetRole={profile.targetRole}
                isDarkMode={isDarkMode}
                demoMode={demoMode}
                onAddSkillToPlan={(skill) => alert(`Added ${skill} to your personalized study planner.`)}
              />
            )}

            {/* SubTab 3: ATS Resume Scanner */}
            {analyzeSubTab === 'ats_resume' && (
              <ResumeAnalyzerView
                profile={profile}
                isDarkMode={isDarkMode}
                currentUserId={currentUser?.id || 'guest'}
                onUpdatePillarScore={(newScore) => {
                  setAtsScore(newScore);
                  setPillars(prev => ({
                    ...prev,
                    resume: newScore
                  }));
                }}
                onUpdateProfileSkills={(detectedSkills) => {
                  if (detectedSkills && detectedSkills.length > 0) {
                    setProfile(p => ({
                      ...p,
                      xp: p.xp + 100,
                      currentSkills: Array.from(new Set([...p.currentSkills, ...detectedSkills]))
                    }));
                  }
                }}
                onAddSkillToPlan={(skill) => {
                  setProfile(p => ({
                    ...p,
                    currentSkills: Array.from(new Set([...p.currentSkills, skill]))
                  }));
                }}
              />
            )}

            {/* SubTab 4: GitHub Auditor */}
            {analyzeSubTab === 'github_auditor' && (
              <GitHubAnalyzerView
                initialUsername={profile.github || 'alexchen-dev'}
                isDarkMode={isDarkMode}
                onUpdateGithubUsername={(u) => setProfile(p => ({ ...p, github: u }))}
              />
            )}

            {/* SubTab 5: LinkedIn Optimizer */}
            {analyzeSubTab === 'linkedin_optimizer' && (
              <LinkedInAnalyzerView
                initialProfileUrl={profile.linkedin || 'alex-chen-tech'}
                targetRole={profile.targetRole}
                isDarkMode={isDarkMode}
              />
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* 3. ROADMAP TAB */}
        {/* ==================================================== */}
        {activeTab === 'roadmap' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            
            {/* Sub-navigation */}
            <div className={`flex p-1 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <button
                onClick={() => setRoadmapSubTab('stages')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition ${
                  roadmapSubTab === 'stages' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Dynamic Plan ({roadmapPercent}%)
              </button>
              <button
                onClick={() => setRoadmapSubTab('skill_gap_matrix')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition ${
                  roadmapSubTab === 'skill_gap_matrix' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Skill Gap Matrix
              </button>
              <button
                onClick={() => setRoadmapSubTab('evidence_matrix')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition ${
                  roadmapSubTab === 'evidence_matrix' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Evidence Matrix
              </button>
            </div>

            {/* Stages View */}
            {roadmapSubTab === 'stages' && (
              <div className="space-y-2.5">
                {stages.map((stage, idx) => {
                  const stageCompleted = stage.tasks.every(t => t.completed);
                  const stageDoneCount = stage.tasks.filter(t => t.completed).length;

                  return (
                    <div key={stage.id} className={`p-3.5 rounded-2xl border space-y-2.5 shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                      <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                            stageCompleted 
                              ? 'bg-emerald-500 text-slate-950 font-black' 
                              : 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                          }`}>
                            {stageCompleted ? '✓' : idx + 1}
                          </div>
                          <div>
                            <h4 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stage.title}</h4>
                            <p className="text-[10px] text-slate-400">{stage.subtitle}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-300 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                          {stageDoneCount}/{stage.tasks.length}
                        </span>
                      </div>

                      {/* Interactive Tasks */}
                      <div className="space-y-1.5 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                        {stage.tasks.map(task => (
                          <div
                            key={task.id}
                            onClick={() => toggleRoadmapTask(stage.id, task.id)}
                            className="flex items-center gap-2 cursor-pointer group py-0.5"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 shrink-0" />
                            )}
                            <span className={`text-[11px] ${task.completed ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                              {task.title}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Stage Project Anchor */}
                      <div className="text-[10px] text-slate-400 bg-slate-950 p-2 rounded-xl flex items-center gap-1.5 border border-slate-800">
                        <Code className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate"><strong>Capstone:</strong> {stage.project}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Skill Gap Matrix */}
            {roadmapSubTab === 'skill_gap_matrix' && (
              <SkillGapMatrixView
                targetRole={profile.targetRole}
                userSkills={profile.currentSkills}
                isDarkMode={isDarkMode}
              />
            )}

            {/* Skill Evidence Matrix */}
            {roadmapSubTab === 'evidence_matrix' && (
              <SkillEvidenceMatrix
                skills={skillEvidence}
                targetRole={profile.targetRole}
                onUpdateSkillStatus={(id, newStatus) => {
                  setSkillEvidence(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
                  if (newStatus === 'strong') {
                    setPillars(p => ({ ...p, skills: Math.min(100, p.skills + 3) }));
                  }
                }}
              />
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* 4. PRACTICE TAB */}
        {/* ==================================================== */}
        {activeTab === 'practice' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            
            {/* Sub-navigation */}
            <div className={`flex p-1 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <button
                onClick={() => setPracticeSubTab('mock_interview')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition ${
                  practiceSubTab === 'mock_interview' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Mock Interview
              </button>
              <button
                onClick={() => setPracticeSubTab('project_blueprints')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition ${
                  practiceSubTab === 'project_blueprints' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Project Blueprints
              </button>
              <button
                onClick={() => setPracticeSubTab('learning_engine')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition ${
                  practiceSubTab === 'learning_engine' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Curriculum
              </button>
            </div>

            {/* Mock Interview */}
            {practiceSubTab === 'mock_interview' && (
              <div className="space-y-3.5 text-xs">
                <div className={`p-3.5 rounded-2xl border space-y-2.5 shadow-md ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} flex items-center gap-1.5`}>
                      <MessageSquare className="w-4 h-4 text-purple-400" /> 4-Dimension Interview Evaluation
                    </span>
                    <span className="text-[9px] bg-purple-500/20 text-purple-300 font-mono px-2 py-0.5 rounded-full font-bold">
                      {interviewTypeFilter} Round
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {(['Technical', 'HR', 'Behavioral'] as const).map(cat => (
                      <button
                        key={cat}
                        onClick={() => {
                          setInterviewTypeFilter(cat);
                          setActiveQuestionIdx(0);
                          setInterviewFeedback(null);
                          setCandidateAnswer('');
                        }}
                        className={`py-1.5 text-[10px] font-bold rounded-xl border transition ${
                          interviewTypeFilter === cat
                            ? 'bg-purple-600 border-purple-500 text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredQuestions[activeQuestionIdx] && (
                  <div className={`p-3.5 rounded-2xl border space-y-3 shadow-md ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div>
                      <h4 className={`text-xs font-bold leading-snug ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        "{filteredQuestions[activeQuestionIdx].question}"
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 bg-slate-950 p-2 rounded-xl border border-slate-800">
                        💡 <strong>Evaluator Focus:</strong> {filteredQuestions[activeQuestionIdx].context}
                      </p>
                    </div>

                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-1">Your Proposed Response:</label>
                      <textarea
                        rows={4}
                        value={candidateAnswer}
                        onChange={e => setCandidateAnswer(e.target.value)}
                        className={`w-full rounded-xl p-2.5 text-xs leading-relaxed outline-none border ${
                          isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-purple-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-600'
                        }`}
                        placeholder="State your answer with technical clarity or STAR format..."
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => setCandidateAnswer(filteredQuestions[activeQuestionIdx].sampleAnswer)}
                        className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold underline"
                      >
                        Load Benchmark Answer
                      </button>

                      <button
                        onClick={handleGradeInterviewAnswer}
                        disabled={isGrading || !candidateAnswer.trim()}
                        className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition disabled:opacity-50"
                      >
                        {isGrading ? 'Grading 4 Dimensions...' : 'Evaluate Response'}
                      </button>
                    </div>

                    {interviewFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-950 p-3.5 rounded-xl border border-purple-500/30 space-y-2.5"
                      >
                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                          <span className="text-[10px] font-bold text-white font-mono">Overall Evaluation</span>
                          <span className="text-base font-black text-emerald-400 font-mono">
                            {interviewFeedback.overallScore}/10
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                            <span className="text-slate-400 block">Correctness</span>
                            <span className="text-emerald-400 font-bold">{interviewFeedback.dimensions.correctness}/10</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                            <span className="text-slate-400 block">Communication</span>
                            <span className="text-cyan-400 font-bold">{interviewFeedback.dimensions.communication}/10</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                            <span className="text-slate-400 block">Technical Depth</span>
                            <span className="text-indigo-400 font-bold">{interviewFeedback.dimensions.depth}/10</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                            <span className="text-slate-400 block">Problem Solving</span>
                            <span className="text-purple-400 font-bold">{interviewFeedback.dimensions.problemSolving}/10</span>
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-300 space-y-1">
                          <p><strong className="text-emerald-400">Key Strengths:</strong> {interviewFeedback.strengths.join(', ')}</p>
                          <p><strong className="text-amber-400">Key Improvement:</strong> {interviewFeedback.mostImportantImprovement}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Gap-Bridging Project Blueprints */}
            {practiceSubTab === 'project_blueprints' && (
              <div className="space-y-3">
                {projectItems.map(proj => (
                  <div key={proj.id} className={`p-3.5 rounded-2xl border space-y-2.5 shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                            {proj.difficulty} &bull; {proj.duration}
                          </span>
                          {proj.bridgesGap && (
                            <span className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                              Bridges: {proj.bridgesGap}
                            </span>
                          )}
                        </div>
                        <h4 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{proj.title}</h4>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">{proj.description}</p>

                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-slate-400 font-mono">GOOGLE XYZ RESUME BULLET:</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(proj.resumeBullet);
                            setCopiedId(proj.id);
                            setTimeout(() => setCopiedId(null), 2000);
                          }}
                          className="text-[9px] text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 font-semibold"
                        >
                          {copiedId === proj.id ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                          {copiedId === proj.id ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-200 italic font-mono">"{proj.resumeBullet}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Learning Engine */}
            {practiceSubTab === 'learning_engine' && (
              <LearningEngineView
                targetRole={profile.targetRole}
                isDarkMode={isDarkMode}
                onAwardXP={handleAwardXP}
              />
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* 5. TRACKER TAB */}
        {/* ==================================================== */}
        {activeTab === 'tracker' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            
            {/* Sub-navigation */}
            <div className={`flex p-1 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <button
                onClick={() => setTrackerSubTab('daily_planner')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition ${
                  trackerSubTab === 'daily_planner' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Daily Planner
              </button>
              <button
                onClick={() => setTrackerSubTab('opportunities')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition ${
                  trackerSubTab === 'opportunities' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Opportunities ({opportunities.length})
              </button>
              <button
                onClick={() => setTrackerSubTab('pipeline')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition ${
                  trackerSubTab === 'pipeline' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Pipeline ({applications.length})
              </button>
            </div>

            {trackerSubTab === 'daily_planner' && (
              <DailyCareerPlannerView
                streak={profile.streak}
                isDarkMode={isDarkMode}
                onAwardXP={handleAwardXP}
              />
            )}

            {trackerSubTab === 'opportunities' && (
              <OpportunityMatchingView
                opportunities={opportunities}
                targetRole={profile.targetRole}
                onTrackApplication={handleTrackOpportunity}
                onAddCustomApp={() => setTrackerSubTab('pipeline')}
              />
            )}

            {trackerSubTab === 'pipeline' && (
              <ApplicationTrackerView
                applications={applications}
                onUpdateApplication={(updated) => setApplications(prev => prev.map(a => a.id === updated.id ? updated : a))}
                onDeleteApplication={(id) => setApplications(prev => prev.filter(a => a.id !== id))}
                onAddApplication={(newApp) => setApplications(prev => [newApp, ...prev])}
              />
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* 6. PROFILE TAB */}
        {/* ==================================================== */}
        {activeTab === 'profile' && (
          <div className="space-y-3.5 animate-in fade-in duration-150 text-xs">
            
            {profileSavedToast && (
              <div className="bg-emerald-500 text-slate-950 p-2.5 rounded-xl font-bold text-xs flex items-center justify-between shadow-lg">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Profile successfully saved!
                </span>
              </div>
            )}

            {/* Candidate Header Card */}
            <div className={`p-4 rounded-2xl border space-y-3 shadow-md ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-base shadow-lg shadow-indigo-500/20">
                  {profile.name ? profile.name.substring(0, 2).toUpperCase() : 'CP'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{profile.name || 'New Student'}</h3>
                  <p className="text-[11px] text-indigo-400 font-semibold truncate">{profile.targetRole} {profile.targetCompany ? `• ${profile.targetCompany}` : ''}</p>
                  <p className="text-[10px] text-slate-400 truncate">{profile.college || 'Student Profile'} • {profile.degree}</p>
                </div>
              </div>

              {currentUser && (
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <div className="truncate">
                    <span className="font-semibold text-slate-300">Account: </span>
                    <span className="font-mono text-slate-400">{currentUser.email}</span>
                  </div>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">
                    Active Session
                  </span>
                </div>
              )}
            </div>

            {/* Gemini API Key Card */}
            <div className={`p-4 rounded-2xl border space-y-3 shadow-md ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                    <Key className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Google Gemini API Configuration</h4>
                    <p className="text-[10px] text-slate-400">Enables live ATS analysis, mock interview grading & copilot</p>
                  </div>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                  isOnline 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {isOnline ? '● ONLINE (Live)' : '○ OFFLINE (Demo Data)'}
                </span>
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 block mb-1">Google AI Studio API Key (AIza...):</label>
                <div className="flex gap-1.5">
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={e => setApiKeyInput(e.target.value)}
                    placeholder="Enter AIzaSy..."
                    className={`flex-1 rounded-xl px-3 py-1.5 text-xs font-mono border outline-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                    }`}
                  />
                  <button
                    onClick={handleSaveApiKey}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition shadow-sm"
                  >
                    {isApiKeySaved ? 'Saved!' : 'Save Key'}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Data & Privacy Triggers */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowOnboarding(true)}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 text-left transition ${
                  isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/40' : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Compass className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <h4 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Discovery Wizard</h4>
                  <p className="text-[10px] text-slate-400">Re-run onboarding flow</p>
                </div>
              </button>

              <button
                onClick={handleExportData}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 text-left transition ${
                  isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/40' : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Download className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <h4 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Export Data</h4>
                  <p className="text-[10px] text-slate-400">Download JSON snapshot</p>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setShowPrivacyModal(true)}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 text-left transition ${
                  isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/40' : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <h4 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Privacy & Telemetry Controls</h4>
                  <p className="text-[10px] text-slate-400">Manage local storage, cookies & privacy consent</p>
                </div>
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleLogout}
                  className="p-3 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-400" />
                  <span>Log Out</span>
                </button>

                <button
                  onClick={handleResetAllData}
                  className="p-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Hard Reset All</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Fresh User Onboarding & Discovery Wizard Modal */}
      <FreshUserOnboardingModal
        isOpen={showOnboarding}
        isDarkMode={isDarkMode}
        onCompleteOnboarding={handleCompleteOnboarding}
        onSkipOnboarding={handleSkipOnboarding}
      />

      {/* Comprehensive 9-Pillar Diagnosis Modal */}
      <ComprehensiveReadinessModal
        isOpen={showDiagnosisModal}
        onClose={() => setShowDiagnosisModal(false)}
        overallScore={readinessOverall}
        targetRole={profile.targetRole}
        breakdown={readinessDiagnosis.breakdown}
        weakestArea={readinessDiagnosis.weakestArea}
        nextBestAction={readinessDiagnosis.nextBestAction}
        isDarkMode={isDarkMode}
        onNavigateToTab={(tab) => {
          setActiveTab(tab as any);
        }}
      />

      {/* Privacy Settings Modal */}
      <PrivacySettingsModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        onClearResume={() => setResumeText('')}
        onResetAllData={handleResetAllData}
        onExportData={handleExportData}
      />

      {/* Persistent AI Career Assistant Copilot Modal */}
      <AiCareerAssistantModal
        isOpen={showAiCopilot}
        onClose={() => setShowAiCopilot(false)}
        targetRole={profile.targetRole}
        candidateName={profile.name}
        currentSkills={profile.currentSkills}
        isDarkMode={isDarkMode}
        onNavigateToTab={(tab) => {
          setActiveTab(tab as any);
        }}
      />

      {/* Brand Identity & Logo System Showcase Modal */}
      <CareerPilotBrandShowcase
        isOpen={showBrandShowcase}
        onClose={() => setShowBrandShowcase(false)}
      />

      {/* Floating AI Copilot Trigger Button */}
      <button
        onClick={() => setShowAiCopilot(true)}
        className="absolute right-4 bottom-14 z-30 w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-xl shadow-indigo-600/40 border border-white/20 flex items-center justify-center hover:scale-105 active:scale-95 transition"
        title="Open AI Career Copilot"
      >
        <Sparkles className="w-5 h-5 text-amber-300" />
      </button>

      {/* Bottom Navigation */}
      <nav className={`${isDarkMode ? 'bg-slate-950 border-slate-800/80' : 'bg-white border-slate-200'} border-t px-2 py-1.5 flex justify-around items-center shrink-0 z-20`}>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl transition ${
            activeTab === 'dashboard' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="text-[9px]">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('analyze')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl transition ${
            activeTab === 'analyze' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="text-[9px]">Analyze</span>
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl transition ${
            activeTab === 'roadmap' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="text-[9px]">Roadmap</span>
        </button>

        <button
          onClick={() => setActiveTab('practice')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl transition ${
            activeTab === 'practice' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code className="w-4 h-4" />
          <span className="text-[9px]">Practice</span>
        </button>

        <button
          onClick={() => setActiveTab('tracker')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl transition ${
            activeTab === 'tracker' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span className="text-[9px]">Tracker</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl transition ${
            activeTab === 'profile' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span className="text-[9px]">Profile</span>
        </button>
      </nav>
    </div>
  );
};
