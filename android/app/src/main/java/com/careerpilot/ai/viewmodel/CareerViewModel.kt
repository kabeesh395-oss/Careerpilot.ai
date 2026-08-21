package com.careerpilot.ai.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.careerpilot.ai.data.CareerData
import com.careerpilot.ai.model.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlin.math.roundToInt

class CareerViewModel : ViewModel() {

    private val _userProfile = MutableStateFlow(CareerData.defaultProfile)
    val userProfile: StateFlow<UserProfile> = _userProfile.asStateFlow()

    private val _pillars = MutableStateFlow(CareerPillars(skills = 0, projects = 0, resume = 0, interview = 0))
    val pillars: StateFlow<CareerPillars> = _pillars.asStateFlow()

    private val _careerEnergyScore = MutableStateFlow(0)
    val careerEnergyScore: StateFlow<Int> = _careerEnergyScore.asStateFlow()

    private val _careerEnergyTier = MutableStateFlow(CareerEnergyTier.DANGER)
    val careerEnergyTier: StateFlow<CareerEnergyTier> = _careerEnergyTier.asStateFlow()

    private val _dailyMissions = MutableStateFlow(CareerData.defaultDailyMissions)
    val dailyMissions: StateFlow<List<DailyMission>> = _dailyMissions.asStateFlow()

    private val _roadmapStages = MutableStateFlow(CareerData.defaultRoadmapStages)
    val roadmapStages: StateFlow<List<RoadmapStage>> = _roadmapStages.asStateFlow()

    private val _skillEvidence = MutableStateFlow(CareerData.defaultSkillEvidence)
    val skillEvidence: StateFlow<List<SkillEvidenceItem>> = _skillEvidence.asStateFlow()

    private val _opportunities = MutableStateFlow(CareerData.defaultOpportunities)
    val opportunities: StateFlow<List<OpportunityMatch>> = _opportunities.asStateFlow()

    private val _trackedApplications = MutableStateFlow(CareerData.defaultApplications)
    val trackedApplications: StateFlow<List<TrackedApplication>> = _trackedApplications.asStateFlow()

    private val _resumeAnalysis = MutableStateFlow(CareerData.defaultResumeAnalysis)
    val resumeAnalysis: StateFlow<ATSResumeAnalysis> = _resumeAnalysis.asStateFlow()

    private val _selectedResumeName = MutableStateFlow("")
    val selectedResumeName: StateFlow<String> = _selectedResumeName.asStateFlow()

    private val _isAnalyzingResume = MutableStateFlow(false)
    val isAnalyzingResume: StateFlow<Boolean> = _isAnalyzingResume.asStateFlow()

    // Mock Interview State
    private val _interviewQuestions = MutableStateFlow(CareerData.mockInterviewQuestions)
    val interviewQuestions: StateFlow<List<InterviewQuestion>> = _interviewQuestions.asStateFlow()

    private val _currentQuestionIndex = MutableStateFlow(0)
    val currentQuestionIndex: StateFlow<Int> = _currentQuestionIndex.asStateFlow()

    private val _userInterviewAnswer = MutableStateFlow("")
    val userInterviewAnswer: StateFlow<String> = _userInterviewAnswer.asStateFlow()

    private val _interviewFeedback = MutableStateFlow<InterviewFeedback?>(null)
    val interviewFeedback: StateFlow<InterviewFeedback?> = _interviewFeedback.asStateFlow()

    private val _isEvaluatingInterview = MutableStateFlow(false)
    val isEvaluatingInterview: StateFlow<Boolean> = _isEvaluatingInterview.asStateFlow()

    // Job Analyzer state
    private val _jdMatchScore = MutableStateFlow(84)
    val jdMatchScore: StateFlow<Int> = _jdMatchScore.asStateFlow()

    private val _jdRecommendation = MutableStateFlow("Recommended")
    val jdRecommendation: StateFlow<String> = _jdRecommendation.asStateFlow()

    private val _isAnalyzingJd = MutableStateFlow(false)
    val isAnalyzingJd: StateFlow<Boolean> = _isAnalyzingJd.asStateFlow()

    init {
        recalculateScore()
    }

    private fun recalculateScore() {
        val p = _pillars.value
        val weights = CareerData.getWeightsForRole(_userProfile.value.targetRole)
        val weighted = (p.skills * weights.skills) +
                (p.projects * weights.projects) +
                (p.resume * weights.resume) +
                (p.interview * weights.interview)

        val score = weighted.roundToInt().coerceIn(0, 100)
        _careerEnergyScore.value = score

        _careerEnergyTier.value = when {
            score >= 85 -> CareerEnergyTier.GOLD
            score >= 70 -> CareerEnergyTier.GOOD
            score >= 50 -> CareerEnergyTier.AVERAGE
            else -> CareerEnergyTier.DANGER
        }
    }

    fun toggleMission(missionId: String) {
        val currentList = _dailyMissions.value.toMutableList()
        val index = currentList.indexOfFirst { it.id == missionId }
        if (index != -1) {
            val item = currentList[index]
            val nextState = !item.completed
            currentList[index] = item.copy(completed = nextState)
            _dailyMissions.value = currentList

            // Add XP and bump pillar
            if (nextState) {
                _userProfile.value = _userProfile.value.copy(
                    xp = _userProfile.value.xp + item.xpReward
                )
                when (item.pillar) {
                    "Projects" -> _pillars.value = _pillars.value.copy(projects = (_pillars.value.projects + 4).coerceAtMost(100))
                    "Interview" -> _pillars.value = _pillars.value.copy(interview = (_pillars.value.interview + 3).coerceAtMost(100))
                    "Resume" -> _pillars.value = _pillars.value.copy(resume = (_pillars.value.resume + 3).coerceAtMost(100))
                    "Skills" -> _pillars.value = _pillars.value.copy(skills = (_pillars.value.skills + 4).coerceAtMost(100))
                }
                recalculateScore()
            }
        }
    }

    fun toggleRoadmapTask(taskId: String) {
        val stages = _roadmapStages.value.map { stage ->
            val updatedTasks = stage.tasks.map { task ->
                if (task.id == taskId) task.copy(completed = !task.completed) else task
            }
            stage.copy(tasks = updatedTasks)
        }
        _roadmapStages.value = stages

        // Count total completion
        val allTasks = stages.flatMap { it.tasks }
        val completedCount = allTasks.count { it.completed }
        val projectScore = ((completedCount.toFloat() / allTasks.size) * 100).roundToInt().coerceIn(30, 98)
        _pillars.value = _pillars.value.copy(projects = projectScore)
        recalculateScore()
    }

    fun setInterviewAnswer(text: String) {
        _userInterviewAnswer.value = text
    }

    fun submitInterviewAnswer() {
        viewModelScope.launch {
            _isEvaluatingInterview.value = true
            delay(1200) // Realistic local AI evaluation simulation

            val currentQ = _interviewQuestions.value[_currentQuestionIndex.value]
            val answer = _userInterviewAnswer.value.trim()

            val length = answer.length
            val score = if (length > 150) 88 else if (length > 60) 74 else 55

            _interviewFeedback.value = InterviewFeedback(
                overallScore = score,
                correctness = (score / 10).coerceIn(5, 10),
                communication = 8,
                depth = if (length > 120) 8 else 6,
                problemSolving = 8,
                strengths = listOf(
                    "Clear structured formulation addressing core principles",
                    "Demonstrated understanding of latency trade-offs and systems"
                ),
                weaknesses = listOf(
                    "Could explicitly mention concrete metrics (e.g. P99 latency ms reduction)",
                    "Include edge-case error recovery scenarios"
                ),
                keyImprovement = "Quantify real-world production impact and explain asynchronous fallback mechanisms.",
                modelAnswer = currentQ.benchmarkAnswer
            )

            _pillars.value = _pillars.value.copy(interview = ((_pillars.value.interview + score) / 2).coerceIn(0, 100))
            recalculateScore()
            _isEvaluatingInterview.value = false
        }
    }

    fun nextInterviewQuestion() {
        val nextIdx = (_currentQuestionIndex.value + 1) % _interviewQuestions.value.size
        _currentQuestionIndex.value = nextIdx
        _userInterviewAnswer.value = ""
        _interviewFeedback.value = null
    }

    fun analyzeResumeFile(fileName: String) {
        viewModelScope.launch {
            _selectedResumeName.value = fileName
            _isAnalyzingResume.value = true
            delay(1500) // Native parsing simulation
            _resumeAnalysis.value = CareerData.defaultResumeAnalysis.copy(
                overallScore = 86,
                formattingScore = 94,
                impactScore = 81
            )
            _pillars.value = _pillars.value.copy(resume = 86)
            recalculateScore()
            _isAnalyzingResume.value = false
        }
    }

    fun analyzeJobDescription(jdText: String) {
        viewModelScope.launch {
            _isAnalyzingJd.value = true
            delay(1000)
            val hasDocker = jdText.contains("Docker", ignoreCase = true)
            val hasPython = jdText.contains("Python", ignoreCase = true)
            val score = if (hasPython && !hasDocker) 88 else 82
            _jdMatchScore.value = score
            _jdRecommendation.value = if (score >= 85) "Recommended" else "Apply with Prep"
            _isAnalyzingJd.value = false
        }
    }

    fun applyOpportunity(oppId: String) {
        val updated = _opportunities.value.map {
            if (it.id == oppId) it.copy(applied = true) else it
        }
        _opportunities.value = updated
    }

    fun updateProfile(name: String, targetRole: String, targetCompany: String) {
        _userProfile.value = _userProfile.value.copy(
            name = name,
            targetRole = targetRole,
            targetCompany = targetCompany
        )
        recalculateScore()
    }
}
