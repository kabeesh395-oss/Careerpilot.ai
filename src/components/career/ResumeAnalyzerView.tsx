import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  FileText, Upload, CheckCircle2, AlertCircle, Sparkles,
  RefreshCw, Trash2, Copy, Check, Eye, EyeOff, FileCode,
  ArrowRight, ShieldCheck, HelpCircle, Layers, CheckSquare,
  TrendingUp, Download, AlertTriangle, CornerDownRight, X
} from 'lucide-react';
import { DetailedResumeAnalysis, UploadedResumeFile, UserProfile } from './careerTypes';
import { ResumeParserService } from '../../services/resumeParserService';
import { AnalyticsService } from '../../services/analyticsService';
import { AIService } from '../../services/aiService';

interface ResumeAnalyzerViewProps {
  profile: UserProfile;
  isDarkMode: boolean;
  onUpdatePillarScore: (score: number) => void;
  onUpdateProfileSkills?: (newSkills: string[]) => void;
  onAddSkillToPlan?: (skill: string) => void;
  currentUserId: string;
}

export const ResumeAnalyzerView: React.FC<ResumeAnalyzerViewProps> = ({
  profile,
  isDarkMode,
  onUpdatePillarScore,
  onUpdateProfileSkills,
  onAddSkillToPlan,
  currentUserId
}) => {
  // Local state for uploaded file & analysis scoped by currentUserId
  const [uploadedFile, setUploadedFile] = useState<UploadedResumeFile | null>(() => {
    if (!currentUserId) return null;
    const saved = localStorage.getItem(`careerpilot_${currentUserId}_resume_file`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [analysis, setAnalysis] = useState<DetailedResumeAnalysis | null>(() => {
    if (!currentUserId) return null;
    const saved = localStorage.getItem(`careerpilot_${currentUserId}_resume_analysis`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [pastedText, setPastedText] = useState<string>(() => uploadedFile?.extractedText || '');
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStage, setProgressStage] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showExtractedPreview, setShowExtractedPreview] = useState(false);
  const [copiedBulletIdx, setCopiedBulletIdx] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync to localStorage whenever uploadedFile or analysis changes
  useEffect(() => {
    if (!currentUserId) return;
    if (uploadedFile) {
      localStorage.setItem(`careerpilot_${currentUserId}_resume_file`, JSON.stringify(uploadedFile));
    } else {
      localStorage.removeItem(`careerpilot_${currentUserId}_resume_file`);
    }
  }, [uploadedFile, currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;
    if (analysis) {
      localStorage.setItem(`careerpilot_${currentUserId}_resume_analysis`, JSON.stringify(analysis));
    } else {
      localStorage.removeItem(`careerpilot_${currentUserId}_resume_analysis`);
    }
  }, [analysis, currentUserId]);

  // Sync state if user account changes
  useEffect(() => {
    if (!currentUserId) {
      setUploadedFile(null);
      setAnalysis(null);
      setPastedText('');
      return;
    }
    const savedFile = localStorage.getItem(`careerpilot_${currentUserId}_resume_file`);
    const savedAnalysis = localStorage.getItem(`careerpilot_${currentUserId}_resume_analysis`);
    if (savedFile) {
      try {
        const parsedFile = JSON.parse(savedFile);
        setUploadedFile(parsedFile);
        setPastedText(parsedFile.extractedText || '');
      } catch {
        setUploadedFile(null);
      }
    } else {
      setUploadedFile(null);
      setPastedText('');
    }

    if (savedAnalysis) {
      try {
        setAnalysis(JSON.parse(savedAnalysis));
      } catch {
        setAnalysis(null);
      }
    } else {
      setAnalysis(null);
    }
  }, [currentUserId]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Handle File Selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processSelectedFile(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processSelectedFile(file);
    }
  };

  const processSelectedFile = async (file: File) => {
    setErrorMessage(null);
    setIsProcessing(true);
    setProgressPercent(10);
    setProgressStage('Validating document format...');

    try {
      const extracted = await ResumeParserService.extractTextFromFile(file, (stage, percent) => {
        setProgressStage(stage);
        setProgressPercent(percent);
      });

      setUploadedFile(extracted);
      setPastedText(extracted.extractedText);
      AnalyticsService.track('resume_uploaded', { fileName: file.name, fileSize: file.size });

      // Automatically trigger analysis
      await executeAnalysis(extracted.extractedText, extracted.fileName);
    } catch (err: any) {
      console.error('File parsing failed:', err);
      setErrorMessage(err?.message || 'Failed to extract text from the uploaded document. Please check the file format or paste your text directly.');
      setIsProcessing(false);
      setProgressStage('');
    }
  };

  // Run ATS Analysis on extracted or pasted text
  const executeAnalysis = async (textToAnalyze: string, documentName?: string) => {
    if (!textToAnalyze.trim()) {
      setErrorMessage('Resume text is empty. Please upload a file or paste your resume text.');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    setProgressStage('Running ATS Keyword & Impact Analysis...');
    setProgressPercent(75);

    try {
      const targetRole = profile.targetRole || 'Software Engineer';
      const result = await ResumeParserService.analyzeResumeText(
        textToAnalyze,
        targetRole,
        profile.currentSkills
      );

      setAnalysis(result);
      onUpdatePillarScore(result.overallScore);

      // Award XP and bump skills
      if (result.matchedKeywords && result.matchedKeywords.length > 0 && onUpdateProfileSkills) {
        onUpdateProfileSkills(result.matchedKeywords);
      }

      AnalyticsService.track('resume_analyzed', {
        targetRole,
        score: result.overallScore,
        fileName: documentName || uploadedFile?.fileName || 'Pasted_Text'
      });

      setProgressStage('Analysis Complete!');
      setProgressPercent(100);
    } catch (err: any) {
      console.error('Resume analysis failed:', err);
      setErrorMessage('Failed to complete ATS analysis. Click Retry to try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear Resume Data
  const handleClearResume = () => {
    if (confirm('Are you sure you want to remove this resume and clear the analysis?')) {
      setUploadedFile(null);
      setAnalysis(null);
      setPastedText('');
      setErrorMessage(null);
      if (currentUserId) {
        localStorage.removeItem(`careerpilot_${currentUserId}_resume_file`);
        localStorage.removeItem(`careerpilot_${currentUserId}_resume_analysis`);
      }
      onUpdatePillarScore(0);
    }
  };

  // Load Starter Fresher Template
  const handleLoadStarterTemplate = () => {
    const starterText = `ALEXANDER CHEN
alex.chen@university.edu | (555) 234-5678 | github.com/alexchen-dev | linkedin.com/in/alexchen-tech

EDUCATION
Bachelor of Science in Computer Science | Tech University (GPA: 3.8/4.0) | Expected May 2026
Relevant Coursework: Data Structures & Algorithms, Database Systems, Computer Networks, Operating Systems, Web Architecture

TECHNICAL SKILLS
Languages: Python, JavaScript, TypeScript, SQL, HTML5, CSS3, C++
Frameworks & Libraries: React, Node.js, Express, FastAPI, Tailwind CSS, PyTorch
Developer Tools: Git, GitHub, Docker, Postman, Linux, VS Code, Jest

TECHNICAL PROJECTS
Distributed Task Queue & Background Worker
• Architected an asynchronous background job processing engine using Python, Redis, and FastAPI, handling 1,200 concurrent tasks with sub-20ms queue latency.
• Implemented worker concurrency pool and exponential backoff retry mechanisms, reducing task drop rates from 8.2% to 0.1%.
• Automated containerized multi-stage builds using Docker and GitHub Actions CI/CD for zero-downtime deployment testing.

Full-Stack Real-Time Collaboration Canvas
• Engineered a responsive collaborative whiteboard application using React, TypeScript, and WebSocket, supporting up to 50 simultaneous drawing streams.
• Optimized state synchronization using differential CRDT algorithms, cutting memory overhead by 42% on high-density vector paths.
• Designed relational PostgreSQL schemas with indexed query paths, achieving P95 read latency under 15ms across 100,000 recorded nodes.

WORK & LEADERSHIP EXPERIENCE
Computer Science Peer Tutor | University Academic Center (Sep 2024 - Present)
• Mentored 45+ undergraduate students in Object-Oriented Programming, Data Structures, and recursion fundamentals.
• Conducted weekly code review workshops emphasizing clean code, modular design patterns, and unit test coverage.`;

    setPastedText(starterText);
    setInputMode('paste');
    setUploadedFile({
      fileName: 'Fresher_Starter_Template.txt',
      fileSize: starterText.length,
      fileType: 'text/plain',
      uploadedAt: new Date().toISOString(),
      extractedText: starterText,
      wordCount: starterText.split(/\s+/).length,
      characterCount: starterText.length
    });
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedBulletIdx(index);
    setTimeout(() => setCopiedBulletIdx(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
    if (score >= 70) return 'text-blue-400 border-blue-500/40 bg-blue-950/40';
    if (score >= 50) return 'text-amber-400 border-amber-500/40 bg-amber-950/40';
    return 'text-rose-400 border-rose-500/40 bg-rose-950/40';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Top Tier (ATS Ready)';
    if (score >= 70) return 'Competitive Match';
    if (score >= 50) return 'Average (Needs Prep)';
    return 'Needs Optimization';
  };

  return (
    <div className={`p-4 sm:p-5 rounded-3xl border space-y-4 font-sans shadow-xl ${
      isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight">ATS Resume Intelligence Engine</h3>
              {analysis?.source === 'ai_gemini' && (
                <span className="text-[9px] bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-300" /> Gemini Powered
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Evaluates keyword density, Google XYZ impact formula, and parseability for <strong className="text-indigo-300">{profile.targetRole || 'Software Engineer'}</strong>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {uploadedFile && (
            <button
              onClick={handleClearResume}
              className="px-2.5 py-1 rounded-xl text-[10px] font-bold text-rose-400 hover:bg-rose-950/40 border border-rose-500/30 flex items-center gap-1 transition"
              title="Remove resume and clear data"
            >
              <Trash2 className="w-3 h-3" />
              <span>Remove</span>
            </button>
          )}

          <div className={`flex p-0.5 rounded-xl border text-[11px] font-bold ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
            <button
              onClick={() => setInputMode('upload')}
              className={`px-3 py-1 rounded-lg transition ${
                inputMode === 'upload' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Upload Doc
            </button>
            <button
              onClick={() => setInputMode('paste')}
              className={`px-3 py-1 rounded-lg transition ${
                inputMode === 'paste' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Text Editor
            </button>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.doc,.txt,.rtf,.md"
        className="hidden"
      />

      {/* UPLOAD MODE */}
      {inputMode === 'upload' && (
        <div className="space-y-3">
          {/* Active Uploaded Document Badge (If already uploaded) */}
          {uploadedFile ? (
            <div className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isDarkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-100">{uploadedFile.fileName}</h4>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
                      Parsed ({formatFileSize(uploadedFile.fileSize)})
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {uploadedFile.wordCount} words • {uploadedFile.characterCount} chars • Uploaded {new Date(uploadedFile.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowExtractedPreview(!showExtractedPreview)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 hover:text-white text-[10px] font-bold flex items-center gap-1 transition"
                >
                  {showExtractedPreview ? <EyeOff className="w-3 h-3 text-indigo-400" /> : <Eye className="w-3 h-3 text-indigo-400" />}
                  <span>{showExtractedPreview ? 'Hide Text' : 'View Text'}</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm transition"
                >
                  <Upload className="w-3 h-3" />
                  <span>Replace File</span>
                </button>
              </div>
            </div>
          ) : (
            /* Drag & Drop Zone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 sm:p-8 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-950/30 scale-[1.01]'
                  : isDarkMode
                    ? 'border-slate-800 hover:border-indigo-500/60 bg-slate-950/40 hover:bg-slate-950/80'
                    : 'border-slate-300 hover:border-indigo-500/60 bg-slate-50 hover:bg-slate-100/80'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3 shadow-inner">
                <Upload className="w-6 h-6 animate-bounce" />
              </div>
              <h4 className="text-xs font-bold text-slate-200">
                Drag and drop your resume file, or <span className="text-indigo-400 underline">browse</span>
              </h4>
              <p className="text-[10px] text-slate-400 mt-1">
                Supports PDF (.pdf), Word (.docx), RTF, or plain text (.txt) • Max 10MB
              </p>
              
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadStarterTemplate();
                  }}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
                >
                  + Or insert starter fresher template
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PASTE / TEXT EDITOR MODE */}
      {inputMode === 'paste' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-slate-400">
              Resume Content Editor:
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadStarterTemplate}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold underline"
              >
                + Insert Fresher Template
              </button>
              {pastedText && (
                <button
                  type="button"
                  onClick={() => setPastedText('')}
                  className="text-[10px] text-slate-400 hover:text-rose-400"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <textarea
            rows={7}
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste your full resume text here to analyze ATS keyword match, bullet point impact, and formatting..."
            className={`w-full rounded-2xl p-3 text-xs font-mono leading-relaxed outline-none border transition ${
              isDarkMode
                ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-indigo-500'
                : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
            }`}
          />
        </div>
      )}

      {/* Extracted Text Collapsible Preview */}
      {showExtractedPreview && uploadedFile && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`p-3.5 rounded-2xl border space-y-1.5 ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
            <span>EXTRACTED TEXT STREAM ({uploadedFile.wordCount} words)</span>
            <span className="font-mono text-indigo-400">100% Parsed Readable</span>
          </div>
          <pre className="text-[10px] font-mono text-slate-300 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/60">
            {uploadedFile.extractedText}
          </pre>
        </motion.div>
      )}

      {/* Progress & Loading State */}
      {isProcessing && (
        <div className={`p-4 rounded-2xl border space-y-2.5 ${
          isDarkMode ? 'bg-indigo-950/30 border-indigo-500/40' : 'bg-indigo-50 border-indigo-200'
        }`}>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-indigo-300 font-bold">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
              <span>{progressStage || 'Analyzing Resume...'}</span>
            </div>
            <span className="font-mono text-xs font-bold text-indigo-400">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-indigo-500/30">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>
      )}

      {/* Error Banner with Retry */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">{errorMessage}</p>
          </div>
          <button
            onClick={() => executeAnalysis(pastedText || uploadedFile?.extractedText || '')}
            className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] shrink-0 transition"
          >
            Retry Analysis
          </button>
        </div>
      )}

      {/* Trigger Analysis Button (If text is present and not currently processing) */}
      {!isProcessing && (pastedText || uploadedFile) && (
        <button
          onClick={() => executeAnalysis(pastedText || uploadedFile?.extractedText || '')}
          disabled={isProcessing || (!pastedText.trim() && !uploadedFile?.extractedText)}
          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition active:scale-[0.98] disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{analysis ? 'Re-Run ATS Intelligence Analysis' : 'Run Live ATS Intelligence Analysis'}</span>
        </button>
      )}

      {/* ==================================================== */}
      {/* DETAILED ATS ANALYSIS RESULTS DISPLAY */}
      {/* ==================================================== */}
      {analysis && !isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 pt-2 border-t border-slate-800/80"
        >
          {/* Top Score Dashboard Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-purple-950/50 border border-indigo-500/40 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ATS READINESS SCORECARD
                </span>
                <h3 className="text-base font-black text-white mt-0.5">
                  {analysis.analyzedRole} Alignment
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Calculated against benchmark tech screening algorithms
                </p>
              </div>

              <div className="flex items-center gap-3 bg-slate-950/70 p-3 rounded-2xl border border-indigo-500/30 shrink-0">
                <div className="text-center">
                  <span className={`text-3xl font-black font-mono block ${getScoreColor(analysis.overallScore).split(' ')[0]}`}>
                    {analysis.overallScore}
                  </span>
                  <span className="text-[9px] text-slate-400 uppercase font-mono">Out of 100</span>
                </div>
                <div className="border-l border-slate-800 pl-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getScoreColor(analysis.overallScore)}`}>
                    {getScoreLabel(analysis.overallScore)}
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-1">
                    {analysis.source === 'ai_gemini' ? 'AI Deep Scan' : 'Rule Engine Scan'}
                  </span>
                </div>
              </div>
            </div>

            {/* 4-Pillar Subscores Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-indigo-500/20 text-xs">
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[9px] text-slate-400 block font-bold">Keyword Match</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-sm font-mono font-black text-indigo-300">{analysis.keywordMatchScore}%</span>
                  <span className="text-[9px] text-slate-400">35% wt</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${analysis.keywordMatchScore}%` }} />
                </div>
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[9px] text-slate-400 block font-bold">Quantified Impact</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-sm font-mono font-black text-purple-300">{analysis.impactScore}%</span>
                  <span className="text-[9px] text-slate-400">30% wt</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${analysis.impactScore}%` }} />
                </div>
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[9px] text-slate-400 block font-bold">Section Structure</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-sm font-mono font-black text-emerald-300">{analysis.sectionCompletenessScore}%</span>
                  <span className="text-[9px] text-slate-400">20% wt</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${analysis.sectionCompletenessScore}%` }} />
                </div>
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[9px] text-slate-400 block font-bold">Parseability</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-sm font-mono font-black text-cyan-300">{analysis.formattingScore}%</span>
                  <span className="text-[9px] text-slate-400">15% wt</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${analysis.formattingScore}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Keywords Breakdown (Matched vs Missing) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Matched Keywords */}
            <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Detected Industry Skills ({analysis.matchedKeywords?.length || 0})
                </span>
                <span className="text-[9px] font-mono text-emerald-400/80">Verified Present</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {analysis.matchedKeywords && analysis.matchedKeywords.length > 0 ? (
                  analysis.matchedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-lg font-mono flex items-center gap-1"
                    >
                      ✓ {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-slate-400 italic">No standard technical keywords recognized in text</span>
                )}
              </div>
            </div>

            {/* Missing Keywords with 1-Click Add */}
            <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-rose-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Missing Target Keywords ({analysis.missingKeywords?.length || 0})
                </span>
                <span className="text-[9px] font-mono text-rose-400/80">Recommended for ATS</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {analysis.missingKeywords && analysis.missingKeywords.length > 0 ? (
                  analysis.missingKeywords.map((kw, i) => (
                    <button
                      key={i}
                      onClick={() => onAddSkillToPlan?.(kw)}
                      className="text-[10px] bg-rose-950/70 hover:bg-rose-900/90 text-rose-300 border border-rose-500/30 hover:border-rose-400 px-2 py-0.5 rounded-lg font-mono flex items-center gap-1 transition cursor-pointer group"
                      title="Click to add to your personalized study plan"
                    >
                      <span>+ {kw}</span>
                      <span className="text-[8px] opacity-0 group-hover:opacity-100 text-rose-200">Add</span>
                    </button>
                  ))
                ) : (
                  <span className="text-[11px] text-emerald-400">All primary benchmark keywords covered!</span>
                )}
              </div>
            </div>
          </div>

          {/* Google XYZ Bullet Point Refactor Engine */}
          {analysis.bulletPointAnalysis && analysis.bulletPointAnalysis.length > 0 && (
            <div className="p-4 rounded-3xl bg-slate-950/80 border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-xs font-bold text-slate-100">
                    Google XYZ Formula Bullet Refactoring
                  </h4>
                </div>
                <span className="text-[9px] text-indigo-300 font-mono">Accomplished [X] by [Y] doing [Z]</span>
              </div>

              <div className="space-y-3">
                {analysis.bulletPointAnalysis.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Original Candidate Bullet:</span>
                      <p className="text-[11px] text-slate-300 font-mono bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                        "{item.original}"
                      </p>
                    </div>

                    <div className="text-[10px] text-amber-400 flex items-center gap-1.5">
                      <HelpCircle className="w-3 h-3 shrink-0" />
                      <span>{item.feedback}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-950 border border-emerald-500/40 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">ATS High-Impact Rewrite:</span>
                        <button
                          onClick={() => copyToClipboard(item.improved, idx)}
                          className="px-2 py-0.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold flex items-center gap-1 transition"
                        >
                          {copiedBulletIdx === idx ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedBulletIdx === idx ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-emerald-200 font-mono leading-relaxed">
                        • {item.improved}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section Completeness Checklist */}
          {analysis.sectionBreakdown && analysis.sectionBreakdown.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-indigo-400" /> ATS Structural Section Verification
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {analysis.sectionBreakdown.map((sec, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border flex items-start gap-2 ${
                      sec.status === 'present'
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                        : sec.status === 'warning'
                          ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                          : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                    }`}
                  >
                    {sec.status === 'present' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="text-[11px] font-bold block">{sec.name}</span>
                      <p className="text-[9px] text-slate-300 mt-0.5 leading-relaxed">{sec.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Suggestions */}
          {analysis.actionableSuggestions && analysis.actionableSuggestions.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Priority Steps to Reach 90+ Score
              </h4>
              <div className="space-y-1.5 pt-1">
                {analysis.actionableSuggestions.map((sug, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] text-slate-300">
                    <span className="text-indigo-400 font-bold font-mono shrink-0">{i + 1}.</span>
                    <p className="leading-relaxed">{sug}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
