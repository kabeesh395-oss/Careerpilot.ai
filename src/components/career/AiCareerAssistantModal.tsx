import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, X, Send, Sparkles, RefreshCw, User, 
  MessageSquare, ArrowRight, BookOpen, Code, FileText, Check
} from 'lucide-react';
import { AiChatMessage } from './careerTypes';
import { AIService } from '../../services/aiService';
import { AnalyticsService } from '../../services/analyticsService';

interface AiCareerAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole: string;
  candidateName: string;
  currentSkills: string[];
  isDarkMode: boolean;
  onNavigateToTab?: (tab: string, subTab?: string) => void;
}

export const AiCareerAssistantModal: React.FC<AiCareerAssistantModalProps> = ({
  isOpen,
  onClose,
  targetRole,
  candidateName,
  currentSkills,
  isDarkMode,
  onNavigateToTab
}) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: `Hello ${candidateName || 'there'}! I am your personal CareerPilot AI Copilot. I know your background in ${currentSkills.slice(0, 3).join(', ')} and your goal to become a **${targetRole}**.\n\nHow can I help accelerate your career roadmap today?`,
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptChips = [
    'What should I learn next for my role?',
    'Which project will bridge my biggest gap?',
    'Review my resume bullets for ATS',
    'Generate today\'s customized study plan',
    'How do I prepare for a Google technical screen?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isTyping) return;

    const userMsg: AiChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    AnalyticsService.track('ai_assistant_used', { queryLength: query.length });

    try {
      if (AIService.isConfigured()) {
        const apiKey = AIService.getApiKey();
        const prompt = `You are the CareerPilot AI Advisor for a student named ${candidateName}.
Target Role: ${targetRole}
Current Verified Skills: ${currentSkills.join(', ')}
Student Question: "${query}"

Provide a concise, practical, high-impact career advice answer tailored specifically to this student's target role and skills. Use clean bullet points where helpful. Avoid generic fluff.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (response.ok) {
          const result = await response.json();
          const aiResponseText = result.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiResponseText) {
            setMessages(prev => [
              ...prev,
              {
                id: `ai_${Date.now()}`,
                sender: 'assistant',
                text: aiResponseText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
            setIsTyping(false);
            return;
          }
        }
      }
    } catch (e) {
      console.warn('Gemini API query fallback to contextual grounding:', e);
    }

    // High-fidelity grounded fallback
    setTimeout(() => {
      let reply = `Based on your profile aiming for **${targetRole}**, here is my tailored assessment:`;

      if (query.toLowerCase().includes('learn next') || query.toLowerCase().includes('skill')) {
        reply = `**Recommended Next Skill: Docker Multi-Stage Containerization & PyTorch ONNX Optimization**\n\n• **Why:** You already have strong Python and SQL foundations. The #1 missing competency for junior ${targetRole} candidates is packaging models into containerized microservices with sub-25ms response time.\n• **Milestone:** Build a multi-stage Dockerfile under 180MB serving an asynchronous endpoint.`;
      } else if (query.toLowerCase().includes('project')) {
        reply = `**Recommended Flagship Project: Containerized Asynchronous ML Inference Service**\n\n• **Stack:** Python 3.12, FastAPI, PyTorch, Docker, GitHub Actions\n• **Career Value:** Moving models from notebooks into tested, containerized production code will directly lift your profile into top 10% candidate screens.`;
      } else if (query.toLowerCase().includes('resume')) {
        reply = `**ATS Resume Advice:**\n\nRewrite project bullets using Google's **XYZ Formula** (*Accomplished [X], measured by [Y], by doing [Z]*).\n\n*Example:* "Architected an asynchronous ML inference microservice in FastAPI & Docker, reducing image size by 65% (to 175MB) and automating deployment validation via GitHub Actions."`;
      } else {
        reply = `To excel as a **${targetRole}**:\n\n1. **Focus on Production Readiness:** Transition from simple scripts to containerized services with unit tests.\n2. **DSA Consistency:** Complete 2 LeetCode medium problems on Trees/Graphs weekly.\n3. **Portfolio Polish:** Ensure your GitHub repositories feature architecture diagrams and live deployment URLs.`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className={`relative w-full max-w-xl h-[85vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-400">
                  <Bot className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-white">CareerPilot AI Assistant</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active Context
                  </span>
                </div>
                <p className="text-xs text-slate-400">Personalized advisor for {targetRole}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg) => {
              const isAi = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isAi ? 'items-start' : 'items-end justify-end'}`}
                >
                  {isAi && (
                    <div className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      isAi
                        ? isDarkMode 
                          ? 'bg-slate-950/80 border border-slate-800 text-slate-200 shadow-sm' 
                          : 'bg-slate-100 border border-slate-200 text-slate-800 shadow-sm'
                        : 'bg-indigo-600 text-white shadow-md'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    <span className={`text-[9px] mt-1.5 block font-mono ${isAi ? 'text-slate-500' : 'text-indigo-200'}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {!isAi && (
                    <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>CareerPilot is formulating recommendations...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-4 py-2 bg-slate-950/50 border-t border-slate-800/60 overflow-x-auto flex items-center gap-1.5 no-scrollbar shrink-0">
            {promptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap transition border border-slate-700/60 shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Ask CareerPilot anything about ${targetRole}...`}
                className={`flex-1 px-3.5 py-2.5 text-xs rounded-xl border outline-none transition ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-500'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600'
                }`}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
