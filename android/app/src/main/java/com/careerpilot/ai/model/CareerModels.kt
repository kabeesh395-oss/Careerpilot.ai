package com.careerpilot.ai.model

import androidx.compose.ui.graphics.Color
import com.careerpilot.ai.theme.*

enum class CareerEnergyTier(val label: String, val color: Color, val glowColor: Color, val description: String) {
    DANGER("DANGER", EnergyDangerRed, EnergyDangerRedGlow, "High gap detected. Critical skills needed to pass ATS & technical screenings."),
    AVERAGE("AVERAGE", EnergyAverageYellow, EnergyAverageYellowGlow, "Good foundations. Focus on project evidence and system design to stand out."),
    GOOD("GOOD", EnergyGoodGreen, EnergyGoodGreenGlow, "Strong profile readiness. Well aligned with competitive role criteria."),
    GOLD("HIGH MATCH", EnergyGoldHighMatch, EnergyGoldGlow, "Top tier candidate potential. Ready for prime interviews & early offers.")
}

data class CareerPillars(
    val skills: Int = 0,
    val projects: Int = 0,
    val resume: Int = 0,
    val interview: Int = 0
)

data class PillarWeights(
    val skills: Float = 0.30f,
    val projects: Float = 0.30f,
    val resume: Float = 0.15f,
    val interview: Float = 0.25f
)

enum class SkillStatus(val label: String, val color: Color) {
    STRONG("Strong", EnergyGoodGreen),
    PARTIAL("Partial", EnergyAverageYellow),
    NOT_DETECTED("Missing", EnergyDangerRed)
}

data class SkillEvidenceItem(
    val id: String,
    val name: String,
    val category: String,
    val status: SkillStatus,
    val evidenceSource: String,
    val importance: String = "Critical"
)

data class DailyMission(
    val id: String,
    val title: String,
    val estimatedMinutes: Int,
    val whyItMatters: String,
    val pillar: String,
    val completed: Boolean,
    val xpReward: Int,
    val skillUnlocked: String
)

data class OpportunityMatch(
    val id: String,
    val title: String,
    val company: String,
    val location: String,
    val type: String,
    val alignmentScore: Int,
    val postedDate: String,
    val deadline: String,
    val requiredSkills: List<String>,
    val matchingSkills: List<String>,
    val missingSkills: List<String>,
    val whyMatch: String,
    val applied: Boolean = false
)

data class TrackedApplication(
    val id: String,
    val company: String,
    val role: String,
    val status: String,
    val appliedDate: String,
    val interviewDate: String? = null,
    val matchScore: Int,
    val notes: String,
    val resumeVersion: String,
    val salaryRange: String? = null
)

data class RoadmapTask(
    val id: String,
    val title: String,
    val completed: Boolean,
    val estimatedHours: Int
)

data class RoadmapStage(
    val id: String,
    val title: String,
    val subtitle: String,
    val duration: String,
    val skills: List<String>,
    val tasks: List<RoadmapTask>,
    val project: String
)

data class ProjectBlueprint(
    val id: String,
    val title: String,
    val description: String,
    val techStack: List<String>,
    val difficulty: String,
    val roleRelevance: String
)

data class InterviewQuestion(
    val id: String,
    val role: String,
    val question: String,
    val category: String,
    val hints: List<String>,
    val benchmarkAnswer: String
)

data class InterviewFeedback(
    val overallScore: Int,
    val correctness: Int,
    val communication: Int,
    val depth: Int,
    val problemSolving: Int,
    val strengths: List<String>,
    val weaknesses: List<String>,
    val keyImprovement: String,
    val modelAnswer: String
)

data class UserProfile(
    val name: String = "",
    val college: String = "",
    val degree: String = "B.S. Computer Science",
    val targetRole: String = "Software Engineer",
    val targetCompany: String = "",
    val streak: Int = 0,
    val xp: Int = 0,
    val level: Int = 1,
    val github: String = "",
    val linkedin: String = "",
    val leetcode: String = "",
    val currentSkills: List<String> = emptyList()
)

data class ATSResumeAnalysis(
    val overallScore: Int,
    val formattingScore: Int,
    val impactScore: Int,
    val detectedSkills: List<String>,
    val missingKeywords: List<String>,
    val strongBullets: List<String>,
    val weakBulletsToImprove: List<Pair<String, String>>
)

data class SampleJobDescription(
    val id: String,
    val company: String,
    val role: String,
    val text: String
)
