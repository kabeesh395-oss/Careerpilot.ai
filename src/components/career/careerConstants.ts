import { PillarWeights, SkillEvidenceItem, DailyMission, OpportunityMatch, TrackedApplication } from './careerTypes';

export const ROLE_PILLAR_WEIGHTS: Record<string, PillarWeights> = {
  'Machine Learning Engineer': { skills: 0.30, projects: 0.30, resume: 0.15, interview: 0.25 },
  'AI / ML Engineer': { skills: 0.30, projects: 0.30, resume: 0.15, interview: 0.25 },
  'Frontend Developer': { skills: 0.30, projects: 0.35, resume: 0.15, interview: 0.20 },
  'Backend Developer': { skills: 0.35, projects: 0.30, resume: 0.15, interview: 0.20 },
  'Full Stack Engineer': { skills: 0.30, projects: 0.30, resume: 0.20, interview: 0.20 },
  'Data Analyst / BI': { skills: 0.35, projects: 0.25, resume: 0.20, interview: 0.20 },
  'Cloud / DevOps Engineer': { skills: 0.35, projects: 0.30, resume: 0.15, interview: 0.20 },
  'Software Engineer (Generalist)': { skills: 0.30, projects: 0.30, resume: 0.15, interview: 0.25 }
};

export const DEFAULT_PILLAR_WEIGHTS: PillarWeights = {
  skills: 0.30,
  projects: 0.30,
  resume: 0.15,
  interview: 0.25
};

export const getPillarWeightsForRole = (role: string): PillarWeights => {
  const normalized = Object.keys(ROLE_PILLAR_WEIGHTS).find(
    k => role.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(role.toLowerCase())
  );
  return normalized ? ROLE_PILLAR_WEIGHTS[normalized] : DEFAULT_PILLAR_WEIGHTS;
};

export const DEFAULT_SKILL_EVIDENCE: SkillEvidenceItem[] = [
  {
    id: 'sk_python',
    name: 'Python 3.x & Algorithms',
    category: 'Core Language',
    status: 'strong',
    evidenceSource: 'Verified in GitHub repo & self-reported coursework',
    importance: 'Critical'
  },
  {
    id: 'sk_sql',
    name: 'Relational Database & SQL',
    category: 'Data & Storage',
    status: 'strong',
    evidenceSource: 'Documented in Resume coursework & projects',
    importance: 'Critical'
  },
  {
    id: 'sk_pytorch',
    name: 'PyTorch / Tensor Operations',
    category: 'AI & Deep Learning',
    status: 'partial',
    evidenceSource: 'Self-reported in profile (No verified public code repo detected)',
    importance: 'Critical'
  },
  {
    id: 'sk_fastapi',
    name: 'FastAPI REST Microservices',
    category: 'Backend Architecture',
    status: 'partial',
    evidenceSource: 'Mentioned in resume summary; no unit tests provided',
    importance: 'Important'
  },
  {
    id: 'sk_docker',
    name: 'Docker Containerization & Multi-stage builds',
    category: 'DevOps & Deployment',
    status: 'not_detected',
    evidenceSource: 'Docker was not detected in your available profile evidence.',
    importance: 'Critical'
  },
  {
    id: 'sk_vector_db',
    name: 'Vector Databases (ChromaDB / Qdrant)',
    category: 'AI & Search',
    status: 'not_detected',
    evidenceSource: 'Vector search was not detected in your available profile evidence.',
    importance: 'Important'
  },
  {
    id: 'sk_sys_design',
    name: 'High-Concurrency System Design',
    category: 'Architecture',
    status: 'partial',
    evidenceSource: 'Basic caching and DB indexing self-reported',
    importance: 'Important'
  },
  {
    id: 'sk_cicd',
    name: 'CI/CD Pipelines (GitHub Actions)',
    category: 'DevOps',
    status: 'not_detected',
    evidenceSource: 'Automated CI/CD workflows not detected in profile history.',
    importance: 'Bonus'
  }
];

export const DEFAULT_DAILY_MISSIONS: DailyMission[] = [
  {
    id: 'mis_1',
    title: 'Containerize FastAPI ML Model with Docker',
    estimatedMinutes: 40,
    whyItMatters: 'Closing the Docker containerization gap increases your ML Engineer role alignment by +12% in ATS screens.',
    pillar: 'Projects',
    completed: false,
    xpReward: 150,
    actionRoute: 'projects',
    skillUnlocked: 'Docker Multi-Stage'
  },
  {
    id: 'mis_2',
    title: 'Answer 1 System Design Interview Question',
    estimatedMinutes: 20,
    whyItMatters: 'Practicing latency trade-offs improves your Interview Depth score from 7.0 to 8.5.',
    pillar: 'Interview',
    completed: false,
    xpReward: 80,
    actionRoute: 'interview',
    skillUnlocked: 'System Design Interview'
  },
  {
    id: 'mis_3',
    title: 'Quantify 2 Resume Bullets with Impact Metrics',
    estimatedMinutes: 15,
    whyItMatters: 'Action verbs + quantified metrics improve ATS parsing score by +8 points.',
    pillar: 'Resume',
    completed: true,
    xpReward: 60,
    actionRoute: 'analyze',
    skillUnlocked: 'ATS Impact Writing'
  }
];

export const DEFAULT_OPPORTUNITIES: OpportunityMatch[] = [
  {
    id: 'opp_1',
    title: 'Machine Learning Engineering Intern (Summer 2026)',
    company: 'Google DeepMind',
    location: 'Mountain View, CA (Hybrid)',
    type: 'Internship',
    alignmentScore: 84,
    postedDate: '2 days ago',
    deadline: 'Rolling',
    requiredSkills: ['Python', 'PyTorch', 'Data Structures', 'Docker', 'FastAPI'],
    matchingSkills: ['Python', 'Data Structures', 'FastAPI'],
    missingSkills: ['Docker Containerization', 'Vector DB Embeddings'],
    whyMatch: 'Strong language proficiency and DSA foundations. Docker project completion will elevate alignment to 94%.',
    applied: false
  },
  {
    id: 'opp_2',
    title: 'Junior AI Backend Systems Developer',
    company: 'Stripe',
    location: 'San Francisco, CA / Remote',
    type: 'New Grad',
    alignmentScore: 78,
    postedDate: 'Yesterday',
    deadline: 'In 3 weeks',
    requiredSkills: ['Python', 'SQL', 'Distributed Systems', 'FastAPI', 'Redis'],
    matchingSkills: ['Python', 'SQL', 'FastAPI'],
    missingSkills: ['Redis Caching', 'Distributed Systems'],
    whyMatch: 'Excellent Python and SQL backend alignment. Needs caching and rate-limiting system design evidence.',
    applied: false
  },
  {
    id: 'opp_3',
    title: 'Applied AI & RAG Fellow',
    company: 'Anthropic Labs',
    location: 'Seattle, WA',
    type: 'Internship',
    alignmentScore: 91,
    postedDate: '3 days ago',
    deadline: 'Next Friday',
    requiredSkills: ['Python', 'Transformers', 'FastAPI', 'Vector Search'],
    matchingSkills: ['Python', 'FastAPI', 'Transformers'],
    missingSkills: ['ChromaDB Vector Indexing'],
    whyMatch: 'Outstanding fit for RAG & Model Evaluation. One vector search project bridges the remaining gap.',
    applied: true
  },
  {
    id: 'opp_4',
    title: 'Software Engineer - AI Platform (Early Career)',
    company: 'Databricks',
    location: 'Austin, TX',
    type: 'New Grad',
    alignmentScore: 72,
    postedDate: '4 days ago',
    deadline: 'In 1 month',
    requiredSkills: ['Python', 'C++', 'Spark', 'Docker', 'Kubernetes'],
    matchingSkills: ['Python', 'C++'],
    missingSkills: ['Spark', 'Kubernetes', 'Docker'],
    whyMatch: 'Strong fundamental algorithms. Cloud containerization required to pass technical filter.',
    applied: false
  }
];

export const DEFAULT_APPLICATIONS: TrackedApplication[] = [
  {
    id: 'app_1',
    company: 'Anthropic Labs',
    role: 'Applied AI & RAG Fellow',
    status: 'Interview',
    appliedDate: 'Oct 12, 2026',
    interviewDate: 'Nov 3, 2026 (Technical Round)',
    matchScore: 91,
    notes: 'Completed take-home vector search challenge. Preparing STAR stories for behavioral panel.',
    resumeVersion: 'Resume_ML_v3.pdf',
    salaryRange: '$52/hr'
  },
  {
    id: 'app_2',
    company: 'Google DeepMind',
    role: 'Machine Learning Engineering Intern',
    status: 'Assessment',
    appliedDate: 'Oct 18, 2026',
    interviewDate: 'Nov 8, 2026 (Online Assessment)',
    matchScore: 84,
    notes: 'Need to review Graph Algorithms and PyTorch memory layout before OA.',
    resumeVersion: 'Resume_ML_v3.pdf',
    salaryRange: '$58/hr'
  },
  {
    id: 'app_3',
    company: 'Stripe',
    role: 'Junior AI Backend Systems Developer',
    status: 'Applied',
    appliedDate: 'Oct 24, 2026',
    matchScore: 78,
    notes: 'Submitted with custom cover letter highlighting FastAPI latency benchmark.',
    resumeVersion: 'Resume_Backend_v2.pdf'
  },
  {
    id: 'app_4',
    company: 'OpenAI',
    role: 'Research Engineer Intern',
    status: 'Saved',
    appliedDate: 'Not applied yet',
    matchScore: 68,
    notes: 'Targeting application after completing Stage 4 Docker & Distributed Systems Capstone.',
    resumeVersion: 'Draft_ML_2026.pdf'
  }
];

export const SAMPLE_JOB_DESCRIPTIONS = [
  {
    title: 'Google - ML Engineering Intern (2026)',
    company: 'Google',
    role: 'Machine Learning Engineer',
    text: `About the role:
As a Machine Learning Engineering Intern, you will work with engineering teams to design, train, and deploy production ML systems.

Qualifications:
- Currently pursuing a BS, MS, or PhD in Computer Science, Data Science, or related technical field.
- Experience in Python, C++, or Java.
- Experience with deep learning frameworks like PyTorch or TensorFlow.
- Experience with REST APIs (FastAPI/Flask) and Containerization (Docker).
- Strong understanding of Data Structures, Algorithms, and System Design fundamentals.`
  },
  {
    title: 'Stripe - Backend AI Systems Engineer',
    company: 'Stripe',
    role: 'Backend Developer',
    text: `About Stripe:
Stripe builds economic infrastructure for the internet.

Requirements:
- Strong programming experience in Python, Go, or Java.
- Solid background in SQL databases, schema design, and query optimization.
- Hands-on experience building scalable microservices and RESTful APIs.
- Familiarity with Docker containerization, CI/CD pipelines, and Redis caching.
- Excellent communication and systematic problem-solving skills.`
  }
];
