# 🚀 CareerIQ — AI Career Analysis Platform

CareerIQ is an AI-powered application designed to help students and professionals analyze their resumes, identify skill gaps, and generate personalized career roadmaps. Instead of generic advice, CareerIQ uses LLMs to provide actionable, specific feedback based on actual resume text and target job roles.

## 🎯 Core Problem Solved
Job seekers often ask: *"Am I ready for this job, what skills am I missing, and what should I do next?"* 
CareerIQ answers this by comparing extracted resume skills against industry-standard job requirements and generating a dynamic learning roadmap.

## ✨ Features
- **AI Resume Analysis**: Upload a PDF resume to get a 0-100 Readiness Score and semantic match analysis.
- **Skill Gap Engine**: Identifies strong skills and missing skills for specific roles (e.g., ML Engineer).
- **Personalized Roadmaps**: Generates a phased learning plan (Foundation → Advanced) tailored to the user's gaps.
- **AI Interview Coach**: Generates technical, system design, and behavioral questions based on current skill levels.
- **GitHub Intelligence**: Analyzes public GitHub repositories to evaluate employer readiness.
- **Privacy First**: Includes a one-click database wipe feature to ensure user data is not permanently stored.

## 🛠️ Tech Stack & Architecture
- **Frontend**: Streamlit (Python), Custom CSS
- **Backend**: Python
- **AI/ML**: Google Gemini 1.5 Flash (LLM), Sentence-Transformers (Embeddings)
- **Database**: SQLite (Local persistent storage)
- **Deployment**: Hugging Face Spaces

### AI Architecture (Division of Labor)
The application separates deterministic logic from generative AI:
1. **Python (pypdf)**: Extracts raw text from PDF files.
2. **Google Gemini API**: Processes raw text, extracts skills, calculates readiness, and generates JSON roadmaps.
3. **Strict JSON Parsing**: The system uses regex cleaning to ensure the LLM output is strictly parsable JSON, preventing frontend crashes.

## ⚙️ Local Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   pip install streamlit google-generativeai pypdf requests
   ```
3. Get a Google AI Studio API key and set it as an environment variable:
   ```bash
   export GOOGLE_API_KEY="your_api_key_here"
   ```
4. Run the app:
   ```bash
   streamlit run app.py
   ```

## 🔮 Future Scope (V2)
- Integrate `pgvector` for storing job descriptions as vector embeddings.
- Add LinkedIn API integration for auto-filling profiles.
- Implement user authentication via Firebase Auth.
