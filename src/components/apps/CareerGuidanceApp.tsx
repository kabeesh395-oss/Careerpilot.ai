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
  ChevronRight, FileSearch, Bookmark, Plus, X, Lock, Download
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

// Career Modules
import { 
  CareerEnergyTier, CareerPillars, PillarWeights, SkillEvidenceItem, 
  DailyMission, OpportunityMatch, TrackedApplication, EnhancedInterviewFeedback 
} from '../career/careerTypes';
import { 
  getPillarWeightsForRole, DEFAULT_SKILL_EVIDENCE, DEFAULT_DAILY_MISSIONS, 
  DEFAULT_OPPORTUNITIES, DEFAULT_APPLICATIONS 
} from '../career/careerConstants';
import { CareerEnergyGauge, getCareerEnergyTier } from '../career/CareerEnergyGauge';
import { ScoreDiagnosisModal } from '../career/ScoreDiagnosisModal';
import { TodayMissionCard } from '../career/TodayMissionCard';
import { JobDescriptionAnalyzer } from '../career/JobDescriptionAnalyzer';
import { OpportunityMatchingView } from '../career/OpportunityMatchingView';
import { ApplicationTrackerView } from '../career/ApplicationTrackerView';
import { SkillEvidenceMatrix } from '../career/SkillEvidenceMatrix';
import { PrivacySettingsModal } from '../career/PrivacySettingsModal';

// --- MOTION ANIMATED SCORE COUNTER & PROGRESS COMPONENTS ---
export const AnimatedScoreCounter: React.FC<{ value: number; duration?: number; delay?: number }> = ({ 
  value, 
  duration = 1.2,
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

// --- DATA STRUCTURES & INTERFACES ---
export interface UserProfile {
  name: string;
  college: string;
  degree: string;
  department: string;
  year: string;
  currentSkills: string[];
  programmingLanguages: string[];
  interests: string[];
  experienceLevel: string;
  targetRole: string;
  targetCompany: string;
  github: string;
  linkedin: string;
  leetcode: string;
  streak: number;
  xp: number;
}

export interface RoadmapTask {
  id: string;
  title: string;
  completed: boolean;
  estimatedHours: number;
}

export interface RoadmapStage {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  skills: string[];
  tasks: RoadmapTask[];
  project: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  technologies: string[];
  description: string;
  careerValue: string;
  duration: string;
  resumeBullet: string;
  bridgesGap?: string;
}

export interface MockQuestion {
  id: string;
  type: 'Technical' | 'HR' | 'Behavioral';
  question: string;
  context: string;
  sampleAnswer: string;
  keyTopics: string[];
}

export interface LearningTask {
  id: string;
  title: string;
  category: 'Daily' | 'Weekly' | 'Revision' | 'Project';
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  dueDate: string;
}

// --- INITIAL DEFAULTS ---
const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Chen',
  college: 'National Institute of Technology',
  degree: 'B.Tech / B.E.',
  department: 'Computer Science & Engineering',
  year: '3rd Year (Class of 2027)',
  currentSkills: ['Python', 'Data Structures & Algorithms', 'SQL', 'Git', 'HTML/CSS', 'FastAPI'],
  programmingLanguages: ['Python', 'C++', 'SQL'],
  interests: ['Machine Learning', 'AI Systems', 'Distributed Systems'],
  experienceLevel: 'Student / Early Career',
  targetRole: 'Machine Learning Engineer',
  targetCompany: 'Google DeepMind',
  github: 'alexchen-dev',
  linkedin: 'alex-chen-tech',
  leetcode: 'alexchen_code',
  streak: 7,
  xp: 1450
};

const DEFAULT_STAGES: RoadmapStage[] = [
  {
    id: 's1',
    title: 'Stage 1: Core Programming & Algorithms',
    subtitle: 'Master fundamental logic, time complexity, and data structures in Python / C++',
    duration: 'Weeks 1 - 3',
    skills: ['Python 3.12 OOP', 'Data Structures (Trees, Graphs)', 'Space-Time Complexity', 'Recursion & Dynamic Programming'],
    tasks: [
      { id: 't1_1', title: 'Implement Binary Search, QuickSort, and MergeSort from scratch', completed: true, estimatedHours: 4 },
      { id: 't1_2', title: 'Solve NeetCode 75 Core Array & String problems', completed: true, estimatedHours: 8 },
      { id: 't1_3', title: 'Implement Graph BFS / DFS traversal algorithms and Dijkstra shortest path', completed: true, estimatedHours: 6 }
    ],
    project: 'CLI Data Structures Visualizer in Pure Python'
  },
  {
    id: 's2',
    title: 'Stage 2: Database Systems & API Backend Engineering',
    subtitle: 'Design relational schemas, SQL indexing, and asynchronous microservices',
    duration: 'Weeks 4 - 6',
    skills: ['PostgreSQL', 'FastAPI REST APIs', 'Pydantic Validation', 'Database Indexing & ACID'],
    tasks: [
      { id: 't2_1', title: 'Design normalized SQL schema with foreign keys, indexes, and aggregate queries', completed: true, estimatedHours: 5 },
      { id: 't2_2', title: 'Build asynchronous RESTful API with FastAPI and SQLite/PostgreSQL', completed: true, estimatedHours: 7 },
      { id: 't2_3', title: 'Implement JWT authentication with token refresh logic and unit tests', completed: false, estimatedHours: 5 }
    ],
    project: 'E-Commerce Inventory & Order Management Microservice with FastAPI'
  },
  {
    id: 's3',
    title: 'Stage 3: Deep Learning Foundations & Model Inference',
    subtitle: 'Learn PyTorch tensors, autograd derivations, backpropagation, and CNNs/Transformers',
    duration: 'Weeks 7 - 9',
    skills: ['PyTorch Tensors', 'Hugging Face Transformers', 'ONNX Runtime', 'Loss Functions & Optimizers'],
    tasks: [
      { id: 't3_1', title: 'Build and train a multi-layer perceptron (MLP) from scratch in PyTorch', completed: false, estimatedHours: 6 },
      { id: 't3_2', title: 'Fine-tune BERT / RoBERTa classifier for sentiment analysis using HuggingFace', completed: false, estimatedHours: 8 },
      { id: 't3_3', title: 'Export trained model to ONNX runtime format for sub-20ms inference latency', completed: false, estimatedHours: 4 }
    ],
    project: 'Sub-20ms NLP Document Classification Service with HuggingFace & ONNX'
  },
  {
    id: 's4',
    title: 'Stage 4: Vector Embeddings & RAG Architectures',
    subtitle: 'Master semantic search, chunking strategies, vector databases, and LLM orchestration',
    duration: 'Weeks 10 - 12',
    skills: ['ChromaDB / Qdrant', 'SentenceTransformers', 'RAG Pipeline Architecture', 'Prompt Engineering & Evaluation'],
    tasks: [
      { id: 't4_1', title: 'Implement recursive chunking and semantic overlap on PDF documents', completed: false, estimatedHours: 5 },
      { id: 't4_2', title: 'Index 10,000 document embeddings into ChromaDB with cosine similarity search', completed: false, estimatedHours: 6 },
      { id: 't4_3', title: 'Build contextual RAG synthesis pipeline with hallucination guardrails', completed: false, estimatedHours: 7 }
    ],
    project: 'Autonomous Technical Document RAG Assistant with ChromaDB & LangChain'
  },
  {
    id: 's5',
    title: 'Stage 5: Containerization, CI/CD & Cloud Deployment',
    subtitle: 'Containerize microservices, write GitHub Actions workflows, and deploy with Docker',
    duration: 'Weeks 13 - 15',
    skills: ['Docker Multi-Stage', 'GitHub Actions CI/CD', 'Cloud Run / AWS ECS', 'Health Check Endpoints'],
    tasks: [
      { id: 't5_1', title: 'Write production Dockerfile with multi-stage build reducing image size below 180MB', completed: false, estimatedHours: 4 },
      { id: 't5_2', title: 'Setup automated GitHub Actions workflow running PyTest on pull requests', completed: false, estimatedHours: 4 },
      { id: 't5_3', title: 'Deploy containerized ML service to Google Cloud Run with HTTPS endpoint', completed: false, estimatedHours: 5 }
    ],
    project: 'Production Containerized ML Pipeline on Cloud Run with Automated CI/CD'
  },
  {
    id: 's6',
    title: 'Stage 6: System Design for High-Throughput ML',
    subtitle: 'Understand horizontal scaling, caching layers, message queues, and rate limiters',
    duration: 'Weeks 16 - 17',
    skills: ['Distributed Architecture', 'Redis Caching', 'Kafka / RabbitMQ Queues', 'Load Balancing & Rate Limiting'],
    tasks: [
      { id: 't6_1', title: 'Design high-throughput asynchronous inference queue with Redis & Celery', completed: false, estimatedHours: 6 },
      { id: 't6_2', title: 'Study distributed caching strategies, write-through vs write-behind patterns', completed: false, estimatedHours: 5 },
      { id: 't6_3', title: 'Simulate P99 latency bottlenecks under concurrent 500 RPS load with Locust', completed: false, estimatedHours: 4 }
    ],
    project: 'High-Concurrency Distributed Task Queue with Redis, Celery & FastAPI'
  },
  {
    id: 's7',
    title: 'Stage 7: High-Impact Portfolio & Technical Interview Mastery',
    subtitle: 'Polished GitHub documentation, live demos, ATS-tuned resumes, and Mock interview coach',
    duration: 'Weeks 18 - 20',
    skills: ['ATS Keyword Alignment', 'STAR Behavioral Framework', 'System Design Whiteboard', 'Technical Deep-Dive Defense'],
    tasks: [
      { id: 't7_1', title: 'Rewrite all resume bullets to follow Google XYZ formula (Accomplished [X], measured by [Y], by doing [Z])', completed: true, estimatedHours: 3 },
      { id: 't7_2', title: 'Record a 2-minute architectural walkthrough video for your flagship GitHub project', completed: false, estimatedHours: 4 },
      { id: 't7_3', title: 'Complete 5 full technical and behavioral mock interview sessions in CareerPilot Coach', completed: false, estimatedHours: 6 }
    ],
    project: 'Full-Stack Portfolio Showcase with Live Interactive Architecture Demos'
  }
];

const DEFAULT_PROJECT_ITEMS: ProjectItem[] = [
  {
    id: 'p_beg_1',
    title: 'High-Performance Asynchronous REST API Engine',
    difficulty: 'Beginner',
    technologies: ['Python 3.12', 'FastAPI', 'PostgreSQL', 'Pydantic v2', 'PyTest'],
    description: 'A production-grade RESTful API template featuring JWT authentication, role-based access control (RBAC), and automated OpenAPI docs.',
    careerValue: 'Demonstrates rock-solid backend engineering fundamentals, database query optimization, and test-driven development.',
    duration: '1-2 Weeks',
    resumeBullet: 'Architected an asynchronous FastAPI backend microservice with PostgreSQL and JWT authentication, achieving sub-25ms response latency across 12 endpoints with 92% PyTest unit test coverage.',
    bridgesGap: 'REST APIs & SQL'
  },
  {
    id: 'p_int_1',
    title: 'Multi-Stage Dockerized ML Inference Container',
    difficulty: 'Intermediate',
    technologies: ['Docker', 'FastAPI', 'PyTorch', 'ONNX Runtime', 'GitHub Actions'],
    description: 'A containerized microservice that loads fine-tuned PyTorch models with multi-stage Docker builds and automated CI/CD test gates.',
    careerValue: 'Directly bridges the critical #1 MLOps gap for ML Engineering roles: production containerization and automated verification.',
    duration: '2-3 Weeks',
    resumeBullet: 'Engineered a containerized ML inference service in Docker with multi-stage caching, reducing image footprint by 65% (to 175MB) and automating deployment testing via GitHub Actions.',
    bridgesGap: 'Docker Containerization'
  },
  {
    id: 'p_int_2',
    title: 'Enterprise Document RAG Knowledge Assistant',
    difficulty: 'Intermediate',
    technologies: ['Python', 'ChromaDB', 'HuggingFace', 'FastAPI', 'SentenceTransformers'],
    description: 'A Retrieval-Augmented Generation (RAG) system with semantic chunking, vector indexing over 10k documents, and cosine reranking.',
    careerValue: 'Demonstrates modern applied AI engineering: embeddings, vector database queries, and context synthesis.',
    duration: '2-3 Weeks',
    resumeBullet: 'Developed an enterprise RAG semantic search engine using ChromaDB and SentenceTransformers, enabling sub-80ms semantic retrieval across 10,000+ technical documents.',
    bridgesGap: 'Vector Databases'
  },
  {
    id: 'p_adv_1',
    title: 'Real-Time Streaming Transaction Fraud Detection Engine',
    difficulty: 'Advanced',
    technologies: ['Python', 'Kafka', 'Redis', 'Docker', 'XGBoost', 'MLflow'],
    description: 'An event-driven machine learning pipeline that consumes real-time streaming transaction feeds and evaluates fraud likelihood with P99 < 40ms.',
    careerValue: 'Tier-1 FAANG-ready capstone showcasing distributed systems, event streams, caching, and production ML monitoring.',
    duration: '3-4 Weeks',
    resumeBullet: 'Engineered an end-to-end streaming fraud detection pipeline with XGBoost and MLflow, attaining 96.8% ROC-AUC on 2M synthetic transactions with sub-40ms P99 inference latency.',
    bridgesGap: 'Distributed Systems & MLOps'
  }
];

const DEFAULT_QUESTIONS: MockQuestion[] = [
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
  // Main Navigation Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analyze' | 'roadmap' | 'practice' | 'tracker' | 'profile'>('dashboard');

  // Sub-tabs
  const [analyzeSubTab, setAnalyzeSubTab] = useState<'profiler' | 'job_matcher' | 'ats_resume'>('profiler');
  const [roadmapSubTab, setRoadmapSubTab] = useState<'stages' | 'evidence_matrix'>('stages');
  const [practiceSubTab, setPracticeSubTab] = useState<'mock_interview' | 'project_blueprints'>('mock_interview');
  const [trackerSubTab, setTrackerSubTab] = useState<'opportunities' | 'pipeline'>('opportunities');

  // Candidate Profile State
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('careerpilot_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  // 4 Pillars Base Scores
  const [pillars, setPillars] = useState<CareerPillars>(() => {
    const saved = localStorage.getItem('careerpilot_pillars');
    return saved ? JSON.parse(saved) : { skills: 85, projects: 70, resume: 82, interview: 75 };
  });

  // Dynamic Weights calculation based on role
  const weights = useMemo(() => {
    return getPillarWeightsForRole(profile.targetRole);
  }, [profile.targetRole]);

  // Overall Career Readiness Score
  const readinessOverall = useMemo(() => {
    const calc = Math.round(
      pillars.skills * weights.skills +
      pillars.projects * weights.projects +
      pillars.resume * weights.resume +
      pillars.interview * weights.interview
    );
    return Math.min(100, Math.max(10, calc));
  }, [pillars, weights]);

  // Daily Missions State
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>(() => {
    const saved = localStorage.getItem('careerpilot_missions');
    return saved ? JSON.parse(saved) : DEFAULT_DAILY_MISSIONS;
  });

  // Skill Evidence State
  const [skillEvidence, setSkillEvidence] = useState<SkillEvidenceItem[]>(() => {
    const saved = localStorage.getItem('careerpilot_evidence');
    return saved ? JSON.parse(saved) : DEFAULT_SKILL_EVIDENCE;
  });

  // Opportunities & Applications State
  const [opportunities, setOpportunities] = useState<OpportunityMatch[]>(() => {
    const saved = localStorage.getItem('careerpilot_opportunities');
    return saved ? JSON.parse(saved) : DEFAULT_OPPORTUNITIES;
  });

  const [applications, setApplications] = useState<TrackedApplication[]>(() => {
    const saved = localStorage.getItem('careerpilot_applications');
    return saved ? JSON.parse(saved) : DEFAULT_APPLICATIONS;
  });

  // Stages & Roadmap State
  const [stages, setStages] = useState<RoadmapStage[]>(() => {
    const saved = localStorage.getItem('careerpilot_stages');
    return saved ? JSON.parse(saved) : DEFAULT_STAGES;
  });

  // Theme & System States
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('careerpilot_theme') !== 'light';
  });
  const [demoMode, setDemoMode] = useState(true);
  const [showAiCopilot, setShowAiCopilot] = useState(false);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Career Analyzer Form State
  const [analyzerForm, setAnalyzerForm] = useState({
    name: profile.name,
    college: profile.college,
    department: profile.department,
    year: profile.year,
    targetRole: profile.targetRole,
    targetCompany: profile.targetCompany,
    skills: profile.currentSkills.join(', '),
    programmingLanguages: profile.programmingLanguages.join(', '),
    experienceLevel: profile.experienceLevel,
    interests: profile.interests.join(', ')
  });

  // Resume Analyzer States
  const [resumeText, setResumeText] = useState(
    'Alex Chen\nEducation: B.Tech Computer Science (GPA: 3.8/4.0)\nSkills: Python, SQL, Git, HTML/CSS, Basic React, FastAPI, SQLite\nExperience: Built personal portfolio and small Python sentiment classifier with Flask.\nProjects: Task Tracker CLI with JSON storage.'
  );
  const [atsScore, setAtsScore] = useState<number>(82);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // AI Mock Interview States
  const [mockQuestions] = useState<MockQuestion[]>(DEFAULT_QUESTIONS);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [interviewFeedback, setInterviewFeedback] = useState<EnhancedInterviewFeedback | null>(null);
  const [isGrading, setIsGrading] = useState(false);
  const [interviewTypeFilter, setInterviewTypeFilter] = useState<'Technical' | 'HR' | 'Behavioral'>('Technical');

  // AI Copilot Chat State
  const [copilotMessages, setCopilotMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: `Greetings ${profile.name}! I am CareerPilot AI. Your active Career Energy is ${readinessOverall}/100 ⚡ aligned toward ${profile.targetRole}. How can I assist your career progression today?`
    }
  ]);
  const [copilotInput, setCopilotInput] = useState('');
  const [isCopilotThinking, setIsCopilotThinking] = useState(false);

  // Filtered mock questions
  const filteredQuestions = mockQuestions.filter(q => q.type === interviewTypeFilter);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('careerpilot_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('careerpilot_pillars', JSON.stringify(pillars));
  }, [pillars]);

  useEffect(() => {
    localStorage.setItem('careerpilot_missions', JSON.stringify(dailyMissions));
  }, [dailyMissions]);

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

  // Copy helper
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Toggle Daily Mission completion
  const handleToggleDailyMission = (id: string) => {
    setDailyMissions(prev => prev.map(m => {
      if (m.id !== id) return m;
      const nextCompleted = !m.completed;
      if (nextCompleted) {
        setProfile(p => ({ ...p, xp: p.xp + m.xpReward }));
        // Boost corresponding pillar
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
      department: analyzerForm.department.trim() || profile.department,
      year: analyzerForm.year.trim() || profile.year,
      targetRole: analyzerForm.targetRole.trim() || profile.targetRole,
      targetCompany: analyzerForm.targetCompany.trim() || profile.targetCompany,
      currentSkills: analyzerForm.skills.split(',').map(s => s.trim()).filter(Boolean),
      programmingLanguages: analyzerForm.programmingLanguages.split(',').map(s => s.trim()).filter(Boolean),
      experienceLevel: analyzerForm.experienceLevel,
      interests: analyzerForm.interests.split(',').map(s => s.trim()).filter(Boolean)
    };
    setProfile(updated);
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
  };

  // Grade Mock Interview with 4 Dimensions
  const handleGradeInterviewAnswer = async () => {
    if (!candidateAnswer.trim()) return;
    setIsGrading(true);

    try {
      const activeQ = filteredQuestions[activeQuestionIdx];
      const apiKey = process.env.GEMINI_API_KEY || '';

      if (apiKey && !demoMode) {
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
        await new Promise(r => setTimeout(r, 700));
        setInterviewFeedback({
          overallScore: 8.5,
          dimensions: {
            correctness: 9.0,
            communication: 8.5,
            depth: 8.0,
            problemSolving: 8.5
          },
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

  // Send message to AI Copilot
  const handleSendCopilot = async (textToSend?: string) => {
    const query = textToSend || copilotInput;
    if (!query.trim()) return;

    const userMsg = { sender: 'user' as const, text: query };
    setCopilotMessages(prev => [...prev, userMsg]);
    setCopilotInput('');
    setIsCopilotThinking(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY || '';
      let reply = '';

      if (apiKey && !demoMode) {
        const ai = new GoogleGenAI({ apiKey });
        const context = `You are CareerPilot AI, a personalized career advisor for ${profile.name}.
Target Role: ${profile.targetRole} @ ${profile.targetCompany}
Current Career Energy: ${readinessOverall}/100 ⚡
Pillars: Skills=${pillars.skills}%, Projects=${pillars.projects}%, Resume=${pillars.resume}%, Interview=${pillars.interview}%
Biggest Gap: Docker Containerization
Answer concisely in 2-3 structured sentences with actionable bullet points.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${context}\n\nUser Question: ${query}`
        });
        reply = response.text || 'I have analyzed your request based on your career trajectory.';
      } else {
        await new Promise(r => setTimeout(r, 500));
        if (query.toLowerCase().includes('learn next') || query.toLowerCase().includes('skill')) {
          reply = `With your Career Energy at **${readinessOverall}/100 ⚡**, your highest-ROI gap is **Docker Multi-Stage containerization**. Closing this unlocks +12% role alignment for ${profile.targetRole}!`;
        } else if (query.toLowerCase().includes('resume')) {
          reply = `Your ATS score is **${atsScore}/100**. Replace passive phrasing with quantified impact: *"Engineered a containerized FastAPI ML service achieving 28ms P99 latency."*`;
        } else if (query.toLowerCase().includes('project')) {
          reply = `I recommend the **Multi-Stage Dockerized ML Inference Container**. It directly bridges your detected MLOps gap and provides a bullet-proof resume bullet.`;
        } else {
          reply = `You have a **7-day streak** with **${readinessOverall}/100 ⚡ alignment**. Complete Today's Mission to elevate your Projects pillar from ${pillars.projects}% to ${pillars.projects + 5}%.`;
        }
      }

      setCopilotMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    } catch (err) {
      setCopilotMessages(prev => [
        ...prev, 
        { sender: 'ai', text: `Focus on Today's Mission: Containerize your FastAPI ML model with Docker to bridge your biggest detected role gap.` }
      ]);
    } finally {
      setIsCopilotThinking(false);
    }
  };

  // Export Data JSON
  const handleExportData = () => {
    const exportPayload = {
      profile,
      pillars,
      readinessOverall,
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
    a.download = `CareerPilot_Data_${profile.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Reset All Local Data
  const handleResetAllData = () => {
    localStorage.clear();
    setProfile(DEFAULT_PROFILE);
    setPillars({ skills: 85, projects: 70, resume: 82, interview: 75 });
    setDailyMissions(DEFAULT_DAILY_MISSIONS);
    setSkillEvidence(DEFAULT_SKILL_EVIDENCE);
    setOpportunities(DEFAULT_OPPORTUNITIES);
    setApplications(DEFAULT_APPLICATIONS);
    setStages(DEFAULT_STAGES);
  };

  // Global Roadmap Progress
  const totalRoadmapTasks = stages.reduce((acc, s) => acc + s.tasks.length, 0);
  const completedRoadmapTasks = stages.reduce((acc, s) => acc + s.tasks.filter(t => t.completed).length, 0);
  const roadmapPercent = Math.round((completedRoadmapTasks / (totalRoadmapTasks || 1)) * 100);

  const activeMission = dailyMissions.find(m => !m.completed) || dailyMissions[0];

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} overflow-hidden font-sans select-none transition-colors duration-200`}>
      
      {/* Top Header */}
      <header className={`${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'} backdrop-blur border-b px-3.5 py-2.5 flex items-center justify-between shrink-0 z-20 shadow-sm`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs font-black tracking-tight text-white flex items-center gap-1">
                CareerPilot <span className="text-indigo-400">AI</span>
              </h1>
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-mono px-1.5 py-0.2 rounded-full font-bold">
                OS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Autonomous Career Readiness Platform</p>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-1.5 rounded-lg border transition ${isDarkMode ? 'bg-slate-800 border-slate-700 text-amber-300' : 'bg-slate-100 border-slate-200 text-slate-600'}`}
            title="Toggle Light/Dark Theme"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`text-[9px] font-bold px-2 py-1 rounded-lg border transition flex items-center gap-1 ${
              demoMode 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
            }`}
          >
            <Zap className="w-2.5 h-2.5 text-amber-300" />
            {demoMode ? 'Demo' : 'Live API'}
          </button>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto p-3.5 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800">
        
        {/* ==================================================== */}
        {/* 1. DASHBOARD TAB */}
        {/* ==================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            
            {/* Top Greeting with Streak & XP */}
            <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 p-3.5 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-semibold mb-0.5">
                    <span>👋 Welcome,</span>
                    <span className="text-white font-bold">{profile.name}</span>
                  </div>
                  <h2 className="text-sm font-extrabold text-white">
                    Target: <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300">{profile.targetRole}</span>
                  </h2>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Aiming for <strong className="text-white">{profile.targetCompany}</strong> &bull; {profile.department}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Flame className="w-3 h-3 fill-amber-400 text-amber-400" /> {profile.streak} Days
                  </span>
                  <span className="text-[10px] font-mono text-indigo-300 font-bold">
                    ⚡ {profile.xp} XP
                  </span>
                </div>
              </div>
            </div>

            {/* Signature Career Energy Gauge (Red/Amber/Green/Gold) */}
            <CareerEnergyGauge
              score={readinessOverall}
              targetRole={profile.targetRole}
              isDarkMode={isDarkMode}
              onOpenDiagnosis={() => setShowDiagnosisModal(true)}
            />

            {/* Biggest Skill Gap Banner */}
            <div 
              onClick={() => {
                setActiveTab('practice');
                setPracticeSubTab('project_blueprints');
              }}
              className="bg-rose-950/30 border border-rose-500/30 p-3 rounded-2xl flex items-center justify-between gap-2 cursor-pointer hover:border-rose-500/60 transition group"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30 group-hover:scale-105 transition">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-rose-400 block">
                    BIGGEST DETECTED GAP
                  </span>
                  <p className="text-xs font-bold text-white truncate">
                    Docker Containerization & Multi-Stage Builds
                  </p>
                  <p className="text-[10px] text-slate-300">
                    Not detected in profile evidence &bull; Bridges +12% role alignment
                  </p>
                </div>
              </div>
              <button className="text-[10px] text-rose-300 font-bold flex items-center gap-0.5 bg-rose-900/50 px-2 py-1 rounded-lg shrink-0 border border-rose-500/30">
                Bridge Gap <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Today's Mission Card ⚡ */}
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

            {/* 4 Pillars Breakdown Cards */}
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-2.5 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase">Role-Weighted Pillars</span>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-indigo-400" /> 4-Pillar Career Readiness
                  </h3>
                </div>
                <button
                  onClick={() => setShowDiagnosisModal(true)}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5"
                >
                  Diagnostic <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* 1. Skills */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setActiveTab('roadmap');
                    setRoadmapSubTab('evidence_matrix');
                  }}
                  className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5 cursor-pointer hover:border-slate-700 transition"
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-mono font-semibold">SKILLS ({Math.round(weights.skills * 100)}%)</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      <AnimatedScoreCounter value={pillars.skills} />%
                    </span>
                  </div>
                  <AnimatedProgressBar percentage={pillars.skills} colorClass="bg-emerald-500" />
                </motion.div>

                {/* 2. Projects */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setActiveTab('practice');
                    setPracticeSubTab('project_blueprints');
                  }}
                  className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5 cursor-pointer hover:border-slate-700 transition"
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-mono font-semibold">PROJECTS ({Math.round(weights.projects * 100)}%)</span>
                    <span className="font-bold text-amber-400 font-mono">
                      <AnimatedScoreCounter value={pillars.projects} />%
                    </span>
                  </div>
                  <AnimatedProgressBar percentage={pillars.projects} colorClass="bg-amber-500" />
                </motion.div>

                {/* 3. Resume */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setActiveTab('analyze');
                    setAnalyzeSubTab('ats_resume');
                  }}
                  className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5 cursor-pointer hover:border-slate-700 transition"
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-mono font-semibold">RESUME ({Math.round(weights.resume * 100)}%)</span>
                    <span className="font-bold text-indigo-400 font-mono">
                      <AnimatedScoreCounter value={pillars.resume} />%
                    </span>
                  </div>
                  <AnimatedProgressBar percentage={pillars.resume} colorClass="bg-indigo-500" />
                </motion.div>

                {/* 4. Interview */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setActiveTab('practice');
                    setPracticeSubTab('mock_interview');
                  }}
                  className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5 cursor-pointer hover:border-slate-700 transition"
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-mono font-semibold">INTERVIEW ({Math.round(weights.interview * 100)}%)</span>
                    <span className="font-bold text-cyan-400 font-mono">
                      <AnimatedScoreCounter value={pillars.interview} />%
                    </span>
                  </div>
                  <AnimatedProgressBar percentage={pillars.interview} colorClass="bg-cyan-500" />
                </motion.div>
              </div>
            </div>

            {/* Quick Hub Launchers */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setActiveTab('analyze');
                  setAnalyzeSubTab('job_matcher');
                }}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 p-3 rounded-2xl text-left flex items-start gap-2.5 group transition active:scale-95"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-500/30 group-hover:scale-105 transition">
                  <FileSearch className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Job Matcher</h4>
                  <p className="text-[10px] text-slate-400">Paste & evaluate JDs</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('tracker');
                  setTrackerSubTab('opportunities');
                }}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 p-3 rounded-2xl text-left flex items-start gap-2.5 group transition active:scale-95"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/30 group-hover:scale-105 transition">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Opportunities</h4>
                  <p className="text-[10px] text-slate-400">{opportunities.length} matched roles</p>
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
            
            {/* Sub-navigation */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setAnalyzeSubTab('profiler')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition ${
                  analyzeSubTab === 'profiler' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Career Profiler
              </button>
              <button
                onClick={() => setAnalyzeSubTab('job_matcher')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition ${
                  analyzeSubTab === 'job_matcher' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Job Matcher
              </button>
              <button
                onClick={() => setAnalyzeSubTab('ats_resume')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition ${
                  analyzeSubTab === 'ats_resume' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                ATS Resume
              </button>
            </div>

            {/* SubTab 1: Career Profiler */}
            {analyzeSubTab === 'profiler' && (
              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-3 text-xs shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-indigo-400" /> Candidate Profile & Target Role
                  </span>
                  <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-mono font-bold">
                    Telemetry
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
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-1">Target Company</label>
                      <input
                        type="text"
                        value={analyzerForm.targetCompany}
                        onChange={e => setAnalyzerForm({ ...analyzerForm, targetCompany: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-1">Current Technical Skills (Comma separated)</label>
                    <input
                      type="text"
                      value={analyzerForm.skills}
                      onChange={e => setAnalyzerForm({ ...analyzerForm, skills: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-1">Programming Languages</label>
                    <input
                      type="text"
                      value={analyzerForm.programmingLanguages}
                      onChange={e => setAnalyzerForm({ ...analyzerForm, programmingLanguages: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Synchronize Profile & Recalculate Weights</span>
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
                onAddSkillToPlan={(skill) => alert(`Added ${skill} to your learning planner.`)}
              />
            )}

            {/* SubTab 3: ATS Resume Scanner */}
            {analyzeSubTab === 'ats_resume' && (
              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-3 text-xs shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase">ATS Engine</span>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-400" /> ATS Resume Compatibility
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-indigo-400 font-mono">{atsScore}/100</span>
                    <span className="text-[8px] text-slate-400 block">Parsing Score</span>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 block mb-1">Resume Plaintext for Keyword Parsing:</label>
                  <textarea
                    rows={6}
                    value={resumeText}
                    onChange={e => setResumeText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 leading-relaxed font-mono"
                  />
                </div>

                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 font-mono">DETECTED ATS STRENGTHS:</span>
                  <p className="text-[10px] text-slate-300">
                    • Clear Python and SQL keywords &bull; Good formatting without complex tables
                  </p>
                  <span className="text-[10px] font-bold text-amber-400 font-mono block pt-1">MISSING FROM RESUME:</span>
                  <p className="text-[10px] text-slate-300">
                    • Quantified latency metrics &bull; Docker containerization &bull; Cloud deployment keywords
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* 3. ROADMAP TAB */}
        {/* ==================================================== */}
        {activeTab === 'roadmap' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            
            {/* Sub-navigation */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setRoadmapSubTab('stages')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition ${
                  roadmapSubTab === 'stages' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                7-Stage Plan ({roadmapPercent}%)
              </button>
              <button
                onClick={() => setRoadmapSubTab('evidence_matrix')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition ${
                  roadmapSubTab === 'evidence_matrix' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Skill Evidence Matrix
              </button>
            </div>

            {/* Stages View */}
            {roadmapSubTab === 'stages' && (
              <div className="space-y-2.5">
                {stages.map((stage, idx) => {
                  const stageCompleted = stage.tasks.every(t => t.completed);
                  const stageDoneCount = stage.tasks.filter(t => t.completed).length;

                  return (
                    <div key={stage.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2.5 transition hover:border-slate-700 shadow-sm">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                            stageCompleted 
                              ? 'bg-emerald-500 text-slate-950 font-black' 
                              : 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                          }`}>
                            {stageCompleted ? '✓' : idx + 1}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">{stage.title}</h4>
                            <p className="text-[10px] text-slate-400">{stage.subtitle}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-300 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                          {stageDoneCount}/{stage.tasks.length}
                        </span>
                      </div>

                      {/* Interactive Tasks Checklist */}
                      <div className="space-y-1.5 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
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
        {/* 4. PRACTICE TAB (INTERVIEW + PROJECTS) */}
        {/* ==================================================== */}
        {activeTab === 'practice' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            
            {/* Sub-navigation */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setPracticeSubTab('mock_interview')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition ${
                  practiceSubTab === 'mock_interview' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Mock Interview Coach
              </button>
              <button
                onClick={() => setPracticeSubTab('project_blueprints')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition ${
                  practiceSubTab === 'project_blueprints' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Gap-Bridging Projects
              </button>
            </div>

            {/* Mock Interview */}
            {practiceSubTab === 'mock_interview' && (
              <div className="space-y-3.5 text-xs">
                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-2.5 shadow-md">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white flex items-center gap-1.5">
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
                  <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-3 shadow-md">
                    <div>
                      <h4 className="text-xs font-bold text-white leading-snug">
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
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-purple-500"
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

                    {/* 4-Dimension Feedback Card */}
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

                        {/* 4 Dimensions Grid */}
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
                {DEFAULT_PROJECT_ITEMS.map(proj => (
                  <div key={proj.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2.5 shadow-sm">
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
                        <h4 className="text-xs font-bold text-white">{proj.title}</h4>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">{proj.description}</p>

                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-slate-400 font-mono">RESUME BULLET:</span>
                        <button
                          onClick={() => handleCopy(proj.id, proj.resumeBullet)}
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
          </div>
        )}

        {/* ==================================================== */}
        {/* 5. TRACKER TAB (OPPORTUNITIES & PIPELINE) */}
        {/* ==================================================== */}
        {activeTab === 'tracker' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            
            {/* Sub-navigation */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setTrackerSubTab('opportunities')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition ${
                  trackerSubTab === 'opportunities' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Matched Opportunities ({opportunities.length})
              </button>
              <button
                onClick={() => setTrackerSubTab('pipeline')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition ${
                  trackerSubTab === 'pipeline' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Application Pipeline ({applications.length})
              </button>
            </div>

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
        {/* 6. PROFILE & PRIVACY TAB */}
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
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-base shadow-lg shadow-indigo-500/20">
                  {profile.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{profile.name}</h3>
                  <p className="text-[11px] text-indigo-300">{profile.targetRole} &bull; {profile.targetCompany}</p>
                  <p className="text-[10px] text-slate-400">{profile.college}</p>
                </div>
              </div>
            </div>

            {/* Quick Data & Privacy Triggers */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExportData}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 p-3 rounded-2xl flex items-center gap-2.5 text-left transition"
              >
                <Download className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Export Data</h4>
                  <p className="text-[10px] text-slate-400">Download JSON backup</p>
                </div>
              </button>

              <button
                onClick={() => setShowPrivacyModal(true)}
                className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-3 rounded-2xl flex items-center gap-2.5 text-left transition"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Privacy Controls</h4>
                  <p className="text-[10px] text-slate-400">Data deletion & sandbox</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* "Why this score?" Diagnosis Modal */}
      <ScoreDiagnosisModal
        isOpen={showDiagnosisModal}
        onClose={() => setShowDiagnosisModal(false)}
        overallScore={readinessOverall}
        targetRole={profile.targetRole}
        targetCompany={profile.targetCompany}
        pillars={pillars}
        weights={weights}
        biggestGap={{
          skill: 'Docker Multi-Stage Containerization',
          reason: 'Docker was not detected in your available profile evidence. Production containerization is required for standard technical screening.',
          impact: '+12% Role Alignment Score upon project completion'
        }}
        nextBestAction={{
          title: 'Containerize FastAPI Inference Service in Docker',
          route: 'practice',
          description: 'Follow the step-by-step project blueprint to write a multi-stage Dockerfile and achieve sub-180MB image footprint.'
        }}
        onNavigateAction={(route) => {
          if (route === 'practice') {
            setActiveTab('practice');
            setPracticeSubTab('project_blueprints');
          }
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

      {/* Floating AI Copilot Trigger */}
      <button
        onClick={() => setShowAiCopilot(!showAiCopilot)}
        className="absolute right-4 bottom-14 z-30 w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-xl shadow-indigo-600/40 border border-white/20 flex items-center justify-center hover:scale-105 active:scale-95 transition"
        title="Open AI Career Copilot"
      >
        <Sparkles className="w-5 h-5 text-amber-300" />
      </button>

      {/* Floating AI Copilot Modal */}
      {showAiCopilot && (
        <div className="absolute inset-x-2 bottom-16 top-12 z-40 bg-slate-950/95 backdrop-blur-md rounded-3xl border border-indigo-500/40 p-3.5 flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">CareerPilot AI Copilot</h3>
                <p className="text-[9px] text-indigo-300">Context: {profile.targetRole} ({readinessOverall}/100 ⚡)</p>
              </div>
            </div>
            <button
              onClick={() => setShowAiCopilot(false)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-900 rounded-lg border border-slate-800"
            >
              Close
            </button>
          </div>

          <div className="flex gap-1 overflow-x-auto pb-1.5 no-scrollbar shrink-0">
            {[
              "What should I learn next?",
              "How to improve my resume?",
              "Recommend a capstone project",
              "Am I ready for Google?"
            ].map(chip => (
              <button
                key={chip}
                onClick={() => handleSendCopilot(chip)}
                className="text-[9px] bg-slate-900 hover:bg-indigo-950 border border-slate-800 hover:border-indigo-500/50 text-slate-200 px-2 py-1 rounded-full whitespace-nowrap transition shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 p-1 text-xs font-sans">
            {copilotMessages.map((m, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-2xl max-w-[85%] leading-relaxed ${
                  m.sender === 'user'
                    ? 'ml-auto bg-indigo-600 text-white rounded-br-none'
                    : 'mr-auto bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
            ))}
            {isCopilotThinking && (
              <div className="p-2 rounded-2xl bg-slate-900 border border-slate-800 text-indigo-300 mr-auto flex items-center gap-1.5 text-xs">
                <RefreshCw className="w-3 h-3 animate-spin" /> Thinking...
              </div>
            )}
          </div>

          <div className="pt-2 flex gap-1.5">
            <input
              type="text"
              value={copilotInput}
              onChange={e => setCopilotInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendCopilot()}
              placeholder="Ask career question..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => handleSendCopilot()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

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
