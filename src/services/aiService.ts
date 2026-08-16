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
    role: string;
    resumeText: string;
    skills?: string;
  }): Promise<CareerAnalysisResponse> => {
    const role = data.role || 'Software Engineer';
    const resumeText = data.resumeText || data.skills || '';
    const apiKey = AIService.getApiKey();

    if (AIService.isConfigured()) {
      const systemInstruction = `You are the core AI engine for "CareerPilot AI". Your job is to analyze a user's pasted resume text and target role, and return STRICT JSON containing the analysis.

### STRICT RULES:
1. Output ONLY valid JSON. NO markdown blocks. NO conversational text.
2. Do not use default values. You MUST extract the actual skills and gaps from the provided resume text. If a skill is not in the resume, put it in the skill_gaps array.
3. Compute a realistic readiness_score (0-100) based strictly on the relevance of the resume for the target role.

### INPUT:
{"task": "career_analysis", "target_role": "${role}", "resume_text": ${JSON.stringify(resumeText)}}

### EXPECTED OUTPUT SCHEMA:
{
  "readiness_score": 45,
  "strengths": ["Python", "SQL"],
  "skill_gaps": ["Docker", "Kubernetes", "MLOps"],
  "recommended_skills": ["PyTorch", "FastAPI"],
  "next_steps": ["Learn Docker fundamentals", "Build an ML API"],
  "resume_bullets": ["Engineered a scalable backend using Python and SQL."]
}`;

      const prompt = `Analyze this resume for the role of ${role}. Resume text:\n${resumeText}\n\nReturn strict JSON following the schema.`;

      // Try gemini-2.5-flash first, fallback to standard gemini endpoint
      const models = ['gemini-2.5-flash', 'gemini-1.5-flash'];
      for (const model of models) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              systemInstruction: { parts: [{ text: systemInstruction }] },
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.2
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
            return {
              readiness_score: Math.min(100, Math.max(10, Number(parsed.readiness_score) || 75)),
              strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
              skill_gaps: Array.isArray(parsed.skill_gaps) ? parsed.skill_gaps : [],
              recommended_skills: Array.isArray(parsed.recommended_skills) ? parsed.recommended_skills : [],
              next_steps: Array.isArray(parsed.next_steps) ? parsed.next_steps : [],
              resume_bullets: Array.isArray(parsed.resume_bullets) ? parsed.resume_bullets : []
            };
          }
        } catch (error) {
          console.error(`AI Analysis Error with ${model}:`, error);
        }
      }
    }

    // Dynamic Offline NLP extraction fallback (extracts actual words from resumeText)
    const lower = resumeText.toLowerCase();
    const commonTechSkills = [
      'Python', 'Java', 'C++', 'Go', 'Rust', 'JavaScript', 'TypeScript', 'React', 'Node.js',
      'FastAPI', 'Django', 'Flask', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
      'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Git', 'Linux', 'PyTorch', 'TensorFlow',
      'Scikit-learn', 'Pandas', 'NumPy', 'HTML/CSS', 'GraphQL', 'Kafka', 'CI/CD'
    ];

    const detectedStrengths = commonTechSkills.filter(skill =>
      lower.includes(skill.toLowerCase())
    );

    const isML = role.toLowerCase().includes('ml') || role.toLowerCase().includes('ai') || role.toLowerCase().includes('machine');
    const isBackend = role.toLowerCase().includes('backend') || role.toLowerCase().includes('cloud');

    const expectedKeywords = isML
      ? ['PyTorch', 'Docker', 'FastAPI', 'Vector Search', 'MLOps', 'Kubernetes']
      : isBackend
      ? ['Docker', 'PostgreSQL', 'Redis', 'Kafka', 'System Design', 'CI/CD']
      : ['TypeScript', 'React', 'Next.js', 'Tailwind', 'GraphQL', 'Testing'];

    const missingGaps = expectedKeywords.filter(k => !detectedStrengths.some(ds => ds.toLowerCase() === k.toLowerCase()));

    const calculatedScore = Math.min(95, Math.max(30, 40 + detectedStrengths.length * 8));

    return {
      readiness_score: calculatedScore,
      strengths: detectedStrengths.length > 0 ? detectedStrengths : ['Basic Programming Logic', 'Data Structures'],
      skill_gaps: missingGaps.length > 0 ? missingGaps : ['Production CI/CD', 'Distributed Monitoring'],
      recommended_skills: missingGaps.slice(0, 3),
      next_steps: [
        `Complete a production-grade project showcasing ${missingGaps[0] || 'Docker'}`,
        `Rewrite resume project bullets with quantified latency metrics`,
        `Practice technical interview questions for ${role}`
      ],
      resume_bullets: [
        `Architected a high-throughput backend service with ${detectedStrengths[0] || 'Python'}, improving response latency by 45%.`,
        `Engineered modular data pipelines with automated test coverage and zero regression defects.`
      ]
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
