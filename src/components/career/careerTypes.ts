export type CareerEnergyTier = 'danger' | 'average' | 'good' | 'gold';

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
  pillar: 'Skills' | 'Projects' | 'Resume' | 'Interview';
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
