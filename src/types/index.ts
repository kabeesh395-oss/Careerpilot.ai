export type AppId = 'career_guidance' | 'fitpulse' | 'harmonix' | 'focuslist' | 'auraweather' | 'gemini_assistant' | 'bitedash' | 'custom_ai';

export interface AndroidApp {
  id: AppId;
  name: string;
  icon: string; // Lucide icon name or emoji
  category: string;
  color: string; // Tailwind color string or hex
  description: string;
  kotlinCode: string;
  xmlManifest: string;
  gradleCode: string;
  stringsXml: string;
}

export interface CareerGapAnalysisInput {
  task: 'career_gap_analysis';
  target_role: string;
  readiness_score: number;
  semantic_match?: number;
  strong_skills: string[];
  missing_skills: string[];
}

export interface CareerGapAnalysisResult {
  readiness_explanation: string;
  next_best_action: string;
  roadmap: {
    phase: string;
    duration: string;
    focus_skills: string[];
    action_items: string[];
  }[];
  recommended_projects: string[];
}

export interface InterviewPrepInput {
  task: 'interview_preparation';
  target_role: string;
  user_skills: string[];
}

export interface InterviewPrepResult {
  technical_questions: string[];
  system_design_questions: string[];
  behavioral_questions: string[];
}

export interface RecommendCareersInput {
  task: 'recommend_careers';
  user_skills: string[];
}

export interface RecommendCareersResult {
  recommended_roles: {
    role: string;
    match_reason: string;
    skills_to_add: string[];
  }[];
}

export interface GithubAnalysisInput {
  task: 'github_analysis';
  repo_name: string;
  languages: string[];
  has_readme: boolean;
  has_tests: boolean;
  commit_count: number;
}

export interface GithubAnalysisResult {
  profile_strength: string;
  improvement_suggestions: string[];
  employer_readiness: 'Low' | 'Medium' | 'High';
  employer_readiness_reason: string;
}

export interface ResumeAnalysisInput {
  resume_text: string;
  target_role: string;
}

export interface ResumeAnalysisResult {
  extracted_skills: string[];
  strong_skills: string[];
  missing_skills: string[];
  readiness_score: number;
  readiness_explanation: string;
  next_best_action: string;
  roadmap: {
    phase: string;
    duration: string;
    focus_skills: string[];
    action_items: string[];
  }[];
  recommended_projects: string[];
}

export interface CareerRoadmapPhase {
  phaseNumber: number;
  title: string;
  durationWeeks: number;
  focusArea: string;
  skillsToAcquire: string[];
  keyMilestones: string[];
  recommendedProject: string;
}

export interface CareerGuidanceResult {
  matchScorePercent: number;
  roleOverview: string;
  transferableSkills: string[];
  skillGapsToBridge: string[];
  phases: CareerRoadmapPhase[];
  recommendedResources: { title: string; type: string; url?: string }[];
  interviewPrepQuestions: { question: string; focus: string }[];
}

export interface CodeFile {
  path: string;
  name: string;
  language: 'kotlin' | 'xml' | 'groovy' | 'json';
  content: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'V' | 'D' | 'I' | 'W' | 'E';
  tag: string;
  message: string;
}

export interface CustomAppSpec {
  title: string;
  themeColor: string;
  accentColor: string;
  headerTitle: string;
  subtitle: string;
  description: string;
  features: {
    type: 'stat_card' | 'action_button' | 'list_item' | 'toggle_switch' | 'chart' | 'chat_input' | 'progress_bar';
    label: string;
    value?: string | number;
    icon?: string;
    details?: string;
  }[];
  generatedCode: string;
}
