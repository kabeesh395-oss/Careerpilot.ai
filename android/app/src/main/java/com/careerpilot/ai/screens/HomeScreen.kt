package com.careerpilot.ai.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.careerpilot.ai.components.*
import com.careerpilot.ai.theme.*
import com.careerpilot.ai.viewmodel.CareerViewModel

@Composable
fun HomeScreen(
    viewModel: CareerViewModel,
    onNavigateToRoadmap: () -> Unit,
    onNavigateToAnalyzer: () -> Unit,
    onNavigateToProfile: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val profile by viewModel.userProfile.collectAsState()
    val score by viewModel.careerEnergyScore.collectAsState()
    val tier by viewModel.careerEnergyTier.collectAsState()
    val pillars by viewModel.pillars.collectAsState()
    val missions by viewModel.dailyMissions.collectAsState()

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(DarkBackground),
        contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 16.dp, bottom = 96.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        // If profile is empty (fresh new user)
        if (profile.name.isEmpty()) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(20.dp))
                        .background(
                            Brush.verticalGradient(
                                listOf(DarkSurfaceElevated, DarkSurface)
                            )
                        )
                        .border(1.dp, PrimaryIndigo.copy(alpha = 0.3f), RoundedCornerShape(20.dp))
                        .padding(24.dp)
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Box(
                            modifier = Modifier
                                .size(56.dp)
                                .clip(CircleShape)
                                .background(PrimaryIndigo.copy(alpha = 0.2f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.RocketLaunch,
                                contentDescription = null,
                                tint = PrimaryIndigo,
                                modifier = Modifier.size(28.dp)
                            )
                        }
                        
                        Spacer(modifier = Modifier.height(16.dp))

                        Text(
                            text = "Welcome to CareerPilot AI",
                            style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Black),
                            color = TextPrimary,
                            fontSize = 20.sp
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = "Your dashboard is currently empty. Set up your profile or analyze a job description to generate your personalized AI career roadmap and readiness score.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = TextSecondary,
                            fontSize = 13.sp,
                            lineHeight = 18.sp,
                            modifier = Modifier.padding(horizontal = 8.dp),
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center
                        )

                        Spacer(modifier = Modifier.height(20.dp))

                        Row(
                            horizontalArrangement = Arrangement.spacedBy(12.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Button(
                                onClick = onNavigateToProfile,
                                colors = ButtonDefaults.buttonColors(containerColor = PrimaryIndigo),
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(Icons.Default.Person, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Set Up Profile", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                            }

                            OutlinedButton(
                                onClick = onNavigateToAnalyzer,
                                shape = RoundedCornerShape(12.dp),
                                border = androidx.compose.foundation.BorderStroke(1.dp, BorderLight),
                                colors = ButtonDefaults.outlinedButtonColors(contentColor = TextPrimary),
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(Icons.Default.Search, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Analyze JD", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        } else {
            // Top Greeting Header for existing configured user
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "Hello, ${profile.name.split(" ").firstOrNull() ?: "Pilot"} 👋",
                            style = MaterialTheme.typography.headlineLarge.copy(
                                fontWeight = FontWeight.Black
                            ),
                            color = TextPrimary
                        )
                        if (profile.targetCompany.isNotEmpty()) {
                            Text(
                                text = "Target: ${profile.targetCompany}",
                                style = MaterialTheme.typography.bodyMedium,
                                color = TextSecondary
                            )
                        } else if (profile.targetRole.isNotEmpty()) {
                            Text(
                                text = "Target: ${profile.targetRole}",
                                style = MaterialTheme.typography.bodyMedium,
                                color = TextSecondary
                            )
                        }
                    }

                    // Streak & XP Badges
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(12.dp))
                                .background(EnergyGoldHighMatch.copy(alpha = 0.15f))
                                .border(1.dp, EnergyGoldHighMatch.copy(alpha = 0.4f), RoundedCornerShape(12.dp))
                                .padding(horizontal = 10.dp, vertical = 6.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("🔥", fontSize = 14.sp)
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "${profile.streak}d",
                                    style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold),
                                    color = EnergyGoldHighMatch
                                )
                            }
                        }

                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(12.dp))
                                .background(PrimaryIndigo.copy(alpha = 0.15f))
                                .border(1.dp, PrimaryIndigo.copy(alpha = 0.4f), RoundedCornerShape(12.dp))
                                .padding(horizontal = 10.dp, vertical = 6.dp)
                        ) {
                            Text(
                                text = "Lv. ${profile.level}",
                                style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold),
                                color = PrimaryIndigo
                            )
                        }
                    }
                }
            }
        }

        // Career Energy ⚡ Gauge
        item {
            CareerEnergyGauge(
                score = score,
                tier = tier,
                targetRole = profile.targetRole
            )
        }

        // 4-Pillar Readiness Breakdown
        item {
            SectionHeader(
                title = "4-Pillar Readiness Breakdown",
                subtitle = "Weighted for ${profile.targetRole}",
                icon = Icons.Default.BarChart
            )
            Spacer(modifier = Modifier.height(10.dp))
            PillarReadinessGrid(
                skills = pillars.skills,
                projects = pillars.projects,
                resume = pillars.resume,
                interview = pillars.interview
            )
        }

        // Biggest Skill Gap
        item {
            BiggestSkillGapCard(
                gapTitle = "Docker & Vector DB Embeddings",
                impactText = "+12% role alignment boost upon containerizing and deploying microservices.",
                onActionClick = onNavigateToRoadmap
            )
        }

        // Today's Missions
        item {
            SectionHeader(
                title = "Today's Missions",
                subtitle = "Complete daily micro-actions to earn XP & boost readiness",
                icon = Icons.Default.CheckCircle
            )
        }

        items(missions, key = { it.id }) { mission ->
            MissionCard(
                mission = mission,
                onToggle = { viewModel.toggleMission(mission.id) }
            )
        }

        // Quick Roadmap Summary
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(18.dp))
                    .background(
                        Brush.horizontalGradient(
                            listOf(DarkSurface, DarkSurfaceElevated)
                        )
                    )
                    .border(1.dp, BorderLight, RoundedCornerShape(18.dp))
                    .padding(16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Career Roadmap Progress",
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold
                            ),
                            color = TextPrimary
                        )
                        Text(
                            text = "Stage 2 of 4 Active • Deep Learning & PyTorch",
                            style = MaterialTheme.typography.bodyMedium,
                            color = TextSecondary
                        )
                    }

                    Button(
                        onClick = onNavigateToRoadmap,
                        colors = ButtonDefaults.buttonColors(containerColor = PrimaryIndigo),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text("View")
                    }
                }
            }
        }
    }
}
