package com.careerpilot.ai.data

import com.careerpilot.ai.model.*

object CareerData {

    val defaultProfile = UserProfile()

    val rolePillarWeights: Map<String, PillarWeights> = mapOf(
        "Machine Learning Engineer" to PillarWeights(skills = 0.30f, projects = 0.30f, resume = 0.15f, interview = 0.25f),
        "AI / ML Engineer" to PillarWeights(skills = 0.30f, projects = 0.30f, resume = 0.15f, interview = 0.25f),
        "Frontend Developer" to PillarWeights(skills = 0.30f, projects = 0.35f, resume = 0.15f, interview = 0.20f),
        "Backend Developer" to PillarWeights(skills = 0.35f, projects = 0.30f, resume = 0.15f, interview = 0.20f),
        "Full Stack Engineer" to PillarWeights(skills = 0.30f, projects = 0.30f, resume = 0.20f, interview = 0.20f),
        "Data Analyst / BI" to PillarWeights(skills = 0.35f, projects = 0.25f, resume = 0.20f, interview = 0.20f),
        "Cloud / DevOps Engineer" to PillarWeights(skills = 0.35f, projects = 0.30f, resume = 0.15f, interview = 0.20f)
    )

    fun getWeightsForRole(role: String): PillarWeights {
        return rolePillarWeights[role] ?: PillarWeights(0.30f, 0.30f, 0.15f, 0.25f)
    }

    val defaultSkillEvidence = listOf(
        SkillEvidenceItem("sk_py", "Python 3.x & Algorithms", "Core Language", SkillStatus.STRONG, "Verified in GitHub repo & coursework", "Critical"),
        SkillEvidenceItem("sk_sql", "Relational Database & SQL", "Data & Storage", SkillStatus.STRONG, "Documented in Resume projects", "Critical"),
        SkillEvidenceItem("sk_torch", "PyTorch / Tensor Operations", "AI & Deep Learning", SkillStatus.PARTIAL, "Self-reported (No verified public code repo detected)", "Critical"),
        SkillEvidenceItem("sk_fastapi", "FastAPI REST Microservices", "Backend Architecture", SkillStatus.PARTIAL, "Mentioned in resume summary; no unit tests detected", "Important"),
        SkillEvidenceItem("sk_docker", "Docker Containerization", "DevOps & Deployment", SkillStatus.NOT_DETECTED, "Docker not detected in profile history", "Critical"),
        SkillEvidenceItem("sk_vectordb", "Vector DBs (ChromaDB / Qdrant)", "AI & Search", SkillStatus.NOT_DETECTED, "Vector indexing not detected in profile history", "Important"),
        SkillEvidenceItem("sk_sys_design", "High-Concurrency System Design", "Architecture", SkillStatus.PARTIAL, "Basic caching and DB indexing self-reported", "Important"),
        SkillEvidenceItem("sk_cicd", "CI/CD Pipelines (GitHub Actions)", "DevOps", SkillStatus.NOT_DETECTED, "Automated CI/CD workflows not detected", "Bonus")
    )

    val defaultDailyMissions = listOf(
        DailyMission(
            id = "mis_1",
            title = "Containerize FastAPI ML Model with Docker",
            estimatedMinutes = 35,
            whyItMatters = "Closing the Docker containerization gap increases your ML Engineer role alignment by +12% in ATS screens.",
            pillar = "Projects",
            completed = false,
            xpReward = 150,
            skillUnlocked = "Docker Multi-Stage"
        ),
        DailyMission(
            id = "mis_2",
            title = "Answer 1 System Design Latency Trade-off Question",
            estimatedMinutes = 20,
            whyItMatters = "Practicing cache invalidation trade-offs elevates your Interview Depth score from 7.0 to 8.5.",
            pillar = "Interview",
            completed = false,
            xpReward = 80,
            skillUnlocked = "System Design Interview"
        ),
        DailyMission(
            id = "mis_3",
            title = "Quantify 2 Resume Bullets with Latency & Throughput Metrics",
            estimatedMinutes = 15,
            whyItMatters = "Action verbs + quantified metrics improve ATS parsing score by +8 points.",
            pillar = "Resume",
            completed = true,
            xpReward = 60,
            skillUnlocked = "ATS Impact Writing"
        )
    )

    val defaultRoadmapStages = listOf(
        RoadmapStage(
            id = "stage_1",
            title = "Stage 1: Core DSA & Python Mastery",
            subtitle = "Foundational problem solving and clean code patterns",
            duration = "Weeks 1 - 3",
            skills = listOf("Python 3.12", "Data Structures", "Dynamic Programming", "Time Complexity"),
            tasks = listOf(
                RoadmapTask("t1", "Solve 25 Blind 75 LeetCode Mediums in Python", true, 18),
                RoadmapTask("t2", "Implement Custom Min-Heap and Trie Data Structures", true, 8),
                RoadmapTask("t3", "Profile Python Memory and Concurrency with Multiprocessing", true, 6)
            ),
            project = "High-Performance Thread-Safe In-Memory Cache"
        ),
        RoadmapStage(
            id = "stage_2",
            title = "Stage 2: Deep Learning & PyTorch Systems",
            subtitle = "Neural network architecture and tensor operations",
            duration = "Weeks 4 - 7",
            skills = listOf("PyTorch", "HuggingFace", "Embeddings", "GPU Acceleration"),
            tasks = listOf(
                RoadmapTask("t4", "Build Custom Transformer Attention Block from Scratch", true, 12),
                RoadmapTask("t5", "Fine-tune BERT / Llama Model for Sequence Classification", false, 15),
                RoadmapTask("t6", "Benchmark Quantized ONNX Model Inference Latency", false, 10)
            ),
            project = "Context-Aware Semantic Search Engine with ChromaDB"
        ),
        RoadmapStage(
            id = "stage_3",
            title = "Stage 3: Production Microservices & Docker",
            subtitle = "Containerization, async APIs, and cloud deployability",
            duration = "Weeks 8 - 10",
            skills = listOf("FastAPI", "Docker", "PostgreSQL", "Redis Caching"),
            tasks = listOf(
                RoadmapTask("t7", "Write Multi-Stage Dockerfile with Minimal Alpine Base Image", false, 6),
                RoadmapTask("t8", "Implement Redis Token Bucket Rate Limiter in FastAPI", false, 8),
                RoadmapTask("t9", "Add Unit and Integration Tests with Pytest & Coverage > 85%", false, 10)
            ),
            project = "Production-Grade AI Inference REST Microservice"
        ),
        RoadmapStage(
            id = "stage_4",
            title = "Stage 4: High-Concurrency & System Design",
            subtitle = "Distributed architectures, queueing, and scalability",
            duration = "Weeks 11 - 14",
            skills = listOf("System Design", "Kafka", "Celery", "Distributed Caching"),
            tasks = listOf(
                RoadmapTask("t10", "Design High-Throughput Video Ingestion Pipeline (100k QPS)", false, 14),
                RoadmapTask("t11", "Simulate Database Sharding and Read Replicas Failover", false, 12),
                RoadmapTask("t12", "Record 3 Live STAR Behavioral and System Design Mocks", false, 8)
            ),
            project = "Distributed Asynchronous Job Queue with Worker Nodes"
        )
    )

    val defaultOpportunities = listOf(
        OpportunityMatch(
            id = "opp_1",
            title = "Machine Learning Engineering Intern (Summer 2026)",
            company = "Google DeepMind",
            location = "Mountain View, CA (Hybrid)",
            type = "Internship",
            alignmentScore = 86,
            postedDate = "2 days ago",
            deadline = "Rolling",
            requiredSkills = listOf("Python", "PyTorch", "Data Structures", "Docker", "FastAPI"),
            matchingSkills = listOf("Python", "Data Structures", "FastAPI", "PyTorch"),
            missingSkills = listOf("Docker Containerization", "Vector DB Embeddings"),
            whyMatch = "Strong language proficiency and DSA foundations. Docker project completion will elevate alignment to 94%."
        ),
        OpportunityMatch(
            id = "opp_2",
            title = "Junior AI Backend Systems Developer",
            company = "Stripe",
            location = "San Francisco, CA / Remote",
            type = "New Grad",
            alignmentScore = 79,
            postedDate = "Yesterday",
            deadline = "In 3 weeks",
            requiredSkills = listOf("Python", "SQL", "Distributed Systems", "FastAPI", "Redis"),
            matchingSkills = listOf("Python", "SQL", "FastAPI"),
            missingSkills = listOf("Redis Caching", "Distributed Systems"),
            whyMatch = "Excellent Python and SQL backend alignment. Needs caching and rate-limiting system design evidence."
        ),
        OpportunityMatch(
            id = "opp_3",
            title = "Applied AI & RAG Fellow",
            company = "Anthropic Labs",
            location = "Seattle, WA",
            type = "Internship",
            alignmentScore = 92,
            postedDate = "3 days ago",
            deadline = "Next Friday",
            requiredSkills = listOf("Python", "Transformers", "FastAPI", "Vector Search"),
            matchingSkills = listOf("Python", "FastAPI", "Transformers"),
            missingSkills = listOf("ChromaDB Vector Indexing"),
            whyMatch = "Outstanding fit for RAG & Model Evaluation. One vector search project bridges the remaining gap.",
            applied = true
        )
    )

    val defaultApplications = listOf(
        TrackedApplication(
            id = "app_1",
            company = "Anthropic Labs",
            role = "Applied AI & RAG Fellow",
            status = "Interview",
            appliedDate = "Oct 12, 2026",
            interviewDate = "Nov 3, 2026 (Technical Round)",
            matchScore = 92,
            notes = "Completed take-home vector search challenge. Preparing STAR stories for behavioral panel.",
            resumeVersion = "Resume_ML_v3.pdf",
            salaryRange = "$52/hr"
        ),
        TrackedApplication(
            id = "app_2",
            company = "Google DeepMind",
            role = "Machine Learning Engineering Intern",
            status = "Assessment",
            appliedDate = "Oct 18, 2026",
            interviewDate = "Nov 8, 2026 (Online Assessment)",
            matchScore = 86,
            notes = "Review Graph Algorithms and PyTorch memory layout before OA.",
            resumeVersion = "Resume_ML_v3.pdf",
            salaryRange = "$58/hr"
        ),
        TrackedApplication(
            id = "app_3",
            company = "Stripe",
            role = "Junior AI Backend Systems Developer",
            status = "Applied",
            appliedDate = "Oct 24, 2026",
            matchScore = 79,
            notes = "Submitted with custom cover letter highlighting FastAPI latency benchmark.",
            resumeVersion = "Resume_Backend_v2.pdf"
        )
    )

    val mockInterviewQuestions = listOf(
        InterviewQuestion(
            id = "q1",
            role = "Machine Learning Engineer",
            category = "Systems & Deep Learning",
            question = "How do you handle high inference latency when deploying a large PyTorch transformer model to production with tight SLA (<50ms)?",
            hints = listOf(
                "Mention Model Quantization (INT8/FP16)",
                "Discuss TensorRT or ONNX Runtime compilation",
                "Explain dynamic batching and asynchronous inference workers",
                "Talk about KV-caching for generative models"
            ),
            benchmarkAnswer = "To reduce transformer inference latency below 50ms: 1) Quantize weights from FP32 to INT8/FP16 with calibration, reducing memory bandwidth pressure. 2) Convert the model graph to TensorRT/ONNX Runtime with kernel fusion. 3) Deploy with Triton Inference Server using dynamic batching. 4) Use KV-caching and speculative decoding for autoregressive workloads."
        ),
        InterviewQuestion(
            id = "q2",
            role = "Backend / AI Systems",
            category = "System Design & Architecture",
            question = "Design a rate limiter for an AI API platform that supports 100,000 requests per second with strict tier limits and Redis.",
            hints = listOf(
                "Compare Token Bucket vs Sliding Window Log",
                "Use Redis Lua scripts for atomic operations",
                "Address distributed clocks and network roundtrips"
            ),
            benchmarkAnswer = "I would implement the Token Bucket algorithm using Redis with Lua scripts to guarantee atomicity and minimize network round-trips. Each client key stores token count and last refill timestamp. For 100k QPS, I would shard Redis clusters by API key hash and implement a local in-memory pre-limiter to shed spikes before reaching Redis."
        ),
        InterviewQuestion(
            id = "q3",
            role = "Generalist SWE / ML",
            category = "Behavioral & Conflict Resolution",
            question = "Tell me about a time when your model or software failed in production. How did you diagnose and resolve the incident?",
            hints = listOf(
                "Use the STAR method (Situation, Task, Action, Result)",
                "Focus on observability, blameless post-mortem, and permanent guardrails"
            ),
            benchmarkAnswer = "Situation: During a model deployment, our embeddings service began throwing 504 timeouts due to an unindexed vector search query under traffic load. Task: Restore service SLA immediately and prevent regressions. Action: I rolled back the canary deployment, profiled the query execution plan in pprof, added HNSW vector indexing, and configured automated load tests. Result: Restored 99.9% uptime, reduced query P99 from 420ms to 18ms, and published a blameless post-mortem."
        )
    )

    val defaultResumeAnalysis = ATSResumeAnalysis(
        overallScore = 82,
        formattingScore = 90,
        impactScore = 75,
        detectedSkills = listOf("Python", "PyTorch", "FastAPI", "SQL", "PostgreSQL", "Git", "Algorithms", "REST APIs"),
        missingKeywords = listOf("Docker", "Vector Search / ChromaDB", "CI/CD GitHub Actions", "Kubernetes", "Redis"),
        strongBullets = listOf(
            "Engineered high-throughput FastAPI service reducing response latency by 34% across 50,000 daily requests.",
            "Architected PyTorch convolutional model achieving 92.4% test accuracy on multi-class defect classification."
        ),
        weakBulletsToImprove = listOf(
            "Worked on machine learning models and dataset preparation" to
            "Optimized distributed PyTorch data pipelines, accelerating training throughput by 2.4x and preparing 1.2M labeled samples.",
            "Responsible for database queries and backend APIs" to
            "Designed normalized PostgreSQL schemas and indexed queries, eliminating N+1 bottlenecks and handling 450 concurrent connections."
        )
    )
}
