package com.careerpilot.ai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.careerpilot.ai.navigation.CareerPilotApp
import com.careerpilot.ai.theme.CareerPilotTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
        setContent {
            CareerPilotTheme {
                CareerPilotApp()
            }
        }
    }
}
