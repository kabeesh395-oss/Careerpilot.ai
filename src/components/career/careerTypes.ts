export type CareerEnergyTier = 'danger' | 'average' | 'good' | 'gold';

export type SkillGapStatus = 'strong' | 'needs_improvement' | 'missing' | 'advanced';

export interface SkillGapItem {
  id: string;
  name: string;
  category: string;
  status: SkillGapStatus;
  whyItMatters: string;
  recommendedOrder: number;
  practiceTask: string;
  projectIdea: string;
  learningResource: string;
  milestone: string;
  currentProficiency: number; // 0 - 100
}

export interface ComprehensiveReadinessBreakdown {
  technicalSkills: number; // 0 - 100
  dsa: number; // 0 - 100
  projects: number; // 0 - 100
  resume: number; // 0 - 100
  github: number; // 0 - 100
  linkedin: number; // 0 - 100
  aptitude: number; // 0 - 100
  communication: number; // 0 - 100
  interview: number; // 0 - 100
}

export interface CareerPillars {
  skills: number; // 0 - 100
  projects: number; // 0 - 100
  resume: number; // 0 - 100
  interview: number; // 0 - 100
}

export interface PillarWeights {
  skills: number;
  projects: number;
  resume: number;
  interview: number;
}

export interface SkillEvidenceItem {
  id: string;
  name: string;
  category: string;
  status: 'strong' | 'partial' | 'not_detected';
  evidenceSource?: string;
  importance: 'Critical' | 'Important' | 'Bonus';
  notes?: string;
}

export interface DailyMission {
  id: string;
  title: string;
  estimatedMinutes: number;
  whyItMatters: string;
  pillar: 'Skills' | 'Projects' | 'Resume' | 'Interview' | 'DSA' | 'Aptitude';
  completed: boolean;
  xpReward: number;
  actionRoute: string;
  skillUnlocked: string;
}

export interface JobDescriptionAnalysis {
  id: string;
  roleTitle: string;
  companyName: string;
  jdText: string;
  matchScore: number;
  strongMatches: string[];
  partialMatches: string[];
  missingSkills: string[];
  shouldIApply: 'Recommended' | 'Apply with Prep' | 'Skill Gap Too High';
  recommendationReason: string;
  highPriorityKeywords: string[];
  createdAt: string;
}

export interface OpportunityMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'New Grad';
  alignmentScore: number;
  postedDate: string;
  requiredSkills: string[];
  matchingSkills: string[];
  missingSkills: string[];
  whyMatch: string;
  deadline: string;
  applied?: boolean;
}

export type ApplicationStatus = 'Saved' | 'Applied' | 'Assessment' | 'Interview' | 'Offer' | 'Rejected';

export interface TrackedApplication {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  appliedDate: string;
  interviewDate?: string;
  matchScore: number;
  notes: string;
  resumeVersion: string;
  salaryRange?: string;
}

export interface InterviewDimensionScore {
  correctness: number; // 0-10
  communication: number; // 0-10
  depth: number; // 0-10
  problemSolving: number; // 0-10
}

export interface EnhancedInterviewFeedback {
  overallScore: number;
  dimensions: InterviewDimensionScore;
  strengths: string[];
  weaknesses: string[];
  mostImportantImprovement: string;
  recommendedPracticeTopic: string;
  benchmarkModelAnswer: string;
}

export interface GitHubAuditResult {
  username: string;
  totalRepos: number;
  analyzedAt: string;
  overallScore: number; // 0 - 100
  languagesDetected: string[];
  portfolioStrength: 'Beginner' | 'Intermediate' | 'Production-Ready';
  readmeQualityScore: number; // 0 - 100
  commitCadenceScore: number; // 0 - 100
  projectComplexityScore: number; // 0 - 100
  keyFindings: string[];
  recommendedImprovements: string[];
  flagshipRepoSuggestion: string;
}

export interface LinkedInAuditResult {
  profileUrlOrUsername: string;
  completenessScore: number; // 0 - 100
  headlineScore: number; // 0 - 100
  aboutScore: number; // 0 - 100
  skillsScore: number; // 0 - 100
  headlineCritique: string;
  recommendedHeadlines: string[];
  aboutCritique: string;
  recommendedAboutTemplate: string;
  actionableChecklist: { task: string; done: boolean; impact: string }[];
}

export interface LearningResource {
  id: string;
  title: string;
  category: 'Programming' | 'DSA' | 'AI/ML' | 'Data Science' | 'Web Development' | 'Cloud & DevOps' | 'Cybersecurity' | 'Aptitude' | 'Communication & Interviews';
  platform: string;
  instructorOrOrg: string;
  pricing: 'FREE' | 'PAID' | 'FREEMIUM';
  certification: 'CERTIFICATE AVAILABLE' | 'NO CERTIFICATE';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  rating: number;
  url: string;
  summary: string;
  skillsTaught: string[];
  whyRecommended: string;
}

export interface DailyStudyBlock {
  id: string;
  timeSlot: string; // e.g. "30 min"
  category: 'DSA' | 'Technical Skill' | 'Project Development' | 'Aptitude' | 'Interview Practice';
  title: string;
  description: string;
  targetGoal: string;
  status: 'pending' | 'completed' | 'skipped';
  xp: number;
}

export interface UserProfile {
  name: string;
  college: string;
  degree: string;
  department: string;
  year: string;
  currentSkills: string[];
  programmingLanguages: string[];
  interests: string[];
  experienceLevel: string; // 'Zero Experience' | 'Student / Aspiring Intern' | 'Early Career'
  targetRole: string;
  targetCompany: string;
  github: string;
  linkedin: string;
  leetcode: string;
  streak: number;
  xp: number;
  dailyTimeBudget?: string; // '30m' | '1h' | '2h' | '3h+'
  isOnboarded?: boolean;
  isZeroExperience?: boolean;
  isUnsureCareer?: boolean;
  discoveredPaths?: string[];
  createdAt?: string;
  lastActiveAt?: string;
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
  completed: boolean;
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
  isStarterProject?: boolean;
}

export interface MockQuestion {
  id: string;
  type: 'Technical' | 'HR' | 'Behavioral';
  question: string;
  context: string;
  sampleAnswer: string;
  keyTopics: string[];
}

export interface CareerDiscoveryOption {
  role: string;
  tagline: string;
  suitabilityScore: number;
  whyGoodFit: string;
  starterStack: string[];
  firstMiniProject: string;
  timeToFirstJob: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionLinks?: { label: string; tab: string; subTab?: string }[];
}
