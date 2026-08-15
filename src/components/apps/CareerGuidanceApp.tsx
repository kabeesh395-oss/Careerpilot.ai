import React, { useState, useEffect } from 'react';
import { motion, animate } from 'motion/react';
import { 
  Compass, Award, CheckCircle2, Circle, Clock, 
  Sparkles, Layers, Code, RefreshCw, HelpCircle, 
  Github, Send, ChevronDown, ChevronUp, AlertCircle, ArrowRight,
  TrendingUp, Terminal, FileCode, Play, Cpu, FileText, Database, 
  History, ShieldCheck, Trash2, User, BookOpen, Briefcase, 
  Target, CheckSquare, Star, Zap, Flame, Trophy, ExternalLink,
  MessageSquare, Copy, Check, Upload, BarChart3, Sun, Moon,
  ListTodo, Plus, ChevronRight, Search, Share2, Lightbulb
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

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
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      }
    });
    return () => controls.stop();
  }, [value, duration, delay]);

  return <>{displayValue}</>;
};

export const AnimatedReadinessRing: React.FC<{
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  isDarkMode?: boolean;
  duration?: number;
}> = ({
  score,
  maxScore = 100,
  size = 96,
  strokeWidth = 8,
  isDarkMode = true,
  duration = 1.1
}) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // 251.33
  const targetOffset = circumference - (circumference * Math.min(score, maxScore)) / maxScore;

  return (
    <div 
      className="relative shrink-0 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="readinessRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {/* Background Track Ring */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={isDarkMode ? '#1e293b' : '#e2e8f0'}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Framer Motion Animated Stroke Ring */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          stroke="url(#readinessRingGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: targetOffset }}
          transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
          strokeLinecap="round"
          fill="transparent"
          filter="url(#glow)"
        />
      </svg>
      {/* Center Animated Number Counter */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.span 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-lg font-black text-white font-mono leading-none"
        >
          <AnimatedScoreCounter value={score} duration={duration} />
          <span className="text-[10px] text-slate-400 font-normal">/{maxScore}</span>
        </motion.span>
        <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider mt-0.5">
          Ready
        </span>
      </div>
    </div>
  );
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

// --- DATA STRUCTURES & TYPES ---

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
}

export interface RoadmapStage {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  skills: string[];
  tasks: RoadmapTask[];
  project: string;
  resources: string[];
}

export interface ProjectRecommendation {
  id: string;
  title: string;
  problem: string;
  technologies: string[];
  features: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  resumeBullet: string;
  readmeTip: string;
}

export interface MockQuestion {
  id: string;
  type: 'Technical' | 'System Design' | 'Behavioral' | 'HR';
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

export interface AchievementBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

// --- DEFAULT STATE CONSTANTS ---

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Chen',
  college: 'National Tech Institute',
  degree: 'B.Tech / B.S. in Computer Science',
  department: 'Computer Science & Engineering',
  year: 'Junior (3rd Year, Class of 2027)',
  currentSkills: ['Python', 'SQL', 'Git', 'Data Structures & Algorithms', 'HTML/CSS', 'Basic React', 'FastAPI'],
  programmingLanguages: ['Python', 'C++', 'JavaScript', 'SQL'],
  interests: ['Machine Learning', 'Full Stack Development', 'Distributed Systems'],
  experienceLevel: 'Student / Early Career',
  targetRole: 'Machine Learning Engineer',
  targetCompany: 'Google',
  github: 'alexchen-dev',
  linkedin: 'alexchen-tech',
  leetcode: 'alex_code99',
  streak: 7,
  xp: 1450
};

const DEFAULT_STAGES: RoadmapStage[] = [
  {
    id: 'stage_1',
    title: '1. Foundation',
    subtitle: 'Core CS & Programming Syntax',
    duration: '2-3 Weeks',
    skills: ['Python Fundamentals', 'Git/GitHub Workflow', 'OOP Concepts'],
    project: 'CLI Task Manager with JSON Persistence & Git Versioning',
    resources: ['Python 3.12 Official Docs', 'Pro Git Book (Free)', 'Real Python Tutorials'],
    tasks: [
      { id: 't1_1', title: 'Master Python OOP: Classes, Inheritance & Dunder Methods', completed: true },
      { id: 't1_2', title: 'Setup GitHub SSH keys, branch workflows & PR conventions', completed: true },
      { id: 't1_3', title: 'Implement File I/O & Exception Handling patterns', completed: true }
    ]
  },
  {
    id: 'stage_2',
    title: '2. Programming',
    subtitle: 'Advanced Language Idioms & Clean Code',
    duration: '3-4 Weeks',
    skills: ['Memory Management', 'Async/Await & Coroutines', 'Unit Testing & PyTest'],
    project: 'High-Performance Asynchronous Data Fetcher with Rate Limiting',
    resources: ['Fluent Python', 'Real Python Async Guides', 'Test-Driven Development with Python'],
    tasks: [
      { id: 't2_1', title: 'Master asynchronous I/O and asyncio event loop patterns', completed: true },
      { id: 't2_2', title: 'Write 90%+ coverage unit test suites using PyTest & mock fixtures', completed: true },
      { id: 't2_3', title: 'Implement clean architectural design patterns (Repository, Factory)', completed: false }
    ]
  },
  {
    id: 'stage_3',
    title: '3. DSA',
    subtitle: 'Data Structures & Algorithms Mastery',
    duration: '4-6 Weeks',
    skills: ['Arrays & HashMaps', 'Trees & Graphs', 'Dynamic Programming', 'SQL Schema Design'],
    project: 'High-Throughput In-Memory Key-Value Store with LRU Cache',
    resources: ['NeetCode 150 Roadmap', 'PostgreSQL Exercises', 'MIT 6.006 Algorithms'],
    tasks: [
      { id: 't3_1', title: 'Solve 75 LeetCode Easy/Medium problems (Two Pointers & Sliding Window)', completed: true },
      { id: 't3_2', title: 'Implement Binary Search Trees & Graph BFS/DFS from scratch', completed: true },
      { id: 't3_3', title: 'Master SQL Joins, Window Functions & Index Optimization', completed: false }
    ]
  },
  {
    id: 'stage_4',
    title: '4. Projects',
    subtitle: 'Production Containerization & Capstone Build',
    duration: '4-5 Weeks',
    skills: ['Docker', 'Vector Databases (ChromaDB)', 'FastAPI', 'Model Serving'],
    project: 'Autonomous Resume Semantic Matcher using Vector Embeddings & Docker',
    resources: ['Docker Mastery Course', 'ChromaDB Docs', 'Full Stack Deep Learning'],
    tasks: [
      { id: 't4_1', title: 'Dockerize PyTorch model inference container with multi-stage builds', completed: false },
      { id: 't4_2', title: 'Integrate Vector Search pipeline for high-speed similarity queries', completed: false },
      { id: 't4_3', title: 'Write comprehensive GitHub README with architecture diagrams & benchmarks', completed: false }
    ]
  },
  {
    id: 'stage_5',
    title: '5. Internship',
    subtitle: 'Open Source, Hackathons & Industry Presence',
    duration: '3-4 Weeks',
    skills: ['Open Source PRs', 'Hackathon Builds', 'Technical Portfolio'],
    project: 'Published PyPI / Hugging Face Open-Source Model Demo',
    resources: ['Good First Issue Tracker', 'Hugging Face Spaces Guide', 'Tech Twitter/LinkedIn Tips'],
    tasks: [
      { id: 't5_1', title: 'Contribute 2 merged PRs to open-source developer repositories', completed: false },
      { id: 't5_2', title: 'Deploy live portfolio demo on Hugging Face Spaces or Vercel', completed: false },
      { id: 't5_3', title: 'Apply to 20+ internships and reach out to hiring managers on LinkedIn', completed: false }
    ]
  },
  {
    id: 'stage_6',
    title: '6. Interview Preparation',
    subtitle: 'Technical Rigor, System Design & STAR Stories',
    duration: '3-4 Weeks',
    skills: ['ML System Design', 'STAR Method Behavioral', 'Live Coding Speed'],
    project: '10 Fully Documented Mock Interview Transcripts with Feedback',
    resources: ['Grokking the ML System Design Interview', 'Cracking the Coding Interview', 'Tech Interview Handbook'],
    tasks: [
      { id: 't6_1', title: 'Practice 10 System Design architectures (e.g. YouTube Recommender, Feed Ranking)', completed: false },
      { id: 't6_2', title: 'Prepare 5 STAR stories for leadership, conflict resolution & project impact', completed: false },
      { id: 't6_3', title: 'Complete 3 full-length AI mock interview rounds with CareerPilot Coach', completed: false }
    ]
  },
  {
    id: 'stage_7',
    title: '7. Job Ready',
    subtitle: 'Referrals, Application Sprints & Offer Negotiation',
    duration: 'Ongoing',
    skills: ['ATS Resume Optimization', 'Cold Networking', 'Salary Negotiation'],
    project: '50 Targeted Applications with Tailored Resume Bullet Points',
    resources: ['Levels.fyi Negotiation Guide', 'LinkedIn Boolean Search', 'Referral Outreach Templates'],
    tasks: [
      { id: 't7_1', title: 'Score 90+ on CareerPilot ATS Resume Analyzer for target role', completed: false },
      { id: 't7_2', title: 'Connect with 15 engineers/alumni at target companies for referrals', completed: false },
      { id: 't7_3', title: 'Track application pipeline with deadline reminders in Learning Planner', completed: false }
    ]
  }
];

export interface ProjectCardItem {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  technologies: string[];
  description: string;
  careerValue: string;
  duration: string;
  resumeBullet: string;
}

const DEFAULT_PROJECT_ITEMS: ProjectCardItem[] = [
  {
    id: 'p_beg_1',
    title: 'CLI Task Manager & Developer Habit Engine',
    difficulty: 'Beginner',
    technologies: ['Python', 'SQLite', 'Argparse', 'Rich CLI'],
    description: 'A lightweight command-line productivity tool with automated JSON/SQLite backup, colorized terminal reporting, and streak tracking.',
    careerValue: 'Demonstrates rock-solid core CS fundamentals, clean OOP architecture, robust exception handling, and mastery of version control.',
    duration: '1-2 Weeks',
    resumeBullet: 'Engineered a modular CLI productivity tool in Python and SQLite, implementing custom sorting algorithms and automated backups with 100% test coverage.'
  },
  {
    id: 'p_beg_2',
    title: 'Real-time Markdown Documentation Generator',
    difficulty: 'Beginner',
    technologies: ['TypeScript', 'Node.js', 'Express', 'Tailwind CSS'],
    description: 'A browser-based live markdown editor that parses AST nodes in real-time, generates table of contents, and exports formatted PDFs.',
    careerValue: 'Proves client-side DOM manipulation, reactive state handling, and full-stack API integration for entry-level engineering roles.',
    duration: '1-2 Weeks',
    resumeBullet: 'Developed a real-time markdown documentation generator in TypeScript and Express, reducing technical spec drafting time by 30% for student engineering teams.'
  },
  {
    id: 'p_int_1',
    title: 'AI Resume ATS Matcher & Semantic Ranker',
    difficulty: 'Intermediate',
    technologies: ['Python', 'PyTorch', 'FastAPI', 'ChromaDB', 'Docker'],
    description: 'An AI-powered semantic search engine that extracts text from PDFs, calculates cosine embeddings against job descriptions, and flags missing keywords.',
    careerValue: 'High-signal project for ML & Backend roles: shows modern embeddings, vector databases, containerization, and REST microservices.',
    duration: '2-3 Weeks',
    resumeBullet: 'Architected and containerized a semantic resume matching engine in PyTorch & FastAPI, processing 50+ resume formats with ChromaDB vector search to boost candidate ATS match rate by 42%.'
  },
  {
    id: 'p_int_2',
    title: 'Distributed In-Memory Key-Value Store',
    difficulty: 'Intermediate',
    technologies: ['Go', 'Raft Consensus', 'gRPC', 'Protobuf'],
    description: 'A fault-tolerant distributed key-value store using Raft consensus for leader election and log replication with consistent hashing.',
    careerValue: 'Stands out immensely in Systems and Backend interviews by proving distributed consensus, networking protocols, and concurrent mutex locks.',
    duration: '3 Weeks',
    resumeBullet: 'Implemented a distributed key-value database in Go with Raft consensus and gRPC, achieving 15k QPS with sub-5ms replication latency across a 3-node cluster.'
  },
  {
    id: 'p_adv_1',
    title: 'Real-Time Streaming Fraud Detection Pipeline',
    difficulty: 'Advanced',
    technologies: ['Python', 'XGBoost', 'Apache Kafka', 'Docker', 'MLflow'],
    description: 'An enterprise-grade streaming analytics pipeline that flags anomalous credit card transactions with sub-40ms P99 inference latency.',
    careerValue: 'Crucial for Machine Learning Engineer & Data Engineer roles: demonstrates end-to-end MLOps, streaming pipelines, drift monitoring, and Docker.',
    duration: '3-4 Weeks',
    resumeBullet: 'Engineered an end-to-end streaming fraud detection pipeline with XGBoost and MLflow, attaining 96.8% ROC-AUC on 2M synthetic transactions with sub-40ms P99 inference latency.'
  },
  {
    id: 'p_adv_2',
    title: 'High-Concurrency Collaborative Code Sandbox',
    difficulty: 'Advanced',
    technologies: ['Rust', 'WebSockets', 'WebAssembly', 'CRDTs', 'Docker'],
    description: 'A browser-based multi-user code editor with conflict-free replicated data types (CRDTs) and isolated sandboxed code execution containers.',
    careerValue: 'World-class tier portfolio capstone: shows systems programming in Rust, real-time WebSockets, secure container sandboxing, and operational transform.',
    duration: '4 Weeks',
    resumeBullet: 'Built a real-time collaborative coding platform in Rust and WebSockets using Yjs CRDTs, supporting 50+ simultaneous editors with zero-conflict document convergence.'
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
    question: 'Why do you want to join our company as a Junior Engineer, and where do you see your career heading in 3 years?',
    context: 'Assesses culture fit, candidate motivation, self-awareness, and alignment with company growth trajectories.',
    sampleAnswer: 'I admire your company\'s commitment to engineering excellence and scalable infrastructure. In my projects, I love building reliable backend systems and solving complex bottlenecks. In the next 3 years, my goal is to transition from an eager learner to a core contributor who champions clean code, mentors incoming interns, and takes ownership of critical services.',
    keyTopics: ['Company Alignment', 'Growth Mindset', 'Long-term Commitment', 'Continuous Learning']
  },
  {
    id: 'q_hr_2',
    type: 'HR',
    question: 'How do you prioritize your time when balancing multiple urgent academic deadlines and technical interview preparation?',
    context: 'Tests time management, prioritization frameworks, stress management, and practical work habits.',
    sampleAnswer: 'I use the Eisenhower matrix to divide responsibilities into urgent vs important. I block 90 minutes each morning for deep-focus coding and interview problem-solving when my concentration is highest. For academic deliverables, I break projects into milestone sprints early, which prevents last-minute scrambles.',
    keyTopics: ['Time Management', 'Prioritization Matrix', 'Consistency', 'Stress Handling']
  },
  {
    id: 'q_beh_1',
    type: 'Behavioral',
    question: 'Tell me about a time you faced a difficult technical bug under a tight deadline. How did you diagnose and resolve it?',
    context: 'Uses STAR framework to assess problem-solving under pressure and systematic root-cause analysis.',
    sampleAnswer: 'Situation: During a 48-hour hackathon, our API server started throwing 504 Gateway Timeouts right before demo submissions. Task: I needed to diagnose whether the root cause was database lock contention, memory leak, or unhandled network promise. Action: I used Chrome DevTools and server logs to isolate the slow endpoint, identifying an unindexed N+1 query loop. I converted it into a single SQL JOIN with Redis caching. Result: Response times dropped from 4.2s to 38ms, and our team successfully delivered the demo to win 2nd place.',
    keyTopics: ['STAR Framework', 'Root Cause Diagnostics', 'Pressure Handling', 'Measurable Impact']
  },
  {
    id: 'q_beh_2',
    type: 'Behavioral',
    question: 'Describe a situation where you had a disagreement with a peer on technical architecture. How did you handle it?',
    context: 'Evaluates emotional intelligence, communication skills, objective decision making, and teamwork.',
    sampleAnswer: 'Situation: In a group project, a teammate wanted to use MongoDB while I advocated for PostgreSQL. Task: We needed to decide quickly without causing team friction. Action: Instead of arguing preferences, I created a short matrix comparing our data schema needs—highlighting that our application had relational user transactions requiring ACID compliance. We reviewed it together, and my teammate agreed that PostgreSQL was the safer choice. Result: The database ran smoothly without any schema anomalies.',
    keyTopics: ['Constructive Debate', 'Objective Decision Matrix', 'Collaboration', 'Empathy']
  }
];

const DEFAULT_PLANNER_TASKS: LearningTask[] = [
  { id: 'pt1', title: 'Solve 2 LeetCode Mediums on Graphs (BFS/DFS)', category: 'Daily', priority: 'High', completed: true, dueDate: 'Today' },
  { id: 'pt2', title: 'Containerize FastAPI ML inference script with Docker', category: 'Daily', priority: 'High', completed: false, dueDate: 'Today' },
  { id: 'pt3', title: 'Review PyTorch Autograd & Backprop derivations', category: 'Revision', priority: 'Medium', completed: false, dueDate: 'Tomorrow' },
  { id: 'pt4', title: 'Complete CareerPilot AI Mock Interview Round #1', category: 'Weekly', priority: 'High', completed: false, dueDate: 'This Weekend' },
  { id: 'pt5', title: 'Optimize Resume bullet points with quantified metrics', category: 'Project', priority: 'Medium', completed: true, dueDate: 'Completed' }
];

const DEFAULT_BADGES: AchievementBadge[] = [
  { id: 'b1', name: 'Profile Pioneer', icon: '👤', description: 'Setup initial candidate career profile', unlocked: true },
  { id: 'b2', name: '7-Day Streak', icon: '🔥', description: 'Maintained 7 consecutive days of career prep', unlocked: true },
  { id: 'b3', name: 'ATS Optimizer', icon: '📄', description: 'Analyzed resume and fixed weak bullets', unlocked: true },
  { id: 'b4', name: 'PyTorch Explorer', icon: '🚀', description: 'Completed PyTorch fundamentals phase', unlocked: false },
  { id: 'b5', name: 'Interview Champion', icon: '🎯', description: 'Cleared 3 full mock interview simulations', unlocked: false },
  { id: 'b6', name: 'Job Ready 100', icon: '👑', description: 'Attained 85+ Career Readiness Score', unlocked: false }
];

export const CareerGuidanceApp: React.FC = () => {
  // Main Navigation Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analyze' | 'roadmap' | 'projects' | 'interview' | 'profile'>('dashboard');

  // Candidate Profile State (with persistence)
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('careerpilot_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  // Stages & Roadmap State
  const [stages, setStages] = useState<RoadmapStage[]>(() => {
    const saved = localStorage.getItem('careerpilot_stages');
    return saved ? JSON.parse(saved) : DEFAULT_STAGES;
  });

  // Tasks State
  const [tasks, setTasks] = useState<LearningTask[]>(() => {
    const saved = localStorage.getItem('careerpilot_tasks');
    return saved ? JSON.parse(saved) : DEFAULT_PLANNER_TASKS;
  });

  // Badges State
  const [badges, setBadges] = useState<AchievementBadge[]>(() => {
    const saved = localStorage.getItem('careerpilot_badges');
    return saved ? JSON.parse(saved) : DEFAULT_BADGES;
  });

  // Theme & System States
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('careerpilot_theme') !== 'light';
  });
  const [demoMode, setDemoMode] = useState(true);
  const [showAiCopilot, setShowAiCopilot] = useState(false);
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

  // Career Analysis Results State
  const [careerAnalysisResult, setCareerAnalysisResult] = useState<{
    score: number;
    fitLevel: string;
    strengths: string[];
    skillGaps: string[];
    recommendedSkills: string[];
    nextSteps: string[];
  }>({
    score: 78,
    fitLevel: 'Strong Fit',
    strengths: ['Python OOP & Clean Code', 'Data Structures & Algorithms (Arrays, Graphs)', 'SQL Schema & Query Optimization', 'RESTful API Design with FastAPI'],
    skillGaps: ['Docker Containerization', 'Production PyTorch Inference', 'Vector Databases (ChromaDB)', 'MLOps & Continuous Drift Monitoring'],
    recommendedSkills: ['Docker & Multi-stage builds', 'PyTorch & HuggingFace Transformers', 'ChromaDB / FAISS Embeddings', 'System Design for ML Services'],
    nextSteps: [
      'Containerize your FastAPI ML sentiment classifier using Docker.',
      'Solve 25 LeetCode Medium Graph and Tree problems on NeetCode 150.',
      'Deploy an open-source demo model on Hugging Face Spaces and add to resume.'
    ]
  });

  // Project Category Filter State
  const [projectFilter, setProjectFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');

  // Interview Category Filter State
  const [interviewTypeFilter, setInterviewTypeFilter] = useState<'Technical' | 'HR' | 'Behavioral'>('Technical');

  // Resume Analyzer States
  const [resumeText, setResumeText] = useState(
    'Alex Chen\nEducation: B.Tech Computer Science (GPA: 3.8/4.0)\nSkills: Python, SQL, Git, HTML/CSS, Basic React, FastAPI, SQLite\nExperience: Built personal portfolio and small Python sentiment classifier with Flask.\nProjects: Task Tracker CLI with JSON storage.'
  );
  const [uploadedFileName, setUploadedFileName] = useState<string | null>('alex_chen_resume.pdf');
  const [atsScore, setAtsScore] = useState<number>(82);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('');

  // AI Mock Interview States
  const [mockQuestions, setMockQuestions] = useState<MockQuestion[]>(DEFAULT_QUESTIONS);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [interviewFeedback, setInterviewFeedback] = useState<{
    score: number;
    strengths: string;
    gaps: string;
    modelAnswer: string;
  } | null>(null);
  const [isGrading, setIsGrading] = useState(false);

  // AI Copilot Chat State
  const [copilotMessages, setCopilotMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: "Greetings Alex! I'm your CareerPilot AI Mentor. I have your profile loaded (Target: ML Engineer @ Google). How can I assist your career progression today?"
    }
  ]);
  const [copilotInput, setCopilotInput] = useState('');
  const [isCopilotThinking, setIsCopilotThinking] = useState(false);

  // New task input state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<'Daily' | 'Weekly' | 'Revision' | 'Project'>('Daily');

  // Filtered mock questions based on selected interview category
  const filteredQuestions = mockQuestions.filter(q => q.type === interviewTypeFilter);

  // Animation trigger for Dashboard readiness score ring and progress bars
  const [dashboardAnimated, setDashboardAnimated] = useState(false);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      setDashboardAnimated(false);
      const timer = setTimeout(() => {
        setDashboardAnimated(true);
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  // Save to localStorage on state changes
  useEffect(() => {
    localStorage.setItem('careerpilot_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('careerpilot_stages', JSON.stringify(stages));
  }, [stages]);

  useEffect(() => {
    localStorage.setItem('careerpilot_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('careerpilot_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('careerpilot_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Copy helper
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Toggle Task Completion in Roadmap
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

  // Run Career Analyzer Handler
  const handleRunCareerAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisStatus('Evaluating candidate profile against target role requirements...');

    try {
      await new Promise(r => setTimeout(r, 600));

      const skillsList = analyzerForm.skills.split(',').map(s => s.trim().toLowerCase());
      const hasPython = skillsList.some(s => s.includes('python'));
      const hasDocker = skillsList.some(s => s.includes('docker'));
      const hasTorch = skillsList.some(s => s.includes('torch') || s.includes('tensor'));

      let calcScore = 75;
      if (hasPython) calcScore += 5;
      if (hasDocker) calcScore += 10;
      if (hasTorch) calcScore += 8;
      if (calcScore > 95) calcScore = 95;

      setCareerAnalysisResult({
        score: calcScore,
        fitLevel: calcScore >= 80 ? 'High Candidate Fit' : 'Moderate Fit',
        strengths: [
          `${analyzerForm.programmingLanguages || 'Python, C++'} Language Proficiency`,
          'Solid Foundational Data Structures & Algorithms',
          `Strong Domain Alignment for ${analyzerForm.targetRole}`,
          'Clear Academic & Portfolio Trajectory'
        ],
        skillGaps: [
          'Production Containerization (Docker / Kubernetes)',
          'High-Throughput Vector Search & Embeddings',
          'Distributed System Design Principles',
          'Automated CI/CD Deployment Pipelines'
        ],
        recommendedSkills: [
          'Docker Multi-Stage Containerization',
          'PyTorch / HuggingFace Model Inference',
          'ChromaDB Vector Embeddings',
          'System Design for High-Concurrency Services'
        ],
        nextSteps: [
          `Build and containerize a flagship project tailored for ${analyzerForm.targetCompany}.`,
          'Complete 3 mock interview simulations in CareerPilot Interview Coach.',
          `Optimize ATS resume bullet points for ${analyzerForm.targetRole} keywords.`
        ]
      });

      // Also update candidate profile with form fields
      handleSaveProfile();
      setProfile(p => ({ ...p, xp: p.xp + 100 }));
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle Learning Planner Task
  const togglePlannerTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const updated = !t.completed;
      if (updated) {
        setProfile(p => ({ ...p, xp: p.xp + 25 }));
      }
      return { ...t, completed: updated };
    }));
  };

  // Add new planner task
  const handleAddPlannerTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: LearningTask = {
      id: 'task_' + Date.now(),
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      priority: 'High',
      completed: false,
      dueDate: 'Today'
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
  };

  // AI Resume & Career Analysis Execution
  const runFullAiAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisStatus('Parsing resume and cross-referencing job requirements...');

    try {
      const apiKey = process.env.GEMINI_API_KEY || '';

      if (apiKey && !demoMode) {
        setAnalysisStatus('Evaluating skills with Google Gemini 2.5 Flash...');
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Candidate Resume:\n${resumeText}\nTarget Role: ${profile.targetRole}\nTarget Company: ${profile.targetCompany}\nCurrent Skills: ${profile.currentSkills.join(', ')}\n\nProvide an evaluation JSON with: {"atsScore": number, "explanation": string, "strongSkills": string[], "missingSkills": string[], "nextAction": string}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });

        const parsed = JSON.parse(response.text || '{}');
        if (parsed.atsScore) setAtsScore(parsed.atsScore);
      } else {
        // High quality deterministic simulated analysis
        await new Promise(r => setTimeout(r, 800));
        setAtsScore(84);
      }

      setAnalysisStatus('Analysis successfully synchronized!');
      setProfile(prev => ({
        ...prev,
        xp: prev.xp + 100
      }));
    } catch (err) {
      console.warn('AI analysis fallback triggered:', err);
      setAtsScore(80);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Submit Answer to Mock Interview Simulator
  const handleGradeInterviewAnswer = async () => {
    if (!candidateAnswer.trim()) return;
    setIsGrading(true);

    try {
      await new Promise(r => setTimeout(r, 700));
      const activeQ = mockQuestions[activeQuestionIdx];
      
      setInterviewFeedback({
        score: 8.5,
        strengths: 'Clear explanation of core principles with strong terminology alignment. Demonstrated understanding of architectural boundaries.',
        gaps: `Consider mentioning edge-case latency degradation under P99 load and memory footprint trade-offs for ${activeQ.keyTopics[0]}.`,
        modelAnswer: activeQ.sampleAnswer
      });

      setProfile(p => ({ ...p, xp: p.xp + 75 }));
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
Current Skills: ${profile.currentSkills.join(', ')}
Experience: ${profile.experienceLevel}
Answer concisely in 2-3 structured sentences with actionable bullet points.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${context}\n\nUser Question: ${query}`
        });
        reply = response.text || 'I have analyzed your request based on your career trajectory.';
      } else {
        await new Promise(r => setTimeout(r, 600));
        if (query.toLowerCase().includes('learn next') || query.toLowerCase().includes('skill')) {
          reply = `Based on your target of **${profile.targetRole} at ${profile.targetCompany}**, your highest-yield priority is **PyTorch tensor operations** and **Docker containerization**. Mastering these two closes 75% of your current gap!`;
        } else if (query.toLowerCase().includes('resume')) {
          reply = `Your resume has strong foundations, but needs **quantified metrics**. Replace passive phrasing like "Built a model" with "Engineered a PyTorch classifier attaining 94.2% test accuracy with 35% latency reduction via ONNX."`;
        } else if (query.toLowerCase().includes('project')) {
          reply = `I recommend building the **AI Resume ATS Matcher with ChromaDB & FastAPI**. It directly showcases deep learning inference, vector embeddings, and containerized backend deployment.`;
        } else {
          reply = `With your solid Python baseline and 7-day prep streak, focusing on **Stage 3 & 4 of your Roadmap** will position you as a top 10% candidate for ${profile.targetRole} internships!`;
        }
      }

      setCopilotMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    } catch (err) {
      setCopilotMessages(prev => [
        ...prev, 
        { sender: 'ai', text: `Prioritize Stage 3 of your roadmap: PyTorch foundations and containerizing your FastAPI endpoints with Docker.` }
      ]);
    } finally {
      setIsCopilotThinking(false);
    }
  };

  // Calculate Global Roadmap Progress
  const totalRoadmapTasks = stages.reduce((acc, s) => acc + s.tasks.length, 0);
  const completedRoadmapTasks = stages.reduce((acc, s) => acc + s.tasks.filter(t => t.completed).length, 0);
  const roadmapPercent = Math.round((completedRoadmapTasks / (totalRoadmapTasks || 1)) * 100);

  // Overall Career Readiness Score Breakdown
  const readinessOverall = 78;

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} overflow-hidden font-sans select-none transition-colors duration-200`}>
      
      {/* Top Android App Header */}
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
                v2.5
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Neural Career Intelligence</p>
          </div>
        </div>

        {/* Quick Top Controls */}
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

      {/* Main Scrollable Body */}
      <main className="flex-1 overflow-y-auto p-3.5 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800">
        
        {/* ==================================================== */}
        {/* 1. DASHBOARD VIEW */}
        {/* ==================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            
            {/* Personalized Greeting Card */}
            <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/50 to-slate-900 border border-indigo-500/30 p-3.5 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
              
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-semibold mb-0.5">
                    <span>👋 Welcome back,</span>
                    <span className="text-white font-bold">{profile.name}</span>
                  </div>
                  <h2 className="text-sm font-extrabold text-white">
                    Target: <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300">{profile.targetRole}</span>
                  </h2>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Aiming for <strong className="text-white">{profile.targetCompany}</strong> &bull; {profile.department}
                  </p>
                </div>

                {/* Learning Streak & XP */}
                <div className="flex flex-col items-end gap-1">
                  <span className="bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Flame className="w-3 h-3 fill-amber-400 text-amber-400 animate-bounce" /> {profile.streak} Days
                  </span>
                  <span className="text-[10px] font-mono text-indigo-300 font-bold">
                    ⚡ {profile.xp} XP
                  </span>
                </div>
              </div>

              {/* Recommended Next Action Banner */}
              <div className="mt-3 pt-2.5 border-t border-indigo-500/20 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/30 text-indigo-300 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <p className="text-[11px] text-slate-200 truncate">
                    <strong>Next Action:</strong> Containerize PyTorch model in Docker
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('roadmap')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-0.5 transition"
                >
                  Resume <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 4-Pillar Career Readiness Score Card with Framer Motion SVG Ring & Sequentially Staggered Pillar Progress Bars */}
            <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border p-3.5 rounded-2xl shadow-md space-y-3 relative overflow-hidden`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">
                    Telemetry Engine
                  </span>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-indigo-400" /> Career Readiness Evaluation
                  </h3>
                </div>
                <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  Top 12% Candidate
                </span>
              </div>

              {/* Score Circular Ring + Diagnostic Rationale */}
              <div className="flex items-center gap-3.5 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                {/* Framer Motion Radial SVG Progress Ring */}
                <AnimatedReadinessRing
                  score={readinessOverall}
                  maxScore={100}
                  isDarkMode={isDarkMode}
                  duration={1.1}
                />

                {/* Right Summary Info */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Candidate Diagnostic</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400">High Fit</span>
                  </div>
                  {/* Framer Motion Horizontal Overall Bar */}
                  <AnimatedProgressBar
                    percentage={readinessOverall}
                    duration={1.1}
                    heightClass="h-2"
                  />
                  <p className="text-[10px] text-slate-300 leading-tight">
                    Strong foundational algorithms and SQL alignment. Closing Docker & PyTorch containerization gaps unlocks 95+ score.
                  </p>
                </div>
              </div>

              {/* 4 Pillars Breakdown with Staggered Sequential Progress Bars (Starting after Ring Completes at 1.1s) */}
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                {/* Pillar 1: Skills (Delay 1.15s) */}
                <motion.div 
                  initial={{ opacity: 0.6, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ delay: 1.15, duration: 0.35 }}
                  className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5 cursor-pointer hover:border-slate-700 transition-colors"
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-mono font-semibold">SKILLS</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      <AnimatedScoreCounter value={85} duration={0.6} delay={1.15} />%
                    </span>
                  </div>
                  <AnimatedProgressBar
                    percentage={85}
                    colorClass="bg-emerald-500"
                    duration={0.6}
                    delay={1.15}
                  />
                </motion.div>

                {/* Pillar 2: Projects (Delay 1.45s) */}
                <motion.div 
                  initial={{ opacity: 0.6, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ delay: 1.45, duration: 0.35 }}
                  className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5 cursor-pointer hover:border-slate-700 transition-colors"
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-mono font-semibold">PROJECTS</span>
                    <span className="font-bold text-amber-400 font-mono">
                      <AnimatedScoreCounter value={70} duration={0.6} delay={1.45} />%
                    </span>
                  </div>
                  <AnimatedProgressBar
                    percentage={70}
                    colorClass="bg-amber-500"
                    duration={0.6}
                    delay={1.45}
                  />
                </motion.div>

                {/* Pillar 3: Resume (Delay 1.75s) */}
                <motion.div 
                  initial={{ opacity: 0.6, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ delay: 1.75, duration: 0.35 }}
                  className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5 cursor-pointer hover:border-slate-700 transition-colors"
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-mono font-semibold">RESUME</span>
                    <span className="font-bold text-indigo-400 font-mono">
                      <AnimatedScoreCounter value={82} duration={0.6} delay={1.75} />%
                    </span>
                  </div>
                  <AnimatedProgressBar
                    percentage={82}
                    colorClass="bg-indigo-500"
                    duration={0.6}
                    delay={1.75}
                  />
                </motion.div>

                {/* Pillar 4: Interview (Delay 2.05s) */}
                <motion.div 
                  initial={{ opacity: 0.6, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ delay: 2.05, duration: 0.35 }}
                  className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5 cursor-pointer hover:border-slate-700 transition-colors"
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-mono font-semibold">INTERVIEW</span>
                    <span className="font-bold text-cyan-400 font-mono">
                      <AnimatedScoreCounter value={75} duration={0.6} delay={2.05} />%
                    </span>
                  </div>
                  <AnimatedProgressBar
                    percentage={75}
                    colorClass="bg-cyan-500"
                    duration={0.6}
                    delay={2.05}
                  />
                </motion.div>
              </div>
            </div>

            {/* Quick Action Hub */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTab('analyze')}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 p-3 rounded-2xl text-left flex items-start gap-2.5 group transition active:scale-95"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-500/30 group-hover:scale-105 transition">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">ATS Resume</h4>
                  <p className="text-[10px] text-slate-400">Scan & rewrite bullets</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('interview')}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 p-3 rounded-2xl text-left flex items-start gap-2.5 group transition active:scale-95"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 border border-purple-500/30 group-hover:scale-105 transition">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Mock Coach</h4>
                  <p className="text-[10px] text-slate-400">AI live interview sim</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('roadmap')}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 p-3 rounded-2xl text-left flex items-start gap-2.5 group transition active:scale-95"
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-500/30 group-hover:scale-105 transition">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">7-Stage Plan</h4>
                  <p className="text-[10px] text-slate-400">{roadmapPercent}% completed</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 p-3 rounded-2xl text-left flex items-start gap-2.5 group transition active:scale-95"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/30 group-hover:scale-105 transition">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Projects Hub</h4>
                  <p className="text-[10px] text-slate-400">Target role blueprints</p>
                </div>
              </button>
            </div>

            {/* Today's Learning Tasks Checklist */}
            <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border p-3.5 rounded-2xl shadow-md space-y-2.5`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-indigo-400" /> Today's Priority Missions
                </h3>
                <button
                  onClick={() => setActiveTab('planner')}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5"
                >
                  View All <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-1.5">
                {tasks.slice(0, 3).map(task => (
                  <div
                    key={task.id}
                    onClick={() => togglePlannerTask(task.id)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition ${
                      task.completed 
                        ? 'bg-slate-950/40 border-slate-800/60 opacity-60' 
                        : 'bg-slate-950 border-slate-800 hover:border-indigo-500/50'
                    }`}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <span className={`text-xs flex-1 ${task.completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                      {task.title}
                    </span>
                    <span className="text-[9px] font-mono text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* 2. ANALYZE & RESUME ATS OPTIMIZER VIEW */}
        {/* ==================================================== */}
        {activeTab === 'analyze' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            
            {/* Career Analyzer Form Container */}
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-3 text-xs shadow-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-indigo-400" /> Career Profile Analyzer
                </span>
                <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-mono font-bold">
                  Telemetry Engine
                </span>
              </div>

              {/* 10 Required Input Fields */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={analyzerForm.name}
                      onChange={e => setAnalyzerForm({ ...analyzerForm, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. Alex Chen"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">College / University</label>
                    <input
                      type="text"
                      value={analyzerForm.college}
                      onChange={e => setAnalyzerForm({ ...analyzerForm, college: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. National Tech Institute"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Department / Major</label>
                    <input
                      type="text"
                      value={analyzerForm.department}
                      onChange={e => setAnalyzerForm({ ...analyzerForm, department: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Graduation Year</label>
                    <input
                      type="text"
                      value={analyzerForm.year}
                      onChange={e => setAnalyzerForm({ ...analyzerForm, year: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. 3rd Year (Class of 2027)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Target Role</label>
                    <input
                      type="text"
                      value={analyzerForm.targetRole}
                      onChange={e => setAnalyzerForm({ ...analyzerForm, targetRole: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. Machine Learning Engineer"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Target Company</label>
                    <input
                      type="text"
                      value={analyzerForm.targetCompany}
                      onChange={e => setAnalyzerForm({ ...analyzerForm, targetCompany: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. Google, Stripe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Programming Languages</label>
                    <input
                      type="text"
                      value={analyzerForm.programmingLanguages}
                      onChange={e => setAnalyzerForm({ ...analyzerForm, programmingLanguages: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. Python, C++, SQL, Go"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Experience Level</label>
                    <select
                      value={analyzerForm.experienceLevel}
                      onChange={e => setAnalyzerForm({ ...analyzerForm, experienceLevel: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Student / Early Career">Student / Early Career</option>
                      <option value="Entry Level (0-1 Years)">Entry Level (0-1 Years)</option>
                      <option value="Mid Level (2-4 Years)">Mid Level (2-4 Years)</option>
                      <option value="Senior Level (5+ Years)">Senior Level (5+ Years)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Current Technical Skills (Comma separated)</label>
                  <input
                    type="text"
                    value={analyzerForm.skills}
                    onChange={e => setAnalyzerForm({ ...analyzerForm, skills: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Python, SQL, Git, Data Structures, FastAPI, HTML/CSS"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Career Interests & Domains</label>
                  <input
                    type="text"
                    value={analyzerForm.interests}
                    onChange={e => setAnalyzerForm({ ...analyzerForm, interests: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Machine Learning, Distributed Systems, Cloud Architecture"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleRunCareerAnalysis}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Career Profile...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Run Career & Skill Gap Evaluation</span>
                  </>
                )}
              </button>
            </div>

            {/* Analysis Results Display */}
            <div className="space-y-3">
              
              {/* 1. Readiness Score Card */}
              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-2.5 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">Diagnosis</span>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4 text-emerald-400" /> Career Readiness Score
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      <AnimatedScoreCounter value={careerAnalysisResult.score} duration={1.2} />/100
                    </span>
                    <span className="text-[9px] text-emerald-400 font-semibold block">{careerAnalysisResult.fitLevel}</span>
                  </div>
                </div>

                <AnimatedProgressBar
                  percentage={careerAnalysisResult.score}
                  duration={1.2}
                  heightClass="h-2"
                />
              </div>

              {/* 2. Strengths & 3. Skill Gaps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Key Strengths
                  </span>
                  <div className="space-y-1">
                    {careerAnalysisResult.strengths.map((str, idx) => (
                      <div key={idx} className="text-[11px] text-slate-200 bg-slate-950 p-2 rounded-xl border border-emerald-500/20 flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{str}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-2">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> Critical Skill Gaps
                  </span>
                  <div className="space-y-1">
                    {careerAnalysisResult.skillGaps.map((gap, idx) => (
                      <div key={idx} className="text-[11px] text-slate-200 bg-slate-950 p-2 rounded-xl border border-rose-500/20 flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">▲</span>
                        <span>{gap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Recommended Skills */}
              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" /> Recommended Skills to Master
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {careerAnalysisResult.recommendedSkills.map((sk, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-950 text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-xl font-mono">
                      + {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* 5. Recommended Next Steps */}
              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400" /> Recommended Next Action Steps
                </span>
                <div className="space-y-1.5">
                  {careerAnalysisResult.nextSteps.map((step, idx) => (
                    <div key={idx} className="text-[11px] text-slate-200 bg-slate-950 p-2.5 rounded-xl border border-indigo-500/30 flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* 3. 7-STAGE CAREER ROADMAP VIEW */}
        {/* ==================================================== */}
        {activeTab === 'roadmap' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            
            {/* Header with Overall Progress */}
            <div className="bg-gradient-to-r from-indigo-900/60 to-purple-900/50 border border-indigo-500/30 p-3.5 rounded-2xl shadow-md space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-indigo-400" /> 7-Stage Career Roadmap
                  </h3>
                  <p className="text-[10px] text-indigo-200">From CS Student to {profile.targetRole} @ {profile.targetCompany}</p>
                </div>
                <span className="text-sm font-black text-cyan-300 font-mono">{roadmapPercent}% Done</span>
              </div>

              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500" style={{ width: `${roadmapPercent}%` }}></div>
              </div>
            </div>

            {/* Stages Vertical Flow */}
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
                          <p className="text-[10px] text-slate-400">{stage.subtitle} &bull; <span className="text-cyan-400">{stage.duration}</span></p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-300 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                        {stageDoneCount}/{stage.tasks.length}
                      </span>
                    </div>

                    {/* Skill Badges */}
                    <div className="flex flex-wrap gap-1">
                      {stage.skills.map(skill => (
                        <span key={skill} className="text-[9px] bg-slate-950 text-indigo-300 border border-slate-800 px-1.5 py-0.5 rounded font-mono">
                          {skill}
                        </span>
                      ))}
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
          </div>
        )}

        {/* ==================================================== */}
        {/* 4. RECOMMENDED PROJECTS HUB */}
        {/* ==================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-2.5">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-emerald-400" /> Recommended Project Blueprints
                </h3>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full font-bold">
                  {DEFAULT_PROJECT_ITEMS.length} Projects
                </span>
              </div>
              
              {/* Category Filter Chips */}
              <div className="flex gap-1.5">
                {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setProjectFilter(cat)}
                    className={`px-3 py-1 rounded-xl text-[10px] font-bold transition ${
                      projectFilter === cat
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {DEFAULT_PROJECT_ITEMS
                .filter(proj => projectFilter === 'All' || proj.difficulty === projectFilter)
                .map(proj => (
                  <div key={proj.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2.5 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`text-[9px] font-bold uppercase font-mono px-2 py-0.5 rounded-full ${
                          proj.difficulty === 'Advanced' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          proj.difficulty === 'Intermediate' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {proj.difficulty} &bull; {proj.duration}
                        </span>
                        <h4 className="text-xs font-bold text-white mt-1.5">{proj.title}</h4>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">{proj.description}</p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1">
                      {proj.technologies.map(t => (
                        <span key={t} className="text-[9px] bg-slate-950 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-md font-mono">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Career Value Card */}
                    <div className="bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-500/30 space-y-1">
                      <span className="text-[9px] font-bold text-indigo-300 font-mono flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-300" /> CAREER VALUE:
                      </span>
                      <p className="text-[11px] text-indigo-100 leading-snug">{proj.careerValue}</p>
                    </div>

                    {/* Resume Bullet */}
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
          </div>
        )}

        {/* ==================================================== */}
        {/* 5. AI MOCK INTERVIEW SIMULATOR */}
        {/* ==================================================== */}
        {activeTab === 'interview' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            
            {/* Category Selector */}
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-2.5 text-xs shadow-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-purple-400" /> AI Mock Interview Coach
                </span>
                <span className="text-[9px] bg-purple-500/20 text-purple-300 font-mono px-2 py-0.5 rounded-full font-bold">
                  Role: {profile.targetRole}
                </span>
              </div>

              {/* 3 Categories: Technical, HR, Behavioral */}
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
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat} Interview
                  </button>
                ))}
              </div>

              {/* Question Number Pills */}
              <div className="flex gap-1.5 pt-1">
                {filteredQuestions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setActiveQuestionIdx(idx);
                      setInterviewFeedback(null);
                      setCandidateAnswer('');
                    }}
                    className={`flex-1 py-1 text-[10px] font-bold rounded-lg border transition ${
                      activeQuestionIdx === idx
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Question {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Question Card */}
            {filteredQuestions[activeQuestionIdx] && (
              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-3 shadow-md">
                <div>
                  <span className="text-[9px] font-bold text-purple-400 uppercase font-mono tracking-wider">
                    {filteredQuestions[activeQuestionIdx].type} Interview Round
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1 leading-snug">
                    "{filteredQuestions[activeQuestionIdx].question}"
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 bg-slate-950 p-2 rounded-xl border border-slate-800">
                    💡 <strong>Evaluator Focus:</strong> {filteredQuestions[activeQuestionIdx].context}
                  </p>
                </div>

                {/* Candidate Answer Box */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Your Proposed Answer:</label>
                  <textarea
                    rows={4}
                    value={candidateAnswer}
                    onChange={e => setCandidateAnswer(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-purple-500"
                    placeholder="Type your response using clear technical details or STAR method..."
                  />
                </div>

                {/* Fast Fill Sample Answer Button for Demo */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setCandidateAnswer(filteredQuestions[activeQuestionIdx].sampleAnswer)}
                    className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold underline"
                  >
                    Load Benchmark Answer
                  </button>
                </div>

                {/* Grade Answer Button */}
                <button
                  onClick={handleGradeInterviewAnswer}
                  disabled={isGrading || !candidateAnswer.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-2.5 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-50"
                >
                  {isGrading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                  {isGrading ? 'Evaluating Response...' : 'Submit & Get Assessment'}
                </button>

                {/* AI Feedback Display */}
                {interviewFeedback && (
                  <div className="bg-slate-950 p-3 rounded-xl border border-purple-500/30 space-y-2 mt-2">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                      <span className="text-[10px] font-bold text-white">Evaluation Score:</span>
                      <span className="text-sm font-extrabold text-emerald-400 font-mono">{interviewFeedback.score}/10</span>
                    </div>

                    <div className="text-[11px] text-slate-200 space-y-1">
                      <p><strong>Strengths:</strong> {interviewFeedback.strengths}</p>
                      <p className="text-amber-300"><strong>Gaps Detected:</strong> {interviewFeedback.gaps}</p>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[9px] font-bold text-indigo-400 uppercase font-mono block mb-0.5">Benchmark Model Answer:</span>
                      <p className="text-[10px] text-slate-300 leading-relaxed font-mono">{interviewFeedback.modelAnswer}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* 6. PROFILE & LOCAL STORAGE VIEW */}
        {/* ==================================================== */}
        {activeTab === 'profile' && (
          <div className="space-y-3.5 animate-in fade-in duration-150 text-xs">
            
            {/* Toast Feedback */}
            {profileSavedToast && (
              <div className="bg-emerald-500 text-slate-950 p-2.5 rounded-xl font-bold text-xs flex items-center justify-between shadow-lg animate-in fade-in">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Profile successfully saved to local device!
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

            {/* Profile Editing Form */}
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-2.5">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <User className="w-3.5 h-3.5 text-indigo-400" /> Edit Candidate Profile
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Name</label>
                  <input
                    type="text"
                    value={analyzerForm.name}
                    onChange={e => setAnalyzerForm({ ...analyzerForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block mb-0.5">College</label>
                  <input
                    type="text"
                    value={analyzerForm.college}
                    onChange={e => setAnalyzerForm({ ...analyzerForm, college: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Department</label>
                  <input
                    type="text"
                    value={analyzerForm.department}
                    onChange={e => setAnalyzerForm({ ...analyzerForm, department: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Year</label>
                  <input
                    type="text"
                    value={analyzerForm.year}
                    onChange={e => setAnalyzerForm({ ...analyzerForm, year: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Target Role</label>
                  <input
                    type="text"
                    value={analyzerForm.targetRole}
                    onChange={e => setAnalyzerForm({ ...analyzerForm, targetRole: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Target Company</label>
                  <input
                    type="text"
                    value={analyzerForm.targetCompany}
                    onChange={e => setAnalyzerForm({ ...analyzerForm, targetCompany: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Skills</label>
                <input
                  type="text"
                  value={analyzerForm.skills}
                  onChange={e => setAnalyzerForm({ ...analyzerForm, skills: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>

              {/* Save Profile Button */}
              <button
                onClick={handleSaveProfile}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition"
              >
                <Check className="w-3.5 h-3.5" /> Save Profile Locally
              </button>
            </div>

            {/* Privacy & Clear Data Controls */}
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Privacy & Local Storage
              </h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                All data, skills, roadmap task checkboxes, and profile records are stored completely on-device without external database servers.
              </p>
              <button
                onClick={() => {
                  if (confirm('Reset profile and clear all cached roadmap progress?')) {
                    localStorage.clear();
                    setProfile(DEFAULT_PROFILE);
                    setStages(DEFAULT_STAGES);
                    setTasks(DEFAULT_PLANNER_TASKS);
                    alert('Data wiped and reset to default.');
                  }
                }}
                className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold py-1.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Trash2 className="w-3 h-3" /> Reset Local Data
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ==================================================== */}
      {/* FLOATING AI ASSISTANT (COPILOT MODAL) */}
      {/* ==================================================== */}
      {showAiCopilot && (
        <div className="absolute inset-x-2 bottom-16 top-12 z-40 bg-slate-950/95 backdrop-blur-md rounded-3xl border border-indigo-500/40 p-3.5 flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">CareerPilot AI Copilot</h3>
                <p className="text-[9px] text-indigo-300">Contextual to {profile.targetRole}</p>
              </div>
            </div>
            <button
              onClick={() => setShowAiCopilot(false)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-900 rounded-lg border border-slate-800"
            >
              Close
            </button>
          </div>

          {/* Quick Inquiry Chips */}
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

          {/* Messages Feed */}
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

          {/* Input Box */}
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

      {/* Floating AI Copilot Trigger Button */}
      <button
        onClick={() => setShowAiCopilot(!showAiCopilot)}
        className="absolute right-4 bottom-14 z-30 w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-xl shadow-indigo-600/40 border border-white/20 flex items-center justify-center hover:scale-105 active:scale-95 transition"
        title="Open AI Career Copilot"
      >
        <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
      </button>

      {/* ==================================================== */}
      {/* BOTTOM ANDROID NAVIGATION BAR */}
      {/* ==================================================== */}
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
          onClick={() => setActiveTab('interview')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl transition ${
            activeTab === 'interview' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-[9px]">Interview</span>
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
