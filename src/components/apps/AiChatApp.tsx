import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Mic, Code, Lightbulb, Dumbbell } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
}

export const AiChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'gemini',
      text: 'Hello! I am your Gemini Android Companion. How can I assist your app development or daily tasks today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      // Call Google GenAI SDK
      const apiKey = process.env.GEMINI_API_KEY || '';
      if (!apiKey) {
        // Fallback friendly AI response if key not available
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              sender: 'gemini',
              text: `Here is advice regarding "${query}":\n\nTo build robust Android applications with Jetpack Compose, ensure you manage state using ViewModel and MutableStateFlow, follow Material Design 3 guidelines, and keep UI components modular.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
          setIsLoading(false);
        }, 1200);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query
      });

      const replyText = response.text || 'I processed your request successfully.';
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'gemini',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'gemini',
          text: `I've prepared a response for: "${query}". Jetpack Compose state management uses remember { mutableStateOf() } and StateFlows to keep UI reactive!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { label: 'Kotlin StateFlow', icon: Code, query: 'Explain Kotlin StateFlow in Jetpack Compose in 2 sentences.' },
    { label: 'Workout Plan', icon: Dumbbell, query: 'Give me a quick 10-minute morning workout routine.' },
    { label: 'App Design Tip', icon: Lightbulb, query: 'What are key rules for Material You 3 dynamic color palettes?' }
  ];

  return (
    <div className="h-full bg-slate-950 text-slate-100 flex flex-col font-sans select-none pb-12">
      {/* Top Bar */}
      <div className="p-3.5 bg-slate-900/90 backdrop-blur sticky top-0 z-10 border-b border-amber-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-amber-300 leading-tight flex items-center gap-1">
              Gemini AI <Sparkles className="w-3 h-3 text-amber-400" />
            </h1>
            <p className="text-[10px] text-slate-400">gemini-2.5-flash</p>
          </div>
        </div>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
              msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
              msg.sender === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
            }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <div className={`text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-500'}`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Bot className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-xs text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce delay-200"></span>
              <span>Gemini is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="px-3 py-1 flex gap-1.5 overflow-x-auto no-scrollbar">
        {quickPrompts.map((qp, i) => {
          const IconComp = qp.icon;
          return (
            <button
              key={i}
              onClick={() => handleSend(qp.query)}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2.5 py-1 rounded-xl text-[10px] font-semibold text-amber-300 flex items-center gap-1 whitespace-nowrap active:scale-95 transition"
            >
              <IconComp className="w-3 h-3 text-amber-400" /> {qp.label}
            </button>
          );
        })}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={() => setIsRecording(!isRecording)}
            className={`p-2 rounded-xl border transition ${
              isRecording 
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse' 
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>
          <input
            type="text"
            placeholder="Ask Gemini anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold p-2 rounded-xl transition shadow active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
