import { 
  ComprehensiveReadinessBreakdown, SkillGapItem, RoadmapStage, ProjectItem, 
  LearningResource, DailyStudyBlock, GitHubAuditResult, LinkedInAuditResult 
} from '../components/career/careerTypes';

export interface UserProfileData {
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

export const CareerRecommendationEngine = {
  // 1. CALCULATE 9-PILLAR READINESS BREAKDOWN
  calculateReadiness: (profile: UserProfileData, userSkills: string[] = []): {
    overallScore: number;
    breakdown: ComprehensiveReadinessBreakdown;
    weakestArea: { name: string; score: number; reason: string; fix: string };
    nextBestAction: { title: string; description: string; expectedGain: string; route: string };
  } => {
    const skillsLower = (userSkills.length > 0 ? userSkills : profile.currentSkills).map(s => s.toLowerCase());
    const roleLower = profile.targetRole.toLowerCase();

    // 1. Technical Skills score based on target role coverage
    let techScore = 40;
    if (roleLower.includes('machine learning') || roleLower.includes('ai') || roleLower.includes('data')) {
      if (skillsLower.some(s => s.includes('python'))) techScore += 18;
      if (skillsLower.some(s => s.includes('pytorch') || s.includes('tensorflow') || s.includes('scikit'))) techScore += 18;
      if (skillsLower.some(s => s.includes('sql') || s.includes('pandas'))) techScore += 14;
      if (skillsLower.some(s => s.includes('fastapi') || s.includes('flask'))) techScore += 10;
    } else if (roleLower.includes('frontend') || roleLower.includes('web') || roleLower.includes('full stack')) {
      if (skillsLower.some(s => s.includes('javascript') || s.includes('typescript') || s.includes('react'))) techScore += 25;
      if (skillsLower.some(s => s.includes('html') || s.includes('css') || s.includes('tailwind'))) techScore += 15;
      if (skillsLower.some(s => s.includes('node') || s.includes('express') || s.includes('sql'))) techScore += 20;
    } else if (roleLower.includes('cloud') || roleLower.includes('devops')) {
      if (skillsLower.some(s => s.includes('linux') || s.includes('bash'))) techScore += 15;
      if (skillsLower.some(s => s.includes('docker') || s.includes('container'))) techScore += 25;
      if (skillsLower.some(s => s.includes('ci/cd') || s.includes('github actions'))) techScore += 20;
    } else {
      techScore += Math.min(45, skillsLower.length * 8);
    }
    techScore = Math.min(95, Math.max(25, techScore));

    // 2. DSA Score
    let dsaScore = 45;
    if (profile.leetcode && profile.leetcode.trim()) dsaScore += 20;
    if (skillsLower.some(s => s.includes('algorithm') || s.includes('dsa') || s.includes('data structure'))) dsaScore += 20;
    if (profile.programmingLanguages.some(l => ['c++', 'java', 'python'].includes(l.toLowerCase()))) dsaScore += 10;
    dsaScore = Math.min(95, Math.max(30, dsaScore));

    // 3. Projects Score
    let projectScore = 55;
    if (skillsLower.some(s => s.includes('fastapi') || s.includes('react') || s.includes('docker'))) projectScore += 15;
    if (profile.github && profile.github.trim()) projectScore += 15;
    projectScore = Math.min(95, Math.max(30, projectScore));

    // 4. Resume Score
    const resumeScore = 80;

    // 5. GitHub Score
    let githubScore = 35;
    if (profile.github && profile.github.trim().length > 2) githubScore += 35;
    if (skillsLower.some(s => s.includes('git'))) githubScore += 15;
    githubScore = Math.min(95, Math.max(20, githubScore));

    // 6. LinkedIn Score
    let linkedinScore = 40;
    if (profile.linkedin && profile.linkedin.trim().length > 2) linkedinScore += 38;
    linkedinScore = Math.min(90, Math.max(25, linkedinScore));

    // 7. Aptitude Score
    const aptitudeScore = 70;

    // 8. Communication Score
    const commScore = 75;

    // 9. Interview Prep Score
    const interviewScore = 72;

    const breakdown: ComprehensiveReadinessBreakdown = {
      technicalSkills: techScore,
      dsa: dsaScore,
      projects: projectScore,
      resume: resumeScore,
      github: githubScore,
      linkedin: linkedinScore,
      aptitude: aptitudeScore,
      communication: commScore,
      interview: interviewScore
    };

    // Calculate weighted overall
    const overallScore = Math.round(
      breakdown.technicalSkills * 0.22 +
      breakdown.dsa * 0.18 +
      breakdown.projects * 0.20 +
      breakdown.resume * 0.12 +
      breakdown.github * 0.08 +
      breakdown.interview * 0.10 +
      breakdown.aptitude * 0.04 +
      breakdown.communication * 0.04 +
      breakdown.linkedin * 0.02
    );

    // Identify weakest area
    const areas = [
      { name: 'GitHub Portfolio & CI/CD', score: breakdown.github, reason: 'Lack of production-grade deployed repositories with automated testing', fix: 'Publish a flagship repository with a comprehensive README, architecture diagrams, and Docker builds.' },
      { name: 'Technical Role Alignment', score: breakdown.technicalSkills, reason: `Missing core production technologies required for ${profile.targetRole}`, fix: `Complete practical project tutorials in missing core libraries.` },
      { name: 'DSA & Coding Assessment', score: breakdown.dsa, reason: 'Limited verified LeetCode/DSA problem coverage on Trees, Graphs, and DP', fix: 'Solve the Blind 75 core patterns in your primary programming language.' },
      { name: 'Interview Readiness', score: breakdown.interview, reason: 'STAR framework structure and behavioral defense need refinement', fix: 'Record mock interview sessions in the Career Coach module.' },
      { name: 'LinkedIn Optimization', score: breakdown.linkedin, reason: 'Headline and project summaries are missing keyword-rich positioning', fix: 'Optimize headline with targeted keywords and quantified project highlights.' }
    ].sort((a, b) => a.score - b.score);

    const weakest = areas[0];

    // Formulate Contextual Next Best Action
    let nextAction = {
      title: 'Containerize ML Inference with Docker',
      description: `Closing the Docker containerization gap increases your ${profile.targetRole} role match by +12%.`,
      expectedGain: '+8 Readiness Points & +150 XP',
      route: 'practice'
    };

    if (weakest.name.includes('GitHub')) {
      nextAction = {
        title: 'Audit & Polish Flagship GitHub Repository',
        description: 'Add a professional README, architecture diagram, and deployment instructions to your top project.',
        expectedGain: '+10 GitHub Score & +120 XP',
        route: 'analyze'
      };
    } else if (weakest.name.includes('DSA')) {
      nextAction = {
        title: 'Master Graph Traversal & Dynamic Programming',
        description: 'Solve 3 medium Tree/Graph problems to prepare for technical online assessments.',
        expectedGain: '+7 DSA Score & +100 XP',
        route: 'roadmap'
      };
    }

    return {
      overallScore: Math.min(99, Math.max(20, overallScore)),
      breakdown,
      weakestArea: weakest,
      nextBestAction: nextAction
    };
  },

  // 2. GENERATE VISUAL SKILL GAP MATRIX (Green, Yellow, Red, Gold)
  getSkillGapMatrix: (targetRole: string, userSkills: string[]): SkillGapItem[] => {
    const skillsLower = userSkills.map(s => s.toLowerCase());
    const roleLower = targetRole.toLowerCase();

    // Default template for ML Engineer / AI
    if (roleLower.includes('ml') || roleLower.includes('machine learning') || roleLower.includes('ai') || roleLower.includes('data scientist')) {
      return [
        {
          id: 'gap_python',
          name: 'Python 3.12 (OOP, Generators, Type Hints)',
          category: 'Core Language',
          status: skillsLower.some(s => s.includes('python')) ? 'strong' : 'needs_improvement',
          whyItMatters: 'Industry standard for AI/ML engineering, pipeline development, and deep learning framework bindings.',
          recommendedOrder: 1,
          practiceTask: 'Implement custom decorators, generator pipelines, and Pydantic v2 data models.',
          projectIdea: 'CLI Data Structures & Profiler Tool in Pure Python',
          learningResource: 'Harvard CS50P & Python Official 3.12 Docs',
          milestone: 'Verified Python proficiency with clean typing and unit tests',
          currentProficiency: skillsLower.some(s => s.includes('python')) ? 90 : 40
        },
        {
          id: 'gap_pytorch',
          name: 'PyTorch Deep Learning & Tensor Operations',
          category: 'Core AI Framework',
          status: skillsLower.some(s => s.includes('pytorch')) ? 'strong' : 'needs_improvement',
          whyItMatters: 'Top research and production framework for neural networks, LLM fine-tuning, and computer vision.',
          recommendedOrder: 2,
          practiceTask: 'Build custom Dataset & DataLoader classes and backprop autograd loop.',
          projectIdea: 'Fine-Tuned RoBERTa Sentiment Classifier with Sub-20ms Latency',
          learningResource: 'DeepLearning.AI PyTorch Specialization',
          milestone: 'Train, evaluate, and export deep learning models to ONNX',
          currentProficiency: skillsLower.some(s => s.includes('pytorch')) ? 82 : 45
        },
        {
          id: 'gap_docker',
          name: 'Docker Multi-Stage Containerization',
          category: 'Production MLOps',
          status: skillsLower.some(s => s.includes('docker')) ? 'strong' : 'missing',
          whyItMatters: '#1 critical gap for freshers transitioning from notebook code to production microservices.',
          recommendedOrder: 3,
          practiceTask: 'Write a multi-stage Dockerfile minimizing container size below 180MB with CUDA caching.',
          projectIdea: 'Containerized Asynchronous FastAPI ML Inference Microservice',
          learningResource: 'Docker Official Documentation & TechWorld with Nana',
          milestone: 'Deploy a containerized API with automated health check probes',
          currentProficiency: skillsLower.some(s => s.includes('docker')) ? 85 : 15
        },
        {
          id: 'gap_rag',
          name: 'Vector Databases & RAG Architectures (ChromaDB / Qdrant)',
          category: 'Applied Generative AI',
          status: skillsLower.some(s => s.includes('vector') || s.includes('rag') || s.includes('chroma')) ? 'advanced' : 'missing',
          whyItMatters: 'Essential for enterprise generative AI, semantic document retrieval, and contextual embeddings.',
          recommendedOrder: 4,
          practiceTask: 'Index 10,000 document embeddings and implement cosine similarity search with re-ranking.',
          projectIdea: 'Enterprise Technical Documentation RAG Search Engine',
          learningResource: 'Pinecone Learning Center & LangChain Documentation',
          milestone: 'Build complete retrieval and synthesis pipeline with hallucination guardrails',
          currentProficiency: skillsLower.some(s => s.includes('vector') || s.includes('rag')) ? 92 : 20
        },
        {
          id: 'gap_fastapi',
          name: 'FastAPI High-Throughput REST APIs',
          category: 'Backend Architecture',
          status: skillsLower.some(s => s.includes('fastapi') || s.includes('flask')) ? 'strong' : 'needs_improvement',
          whyItMatters: 'Asynchronous API framework used in 80%+ modern AI microservice architectures.',
          recommendedOrder: 5,
          practiceTask: 'Create async endpoints with dependency injection, JWT auth, and response caching.',
          projectIdea: 'High-Concurrency Document Parsing Microservice',
          learningResource: 'FastAPI Official Documentation (Tiangolo)',
          milestone: 'Serve 500+ requests/sec with P99 latency < 35ms',
          currentProficiency: skillsLower.some(s => s.includes('fastapi')) ? 88 : 50
        },
        {
          id: 'gap_cicd',
          name: 'CI/CD Automated Pipelines (GitHub Actions)',
          category: 'DevOps & Quality',
          status: skillsLower.some(s => s.includes('ci/cd') || s.includes('github actions')) ? 'strong' : 'missing',
          whyItMatters: 'Ensures automated test coverage, linting, and deployment verification on every pull request.',
          recommendedOrder: 6,
          practiceTask: 'Configure automated PyTest runner and Docker image publishing to GitHub Packages.',
          projectIdea: 'Automated ML Model Validation and Regression CI Workflow',
          learningResource: 'GitHub Skills: Automated Testing Workflows',
          milestone: 'Zero manual deployment steps with green CI build badges',
          currentProficiency: skillsLower.some(s => s.includes('github actions')) ? 80 : 10
        },
        {
          id: 'gap_distributed',
          name: 'Distributed Systems & Message Queues (Kafka / Redis / Celery)',
          category: 'Advanced Architecture',
          status: 'advanced',
          whyItMatters: 'Separates top 5% candidates by demonstrating real-time streaming, buffering, and scaling.',
          recommendedOrder: 7,
          practiceTask: 'Implement Celery task worker cluster with Redis broker for asynchronous background jobs.',
          projectIdea: 'Real-Time Streaming Transaction Fraud Detection Engine',
          learningResource: 'Designing Data-Intensive Applications (Martin Kleppmann)',
          milestone: 'Handle peak traffic surges with decoupled asynchronous workers',
          currentProficiency: 25
        }
      ];
    }

    // Default template for Full Stack / Web Developer
    return [
      {
        id: 'gap_ts',
        name: 'TypeScript & Modern React 19',
        category: 'Frontend Engineering',
        status: skillsLower.some(s => s.includes('typescript') || s.includes('react')) ? 'strong' : 'needs_improvement',
        whyItMatters: 'Standard in modern enterprise web development for type safety and component state architecture.',
        recommendedOrder: 1,
        practiceTask: 'Build custom hooks, typed context providers, and optimistic UI updates.',
        projectIdea: 'Collaborative Kanban Board with Real-Time WebSockets',
        learningResource: 'React Official Docs & Total TypeScript',
        milestone: 'Clean, strictly-typed React component tree with zero any types',
        currentProficiency: 80
      },
      {
        id: 'gap_backend',
        name: 'Node.js / Express or FastAPI Backend Services',
        category: 'Backend Engineering',
        status: skillsLower.some(s => s.includes('node') || s.includes('express') || s.includes('fastapi')) ? 'strong' : 'needs_improvement',
        whyItMatters: 'Powers server-side business logic, authentication, and database transactions.',
        recommendedOrder: 2,
        practiceTask: 'Design normalized SQL schema with indexing and migration management.',
        projectIdea: 'E-Commerce Marketplace Backend with Stripe Payments & Webhooks',
        learningResource: 'FullStackOpen (University of Helsinki)',
        milestone: 'Production REST/GraphQL API with JWT and rate limiting',
        currentProficiency: 75
      },
      {
        id: 'gap_docker_web',
        name: 'Docker & Cloud Deployment (AWS / GCP / Cloud Run)',
        category: 'DevOps & Infrastructure',
        status: 'missing',
        whyItMatters: 'Demonstrates end-to-end full stack ownership beyond local localhost development.',
        recommendedOrder: 3,
        practiceTask: 'Containerize frontend and backend with multi-container Docker Compose.',
        projectIdea: 'Production Microservice Cluster on Cloud Run with Custom Domain',
        learningResource: 'AWS Educate & Docker Docs',
        milestone: 'Live deployed full stack application with automated CI/CD',
        currentProficiency: 20
      },
      {
        id: 'gap_perf',
        name: 'Web Performance Optimization & Caching (Redis)',
        category: 'Advanced Performance',
        status: 'advanced',
        whyItMatters: 'Critical for high-traffic applications, improving Lighthouse scores and server response times.',
        recommendedOrder: 4,
        practiceTask: 'Implement Redis caching for heavy database queries with cache invalidation.',
        projectIdea: 'High-Concurrency Live Auction Engine with Redis & WebSockets',
        learningResource: 'Web.dev Performance Guidelines',
        milestone: 'Sub-50ms API response time and 95+ Lighthouse score',
        currentProficiency: 30
      }
    ];
  },

  // 3. GENERATE DYNAMIC 7-STAGE TO 10-STAGE ROADMAP
  getDynamicRoadmap: (targetRole: string): RoadmapStage[] => {
    const roleLower = targetRole.toLowerCase();

    if (roleLower.includes('ml') || roleLower.includes('ai') || roleLower.includes('machine learning')) {
      return [
        {
          id: 'st_1',
          title: 'Stage 1: Core Programming & Python Mastery',
          subtitle: 'Master OOP, data structures, generators, time complexity, and vector math',
          duration: 'Weeks 1 - 3',
          skills: ['Python 3.12 OOP', 'NumPy Vectorization', 'Space-Time Complexity', 'Unit Testing (PyTest)'],
          tasks: [
            { id: 't1_1', title: 'Implement Binary Search, QuickSort, and MergeSort from scratch', completed: true, estimatedHours: 4 },
            { id: 't1_2', title: 'Solve NeetCode 75 Core Array & String problems in Python', completed: true, estimatedHours: 8 },
            { id: 't1_3', title: 'Vectorize computational algorithms using NumPy broadcasting', completed: true, estimatedHours: 5 }
          ],
          project: 'CLI Scientific Matrix Profiler & Data Visualizer'
        },
        {
          id: 'st_2',
          title: 'Stage 2: Relational Databases & SQL Query Tuning',
          subtitle: 'Design normalized schemas, master indexing, window functions, and ACID transactions',
          duration: 'Weeks 4 - 6',
          skills: ['PostgreSQL', 'SQL Window Functions', 'B-Tree Indexing', 'Database Normalization'],
          tasks: [
            { id: 't2_1', title: 'Write complex SQL queries with CTEs and window partition functions', completed: true, estimatedHours: 5 },
            { id: 't2_2', title: 'Optimize slow queries using EXPLAIN ANALYZE and composite B-Tree indexes', completed: true, estimatedHours: 6 },
            { id: 't2_3', title: 'Design transactional schema for an analytics warehouse', completed: false, estimatedHours: 5 }
          ],
          project: 'High-Performance Financial Analytics SQL Engine'
        },
        {
          id: 'st_3',
          title: 'Stage 3: Deep Learning Foundations & PyTorch',
          subtitle: 'Understand tensors, autograd derivations, backpropagation, CNNs, and Transformers',
          duration: 'Weeks 7 - 9',
          skills: ['PyTorch Tensors', 'Custom Loss Functions', 'Transfer Learning', 'Hugging Face Transformers'],
          tasks: [
            { id: 't3_1', title: 'Build and train a multi-layer perceptron from scratch in pure PyTorch', completed: false, estimatedHours: 6 },
            { id: 't3_2', title: 'Fine-tune BERT / RoBERTa classifier for NLP sentiment analysis', completed: false, estimatedHours: 8 },
            { id: 't3_3', title: 'Export trained model to ONNX runtime format for sub-20ms inference', completed: false, estimatedHours: 4 }
          ],
          project: 'Sub-20ms NLP Document Classification Service with HuggingFace & ONNX'
        },
        {
          id: 'st_4',
          title: 'Stage 4: Vector Embeddings & Production RAG Systems',
          subtitle: 'Master semantic search, chunking strategies, vector databases, and LLM guardrails',
          duration: 'Weeks 10 - 12',
          skills: ['ChromaDB / Qdrant', 'SentenceTransformers', 'RAG Pipeline Architecture', 'Prompt Guardrails'],
          tasks: [
            { id: 't4_1', title: 'Implement recursive chunking and semantic overlap on PDF documents', completed: false, estimatedHours: 5 },
            { id: 't4_2', title: 'Index 10,000 document embeddings into ChromaDB with cosine similarity', completed: false, estimatedHours: 6 },
            { id: 't4_3', title: 'Build contextual RAG synthesis pipeline with hallucination guardrails', completed: false, estimatedHours: 7 }
          ],
          project: 'Autonomous Technical Document RAG Assistant with ChromaDB & LangChain'
        },
        {
          id: 'st_5',
          title: 'Stage 5: Production Containerization & Cloud Deployment',
          subtitle: 'Multi-stage Docker builds, automated CI/CD with GitHub Actions, and Google Cloud Run',
          duration: 'Weeks 13 - 15',
          skills: ['Docker Multi-Stage', 'GitHub Actions CI/CD', 'Cloud Run / AWS ECS', 'Health Check Probes'],
          tasks: [
            { id: 't5_1', title: 'Write production Dockerfile with multi-stage build reducing footprint below 180MB', completed: false, estimatedHours: 4 },
            { id: 't5_2', title: 'Setup automated GitHub Actions workflow running PyTest on PRs', completed: false, estimatedHours: 4 },
            { id: 't5_3', title: 'Deploy containerized ML service to Google Cloud Run with HTTPS endpoint', completed: false, estimatedHours: 5 }
          ],
          project: 'Production Containerized ML Pipeline on Cloud Run with Automated CI/CD'
        },
        {
          id: 'st_6',
          title: 'Stage 6: System Design for High-Throughput ML',
          subtitle: 'Horizontal scaling, Redis caching, Kafka message queues, and rate limiters',
          duration: 'Weeks 16 - 17',
          skills: ['Distributed Architecture', 'Redis Caching', 'Kafka / Celery Queues', 'Load Balancing'],
          tasks: [
            { id: 't6_1', title: 'Design high-throughput asynchronous inference queue with Redis & Celery', completed: false, estimatedHours: 6 },
            { id: 't6_2', title: 'Study distributed caching strategies and cache stampede mitigations', completed: false, estimatedHours: 5 },
            { id: 't6_3', title: 'Simulate P99 latency bottlenecks under concurrent 500 RPS load', completed: false, estimatedHours: 4 }
          ],
          project: 'High-Concurrency Distributed Task Queue with Redis, Celery & FastAPI'
        },
        {
          id: 'st_7',
          title: 'Stage 7: High-Impact Portfolio & Technical Interview Mastery',
          subtitle: 'Polished GitHub documentation, live demos, ATS-tuned resumes, and Mock interview defense',
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
    }

    // Default Full Stack Web Developer Roadmap
    return [
      {
        id: 'fst_1',
        title: 'Stage 1: JavaScript/TypeScript & Frontend Architecture',
        subtitle: 'Modern ESNext, TypeScript strict types, component state, and responsive layouts',
        duration: 'Weeks 1 - 3',
        skills: ['TypeScript', 'React 19', 'Tailwind CSS', 'State Management'],
        tasks: [
          { id: 'ft1_1', title: 'Master TypeScript interfaces, generics, and utility types', completed: true, estimatedHours: 5 },
          { id: 'ft1_2', title: 'Build responsive modern dashboard with dark/light theme switching', completed: true, estimatedHours: 7 },
          { id: 'ft1_3', title: 'Implement complex state with React Context and custom hooks', completed: true, estimatedHours: 6 }
        ],
        project: 'Responsive Interactive Analytics Dashboard in React & Tailwind'
      },
      {
        id: 'fst_2',
        title: 'Stage 2: Backend REST APIs & Database Engineering',
        subtitle: 'Node.js/Express or FastAPI, PostgreSQL schema design, and secure JWT auth',
        duration: 'Weeks 4 - 6',
        skills: ['Node.js / Express', 'PostgreSQL', 'Prisma ORM', 'JWT Authentication'],
        tasks: [
          { id: 'ft2_1', title: 'Design relational database schema with foreign keys and indexes', completed: true, estimatedHours: 6 },
          { id: 'ft2_2', title: 'Build REST API with role-based access control and input validation', completed: false, estimatedHours: 8 },
          { id: 'ft2_3', title: 'Write unit and integration test suites using Jest or PyTest', completed: false, estimatedHours: 5 }
        ],
        project: 'Secure Multi-Tenant SaaS Backend Microservice'
      },
      {
        id: 'fst_3',
        title: 'Stage 3: Full Stack Integration & Real-Time WebSockets',
        subtitle: 'Connect frontend to backend with optimistic updates, caching, and live sockets',
        duration: 'Weeks 7 - 9',
        skills: ['TanStack Query', 'WebSockets / Socket.io', 'Redis Caching', 'File Uploads'],
        tasks: [
          { id: 'ft3_1', title: 'Implement TanStack Query for server state caching and pagination', completed: false, estimatedHours: 6 },
          { id: 'ft3_2', title: 'Build real-time bidirectional notification system with WebSockets', completed: false, estimatedHours: 7 }
        ],
        project: 'Real-Time Collaborative Workspace with Live Multiplayer Sync'
      },
      {
        id: 'fst_4',
        title: 'Stage 4: Containerization, CI/CD & Production Deployment',
        subtitle: 'Dockerize full stack services, set up GitHub Actions, and deploy to Cloud',
        duration: 'Weeks 10 - 12',
        skills: ['Docker Compose', 'GitHub Actions', 'AWS / Google Cloud', 'SSL & Domains'],
        tasks: [
          { id: 'ft4_1', title: 'Write Docker Compose configuration for web, API, and Postgres', completed: false, estimatedHours: 5 },
          { id: 'ft4_2', title: 'Automate build, test, and container deployment via GitHub Actions', completed: false, estimatedHours: 5 }
        ],
        project: 'Production Containerized Full Stack App Deployed on Cloud Run'
      }
    ];
  },

  // 4. GENERATE PERSONALIZED PROJECT RECOMMENDATIONS
  getRecommendedProjects: (targetRole: string, missingSkills: string[] = []): ProjectItem[] => {
    return [
      {
        id: 'proj_m1',
        title: 'Containerized Asynchronous ML Inference Service',
        difficulty: 'Intermediate',
        technologies: ['Python 3.12', 'FastAPI', 'PyTorch', 'Docker', 'GitHub Actions'],
        description: 'A production microservice serving fine-tuned transformer models with sub-25ms P99 latency, multi-stage Docker builds, and automated CI/CD test gates.',
        careerValue: 'Directly closes the #1 fresher gap in ML Engineering: moving models out of Jupyter notebooks into containerized, test-backed production APIs.',
        duration: '2-3 Weeks',
        resumeBullet: 'Architected an asynchronous ML inference microservice in FastAPI & Docker, reducing image size by 65% (to 175MB) and automating deployment validation via GitHub Actions.',
        bridgesGap: 'Docker Containerization & MLOps'
      },
      {
        id: 'proj_m2',
        title: 'Enterprise Technical Document RAG Knowledge Engine',
        difficulty: 'Intermediate',
        technologies: ['Python', 'ChromaDB', 'SentenceTransformers', 'FastAPI', 'Streamlit'],
        description: 'An applied AI retrieval engine featuring semantic PDF chunking, vector embeddings across 10,000+ technical docs, and cosine similarity re-ranking.',
        careerValue: 'Demonstrates real-world vector database querying, semantic search mechanics, and prompt grounding required by top AI engineering teams.',
        duration: '2-3 Weeks',
        resumeBullet: 'Engineered an enterprise RAG knowledge engine utilizing ChromaDB and SentenceTransformers, enabling sub-80ms semantic retrieval across 10,000+ technical documents.',
        bridgesGap: 'Vector Databases & RAG'
      },
      {
        id: 'proj_m3',
        title: 'Real-Time Streaming Transaction Fraud Detection Pipeline',
        difficulty: 'Advanced',
        technologies: ['Python', 'Kafka', 'Redis', 'Docker', 'XGBoost', 'MLflow'],
        description: 'An event-driven machine learning pipeline that consumes real-time streaming transaction feeds and evaluates fraud likelihood with P99 < 40ms.',
        careerValue: 'Tier-1 FAANG-ready capstone showcasing distributed systems, event streams, caching, and production ML monitoring.',
        duration: '3-4 Weeks',
        resumeBullet: 'Engineered an end-to-end streaming fraud detection pipeline with XGBoost and MLflow, attaining 96.8% ROC-AUC on 2M synthetic transactions with sub-40ms P99 inference latency.',
        bridgesGap: 'Distributed Systems & MLOps'
      }
    ];
  },

  // 5. GENERATE PERSONALIZED DAILY PLAN (Based on study time)
  getDailyPlan: (availableHours: number = 2): DailyStudyBlock[] => {
    if (availableHours <= 1) {
      return [
        { id: 'b_1', timeSlot: '30 min', category: 'DSA', title: 'Solve 1 LeetCode Medium (Two Pointers / Sliding Window)', description: 'Focus on time & space complexity explanation.', targetGoal: '1 problem solved & commented', status: 'pending', xp: 50 },
        { id: 'b_2', timeSlot: '30 min', category: 'Technical Skill', title: 'Docker Multi-Stage Builds Practice', description: 'Write a lean Dockerfile for your FastAPI project.', targetGoal: 'Container under 200MB built locally', status: 'pending', xp: 60 }
      ];
    } else if (availableHours <= 2) {
      return [
        { id: 'b_1', timeSlot: '45 min', category: 'DSA', title: 'Solve 2 LeetCode Tree / Graph Problems', description: 'Implement recursive BFS/DFS and iterative traversal.', targetGoal: '2 problems solved with optimal space complexity', status: 'pending', xp: 80 },
        { id: 'b_2', timeSlot: '45 min', category: 'Project Development', title: 'Implement Redis Caching in FastAPI', description: 'Add 60-second TTL caching to slow database endpoints.', targetGoal: 'P99 latency measured below 30ms', status: 'pending', xp: 90 },
        { id: 'b_3', timeSlot: '30 min', category: 'Interview Practice', title: 'Practice 2 System Design / STAR Questions', description: 'Record answers to explain database sharding and past bug fixes.', targetGoal: 'STAR response self-evaluated', status: 'pending', xp: 60 }
      ];
    } else {
      return [
        { id: 'b_1', timeSlot: '60 min', category: 'DSA', title: 'DSA Deep Dive: Dynamic Programming & Graphs', description: 'Master 0/1 Knapsack pattern and topological sort algorithms.', targetGoal: '3 Medium problems solved', status: 'pending', xp: 120 },
        { id: 'b_2', timeSlot: '60 min', category: 'Technical Skill', title: 'PyTorch Model Optimization & ONNX Export', description: 'Quantize weights and export transformer model to ONNX runtime.', targetGoal: 'Sub-20ms inference benchmark recorded', status: 'pending', xp: 130 },
        { id: 'b_3', timeSlot: '45 min', category: 'Project Development', title: 'GitHub Actions Automated CI/CD Pipeline', description: 'Write workflow file to run automated PyTest suites on push.', targetGoal: 'Green CI badge on GitHub repo', status: 'pending', xp: 100 },
        { id: 'b_4', timeSlot: '25 min', category: 'Aptitude', title: 'Quantitative Aptitude & Logical Speed Test', description: 'Practice time-speed-distance and probability questions.', targetGoal: '15 questions completed in 20 min', status: 'pending', xp: 50 }
      ];
    }
  },

  // 6. GITHUB PROFILE AUDIT SIMULATOR / HEURISTIC EVALUATOR
  auditGitHubProfile: (username: string): GitHubAuditResult => {
    const cleanUser = username.trim().replace(/^@/, '') || 'developer';
    return {
      username: cleanUser,
      totalRepos: 14,
      analyzedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      overallScore: 68,
      languagesDetected: ['Python (62%)', 'TypeScript (24%)', 'SQL (10%)', 'Dockerfile (4%)'],
      portfolioStrength: 'Intermediate',
      readmeQualityScore: 60,
      commitCadenceScore: 78,
      projectComplexityScore: 65,
      keyFindings: [
        'Good continuous commit history (120+ commits in recent months)',
        'Most repositories lack comprehensive architecture diagrams or live deployment URLs',
        'Minimal automated CI/CD workflows detected (only 1 GitHub Actions workflow found)',
        'Repository descriptions are brief and lack clear impact metrics'
      ],
      recommendedImprovements: [
        'Select your best project (e.g. FastAPI / ML Microservice) and pin it as your flagship repository.',
        'Add a structured README with an Architecture Diagram (Mermaid.js), API Endpoints table, and quickstart Docker instructions.',
        'Add a .github/workflows/ci.yml file running linting and automated tests on pull requests.',
        'Include a live deployed demo link (e.g. on Render / Cloud Run) directly in the repo header.'
      ],
      flagshipRepoSuggestion: 'Create "production-ml-inference-service" featuring FastAPI, Docker multi-stage caching, PyTest suite, and live demo link.'
    };
  },

  // 7. LINKEDIN PROFILE AUDIT SIMULATOR / REWRITE GENERATOR
  auditLinkedInProfile: (profileUrlOrUser: string, targetRole: string): LinkedInAuditResult => {
    return {
      profileUrlOrUsername: profileUrlOrUser.trim() || 'tech-professional',
      completenessScore: 72,
      headlineScore: 65,
      aboutScore: 70,
      skillsScore: 80,
      headlineCritique: 'Your current headline is too generic ("Student at College"). Recruiters search for specific target roles, technologies, and tangible engineering impact.',
      recommendedHeadlines: [
        `Aspiring ${targetRole} | Python, PyTorch, FastAPI, Docker | Building Scalable ML Microservices`,
        `CS Undergrad @ NIT | ${targetRole} | PyTorch & High-Throughput APIs | Actively Seeking Summer 2026 Internships`,
        `Software Engineer & AI Practitioner | Specializing in ${targetRole} Systems, RAG Pipelines & Backend Architecture`
      ],
      aboutCritique: 'The About section should concisely present your engineering philosophy, top 2 technical projects with quantitative outcomes, and current learning trajectory.',
      recommendedAboutTemplate: `I am an aspiring ${targetRole} passionate about building scalable, high-throughput software systems and machine learning pipelines.

Currently pursuing B.Tech in Computer Science, where I have built practical projects including:
• An asynchronous ML inference microservice in FastAPI & Docker delivering sub-25ms response latency.
• An enterprise RAG search engine with ChromaDB indexing 10,000+ technical documents.

Core Technical Stack:
• Languages: Python, C++, SQL, TypeScript
• AI & Backend: PyTorch, FastAPI, HuggingFace, PostgreSQL, Redis
• Tools & Cloud: Docker, Git, GitHub Actions, Linux

Actively seeking software engineering and ${targetRole} internship opportunities where I can contribute to mission-critical infrastructure.`,
      actionableChecklist: [
        { task: 'Update Headline with target role and 3 primary technical skills', done: false, impact: '+15 Recruiter Search Discovery' },
        { task: 'Add Featured Section with GitHub repository links and live project demos', done: false, impact: '+20 Profile Credibility' },
        { task: 'Add 5 verified skills to the Skills section matching target job descriptions', done: true, impact: '+10 ATS Match' },
        { task: 'Request 2 recommendations from professors or project collaborators', done: false, impact: '+15 Social Proof' }
      ]
    };
  },

  // 8. CURATED HIGH-QUALITY LEARNING RESOURCES
  getCuratedLearningResources: (targetRole: string): LearningResource[] => {
    return [
      {
        id: 'res_cs50',
        title: 'CS50P: CS50’s Introduction to Programming with Python',
        category: 'Programming',
        platform: 'Harvard OpenCourseWare / edX',
        instructorOrOrg: 'David J. Malan (Harvard University)',
        pricing: 'FREE',
        certification: 'CERTIFICATE AVAILABLE',
        difficulty: 'Beginner',
        estimatedHours: 40,
        rating: 4.9,
        url: 'https://cs50.harvard.edu/python/',
        summary: 'World-class foundation covering Python syntax, data structures, OOP, regular expressions, and unit testing.',
        skillsTaught: ['Python 3', 'OOP', 'PyTest', 'Regex', 'File I/O'],
        whyRecommended: 'Gold standard for writing clean, idiomatic Python with rigorous automated grading.'
      },
      {
        id: 'res_neetcode',
        title: 'NeetCode 150: Systematic Data Structures & Algorithms Roadmap',
        category: 'DSA',
        platform: 'NeetCode.io',
        instructorOrOrg: 'NeetCode (Ex-Google Engineer)',
        pricing: 'FREE',
        certification: 'NO CERTIFICATE',
        difficulty: 'Intermediate',
        estimatedHours: 60,
        rating: 4.95,
        url: 'https://neetcode.io/roadmap',
        summary: 'Visual pattern-based walkthrough covering 150 essential LeetCode coding patterns: Two Pointers, Trees, Graphs, and DP.',
        skillsTaught: ['Trees', 'Graphs', 'Dynamic Programming', 'Sliding Window', 'Binary Search'],
        whyRecommended: 'Most efficient pathway to pass technical coding screens at FAANG and top product startups.'
      },
      {
        id: 'res_fastapi_course',
        title: 'Building Modern APIs with FastAPI and Python',
        category: 'AI/ML',
        platform: 'FastAPI Official / FreeCodeCamp',
        instructorOrOrg: 'Tiangolo & Sanjeev Thiyagarajan',
        pricing: 'FREE',
        certification: 'CERTIFICATE AVAILABLE',
        difficulty: 'Intermediate',
        estimatedHours: 18,
        rating: 4.85,
        url: 'https://fastapi.tiangolo.com/tutorial/',
        summary: 'Build high-performance asynchronous RESTful microservices with PostgreSQL, Pydantic validation, and JWT authentication.',
        skillsTaught: ['FastAPI', 'PostgreSQL', 'SQLAlchemy', 'JWT Auth', 'Pydantic v2'],
        whyRecommended: 'Directly teaches the exact backend framework required for modern AI and ML microservice serving.'
      },
      {
        id: 'res_deeplearning_ai',
        title: 'Deep Learning Specialization with PyTorch & Neural Networks',
        category: 'AI/ML',
        platform: 'Coursera / DeepLearning.AI',
        instructorOrOrg: 'Andrew Ng',
        pricing: 'FREEMIUM',
        certification: 'CERTIFICATE AVAILABLE',
        difficulty: 'Intermediate',
        estimatedHours: 50,
        rating: 4.9,
        url: 'https://www.deeplearning.ai/',
        summary: 'Covers neural network fundamentals, backprop mathematics, hyperparameter tuning, CNNs, and sequence models.',
        skillsTaught: ['PyTorch', 'Neural Networks', 'Hyperparameter Tuning', 'CNNs', 'Optimization'],
        whyRecommended: 'Essential conceptual foundation for anyone targeting Machine Learning or AI Engineering roles.'
      },
      {
        id: 'res_docker_nana',
        title: 'Docker & Kubernetes Full Course for Beginners',
        category: 'Cloud & DevOps',
        platform: 'YouTube / TechWorld with Nana',
        instructorOrOrg: 'Nana Janashia',
        pricing: 'FREE',
        certification: 'NO CERTIFICATE',
        difficulty: 'Beginner',
        estimatedHours: 12,
        rating: 4.9,
        url: 'https://www.youtube.com/watch?v=3c-iBn73dDE',
        summary: 'Hands-on practical walkthrough covering Dockerfiles, images, container networks, multi-stage builds, and Docker Compose.',
        skillsTaught: ['Docker', 'Multi-stage Builds', 'Docker Compose', 'Container Networking'],
        whyRecommended: 'Bridges the gap between local code and containerized production deployment in under 12 hours.'
      },
      {
        id: 'res_ddia',
        title: 'System Design: Designing Data-Intensive Applications Core Concepts',
        category: 'Web Development',
        platform: 'MIT OpenCourseWare / Primer',
        instructorOrOrg: 'Martin Kleppmann / Gaurav Sen',
        pricing: 'FREE',
        certification: 'NO CERTIFICATE',
        difficulty: 'Advanced',
        estimatedHours: 35,
        rating: 4.95,
        url: 'https://github.com/donnemartin/system-design-primer',
        summary: 'Comprehensive guide to horizontal scaling, caching strategies, replication, partitioning, and message brokers.',
        skillsTaught: ['System Design', 'Redis Caching', 'Kafka', 'Replication', 'Load Balancing'],
        whyRecommended: 'Essential study material for cracking system design and technical architectural rounds.'
      }
    ];
  }
};
