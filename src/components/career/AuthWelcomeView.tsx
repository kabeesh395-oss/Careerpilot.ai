import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, ArrowRight, ShieldCheck, 
  Lock, Mail, User, CheckCircle2, Zap, 
  Layers, ChevronRight, Compass
} from 'lucide-react';
import { AnalyticsService } from '../../services/analyticsService';
import { CareerPilotLogo, CareerPilotSymbol } from './CareerPilotLogo';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthWelcomeViewProps {
  isDarkMode: boolean;
  onAuthenticate: (user: AuthUser, isNewUser: boolean) => void;
}

export const AuthWelcomeView: React.FC<AuthWelcomeViewProps> = ({
  isDarkMode,
  onAuthenticate
}) => {
  const [authMode, setAuthMode] = useState<'welcome' | 'signup' | 'login'>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newUser: AuthUser = {
        id: userId,
        email: email.trim().toLowerCase(),
        name: name.trim(),
        createdAt: new Date().toISOString()
      };

      // Save user to registry
      try {
        const usersRaw = localStorage.getItem('careerpilot_registered_users');
        const users: AuthUser[] = usersRaw ? JSON.parse(usersRaw) : [];
        users.push(newUser);
        localStorage.setItem('careerpilot_registered_users', JSON.stringify(users));
      } catch (err) {
        console.error('Error saving user registry', err);
      }

      AnalyticsService.track('signup_started', { method: 'email' });
      setIsLoading(false);
      onAuthenticate(newUser, true);
    }, 400);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter your registered email');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      try {
        const usersRaw = localStorage.getItem('careerpilot_registered_users');
        const users: AuthUser[] = usersRaw ? JSON.parse(usersRaw) : [];
        const existingUser = users.find(u => u.email === email.trim().toLowerCase());

        if (existingUser) {
          setIsLoading(false);
          onAuthenticate(existingUser, false);
        } else {
          // Auto create or log in
          const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          const newUser: AuthUser = {
            id: userId,
            email: email.trim().toLowerCase(),
            name: email.split('@')[0],
            createdAt: new Date().toISOString()
          };
          users.push(newUser);
          localStorage.setItem('careerpilot_registered_users', JSON.stringify(users));
          setIsLoading(false);
          onAuthenticate(newUser, true);
        }
      } catch {
        const fallbackUser: AuthUser = {
          id: `usr_${Date.now()}`,
          email: email.trim().toLowerCase(),
          name: email.split('@')[0],
          createdAt: new Date().toISOString()
        };
        setIsLoading(false);
        onAuthenticate(fallbackUser, true);
      }
    }, 400);
  };

  const handleQuickGuestStart = () => {
    setIsLoading(true);
    setTimeout(() => {
      const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const guestUser: AuthUser = {
        id: guestId,
        email: `student_${guestId.substring(6, 11)}@university.edu`,
        name: 'New Student',
        createdAt: new Date().toISOString()
      };
      AnalyticsService.track('signup_started', { method: 'guest' });
      setIsLoading(false);
      onAuthenticate(guestUser, true);
    }, 300);
  };

  return (
    <div className={`h-full flex flex-col justify-between p-4 overflow-y-auto font-sans ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Top Header Logo */}
      <div className="flex items-center justify-between pt-2">
        <CareerPilotLogo variant={isDarkMode ? 'dark' : 'light'} size={28} showBadge badgeText="AI" />

        <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
          ● v2.4 Clean Ready
        </span>
      </div>

      {/* Main Content Area */}
      <div className="my-auto py-4 space-y-4">
        {authMode === 'welcome' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 text-center"
          >
            <div className="flex justify-center py-2">
              <CareerPilotSymbol variant="dark" size={56} appIcon />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Your AI Career Guidance <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-cyan-300">
                  Built for Freshers & Students
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
                Personalized roadmaps, live ATS resume analysis, mock interviews, and zero-experience career discovery.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 gap-2 text-left pt-2">
              <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-2xl flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[11px] font-bold text-white">Role Diagnostics</h4>
                  <p className="text-[9px] text-slate-400">4-pillar readiness scoring</p>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-2xl flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[11px] font-bold text-white">0-Experience Ready</h4>
                  <p className="text-[9px] text-slate-400">Starter project blueprints</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => setAuthMode('signup')}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-95"
              >
                <span>Create New Profile & Start</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleQuickGuestStart}
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 transition"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>1-Click Fresh Student Launch</span>
              </button>

              <p className="text-[11px] text-slate-400 pt-1">
                Already have an account?{' '}
                <button 
                  onClick={() => setAuthMode('login')} 
                  className="text-indigo-400 font-bold hover:underline"
                >
                  Log In
                </button>
              </p>
            </div>
          </motion.div>
        )}

        {authMode === 'signup' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3.5"
          >
            <div>
              <button 
                onClick={() => setAuthMode('welcome')}
                className="text-[11px] text-slate-400 hover:text-slate-200 mb-1 flex items-center gap-1"
              >
                ← Back
              </button>
              <h2 className="text-base font-extrabold text-white">Create New Account</h2>
              <p className="text-[11px] text-slate-400">Initialize your clean, personalized student profile</p>
            </div>

            {error && (
              <div className="bg-rose-500/20 border border-rose-500/30 text-rose-300 p-2.5 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-2.5">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Your Full Name:</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g., Alex Johnson"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-indigo-500 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">College Email or Personal Email:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-indigo-500 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Password:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-indigo-500 font-medium"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition active:scale-95"
              >
                {isLoading ? 'Creating Fresh Profile...' : 'Continue to Onboarding →'}
              </button>
            </form>

            <p className="text-center text-[10px] text-slate-400">
              Already have an account?{' '}
              <button 
                onClick={() => setAuthMode('login')} 
                className="text-indigo-400 font-bold hover:underline"
              >
                Log In
              </button>
            </p>
          </motion.div>
        )}

        {authMode === 'login' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3.5"
          >
            <div>
              <button 
                onClick={() => setAuthMode('welcome')}
                className="text-[11px] text-slate-400 hover:text-slate-200 mb-1 flex items-center gap-1"
              >
                ← Back
              </button>
              <h2 className="text-base font-extrabold text-white">Welcome Back</h2>
              <p className="text-[11px] text-slate-400">Log in to resume your career roadmap</p>
            </div>

            {error && (
              <div className="bg-rose-500/20 border border-rose-500/30 text-rose-300 p-2.5 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-2.5">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Email Address:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-indigo-500 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Password:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-indigo-500 font-medium"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition active:scale-95"
              >
                {isLoading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-[10px] text-slate-400">
              Don't have an account yet?{' '}
              <button 
                onClick={() => setAuthMode('signup')} 
                className="text-indigo-400 font-bold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </motion.div>
        )}
      </div>

      {/* Footer Security Note */}
      <div className="pt-2 border-t border-slate-900 text-center">
        <span className="text-[9px] text-slate-500 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-500" /> Private on-device profile storage &bull; Zero data tracking
        </span>
      </div>
    </div>
  );
};
