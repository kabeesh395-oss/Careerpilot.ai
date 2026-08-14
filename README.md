# 🧭 CareerPilot AI — Neural Career Intelligence Platform

CareerPilot AI is an enterprise-grade, serverless AI career guidance platform designed to help students and software engineers bridge the gap between their current skill stack and their target job roles. Powered directly by Google Gemini 1.5 Flash via native REST APIs, the platform operates completely client-side without requiring Python servers or `streamlit run`.

![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Android APK](https://img.shields.io/badge/Android_APK-3DDC84?style=for-the-badge&logo=android&logoColor=white)
![Codemagic](https://img.shields.io/badge/Codemagic-F4511E?style=for-the-badge&logo=codemagic&logoColor=white)

---

## 🚀 Key Features

1. **🧬 Skill DNA & Gap Heatmap**: Real-time evaluation of matched capabilities vs. critical missing skills for target roles.
2. **📡 Recruiter Radar**: Market discovery estimation (High / Med / Low) with actionable optimization directives.
3. **⚡ Daily AI Missions**: Gamified daily checklist of high-leverage technical and algorithmic tasks.
4. **✨ AI Resume Bullet Rewriter**: Transforms weak bullets into high-impact, metrics-driven, ATS-compliant bullet points.
5. **🎤 Target Interview Simulator**: Dynamic generation of company- and role-specific technical and behavioral questions.
6. **📱 Standalone Mobile App**: Full mobile support with a dedicated React Native WebView wrapper and Codemagic CI/CD build pipeline.

---

## 🛠️ Serverless Architecture

The application runs 100% client-side with zero Python server requirements:

```
┌─────────────────────────────────────────────────────────────┐
│                 CareerPilot AI Client UI                    │
│        (GitHub Pages Web App / Android Native APK)          │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌──────────────────────────────┐    ┌──────────────────────────────┐
│     Client-Side Engine       │    │     Google AI Studio         │
│  - Zero Python Server Needed │    │  - Gemini 1.5 Flash REST API │
│  - No `streamlit run`        │    │  - Structured JSON Schemas   │
│  - Local Data Storage        │    │  - Direct Client Ingestion   │
│  - PWA / Mobile Optimized    │    │  - Dynamic Neural Analysis   │
└──────────────────────────────┘    └──────────────────────────────┘
```

---

## ⚙️ Quick Start (No Server / No Terminal Required)

### 1. Run Locally
Simply open `index.html` in any web browser (Chrome, Edge, Safari, Firefox). No installation or terminal commands needed.

### 2. Deploy to GitHub Pages (Free)
1. Push `index.html` to your GitHub repository.
2. Go to repository **Settings** ➡️ **Pages**.
3. Under **Build and deployment**, select `main` branch and click **Save**.
4. Access your live web app URL (e.g., `https://yourusername.github.io/Careerpilot.ai/`).

---

## 📱 Compiling Standalone Android APK (via Codemagic CI/CD)

The included `codemagic.yaml` compiles the application into an Android `.apk` installer without local Android SDK setup:

1. Connect your repository to [Codemagic](https://codemagic.io/).
2. Select the `android-expo-app` workflow.
3. Click **Start new build**.
4. Download the compiled `app-release.apk` directly to your Android device from the **Artifacts** tab.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
