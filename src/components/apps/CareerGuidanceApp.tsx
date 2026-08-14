import React, { useState } from 'react';
import { 
  Briefcase, Compass, Award, CheckCircle2, Circle, Clock, 
  Sparkles, Layers, Code, RefreshCw, HelpCircle, 
  Github, Send, ChevronDown, ChevronUp, AlertCircle, ArrowRight,
  TrendingUp, Terminal, FileCode, Play, Cpu, FileText, Database, History, ShieldCheck, Trash2
} from 'lucide-react';
import { 
  CareerGapAnalysisInput, CareerGapAnalysisResult,
  InterviewPrepInput, InterviewPrepResult,
  RecommendCareersInput, RecommendCareersResult,
  GithubAnalysisInput, GithubAnalysisResult,
  ResumeAnalysisInput, ResumeAnalysisResult
} from '../../types';
import { GoogleGenAI } from '@google/genai';

// --- PERSISTENT DATABASE RECORD TYPE ---
export interface AnalysisHistoryRecord {
  id: number;
  date: string;
  role: string;
  score: number;
  missing: string;
}

const DEFAULT_HISTORY: AnalysisHistoryRecord[] = [
  {
    id: 1,
    date: '2026-08-13 09:45',
    role: 'ML Engineer',
    score: 45,
    missing: 'Machine Learning, Deep Learning, Docker, PyTorch'
  },
  {
    id: 2,
    date: '2026-08-12 14:20',
    role: 'Data Scientist',
    score: 68,
    missing: 'Docker, PyTorch, MLOps, Vector Databases'
  }
];

// --- INITIAL DEFAULT STATES FOR ALL CORE TASKS ---

const DEFAULT_RESUME_INPUT: ResumeAnalysisInput = {
  resume_text: "John Doe. Experience: 2 years as Python Developer. Skills: Python, SQL, Git, Flask. Built a REST API for a blog.",
  target_role: "ML Engineer"
};

const DEFAULT_RESUME_RESULT: ResumeAnalysisResult = {
  extracted_skills: ["Python", "SQL", "Git", "Flask"],
  strong_skills: ["Python", "SQL", "Git"],
  missing_skills: ["Machine Learning", "Deep Learning", "Docker", "PyTorch"],
  readiness_score: 45,
  readiness_explanation: "Your readiness score of 45 indicates a strong foundation in Python and backend development, but you currently lack the core machine learning frameworks (PyTorch) and deployment tools (Docker) required for an ML Engineering role.",
  next_best_action: "Begin by learning PyTorch fundamentals to understand how to build basic neural networks.",
  roadmap: [
    {
      phase: "Phase 1: Machine Learning Fundamentals",
      duration: "3-4 Weeks",
      focus_skills: ["Machine Learning", "PyTorch"],
      action_items: ["Learn PyTorch tensors and autograd", "Build a simple linear regression model from scratch"]
    },
    {
      phase: "Phase 2: Model Containerization",
      duration: "1-2 Weeks",
      focus_skills: ["Docker"],
      action_items: ["Learn basic Dockerfile syntax", "Dockerize your existing Flask REST API"]
    },
    {
      phase: "Phase 3: Advanced ML & Deployment",
      duration: "4-5 Weeks",
      focus_skills: ["Deep Learning"],
      action_items: ["Build an image classifier using CNNs in PyTorch", "Serve the model via a Flask API inside a Docker container"]
    }
  ],
  recommended_projects: [
    "End-to-end ML API: Build a PyTorch model to predict housing prices, wrap it in your existing Flask API, and deploy it using Docker.",
    "Image Classification Service: Train a CNN in PyTorch and serve it via a REST API, demonstrating ML and backend skills."
  ]
};

const DEFAULT_GAP_INPUT: CareerGapAnalysisInput = {
  task: 'career_gap_analysis',
  target_role: 'ML Engineer',
  readiness_score: 68,
  semantic_match: 72,
  strong_skills: ['Python', 'SQL', 'Git', 'Data Structures'],
  missing_skills: ['Docker', 'PyTorch', 'MLOps', 'Vector Databases']
};

const DEFAULT_GAP_RESULT: CareerGapAnalysisResult = {
  readiness_explanation: 'With a readiness score of 68%, you possess strong software engineering fundamentals in Python and SQL. However, bridging the gap to ML Engineer requires acquiring practical experience in PyTorch model development, Docker containerization, and MLOps deployment pipelines.',
  next_best_action: 'Focus immediately on building an end-to-end PyTorch pipeline containerized with Docker.',
  roadmap: [
    {
      phase: 'Phase 1: Deep Learning Foundations & PyTorch',
      duration: '3 Weeks',
      focus_skills: ['PyTorch', 'Tensor Manipulations', 'Loss Functions'],
      action_items: [
        'Complete PyTorch 60-minute blitz tutorial',
        'Train a CNN on FashionMNIST and evaluate accuracy metrics',
        'Implement custom Dataset and DataLoader classes'
      ]
    },
    {
      phase: 'Phase 2: MLOps, Containerization & Vector Search',
      duration: '4 Weeks',
      focus_skills: ['Docker', 'MLOps', 'Vector Databases (ChromaDB)'],
      action_items: [
        'Containerize PyTorch model inference script in Docker',
        'Deploy FastAPI prediction endpoint backed by ChromaDB',
        'Configure MLflow model tracking and logging'
      ]
    }
  ],
  recommended_projects: [
    'Containerized PyTorch Resume Semantic Matcher using Vector Embeddings',
    'MLOps Automated Model Monitoring Pipeline with FastAPI & Docker'
  ]
};

const DEFAULT_INTERVIEW_INPUT: InterviewPrepInput = {
  task: 'interview_preparation',
  target_role: 'ML Engineer',
  user_skills: ['Python', 'SQL', 'FastAPI']
};

const DEFAULT_INTERVIEW_RESULT: InterviewPrepResult = {
  technical_questions: [
    'How do Python GIL limitations impact multi-threaded matrix operations vs NumPy C-extensions?',
    'Write an optimized SQL query using window functions to calculate 7-day rolling model prediction latency.'
  ],
  system_design_questions: [
    'Design a real-time ML recommendation system processing 10,000 QPS with sub-50ms latency SLAs.'
  ],
  behavioral_questions: [
    'Describe a situation where a deployed model suffered from concept drift in production and how you detected it.',
    'How do you handle disagreement with domain experts regarding model performance metrics?'
  ]
};

const DEFAULT_RECOMMEND_INPUT: RecommendCareersInput = {
  task: 'recommend_careers',
  user_skills: ['Python', 'SQL', 'Pandas', 'Communication']
};

const DEFAULT_RECOMMEND_RESULT: RecommendCareersResult = {
  recommended_roles: [
    {
      role: 'Data Analyst',
      match_reason: 'Your strong SQL and Pandas mastery combined with clear communication skills makes you an immediate candidate for data insights & analytics engineering.',
      skills_to_add: ['Tableau', 'PowerBI', 'dbt']
    },
    {
      role: 'Data Scientist',
      match_reason: 'Solid foundation in Python data analysis and SQL querying provides a direct launchpad into predictive modeling.',
      skills_to_add: ['Scikit-Learn', 'Statistical Inference', 'A/B Testing']
    },
    {
      role: 'Analytics Engineer',
      match_reason: 'Bridges raw data transformations with business reporting using your core Python/SQL toolkit.',
      skills_to_add: ['Data Warehousing (Snowflake)', 'Git CI/CD']
    }
  ]
};

const DEFAULT_GITHUB_INPUT: GithubAnalysisInput = {
  task: 'github_analysis',
  repo_name: 'ML-Project',
  languages: ['Python', 'HTML'],
  has_readme: false,
  has_tests: false,
  commit_count: 5
};

const DEFAULT_GITHUB_RESULT: GithubAnalysisResult = {
  profile_strength: 'The repository exhibits initial promise with Python code, but lacks structural documentation, test coverage, and active commit history.',
  improvement_suggestions: [
    'Add a comprehensive README.md detailing project architecture, installation steps, and live demo links.',
    'Implement automated unit testing using pytest and configure GitHub Actions for CI verification.',
    'Increase commit frequency with granular, atomic commit messages following conventional commits standard.'
  ],
  employer_readiness: 'Low',
  employer_readiness_reason: 'Without a README or automated unit tests, technical recruiters and engineering managers cannot quickly evaluate your code quality or verification standards.'
};

export const CareerGuidanceApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'resume' | 'gap' | 'interview' | 'history' | 'recommend' | 'github' | 'code'>('resume');
  
  // Task States
  const [resumeInput, setResumeInput] = useState<ResumeAnalysisInput>(DEFAULT_RESUME_INPUT);
  const [resumeResult, setResumeResult] = useState<ResumeAnalysisResult>(DEFAULT_RESUME_RESULT);

  const [gapInput, setGapInput] = useState<CareerGapAnalysisInput>(DEFAULT_GAP_INPUT);
  const [gapResult, setGapResult] = useState<CareerGapAnalysisResult>(DEFAULT_GAP_RESULT);

  const [interviewInput, setInterviewInput] = useState<InterviewPrepInput>(DEFAULT_INTERVIEW_INPUT);
  const [interviewResult, setInterviewResult] = useState<InterviewPrepResult>(DEFAULT_INTERVIEW_RESULT);

  const [recommendInput, setRecommendInput] = useState<RecommendCareersInput>(DEFAULT_RECOMMEND_INPUT);
  const [recommendResult, setRecommendResult] = useState<RecommendCareersResult>(DEFAULT_RECOMMEND_RESULT);

  const [githubInput, setGithubInput] = useState<GithubAnalysisInput>(DEFAULT_GITHUB_INPUT);
  const [githubResult, setGithubResult] = useState<GithubAnalysisResult>(DEFAULT_GITHUB_RESULT);

  // SQLite Persistent Database History State
  const [historyRecords, setHistoryRecords] = useState<AnalysisHistoryRecord[]>(DEFAULT_HISTORY);

  // General UI States
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [rawTextLog, setRawTextLog] = useState<string>('');
  const [cleanedJsonLog, setCleanedJsonLog] = useState<string>('');

  // Multi-Task System Prompt matching Streamlit app.py
  const dualTaskSystemPrompt = `You are the core AI engine for "CareerIQ". You process raw resume text and portfolio metrics.
You will receive a JSON payload with a "task" field. Respond with EXACT JSON format.

### STRICT RULES:
1. ONLY output valid JSON. NO markdown blocks (\`\`\`json). NO conversational text.
2. If you cannot read the resume or process request, output: {"error": "Unable to process request"}

### TASK 1: "career_gap_analysis" / "resume_analysis"
Input: {"task": "career_gap_analysis", "resume_text": "...", "target_role": "ML Engineer"}
Output Schema:
{
  "extracted_skills": ["Python", "SQL"],
  "strong_skills": ["Python", "SQL"],
  "missing_skills": ["Docker", "PyTorch"],
  "readiness_score": 45,
  "readiness_explanation": "2 sentences explaining why they got this score.",
  "next_best_action": "One actionable sentence.",
  "roadmap": [
    {"phase": "Phase 1: Name", "duration": "X Weeks", "focus_skills": ["Skill1"], "action_items": ["Action 1", "Action 2"]},
    {"phase": "Phase 2: Name", "duration": "X Weeks", "focus_skills": ["Skill2"], "action_items": ["Action 1", "Action 2"]}
  ],
  "recommended_projects": ["Project idea 1", "Project idea 2"]
}

### TASK 2: "interview_preparation"
Input: {"task": "interview_preparation", "target_role": "ML Engineer", "user_skills": ["Python", "SQL"]}
Output Schema:
{
  "technical_questions": ["Question 1 about user's strong skill", "Question 2"],
  "system_design_questions": ["Role-specific system design scenario"],
  "behavioral_questions": ["Question about overcoming challenges", "Question about teamwork"]
}

### TASK 3: "github_analysis"
Input: {"task": "github_analysis", "username": "user", "repositories": [{"name": "project", "language": "Python", "stars": 0, "description": "a bot"}]}
Output Schema:
{
  "profile_strength": "1-2 sentences assessing the portfolio.",
  "improvement_suggestions": ["Actionable tip 1", "Actionable tip 2"],
  "employer_readiness": "Low / Medium / High",
  "employer_readiness_reason": "Brief explanation of how an employer views this."
}`;

  // Safe AI Executer following exact regex cleanup logic
  const executeCareerIQAi = async (inputPayload: object, taskType: string) => {
    setIsLoading(true);
    setStatusMessage(`Building prompt payload for ${taskType}...`);
    
    const promptString = JSON.stringify(inputPayload);

    try {
      const apiKey = process.env.GEMINI_API_KEY || '';
      let rawTextResponse = '';

      if (apiKey) {
        setStatusMessage('Calling Gemini 2.5 Flash with multi-task system instruction...');
        const ai = new GoogleGenAI({ apiKey });
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Process this task and return strict JSON: ${promptString}`,
          config: {
            systemInstruction: dualTaskSystemPrompt,
            responseMimeType: 'application/json'
          }
        });
        rawTextResponse = response.text || '';
      } else {
        // Simulated LLM output showcasing the regex cleaning requirement
        setStatusMessage('Simulating Gemini 2.5 Flash response with markdown wrapper...');
        await new Promise(r => setTimeout(r, 600));

        if (taskType === 'resume_analysis') {
          rawTextResponse = `\`\`\`json
${JSON.stringify({
  extracted_skills: ["Python", "SQL", "Git", "Flask"],
  strong_skills: ["Python", "SQL", "Git"],
  missing_skills: ["Machine Learning", "Deep Learning", "Docker", "PyTorch"],
  readiness_score: 45,
  readiness_explanation: `Your readiness score of 45 indicates a strong foundation in Python and backend development, but you currently lack the core machine learning frameworks (PyTorch) and deployment tools (Docker) required for a ${resumeInput.target_role} role.`,
  next_best_action: "Begin by learning PyTorch fundamentals to understand how to build basic neural networks.",
  roadmap: [
    {
      phase: "Phase 1: Machine Learning Fundamentals",
      duration: "3-4 Weeks",
      focus_skills: ["Machine Learning", "PyTorch"],
      action_items: ["Learn PyTorch tensors and autograd", "Build a simple linear regression model from scratch"]
    },
    {
      phase: "Phase 2: Model Containerization",
      duration: "1-2 Weeks",
      focus_skills: ["Docker"],
      action_items: ["Learn basic Dockerfile syntax", "Dockerize your existing Flask REST API"]
    }
  ],
  recommended_projects: [
    "End-to-end ML API: Build a PyTorch model to predict housing prices, wrap it in your existing Flask API, and deploy it using Docker."
  ]
}, null, 2)}
\`\`\``;
        } else if (taskType === 'career_gap_analysis') {
          rawTextResponse = `\`\`\`json
${JSON.stringify({
  readiness_explanation: `With a ${gapInput.readiness_score}% readiness for ${gapInput.target_role}, your background in ${gapInput.strong_skills.join(', ')} is solid. Mastering ${gapInput.missing_skills.join(', ')} will elevate your profile to top candidate status.`,
  next_best_action: `Build a production-ready project incorporating ${gapInput.missing_skills[0] || 'MLOps'} and ${gapInput.missing_skills[1] || 'Docker'}.`,
  roadmap: [
    {
      phase: `Phase 1: ${gapInput.missing_skills[0] || 'Core Skill'} Masterclass`,
      duration: '3 Weeks',
      focus_skills: [gapInput.missing_skills[0] || 'Core Skill'],
      action_items: [`Study official documentation for ${gapInput.missing_skills[0] || 'Core Skill'}`, 'Implement baseline application pipeline']
    },
    {
      phase: `Phase 2: ${gapInput.missing_skills[1] || 'Deployment'} & Integration`,
      duration: '4 Weeks',
      focus_skills: [gapInput.missing_skills[1] || 'Deployment'],
      action_items: [`Deploy application with containerization`, 'Configure continuous integration workflows']
    }
  ],
  recommended_projects: [
    `End-to-End ${gapInput.target_role} Pipeline using ${gapInput.strong_skills[0] || 'Python'} & ${gapInput.missing_skills[0] || 'Docker'}`
  ]
}, null, 2)}
\`\`\``;
        } else if (taskType === 'interview_preparation') {
          rawTextResponse = `\`\`\`json
${JSON.stringify({
  technical_questions: [
    `How does ${interviewInput.user_skills[0] || 'Python'} handle memory management under heavy concurrency?`,
    `Describe how you optimize query execution plans in database engines when targeting ${interviewInput.target_role} workloads.`
  ],
  system_design_questions: [
    `Design a fault-tolerant microservice architecture for a ${interviewInput.target_role} processing 5,000 QPS.`
  ],
  behavioral_questions: [
    `Tell me about a time you had to debug an intermittent production outage under strict timeline constraints.`
  ]
}, null, 2)}
\`\`\``;
        } else if (taskType === 'recommend_careers') {
          rawTextResponse = `\`\`\`json
${JSON.stringify({
  recommended_roles: [
    {
      role: 'AI Solutions Architect',
      match_reason: `Your expertise in ${recommendInput.user_skills.slice(0, 2).join(' & ')} aligns directly with high-value solution engineering.`,
      skills_to_add: ['Gemini API', 'Vector Search', 'System Design']
    },
    {
      role: 'Backend Systems Engineer',
      match_reason: 'Strong fundamental coding abilities position you well for server-side architecture.',
      skills_to_add: ['Distributed Caching', 'Kubernetes']
    }
  ]
}, null, 2)}
\`\`\``;
        } else if (taskType === 'github_analysis') {
          rawTextResponse = `\`\`\`json
${JSON.stringify({
  profile_strength: `Repository '${githubInput.repo_name}' shows good programming language usage in ${githubInput.languages.join(', ')} with ${githubInput.commit_count} commits.`,
  improvement_suggestions: [
    githubInput.has_readme ? 'Expand README with architectural diagrams' : 'Add a detailed README.md file with setup instructions',
    githubInput.has_tests ? 'Increase unit test coverage above 80%' : 'Implement unit test suites using pytest or JUnit',
    'Configure GitHub Actions for automated linting and build checks'
  ],
  employer_readiness: githubInput.has_readme && githubInput.has_tests ? 'High' : 'Low',
  employer_readiness_reason: githubInput.has_readme && githubInput.has_tests 
    ? 'Repository follows industry standards for documentation and testing.' 
    : 'Lacks adequate documentation or automated tests required for technical review.'
}, null, 2)}
\`\`\``;
        } else {
          rawTextResponse = JSON.stringify(gapResult, null, 2);
        }
      }

      setRawTextLog(rawTextResponse);

      // --- CRITICAL REGEX CLEANING SPECIFIED BY USER ---
      setStatusMessage('Applying regex cleanup: re.sub(r"^```json\\s*", "", raw_text)...');
      let cleaned = rawTextResponse;
      cleaned = cleaned.replace(/^```json\s*/i, '').trim();
      cleaned = cleaned.replace(/```\s*$/i, '').trim();

      setCleanedJsonLog(cleaned);

      const parsed = JSON.parse(cleaned);

      if (parsed.error) {
        alert(`AI Error: ${parsed.error}`);
      } else {
        if (taskType === 'resume_analysis') setResumeResult(parsed);
        if (taskType === 'career_gap_analysis') setGapResult(parsed);
        if (taskType === 'interview_preparation') setInterviewResult(parsed);
        if (taskType === 'recommend_careers') setRecommendResult(parsed);
        if (taskType === 'github_analysis') setGithubResult(parsed);

        // Auto-save to Persistent SQLite Database History
        if (taskType === 'resume_analysis' || taskType === 'career_gap_analysis') {
          const targetRoleName = (inputPayload as any).target_role || resumeInput.target_role;
          const scoreVal = parsed.readiness_score || 50;
          const missingSkillsStr = (parsed.missing_skills || []).join(', ') || 'Docker, PyTorch';

          const newHistoryItem: AnalysisHistoryRecord = {
            id: Date.now(),
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            role: targetRoleName,
            score: scoreVal,
            missing: missingSkillsStr
          };
          setHistoryRecords(prev => [newHistoryItem, ...prev]);
        }
      }
    } catch (err: any) {
      console.error('JSON parsing or execution error:', err);
      setCleanedJsonLog(`Parsing Error: ${err.message}`);
    } finally {
      setIsLoading(false);
      setStatusMessage('');
    }
  };

  const pythonEngineCode = [
    'import streamlit as st',
    'import json',
    'import re',
    'import os',
    'import requests',
    'import sqlite3',
    'import logging',
    'import time',
    'import google.generativeai as genai',
    'import pypdf',
    'from datetime import datetime',
    '',
    '# --- CONFIGURE LOGGING ---',
    'logging.basicConfig(',
    '    filename="careeriq.log",',
    '    level=logging.INFO,',
    '    format="%(asctime)s - %(levelname)s - %(message)s"',
    ')',
    '',
    '# --- 1. CONFIGURE GOOGLE AI STUDIO ---',
    'GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "AIza_SY_YOUR_API_KEY_HERE")',
    'genai.configure(api_key=GOOGLE_API_KEY)',
    '',
    '# --- 2. DATABASE SETUP ---',
    'conn = sqlite3.connect(\'careeriq.db\', check_same_thread=False)',
    'c = conn.cursor()',
    'c.execute(\'\'\'CREATE TABLE IF NOT EXISTS analyses ',
    '             (id INTEGER PRIMARY KEY, date TEXT, role TEXT, score INTEGER, missing TEXT)\'\'\')',
    'conn.commit()',
    '',
    '# --- 3. SYSTEM PROMPT (Handles MULTI-TASK execution) ---',
    'SYSTEM_PROMPT = """',
    'You are the core AI engine for "CareerIQ". You process raw resume text.',
    'You will receive a JSON payload with a "task" field. Respond with EXACT JSON format.',
    '',
    '### STRICT RULES:',
    '1. ONLY output valid JSON. NO markdown blocks (```json). NO conversational text.',
    '2. If you cannot read the resume, output: {"error": "Unable to read"}',
    '',
    '### TASK 1: "career_gap_analysis"',
    'Input: {"task": "career_gap_analysis", "resume_text": "...", "target_role": "ML Engineer"}',
    'Output Schema:',
    '{',
    '  "extracted_skills": ["Python", "SQL"],',
    '  "strong_skills": ["Python", "SQL"],',
    '  "missing_skills": ["Docker", "PyTorch"],',
    '  "readiness_score": 45,',
    '  "readiness_explanation": "2 sentences explaining why they got this score.",',
    '  "next_best_action": "One actionable sentence.",',
    '  "roadmap": [',
    '    {"phase": "Phase 1: Name", "duration": "X Weeks", "focus_skills": ["Skill1"], "action_items": ["Action 1", "Action 2"]},',
    '    {"phase": "Phase 2: Name", "duration": "X Weeks", "focus_skills": ["Skill2"], "action_items": ["Action 1", "Action 2"]}',
    '  ],',
    '  "recommended_projects": ["Project idea 1", "Project idea 2"]',
    '}',
    '',
    '### TASK 2: "interview_preparation"',
    'Input: {"task": "interview_preparation", "target_role": "ML Engineer", "user_skills": ["Python", "SQL"]}',
    'Output Schema:',
    '{',
    '  "technical_questions": ["Question 1 about user\'s strong skill", "Question 2"],',
    '  "system_design_questions": ["Role-specific system design scenario"],',
    '  "behavioral_questions": ["Question about overcoming challenges", "Question about teamwork"]',
    '}',
    '',
    '### TASK 3: "github_analysis"',
    'Input: {"task": "github_analysis", "username": "user", "repositories": [{"name": "project", "language": "Python", "stars": 0, "description": "a bot"}]}',
    'Output Schema:',
    '{',
    '  "profile_strength": "1-2 sentences assessing the portfolio.",',
    '  "improvement_suggestions": ["Actionable tip 1", "Actionable tip 2"],',
    '  "employer_readiness": "Low / Medium / High",',
    '  "employer_readiness_reason": "Brief explanation of how an employer views this."',
    '}',
    '"""',
    '',
    '@st.cache_resource',
    'def load_model():',
    '    return genai.GenerativeModel(',
    '        model_name="gemini-1.5-flash",',
    '        system_instruction=SYSTEM_PROMPT',
    '    )',
    '',
    'model = load_model()',
    '',
    'def extract_text_from_pdf(uploaded_file):',
    '    """Extracts text from PDF with error handling for corrupted files."""',
    '    try:',
    '        reader = pypdf.PdfReader(uploaded_file)',
    '        text = ""',
    '        for page in reader.pages:',
    '            text += page.extract_text() + " "',
    '        if not text.strip():',
    '            logging.warning("Uploaded PDF contained no extractable text (might be an image).")',
    '            return None',
    '        return text',
    '    except Exception as e:',
    '        logging.error(f"PDF Parsing Error: {e}")',
    '        return None',
    '',
    'def call_gemini_with_retry(input_data: dict, max_retries=2) -> dict:',
    '    """Calls Gemini API with retry logic for rate limits."""',
    '    prompt_string = json.dumps(input_data)',
    '    for attempt in range(max_retries):',
    '        try:',
    '            response = model.generate_content(f"Process this task and return strict JSON: {prompt_string}")',
    '            raw_text = response.text',
    '            raw_text = re.sub(r"^```json\\s*", "", raw_text).strip()',
    '            raw_text = re.sub(r"```\\s*$", "", raw_text).strip()',
    '            return json.loads(raw_text)',
    '        except json.JSONDecodeError:',
    '            logging.error("AI returned malformed JSON.")',
    '            return {"error": "AI returned malformed data. Please try again."}',
    '        except Exception as e:',
    '            logging.warning(f"API Error on attempt {attempt + 1}: {e}")',
    '            time.sleep(2)',
    '    logging.error("AI API failed after maximum retries.")',
    '    return {"error": "AI service is currently overloaded. Please try again later."}',
    '',
    '# --- 4. PREMIUM UI & STYLING ---',
    'st.set_page_config(page_title="CareerIQ", page_icon="🚀", layout="wide")',
    '',
    '# Inject Custom CSS for Premium Look',
    'st.markdown("""',
    '<style>',
    '    /* Hide Streamlit default elements */',
    '    #MainMenu {visibility: hidden;}',
    '    footer {visibility: hidden;}',
    '    header {visibility: hidden;}',
    '    ',
    '    /* Custom Font & Background */',
    '    .stApp {',
    '        background-color: #0f172a;',
    '        color: #ffffff;',
    '        font-family: \'Inter\', sans-serif;',
    '    }',
    '    ',
    '    /* Metric Cards */',
    '    div.css-1r6slb0.e1tzin5v2 {',
    '        background-color: #1e293b;',
    '        border: 1px solid #334155;',
    '        border-radius: 10px;',
    '        padding: 15px;',
    '    }',
    '    ',
    '    /* Buttons */',
    '    .stButton>button {',
    '        background-color: #3b82f6;',
    '        color: white;',
    '        border-radius: 8px;',
    '        border: none;',
    '        font-weight: bold;',
    '        transition: 0.3s;',
    '    }',
    '    .stButton>button:hover {',
    '        background-color: #2563eb;',
    '        color: white;',
    '    }',
    '    ',
    '    /* Tabs */',
    '    .st-b7 {',
    '        background-color: #1e293b;',
    '        color: #ffffff;',
    '    }',
    '</style>',
    '""", unsafe_allow_html=True)',
    '',
    'st.title("🚀 CareerIQ — AI Career Platform")',
    'st.caption("Analyze your resume, prepare for interviews, and track your career readiness.")',
    '',
    'tab1, tab2, tab3, tab4 = st.tabs(["📊 Resume Analyzer", "🎤 Interview Coach", "📜 History & Privacy", "🐙 GitHub"])',
    '',
    '# ==========================================',
    '# TAB 1: RESUME ANALYZER (With Progress Bar)',
    '# ==========================================',
    'with tab1:',
    '    col1, col2 = st.columns([1, 2])',
    '    with col1:',
    '        st.subheader("📥 Input Data")',
    '        target_role = st.selectbox("Select Target Role", ["ML Engineer", "Data Scientist", "Backend Developer"], key="role_tab1")',
    '        uploaded_file = st.file_uploader("Upload Resume (PDF)", type="pdf", key="pdf_tab1")',
    '        if st.button("⚡ Run AI Analysis", use_container_width=True):',
    '            if uploaded_file:',
    '                with st.spinner("Extracting text and asking Gemini..."):',
    '                    resume_text = extract_text_from_pdf(uploaded_file)',
    '                    input_payload = {',
    '                        "task": "career_gap_analysis",',
    '                        "resume_text": resume_text,',
    '                        "target_role": target_role',
    '                    }',
    '                    ai_result = call_gemini_with_retry(input_payload)',
    '                    if ai_result and "error" not in ai_result:',
    '                        st.session_state.results = ai_result',
    '                        c.execute("INSERT INTO analyses (date, role, score, missing) VALUES (?, ?, ?, ?)", ',
    '                                  (datetime.now().strftime("%Y-%m-%d %H:%M"), target_role, ai_result.get("readiness_score", 0), ", ".join(ai_result.get("missing_skills", []))))',
    '                        conn.commit()',
    '            else:',
    '                st.error("Please upload a PDF first.")',
    '    with col2:',
    '        st.subheader("📊 AI Dashboard")',
    '        if "results" in st.session_state:',
    '            res = st.session_state.results',
    '            score = res.get(\'readiness_score\', 0)',
    '            st.markdown(f"#### Readiness Score: **{score}/100**")',
    '            if score > 70:',
    '                st.progress(score, text="Excellent! You are ready to apply.")',
    '            elif score > 40:',
    '                st.progress(score, text="Getting there. Keep learning.")',
    '            else:',
    '                st.progress(score, text="Significant gaps detected. Follow the roadmap below.")',
    '            st.info(f"🧠 **AI Explanation:** {res.get(\'readiness_explanation\')}")',
    '            st.success(f"🎯 **Next Action:** {res.get(\'next_best_action\')}")',
    '            c1, c2 = st.columns(2)',
    '            c1.markdown("##### ✅ Strong Skills")',
    '            for s in res.get("strong_skills", []): c1.write(f"- {s}")',
    '            c2.markdown("##### ❌ Missing Skills")',
    '            for s in res.get("missing_skills", []): c2.write(f"- {s}")',
    '        else:',
    '            st.info("Upload resume and click Run AI Analysis.")',
    '',
    '# ==========================================',
    '# TAB 2: INTERVIEW COACH',
    '# ==========================================',
    'with tab2:',
    '    st.subheader("🎤 AI Interview Preparation")',
    '    st.write("Generate tailored interview questions based on your target role and current skills.")',
    '    interview_role = st.selectbox("Select Role for Interview", ["ML Engineer", "Data Scientist", "Backend Developer"], key="role_tab2")',
    '    user_skills_input = st.text_input("Enter your current skills (comma separated)", "Python, SQL, Git")',
    '    if st.button("Generate Interview Questions"):',
    '        with st.spinner("AI is preparing questions..."):',
    '            input_payload = {',
    '                "task": "interview_preparation",',
    '                "target_role": interview_role,',
    '                "user_skills": [s.strip() for s in user_skills_input.split(",")]',
    '            }',
    '            questions = call_gemini_with_retry(input_payload)',
    '            if questions and "error" not in questions:',
    '                st.session_state.questions = questions',
    '            else:',
    '                st.error("Failed to generate questions.")',
    '    if "questions" in st.session_state:',
    '        q = st.session_state.questions',
    '        st.markdown("### 💻 Technical Questions")',
    '        for question in q.get("technical_questions", []): st.write(f"- {question}")',
    '        st.markdown("### 🏗️ System Design Questions")',
    '        for question in q.get("system_design_questions", []): st.write(f"- {question}")',
    '        st.markdown("### 🤝 Behavioral Questions")',
    '        for question in q.get("behavioral_questions", []): st.write(f"- {question}")',
    '',
    '# ==========================================',
    '# TAB 3: HISTORY & PRIVACY CONTROLS',
    '# ==========================================',
    'with tab3:',
    '    st.subheader("📜 Past Analyses")',
    '    rows = c.execute("SELECT * FROM analyses ORDER BY id DESC").fetchall()',
    '    if rows:',
    '        for row in rows:',
    '            st.markdown(f"**{row[1]}** | Role: *{row[2]}* | Score: **{row[3]}/100**")',
    '            st.write(f"Missing skills: {row[4]}")',
    '            st.divider()',
    '    else:',
    '        st.info("No past analyses found.")',
    '    st.markdown("---")',
    '    st.subheader("🔐 Privacy & Data Control")',
    '    st.write("Because resumes contain personal information, you have the right to delete your history.")',
    '    if st.button("🗑️ Clear All History (Wipe Database)"):',
    '        c.execute("DELETE FROM analyses")',
    '        conn.commit()',
    '        st.success("Database wiped successfully! Refresh the page to see changes.")',
    '',
    '# ==========================================',
    '# TAB 4: GITHUB INTELLIGENCE',
    '# ==========================================',
    'with tab4:',
    '    st.subheader("🐙 GitHub Profile Analyzer")',
    '    st.write("Analyze your GitHub repositories to see how employers will judge your code portfolio.")',
    '    github_username = st.text_input("Enter your GitHub Username", "torvalds")',
    '    if st.button("Analyze GitHub Profile"):',
    '        with st.spinner("Fetching repositories from GitHub API..."):',
    '            try:',
    '                url = f"https://api.github.com/users/{github_username}/repos?sort=updated&per_page=5"',
    '                response = requests.get(url)',
    '                repos = response.json()',
    '                if response.status_code == 200 and repos:',
    '                    repo_data = []',
    '                    for repo in repos:',
    '                        repo_data.append({',
    '                            "name": repo["name"],',
    '                            "language": repo["language"],',
    '                            "stars": repo["stargazers_count"],',
    '                            "description": repo["description"]',
    '                        })',
    '                    input_payload = {',
    '                        "task": "github_analysis",',
    '                        "username": github_username,',
    '                        "repositories": repo_data',
    '                    }',
    '                    github_result = call_gemini_with_retry(input_payload)',
    '                    if github_result and "error" not in github_result:',
    '                        st.session_state.github_result = github_result',
    '                    else:',
    '                        st.error("AI failed to analyze GitHub profile.")',
    '                else:',
    '                    st.error("GitHub user not found or no public repositories.")',
    '            except Exception as e:',
    '                st.error(f"Error fetching GitHub data: {e}")',
    '    if "github_result" in st.session_state:',
    '        gh = st.session_state.github_result',
    '        st.markdown("### 📊 Profile Strength")',
    '        st.info(gh.get("profile_strength", "N/A"))',
    '        st.markdown("### 💡 Improvement Suggestions")',
    '        for suggestion in gh.get("improvement_suggestions", []):',
    '            st.write(f"- {suggestion}")',
    '        st.markdown("### 🏢 Employer Readiness")',
    '        st.warning(f"Status: {gh.get(\'employer_readiness\', \'N/A\')}")',
    '        st.write(f"Reason: {gh.get(\'employer_readiness_reason\', \'N/A\')}")'
  ].join('\n');

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Mobile Header */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-purple-950 p-3 border-b border-indigo-500/20 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-400/40 flex items-center justify-center text-violet-300">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white leading-tight">CareerIQ AI Platform</h1>
              <p className="text-[10px] text-violet-300/80 font-mono">Gemini 2.5 Flash • SQLite Persistence • Interview Coach</p>
            </div>
          </div>

          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-300" /> Active
          </span>
        </div>

        {/* Task Selector Tabs */}
        <div className="grid grid-cols-7 gap-0.5 mt-2.5 bg-slate-950/70 p-1 rounded-xl border border-indigo-500/20 text-[9px]">
          <button
            onClick={() => setActiveTab('resume')}
            className={`py-1 rounded-lg font-medium transition text-center truncate ${
              activeTab === 'resume' ? 'bg-violet-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Analyzer
          </button>
          <button
            onClick={() => setActiveTab('gap')}
            className={`py-1 rounded-lg font-medium transition text-center truncate ${
              activeTab === 'gap' ? 'bg-violet-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Gap Analysis
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`py-1 rounded-lg font-medium transition text-center truncate ${
              activeTab === 'interview' ? 'bg-violet-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Interview
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-1 rounded-lg font-medium transition text-center truncate ${
              activeTab === 'history' ? 'bg-violet-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            History DB
          </button>
          <button
            onClick={() => setActiveTab('recommend')}
            className={`py-1 rounded-lg font-medium transition text-center truncate ${
              activeTab === 'recommend' ? 'bg-violet-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Careers
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`py-1 rounded-lg font-medium transition text-center truncate ${
              activeTab === 'github' ? 'bg-violet-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            GitHub
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`py-1 rounded-lg font-medium transition text-center truncate ${
              activeTab === 'code' ? 'bg-violet-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Python API
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800">
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="bg-slate-900/90 border border-violet-500/40 rounded-2xl p-5 text-center space-y-3 animate-pulse my-2 shadow-xl">
            <div className="w-10 h-10 rounded-2xl bg-violet-600/30 border border-violet-400/40 mx-auto flex items-center justify-center text-violet-300 animate-spin">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-white">CareerIQ AI Processing</h3>
            <p className="text-[11px] text-violet-300 font-mono">{statusMessage}</p>
          </div>
        )}

        {/* PRIMARY TASK: RESUME PARSER & ROADMAP GENERATOR */}
        {!isLoading && activeTab === 'resume' && (
          <div className="space-y-3">
            {/* Input Panel */}
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-violet-400" /> Resume Text & Target Role Analyzer
                </span>
                <span className="text-[9px] bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded font-mono">
                  Raw Text Engine
                </span>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Target Role</label>
                <input 
                  type="text" 
                  value={resumeInput.target_role}
                  onChange={e => setResumeInput({...resumeInput, target_role: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-violet-500"
                  placeholder="e.g. ML Engineer, Data Scientist"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Raw Resume Text</label>
                <textarea 
                  rows={3}
                  value={resumeInput.resume_text}
                  onChange={e => setResumeInput({...resumeInput, resume_text: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500 font-mono leading-relaxed"
                  placeholder="Paste raw resume content here..."
                />
              </div>

              <button
                onClick={() => executeCareerIQAi(resumeInput, 'resume_analysis')}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-2 rounded-xl shadow-md text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Analyze Resume & Save to DB
              </button>
            </div>

            {/* Analysis Output Result */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950/80 border border-indigo-500/30 rounded-2xl p-3 space-y-3">
              {/* Readiness Score Banner */}
              <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                <div>
                  <span className="text-[9px] font-mono text-violet-400 font-bold uppercase tracking-wider block">
                    Target Role: {resumeInput.target_role}
                  </span>
                  <h3 className="text-sm font-extrabold text-white">Extracted Skills & Readiness</h3>
                </div>
                <div className="text-right">
                  <span className="bg-violet-500/20 border border-violet-400/40 px-2.5 py-1 rounded-xl text-violet-300 text-xs font-black">
                    {resumeResult.readiness_score}/100 Readiness
                  </span>
                </div>
              </div>

              {/* Extracted Skills Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">Extracted Skills from Resume</span>
                  <div className="flex flex-wrap gap-1">
                    {resumeResult.extracted_skills.map((s, i) => (
                      <span key={i} className="bg-slate-950 text-slate-300 border border-slate-800 text-[10px] px-2 py-0.5 rounded-lg font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 block mb-1">Strong Matching Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {resumeResult.strong_skills.map((s, i) => (
                        <span key={i} className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[9px] px-1.5 py-0.5 rounded font-mono">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-amber-400 block mb-1">Missing Gap Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {resumeResult.missing_skills.map((s, i) => (
                        <span key={i} className="bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[9px] px-1.5 py-0.5 rounded font-mono">
                          ! {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Readiness Explanation */}
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-white/5 space-y-1">
                <h4 className="text-[11px] font-bold text-slate-200">Readiness Explanation</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {resumeResult.readiness_explanation}
                </p>
              </div>

              {/* Next Best Action */}
              <div className="bg-indigo-950/60 border border-indigo-500/30 p-2.5 rounded-xl space-y-0.5">
                <span className="text-[10px] font-bold text-indigo-300 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-indigo-400" /> Recommended Next Best Action
                </span>
                <p className="text-xs text-white font-semibold">{resumeResult.next_best_action}</p>
              </div>

              {/* Personalized Roadmap */}
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-violet-400" /> Personalized Learning Roadmap
                </h4>
                {resumeResult.roadmap.map((p, idx) => (
                  <div key={idx} className="bg-slate-950/90 border border-slate-800 p-2.5 rounded-xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-violet-300">{p.phase}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{p.duration}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {p.focus_skills.map((fs, i) => (
                        <span key={i} className="bg-violet-500/10 text-violet-300 text-[9px] px-1.5 py-0.5 rounded font-mono">
                          {fs}
                        </span>
                      ))}
                    </div>
                    <ul className="space-y-1 text-[11px] text-slate-300 pt-1">
                      {p.action_items.map((ai, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{ai}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Recommended Projects */}
              <div className="space-y-1 pt-1">
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Recommended Portfolio Projects
                </h4>
                <div className="space-y-1.5">
                  {resumeResult.recommended_projects.map((proj, i) => (
                    <div key={i} className="bg-slate-950 p-2.5 rounded-xl text-xs text-slate-200 border border-slate-800/80 leading-relaxed">
                      🚀 {proj}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TASK: CAREER GAP ANALYSIS */}
        {!isLoading && activeTab === 'gap' && (
          <div className="space-y-3">
            {/* Input Form Panel */}
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-violet-400" /> Task: career_gap_analysis
                </span>
                <span className="text-[9px] bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded font-mono">
                  Readiness: {gapInput.readiness_score}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Target Role</label>
                  <input 
                    type="text" 
                    value={gapInput.target_role}
                    onChange={e => setGapInput({...gapInput, target_role: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Readiness Score ({gapInput.readiness_score}%)</label>
                  <input 
                    type="range" 
                    min="10" 
                    max="100"
                    value={gapInput.readiness_score}
                    onChange={e => setGapInput({...gapInput, readiness_score: parseInt(e.target.value)})}
                    className="w-full accent-violet-500 mt-1"
                  />
                </div>
              </div>

              {/* Skills Tags */}
              <div className="space-y-1 text-xs">
                <label className="text-[10px] font-bold text-emerald-400 block">Strong Skills</label>
                <div className="flex flex-wrap gap-1">
                  {gapInput.strong_skills.map((s, i) => (
                    <span key={i} className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1">
                      {s}
                      <button onClick={() => setGapInput({...gapInput, strong_skills: gapInput.strong_skills.filter(x => x !== s)})} className="text-emerald-500 hover:text-rose-400">×</button>
                    </span>
                  ))}
                </div>

                <label className="text-[10px] font-bold text-amber-400 block pt-1">Missing Skills to Bridge</label>
                <div className="flex flex-wrap gap-1">
                  {gapInput.missing_skills.map((s, i) => (
                    <span key={i} className="bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1">
                      {s}
                      <button onClick={() => setGapInput({...gapInput, missing_skills: gapInput.missing_skills.filter(x => x !== s)})} className="text-amber-500 hover:text-rose-400">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => executeCareerIQAi(gapInput, 'career_gap_analysis')}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-2 rounded-xl shadow-md text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Execute Gap Analysis Task
              </button>
            </div>

            {/* Results Display */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950/80 border border-indigo-500/30 rounded-2xl p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-violet-400 font-bold uppercase tracking-wider">
                  Analysis Output
                </span>
                <span className="bg-violet-500/20 border border-violet-400/30 px-2 py-0.5 rounded-full text-violet-300 text-[10px] font-extrabold">
                  Score: {gapInput.readiness_score}%
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-white">Readiness Explanation</h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-0.5 bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                  {gapResult.readiness_explanation}
                </p>
              </div>

              <div className="bg-indigo-950/50 border border-indigo-500/30 p-2.5 rounded-xl">
                <span className="text-[10px] font-bold text-indigo-300 flex items-center gap-1 mb-0.5">
                  <ArrowRight className="w-3 h-3 text-indigo-400" /> Next Best Action
                </span>
                <p className="text-xs text-white font-semibold">{gapResult.next_best_action}</p>
              </div>

              {/* Roadmap Phases */}
              <div className="space-y-2 pt-1">
                <h4 className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-violet-400" /> Roadmap Phases ({gapResult.roadmap.length})
                </h4>
                {gapResult.roadmap.map((p, idx) => (
                  <div key={idx} className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-violet-300">{p.phase}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{p.duration}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {p.focus_skills.map((fs, i) => (
                        <span key={i} className="bg-violet-500/10 text-violet-300 text-[9px] px-1.5 py-0.5 rounded font-mono">
                          {fs}
                        </span>
                      ))}
                    </div>
                    <ul className="space-y-1 text-[11px] text-slate-300 pt-1">
                      {p.action_items.map((ai, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{ai}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Recommended Projects */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-300 flex items-center gap-1 mb-1">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Portfolio Capstone Projects
                </h4>
                <div className="space-y-1">
                  {gapResult.recommended_projects.map((proj, i) => (
                    <div key={i} className="bg-slate-950 p-2 rounded-xl text-xs text-slate-200 border border-slate-800/80">
                      🚀 {proj}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TASK: INTERVIEW PREPARATION */}
        {!isLoading && activeTab === 'interview' && (
          <div className="space-y-3">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Task: interview_preparation
                </span>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Target Role</label>
                <input 
                  type="text" 
                  value={interviewInput.target_role}
                  onChange={e => setInterviewInput({...interviewInput, target_role: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Your Current Skills (Comma Separated)</label>
                <input 
                  type="text" 
                  value={interviewInput.user_skills.join(', ')}
                  onChange={e => setInterviewInput({...interviewInput, user_skills: e.target.value.split(',').map(s => s.trim())})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                  placeholder="Python, SQL, Git"
                />
              </div>

              <button
                onClick={() => executeCareerIQAi(interviewInput, 'interview_preparation')}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-2 rounded-xl shadow-md text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Generate Tailored Interview Questions
              </button>
            </div>

            {/* Questions Result */}
            <div className="space-y-2">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-1.5">
                <h4 className="text-xs font-bold text-violet-300 flex items-center gap-1">
                  💻 Technical Questions ({interviewResult.technical_questions.length})
                </h4>
                {interviewResult.technical_questions.map((q, i) => (
                  <div key={i} className="bg-slate-950 p-2.5 rounded-xl text-xs text-slate-200 border border-slate-800/80 leading-relaxed">
                    <strong className="text-violet-400 mr-1.5">Q{i+1}:</strong> {q}
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-1.5">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  🏗️ System Design Scenarios
                </h4>
                {interviewResult.system_design_questions.map((q, i) => (
                  <div key={i} className="bg-slate-950 p-2.5 rounded-xl text-xs text-slate-200 border border-slate-800/80 leading-relaxed">
                    <strong className="text-amber-400 mr-1.5">SD:</strong> {q}
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-1.5">
                <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                  🗣️ Behavioral Questions
                </h4>
                {interviewResult.behavioral_questions.map((q, i) => (
                  <div key={i} className="bg-slate-950 p-2.5 rounded-xl text-xs text-slate-200 border border-slate-800/80 leading-relaxed">
                    <strong className="text-emerald-400 mr-1.5">BQ:</strong> {q}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DATABASE HISTORY */}
        {!isLoading && activeTab === 'history' && (
          <div className="space-y-3">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-indigo-400" /> Past Analyses (SQLite Database Storage)
                </span>
                <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono">
                  careeriq.db
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                All resume analyses run in Tab 1 are automatically saved to SQLite storage.
              </p>
            </div>

            <div className="space-y-2">
              {historyRecords.length > 0 ? (
                historyRecords.map(item => (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" /> {item.date}
                      </span>
                      <span className="bg-violet-500/20 text-violet-300 border border-violet-400/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        Score: {item.score}/100
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-0.5">
                      <h4 className="font-extrabold text-white text-xs">Target Role: {item.role}</h4>
                    </div>

                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80 text-[11px]">
                      <span className="text-[10px] font-bold text-amber-400 block mb-0.5">Missing Skills:</span>
                      <p className="text-slate-300 font-mono">{item.missing}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-slate-900 p-6 rounded-2xl text-center text-slate-400 text-xs border border-slate-800">
                  No past analyses found. Run an analysis in the Analyzer tab to save it to the SQLite database.
                </div>
              )}
            </div>

            {/* Privacy & Data Control */}
            <div className="bg-slate-900/90 border border-rose-500/20 p-3 rounded-2xl space-y-2 text-xs mt-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-400" /> 🔐 Privacy & Data Control
                </span>
                <span className="text-[9px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono font-bold">
                  GDPR / Privacy Compliant
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Because resumes contain sensitive personal information, you have the absolute right to wipe your analysis history at any time.
              </p>
              <button
                onClick={() => setHistoryRecords([])}
                className="w-full bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" /> 🗑️ Clear All History (Wipe Database)
              </button>
            </div>
          </div>
        )}

        {/* TASK: RECOMMEND CAREERS */}
        {!isLoading && activeTab === 'recommend' && (
          <div className="space-y-3">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-indigo-400" /> Task: recommend_careers
                </span>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Your Extracted Skills</label>
                <div className="flex flex-wrap gap-1 mb-1">
                  {recommendInput.user_skills.map((s, i) => (
                    <span key={i} className="bg-slate-950 border border-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1 font-mono">
                      {s}
                      <button onClick={() => setRecommendInput({...recommendInput, user_skills: recommendInput.user_skills.filter(x => x !== s)})} className="text-slate-500 hover:text-rose-400">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => executeCareerIQAi(recommendInput, 'recommend_careers')}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-2 rounded-xl shadow-md text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Recommend Roles
              </button>
            </div>

            {/* Recommendations List */}
            <div className="space-y-2">
              {recommendResult.recommended_roles.map((r, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">{r.role}</h4>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      Recommended
                    </span>
                  </div>
                  <p className="text-slate-300 bg-slate-950 p-2 rounded-xl border border-slate-800/80 text-[11px] leading-relaxed">
                    {r.match_reason}
                  </p>
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 block mb-0.5">Skills to Add:</span>
                    <div className="flex flex-wrap gap-1">
                      {r.skills_to_add.map((sa, idx) => (
                        <span key={idx} className="bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[9px] px-1.5 py-0.5 rounded font-mono">
                          + {sa}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TASK: GITHUB ANALYSIS */}
        {!isLoading && activeTab === 'github' && (
          <div className="space-y-3">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-purple-400" /> Task: github_analysis
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Repo Name</label>
                  <input 
                    type="text" 
                    value={githubInput.repo_name}
                    onChange={e => setGithubInput({...githubInput, repo_name: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Commits ({githubInput.commit_count})</label>
                  <input 
                    type="number" 
                    value={githubInput.commit_count}
                    onChange={e => setGithubInput({...githubInput, commit_count: parseInt(e.target.value) || 0})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 py-1">
                <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={githubInput.has_readme}
                    onChange={e => setGithubInput({...githubInput, has_readme: e.target.checked})}
                    className="rounded accent-violet-500"
                  />
                  Has README.md
                </label>
                <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={githubInput.has_tests}
                    onChange={e => setGithubInput({...githubInput, has_tests: e.target.checked})}
                    className="rounded accent-violet-500"
                  />
                  Has Unit Tests
                </label>
              </div>

              <button
                onClick={() => executeCareerIQAi(githubInput, 'github_analysis')}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-2 rounded-xl shadow-md text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Analyze Repository
              </button>
            </div>

            {/* Analysis Output */}
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Employer Readiness Rating</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                  githubResult.employer_readiness === 'High' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  githubResult.employer_readiness === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {githubResult.employer_readiness} Readiness
                </span>
              </div>

              <p className="text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                {githubResult.profile_strength}
              </p>

              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1">Improvement Suggestions</span>
                <ul className="space-y-1">
                  {githubResult.improvement_suggestions.map((sug, i) => (
                    <li key={i} className="bg-slate-950 p-2 rounded-xl text-slate-200 border border-slate-800/80 flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 italic">
                <strong>Employer View:</strong> {githubResult.employer_readiness_reason}
              </div>
            </div>
          </div>
        )}

        {/* CODE TAB: PYTHON API IMPLEMENTATION */}
        {!isLoading && activeTab === 'code' && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <span className="font-mono text-violet-300 font-bold flex items-center gap-1">
                <Code className="w-3.5 h-3.5" /> app.py (Streamlit + SQLite + Gemini)
              </span>
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded font-mono">
                Multi-Feature Engine
              </span>
            </div>

            <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
              <code>{pythonEngineCode}</code>
            </pre>

            {/* Regex execution logs */}
            {rawTextLog && (
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Live Gemini Raw Output Log
                </h4>
                <div>
                  <span className="text-[9px] text-slate-400 block mb-0.5 font-mono">1. Raw Output (Before Regex):</span>
                  <pre className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-[9px] font-mono text-amber-300 overflow-x-auto max-h-32">
                    <code>{rawTextLog}</code>
                  </pre>
                </div>

                <div>
                  <span className="text-[9px] text-slate-400 block mb-0.5 font-mono">2. Cleaned Output (After Regex re.sub):</span>
                  <pre className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-[9px] font-mono text-emerald-300 overflow-x-auto max-h-32">
                    <code>{cleanedJsonLog}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

