// --- AI ABSTRACTION LAYER (REAL GOOGLE GEMINI API INTEGRATION) ---

export interface CareerAnalysisResponse {
  readiness_score: number;
  strengths: string[];
  skill_gaps: string[];
  recommended_skills: string[];
  next_steps: string[];
  resume_bullets: string[];
  error?: string;
}

export interface InterviewQuestionsResponse {
  tech: string[];
  hr: string[];
  behavioral?: string[];
  error?: string;
}

export interface InterviewEvaluationResponse {
  overallScore: number;
  dimensions: {
    correctness: number;
    communication: number;
    depth: number;
    problemSolving: number;
  };
  strengths: string[];
  weaknesses: string[];
  mostImportantImprovement: string;
  recommendedPracticeTopic: string;
  benchmarkModelAnswer: string;
  error?: string;
}

// Global State key store
export const AIService = {
  getApiKey: (): string => {
    return (
      localStorage.getItem('careerpilot_gemini_api_key') ||
      (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
      ''
    );
  },

  setApiKey: (key: string) => {
    if (key.trim()) {
      localStorage.setItem('careerpilot_gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('careerpilot_gemini_api_key');
    }
  },

  isConfigured: (): boolean => {
    const key = AIService.getApiKey();
    return !!key && (key.startsWith('AIza') || key.length > 20);
  },

  // 1. ANALYZE RESUME & CAREER TRAJECTORY WITH GEMINI
  analyze: async (data: {
    target_role?: string;
    resume_text?: string;
    role?: string;
    resumeText?: string;
    skills?: string[] | string;
  }): Promise<CareerAnalysisResponse> => {
    const targetRole = (data.target_role || data.role || '').trim();
    const resumeText = (data.resume_text || data.resumeText || (typeof data.skills === 'string' ? data.skills : '')).trim();
    const skillsList = Array.isArray(data.skills) 
      ? data.skills 
      : typeof data.skills === 'string' && data.skills 
        ? data.skills.split(',').map(s => s.trim()).filter(Boolean) 
        : [];

    // 1. Check if API key exists
    if (!AIService.isConfigured()) {
      return {
        readiness_score: 0,
        strengths: [],
        skill_gaps: [],
        recommended_skills: [],
        next_steps: [],
        resume_bullets: [],
        error: "AI service is not configured. Please add your API key in Profile."
      };
    }

    // 2. Validate user input (Ensure they didn't submit empty fields)
    if (!targetRole || !resumeText) {
      return {
        readiness_score: 0,
        strengths: [],
        skill_gaps: [],
        recommended_skills: [],
        next_steps: [],
        resume_bullets: [],
        error: "Please complete your profile and enter a target role to run the analysis."
      };
    }

    // 3. Construct input payload using REAL user data
    const inputPayload = {
      task: "career_analysis",
      target_role: targetRole,
      resume_text: resumeText,
      skills: skillsList
    };

    const apiKey = AIService.getApiKey();

    const systemInstruction = `You are the core AI engine for "CareerPilot AI". Your job is to analyze brand new users who are inputting their data for the first time.

### STRICT RULES FOR NEW USERS (CRITICAL):
1. Output ONLY valid JSON. NO markdown blocks. NO conversational text.
2. DO NOT use default or demo data. You must analyze the EXACT text provided by the user.
3. NEVER hallucinate skills. If a skill is not explicitly written in the user's input, do not add it to their strengths.
4. If the user provides incomplete data (e.g., missing target role or resume text), return this exact JSON:
   {"error": "Please complete your profile and enter a target role to run the analysis."}
5. If the user provides valid data, calculate a realistic readiness_score (0-100) based ONLY on what they provided.

### EXPECTED INPUT (May contain empty fields for new users):
{
  "task": "career_analysis",
  "target_role": "Data Scientist", 
  "resume_text": "I know Python and SQL. I built a dashboard.",
  "skills": ["Python", "SQL"]
}

### EXPECTED OUTPUT SCHEMA (Strict JSON):
{
  "readiness_score": 45,
  "strengths": ["Python", "SQL"],
  "skill_gaps": ["Machine Learning", "Statistics", "Pandas"],
  "recommended_skills": ["Scikit-learn", "Tableau"],
  "next_steps": ["Learn Pandas for data manipulation", "Build a machine learning model"],
  "resume_bullets": ["Engineered a data dashboard using Python and SQL to visualize key metrics."]
}`;

    // Try gemini-1.5-flash and gemini-2.5-flash
    const models = ['gemini-1.5-flash', 'gemini-2.5-flash'];
    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: JSON.stringify(inputPayload) }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.1
            }
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          console.warn(`Gemini API error with ${model}:`, errData);
          continue;
        }

        const result = await response.json();
        const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          if (parsed.error) {
            return {
              readiness_score: 0,
              strengths: [],
              skill_gaps: [],
              recommended_skills: [],
              next_steps: [],
              resume_bullets: [],
              error: parsed.error
            };
          }

          return {
            readiness_score: Math.min(100, Math.max(0, Number(parsed.readiness_score) ?? 50)),
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
            skill_gaps: Array.isArray(parsed.skill_gaps) ? parsed.skill_gaps : [],
            recommended_skills: Array.isArray(parsed.recommended_skills) ? parsed.recommended_skills : [],
            next_steps: Array.isArray(parsed.next_steps) ? parsed.next_steps : [],
            resume_bullets: Array.isArray(parsed.resume_bullets) ? parsed.resume_bullets : []
          };
        }
      } catch (error) {
        console.error(`AI Error with ${model}:`, error);
      }
    }

    return {
      readiness_score: 0,
      strengths: [],
      skill_gaps: [],
      recommended_skills: [],
      next_steps: [],
      resume_bullets: [],
      error: "Failed to connect to AI service. Check your internet connection or verify your API key."
    };
  },

  // 2. GENERATE INTERVIEW QUESTIONS
  interview: async (role: string): Promise<InterviewQuestionsResponse> => {
    const apiKey = AIService.getApiKey();

    if (AIService.isConfigured()) {
      const prompt = `Generate 2 technical interview questions and 2 HR questions for a ${role} candidate. Return as STRICT JSON with "tech" and "hr" arrays of strings.`;
      const models = ['gemini-2.5-flash', 'gemini-1.5-flash'];

      for (const model of models) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: 'application/json' }
            })
          });

          if (!response.ok) continue;
          const result = await response.json();
          const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            return {
              tech: Array.isArray(parsed.tech) ? parsed.tech : [],
              hr: Array.isArray(parsed.hr) ? parsed.hr : []
            };
          }
        } catch (error) {
          console.error('Interview Question Generation Error:', error);
        }
      }
    }

    return {
      tech: [
        `Explain how memory allocation and garbage collection impact high-throughput services in your primary programming language for a ${role}.`,
        `How would you architect a fault-tolerant caching layer using Redis to avoid cache stampede under heavy concurrent load?`
      ],
      hr: [
        `Tell me about a challenging engineering trade-off you had to navigate under strict deadlines.`,
        `Why are you interested in becoming a ${role}, and what engineering practices do you value most?`
      ]
    };
  }
};
