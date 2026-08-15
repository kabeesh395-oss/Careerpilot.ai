import { AndroidApp } from '../types';

export const SAMPLE_APPS: AndroidApp[] = [
  {
    id: 'career_guidance',
    name: 'CareerPilot AI',
    icon: 'Compass',
    category: 'Career & AI',
    color: '#6366F1', // Indigo
    description: 'Autonomous AI Career Mentor for students & developers featuring Resume ATS analysis, 7-stage learning roadmaps, mock interview coach, and skill gap heatmaps.',
    kotlinCode: `package com.careerpilot.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import com.example.careeriq.ui.theme.CareerIQTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            CareerIQTheme {
                CareerIQScreen()
            }
        }
    }
}

// --- TASK 1: CAREER GAP ANALYSIS ---
@Serializable
data class CareerGapInput(
    val task: String = "career_gap_analysis",
    val target_role: String,
    val readiness_score: Int,
    val strong_skills: List<String>,
    val missing_skills: List<String>
)

@Serializable
data class CareerGapResult(
    val readiness_explanation: String,
    val next_best_action: String,
    val roadmap: List<RoadmapPhase>,
    val recommended_projects: List<String>
)

@Serializable
data class RoadmapPhase(
    val phase: String,
    val duration: String,
    val focus_skills: List<String>,
    val action_items: List<String>
)

// --- TASK 2: INTERVIEW PREPARATION ---
@Serializable
data class InterviewPrepInput(
    val task: String = "interview_preparation",
    val target_role: String,
    val user_skills: List<String>
)

@Serializable
data class InterviewPrepResult(
    val technical_questions: List<String>,
    val system_design_questions: List<String>,
    val behavioral_questions: List<String>
)

// --- TASK 3: RECOMMEND CAREERS ---
@Serializable
data class RecommendCareersInput(
    val task: String = "recommend_careers",
    val user_skills: List<String>
)

@Serializable
data class RecommendedRole(
    val role: String,
    val match_reason: String,
    val skills_to_add: List<String>
)

@Serializable
data class RecommendCareersResult(
    val recommended_roles: List<RecommendedRole>
)

// --- TASK 4: GITHUB ANALYSIS ---
@Serializable
data class GithubAnalysisInput(
    val task: String = "github_analysis",
    val repo_name: String,
    val languages: List<String>,
    val has_readme: Boolean,
    val has_tests: Boolean,
    val commit_count: Int
)

@Serializable
data class GithubAnalysisResult(
    val profile_strength: String,
    val improvement_suggestions: List<String>,
    val employer_readiness: String,
    val employer_readiness_reason: String
)

object CareerIQAiService {
    // CRITICAL: Clean LLM markdown code blocks before JSON parsing
    fun cleanJsonResponse(rawText: String): String {
        var text = rawText.trim()
        if (text.startsWith("\`\`\`json")) {
            text = text.substring(7)
        }
        if (text.endsWith("\`\`\`")) {
            text = text.substring(0, text.length - 3)
        }
        return text.trim()
    }

    suspend fun callCareerIQ(inputJsonString: String): String {
        // API call to Gemini model goes here
        val rawResponse = """
        \`\`\`json
        {
          "readiness_explanation": "With a 68% score, you possess strong foundations in Python and SQL.",
          "next_best_action": "Focus on building a Docker containerized PyTorch pipeline.",
          "roadmap": [],
          "recommended_projects": ["PyTorch ResNet Container"]
        }
        \`\`\`
        """.trimIndent()

        return cleanJsonResponse(rawResponse)
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CareerIQScreen() {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("CareerIQ Engine", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF6D28D9),
                    titleContentColor = Color.White
                )
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp)
        ) {
            Text("CareerIQ AI Engine active with 4 tasks.", fontWeight = FontWeight.SemiBold)
        }
    }
}`,
    xmlManifest: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.careeriq">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="CareerIQ Engine"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.CareerIQ">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.CareerIQ">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
    gradleCode: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.serialization)
}

android {
    namespace = "com.example.careerguidance"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.careerguidance"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.material3)
    implementation(libs.kotlinx.serialization.json)
    implementation(libs.retrofit)
    implementation(libs.retrofit.converter.serialization)
}`,
    stringsXml: `<resources>
    <string name="app_name">Career Guidance AI</string>
    <string name="welcome_title">Career Guidance &amp; AI Roadmap</string>
</resources>`
  },
  {
    id: 'fitpulse',
    name: 'FitPulse',
    icon: 'Activity',
    category: 'Health & Fitness',
    color: '#10B981', // Emerald
    description: 'Track your daily steps, heart rate, active calories, and hydration with Material You dynamic widgets.',
    kotlinCode: `package com.example.fitpulse

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.fitpulse.ui.theme.FitPulseTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            FitPulseTheme {
                FitPulseHomeScreen()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FitPulseHomeScreen() {
    var stepCount by remember { mutableStateOf(8420) }
    var heartRate by remember { mutableStateOf(72) }
    var waterGlasses by remember { mutableStateOf(5) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("FitPulse Dashboard", style = MaterialTheme.typography.titleLarge) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer
                )
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Steps Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFE6F4EA)),
                shape = RoundedCornerShape(24.dp)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text("Daily Steps", style = MaterialTheme.typography.labelMedium, color = Color(0xFF137333))
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("$stepCount / 10,000", fontSize = 32.sp, style = MaterialTheme.typography.headlineMedium)
                    LinearProgressIndicator(
                        progress = { stepCount / 10000f },
                        modifier = Modifier.fillMaxWidth().padding(top = 12.dp),
                        color = Color(0xFF10B981)
                    )
                }
            }

            // Hydration Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(24.dp)
            ) {
                Row(
                    modifier = Modifier.padding(20.dp).fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("Hydration", style = MaterialTheme.typography.titleMedium)
                        Text("$waterGlasses Glasses (1.25L)", color = Color.Gray)
                    }
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Button(onClick = { if (waterGlasses > 0) waterGlasses-- }) { Text("-") }
                        Button(onClick = { waterGlasses++ }) { Text("+") }
                    }
                }
            }
        }
    }
}`,
    xmlManifest: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.fitpulse">

    <uses-permission android:name="android.permission.ACTIVITY_RECOGNITION" />
    <uses-permission android:name="android.permission.BODY_SENSORS" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="FitPulse"
        android:supportsRtl="true"
        android:theme="@style/Theme.FitPulse">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.FitPulse">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
    gradleCode: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.example.fitpulse"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.fitpulse"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }
}`,
    stringsXml: `<resources>
    <string name="app_name">FitPulse</string>
    <string name="welcome_message">Stay Active Every Day!</string>
</resources>`
  },
  {
    id: 'harmonix',
    name: 'Harmonix',
    icon: 'Music',
    category: 'Audio & Music',
    color: '#8B5CF6', // Purple
    description: 'Sleek Material You music player featuring album glow, live sound visualizers, and playlist curation.',
    kotlinCode: `package com.example.harmonix

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.SkipNext
import androidx.compose.material.icons.filled.SkipPrevious
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            HarmonixPlayerScreen()
        }
    }
}

@Composable
fun HarmonixPlayerScreen() {
    var isPlaying by remember { mutableStateOf(true) }
    var progress by remember { mutableFloatStateOf(0.42f) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0F0E17))
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Text("NOW PLAYING", color = Color(0xFFA7A9BE), fontSize = 12.sp, modifier = Modifier.padding(top = 16.dp))

        // Album Art Box
        Card(
            modifier = Modifier
                .size(280.dp)
                .padding(12.dp),
            shape = RoundedCornerShape(32.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFFFF8906))
        ) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("🎧 Midnight Echoes", color = Color.White, fontSize = 20.sp)
            }
        }

        // Track Details
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text("Starry Synthwave", color = Color.White, fontSize = 24.sp)
            Text("Neon Horizons", color = Color(0xFFA7A9BE), fontSize = 16.sp)
        }

        // Playback Controls
        Row(
            horizontalArrangement = Arrangement.spacedBy(24.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = {}) { Icon(Icons.Default.SkipPrevious, contentDescription = "Prev", tint = Color.White) }
            FloatingActionButton(
                onClick = { isPlaying = !isPlaying },
                shape = CircleShape,
                containerColor = Color(0xFFFF8906)
            ) {
                Icon(if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow, contentDescription = "Toggle")
            }
            IconButton(onClick = {}) { Icon(Icons.Default.SkipNext, contentDescription = "Next", tint = Color.White) }
        }
    }
}`,
    xmlManifest: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.harmonix">
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
</manifest>`,
    gradleCode: `plugins { alias(libs.plugins.android.application) }`,
    stringsXml: `<resources><string name="app_name">Harmonix</string></resources>`
  },
  {
    id: 'focuslist',
    name: 'FocusList',
    icon: 'CheckSquare',
    category: 'Productivity',
    color: '#3B82F6', // Blue
    description: 'Clean tasks and habits manager with category tags, swipe completion, and productivity stats.',
    kotlinCode: `package com.example.focuslist

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

data class TaskItem(val id: Int, val title: String, var isDone: Boolean, val category: String)

@Composable
fun FocusListScreen() {
    val tasks = remember {
        mutableStateListOf(
            TaskItem(1, "Review Android Jetpack Compose code", false, "Work"),
            TaskItem(2, "Complete 30-min morning workout", true, "Health"),
            TaskItem(3, "Read 10 pages of Clean Architecture", false, "Personal")
        )
    }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(onClick = {
                tasks.add(TaskItem(tasks.size + 1, "New Focus Task", false, "General"))
            }) { Text("+") }
        }
    ) { padding ->
        LazyColumn(modifier = Modifier.padding(padding).padding(16.dp)) {
            items(tasks) { task ->
                Card(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                    Row(
                        modifier = Modifier.padding(16.dp).fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(task.title)
                        Checkbox(
                            checked = task.isDone,
                            onCheckedChange = { checked ->
                                val index = tasks.indexOf(task)
                                if (index != -1) tasks[index] = task.copy(isDone = checked)
                            }
                        )
                    }
                }
            }
        }
    }
}`,
    xmlManifest: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.example.focuslist"></manifest>`,
    gradleCode: `plugins { alias(libs.plugins.android.application) }`,
    stringsXml: `<resources><string name="app_name">FocusList</string></resources>`
  },
  {
    id: 'auraweather',
    name: 'AuraWeather',
    icon: 'CloudSun',
    category: 'Weather & Forecast',
    color: '#06B6D4', // Cyan
    description: 'Hyper-local weather application featuring animated weather particle effects and 7-day hourly graphs.',
    kotlinCode: `package com.example.auraweather

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun WeatherScreen() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(Color(0xFF2980B9), Color(0xFF6DD5FA), Color(0xFFFFFFFF))
                )
            )
            .padding(24.dp)
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
            Spacer(modifier = Modifier.height(40.dp))
            Text("San Francisco", color = Color.White, fontSize = 28.sp)
            Text("72°", color = Color.White, fontSize = 72.sp)
            Text("Partly Cloudy • H: 76° L: 58°", color = Color.White.copy(alpha = 0.8f))
        }
    }
}`,
    xmlManifest: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.example.auraweather">
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
</manifest>`,
    gradleCode: `plugins { alias(libs.plugins.android.application) }`,
    stringsXml: `<resources><string name="app_name">AuraWeather</string></resources>`
  },
  {
    id: 'gemini_assistant',
    name: 'Gemini AI',
    icon: 'Bot',
    category: 'AI Assistant',
    color: '#F59E0B', // Amber
    description: 'Conversational assistant backed by Gemini Flash API with voice wave feedback and smart recommendations.',
    kotlinCode: `package com.example.geminiassistant

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun GeminiAssistantScreen() {
    var userPrompt by remember { mutableStateOf("") }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Gemini AI Companion", style = MaterialTheme.typography.titleLarge)
        Spacer(modifier = Modifier.weight(1f))
        Row(modifier = Modifier.fillMaxWidth()) {
            OutlinedTextField(
                value = userPrompt,
                onValueChange = { userPrompt = it },
                modifier = Modifier.weight(1f),
                placeholder = { Text("Ask Gemini anything...") }
            )
            Spacer(modifier = Modifier.width(8.dp))
            Button(onClick = { /* Send API Call */ }) { Text("Send") }
        }
    }
}`,
    xmlManifest: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.example.geminiassistant">
    <uses-permission android:name="android.permission.INTERNET" />
</manifest>`,
    gradleCode: `dependencies { implementation(libs.firebase.ai) }`,
    stringsXml: `<resources><string name="app_name">Gemini AI</string></resources>`
  },
  {
    id: 'bitedash',
    name: 'BiteDash',
    icon: 'Utensils',
    category: 'Food & Delivery',
    color: '#EF4444', // Red
    description: 'Instant food ordering experience with real-time driver delivery tracking map and cart checkout.',
    kotlinCode: `package com.example.bitedash

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun BiteDashScreen() {
    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("BiteDash Gourmet Express", style = MaterialTheme.typography.headlineMedium)
        Card(modifier = Modifier.fillMaxWidth().padding(top = 16.dp)) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Artisanal Truffle Burger", style = MaterialTheme.typography.titleLarge)
                Text("$14.99 • 15-20 min delivery", color = MaterialTheme.colorScheme.secondary)
                Button(onClick = {}, modifier = Modifier.padding(top = 12.dp)) {
                    Text("Add to Cart")
                }
            }
        }
    }
}`,
    xmlManifest: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.example.bitedash"></manifest>`,
    gradleCode: `plugins { alias(libs.plugins.android.application) }`,
    stringsXml: `<resources><string name="app_name">BiteDash</string></resources>`
  }
];
