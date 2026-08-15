package com.careerpilot.ai.navigation

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.careerpilot.ai.screens.*
import com.careerpilot.ai.theme.*
import com.careerpilot.ai.viewmodel.CareerViewModel

sealed class Screen(
    val route: String,
    val title: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector
) {
    data object Home : Screen("home", "Home", Icons.Filled.Dashboard, Icons.Outlined.Dashboard)
    data object Analyzer : Screen("analyzer", "Analyzer", Icons.Filled.Search, Icons.Outlined.Search)
    data object Resume : Screen("resume", "Resume", Icons.Filled.Description, Icons.Outlined.Description)
    data object Roadmap : Screen("roadmap", "Roadmap", Icons.Filled.Timeline, Icons.Outlined.Timeline)
    data object Practice : Screen("practice", "Practice", Icons.Filled.RecordVoiceOver, Icons.Outlined.RecordVoiceOver)
    data object Profile : Screen("profile", "Profile", Icons.Filled.Person, Icons.Outlined.Person)
}

val bottomNavItems = listOf(
    Screen.Home,
    Screen.Analyzer,
    Screen.Resume,
    Screen.Roadmap,
    Screen.Practice,
    Screen.Profile
)

@Composable
fun CareerPilotApp(
    viewModel: CareerViewModel = androidx.lifecycle.viewmodel.compose.viewModel()
) {
    val navController = rememberNavController()

    Scaffold(
        containerColor = DarkBackground,
        bottomBar = {
            CareerBottomNavigation(navController = navController)
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Home.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.Home.route) {
                HomeScreen(
                    viewModel = viewModel,
                    onNavigateToRoadmap = { navController.navigate(Screen.Roadmap.route) },
                    onNavigateToAnalyzer = { navController.navigate(Screen.Analyzer.route) }
                )
            }
            composable(Screen.Analyzer.route) {
                CareerAnalyzerScreen(viewModel = viewModel)
            }
            composable(Screen.Resume.route) {
                ResumeAnalyzerScreen(viewModel = viewModel)
            }
            composable(Screen.Roadmap.route) {
                RoadmapScreen(viewModel = viewModel)
            }
            composable(Screen.Practice.route) {
                PracticeScreen(viewModel = viewModel)
            }
            composable(Screen.Profile.route) {
                ProfileScreen(viewModel = viewModel)
            }
        }
    }
}

@Composable
fun CareerBottomNavigation(
    navController: NavHostController
) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    NavigationBar(
        containerColor = DarkSurface,
        tonalElevation = 8.dp,
        modifier = Modifier
            .fillMaxWidth()
            .windowInsetsPadding(WindowInsets.navigationBars)
    ) {
        bottomNavItems.forEach { screen ->
            val selected = currentRoute == screen.route
            NavigationBarItem(
                selected = selected,
                onClick = {
                    if (currentRoute != screen.route) {
                        navController.navigate(screen.route) {
                            popUpTo(Screen.Home.route) {
                                saveState = true
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                },
                icon = {
                    Icon(
                        imageVector = if (selected) screen.selectedIcon else screen.unselectedIcon,
                        contentDescription = screen.title,
                        modifier = Modifier.size(22.dp)
                    )
                },
                label = {
                    Text(
                        text = screen.title,
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal,
                            fontSize = 10.sp
                        )
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = TextPrimary,
                    selectedTextColor = TextPrimary,
                    indicatorColor = PrimaryIndigo,
                    unselectedIconColor = TextMuted,
                    unselectedTextColor = TextMuted
                )
            )
        }
    }
}
