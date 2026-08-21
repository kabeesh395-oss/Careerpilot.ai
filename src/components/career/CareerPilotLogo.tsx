import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, Download, Layers, Sparkles, Moon, Sun, Shield, Sliders, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export type LogoVariant = 'dark' | 'light' | 'monochrome-dark' | 'monochrome-light' | 'electric-blue' | 'silver';
export type LogoLayout = 'horizontal' | 'vertical' | 'symbol-only' | 'app-icon';

export interface CareerPilotLogoProps {
  variant?: LogoVariant;
  layout?: LogoLayout;
  size?: number;
  className?: string;
  showBadge?: boolean;
  badgeText?: string;
  animate?: boolean;
}

/**
 * PURE GEOMETRIC "C + CAREER PATH + UPWARD ARROW" SYMBOL
 * 
 * Mathematical Geometry:
 * - Outer 100x100 coordinate grid with 12px optical margin.
 * - Bold, continuous geometric "C" arc flowing from bottom terminal (76, 72)
 *   around the foundation (50, 88), sweeping up through the left spine (14, 50),
 *   and anchoring over the top (50, 12).
 * - Upward-moving Career Path: An ascending diagonal vector originating from 
 *   the base interior (38, 66) that climbs at a precise 45° angle.
 * - Integrated Upward Arrowhead: Crests at (80, 24) pointing North-East (45°),
 *   creating an unmistakable upward career trajectory that locks harmoniously
 *   into the open aperture of the C.
 * - Negative space channels: Uniform 8px optical separation ensuring crisp
 *   legibility even at small 16px/24px favicon & app icon sizes.
 */
export const CareerPilotSymbol: React.FC<{
  variant?: LogoVariant;
  size?: number;
  className?: string;
  appIcon?: boolean;
  animate?: boolean;
}> = ({
  variant = 'dark',
  size = 32,
  className = '',
  appIcon = false,
  animate = false
}) => {
  // Color tokens based on visual style guidelines
  const colors = {
    // Dark background theme (charcoal canvas)
    'dark': {
      cArc: '#F8FAFC',        // Crisp white/soft silver for C chassis
      path: '#3B82F6',        // Subtle electric blue for the upward path
      arrow: '#60A5FA',       // Bright electric blue apex
      accentGlow: 'rgba(59, 130, 246, 0.15)',
      appBg: '#090D16',       // Deep charcoal / near-black
      appBorder: '#1E293B'
    },
    // Light background theme
    'light': {
      cArc: '#0B0F17',        // Deep charcoal for C chassis
      path: '#2563EB',        // Electric blue for upward path
      arrow: '#1D4ED8',       // Rich blue arrow
      accentGlow: 'rgba(37, 99, 235, 0.10)',
      appBg: '#FFFFFF',
      appBorder: '#E2E8F0'
    },
    // Pure Monochrome Dark (White on Black)
    'monochrome-dark': {
      cArc: '#FFFFFF',
      path: '#FFFFFF',
      arrow: '#FFFFFF',
      accentGlow: 'none',
      appBg: '#000000',
      appBorder: '#27272A'
    },
    // Pure Monochrome Light (Black on White)
    'monochrome-light': {
      cArc: '#000000',
      path: '#000000',
      arrow: '#000000',
      accentGlow: 'none',
      appBg: '#FFFFFF',
      appBorder: '#E4E4E7'
    },
    // Electric Blue Hero
    'electric-blue': {
      cArc: '#FFFFFF',
      path: '#38BDF8',
      arrow: '#60A5FA',
      accentGlow: 'rgba(56, 189, 248, 0.25)',
      appBg: '#0F172A',
      appBorder: '#1E3A8A'
    },
    // Soft Silver Minimal
    'silver': {
      cArc: '#E2E8F0',
      path: '#94A3B8',
      arrow: '#CBD5E1',
      accentGlow: 'none',
      appBg: '#0B0F17',
      appBorder: '#1E293B'
    }
  }[variant] || {
    cArc: '#F8FAFC',
    path: '#3B82F6',
    arrow: '#60A5FA',
    accentGlow: 'rgba(59, 130, 246, 0.15)',
    appBg: '#090D16',
    appBorder: '#1E293B'
  };

  const isMonochrome = variant === 'monochrome-dark' || variant === 'monochrome-light';

  const svgContent = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="CareerPilot Logo Symbol"
    >
      <defs>
        {/* Subtle high-tech gradient for electric blue path */}
        {!isMonochrome && (
          <>
            <linearGradient id={`cp-blue-path-${variant}`} x1="30" y1="75" x2="85" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="60%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
            <linearGradient id={`cp-c-silver-${variant}`} x1="20" y1="15" x2="80" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={variant === 'light' ? '#0F172A' : '#FFFFFF'} />
              <stop offset="100%" stopColor={variant === 'light' ? '#1E293B' : '#E2E8F0'} />
            </linearGradient>
          </>
        )}
      </defs>

      {/* 
        ELEMENT 1: The Outer "C" Chassis
        Precision geometric path with consistent 15px stroke weight and smooth rounded terminal caps.
        Sweeps from (72, 70) around the bottom, spine, and top to (72, 30).
      */}
      <path
        d="M 68 76 C 58 84, 44 86, 34 82 C 20 76, 12 62, 12 48 C 12 32, 22 18, 38 14 C 48 11, 60 13, 70 20"
        stroke={!isMonochrome && variant !== 'light' ? `url(#cp-c-silver-${variant})` : colors.cArc}
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 
        ELEMENT 2: The Ascending Upward Career Path
        Originates from inside the lower quadrant of the C and shoots diagonally upwards at 45°.
      */}
      <path
        d="M 35 65 L 68 32"
        stroke={isMonochrome ? colors.path : `url(#cp-blue-path-${variant})`}
        strokeWidth="11"
        strokeLinecap="round"
      />

      {/* 
        ELEMENT 3: The Integrated Directional Arrowhead
        Precision 45° upward arrowhead capping the career path, representing forward acceleration and career promotion.
      */}
      <path
        d="M 46 25 L 78 22 L 75 54"
        stroke={isMonochrome ? colors.arrow : `url(#cp-blue-path-${variant})`}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 
        Subtle precision guide dot at the origin of the career path (anchor point)
      */}
      {!isMonochrome && (
        <circle
          cx="35"
          cy="65"
          r="4"
          fill={colors.path}
        />
      )}
    </svg>
  );

  // App-Icon Container Option (Squircle format)
  if (appIcon) {
    return (
      <div 
        className={`relative flex items-center justify-center rounded-[22%] border shadow-xl overflow-hidden transition-all duration-300 ${className}`}
        style={{
          width: size * 1.35,
          height: size * 1.35,
          backgroundColor: colors.appBg,
          borderColor: colors.appBorder,
          boxShadow: variant === 'dark' || variant === 'electric-blue' 
            ? '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 20px -5px rgba(37, 99, 235, 0.2)' 
            : '0 8px 20px -4px rgba(0, 0, 0, 0.08)'
        }}
      >
        {/* Subtle ambient interior glow */}
        {colors.accentGlow !== 'none' && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 65% 35%, ${colors.accentGlow} 0%, transparent 70%)`
            }}
          />
        )}
        {svgContent}
      </div>
    );
  }

  return svgContent;
};

/**
 * COMPLETE "CAREER PILOT" WORDMARK & COMBINATION LOGO
 */
export const CareerPilotLogo: React.FC<CareerPilotLogoProps> = ({
  variant = 'dark',
  layout = 'horizontal',
  size = 32,
  className = '',
  showBadge = false,
  badgeText = 'AI'
}) => {
  const isLight = variant === 'light' || variant === 'monochrome-light';
  
  const textColor = isLight ? 'text-slate-950' : 'text-white';
  const subtextColor = isLight ? 'text-slate-500' : 'text-slate-400';
  const pilotColor = isLight ? 'text-blue-600' : (variant.includes('monochrome') ? 'text-white' : 'text-blue-400');
  
  if (layout === 'symbol-only') {
    return <CareerPilotSymbol variant={variant} size={size} className={className} />;
  }

  if (layout === 'app-icon') {
    return <CareerPilotSymbol variant={variant} size={size} appIcon className={className} />;
  }

  if (layout === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center gap-2 ${className}`}>
        <CareerPilotSymbol variant={variant} size={size * 1.3} />
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <span className={`text-sm font-extrabold tracking-tight font-sans ${textColor}`}>
              Career<span className={pilotColor}>Pilot</span>
            </span>
            {showBadge && (
              <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                {badgeText}
              </span>
            )}
          </div>
          <span className={`text-[10px] font-medium tracking-wide ${subtextColor}`}>
            Career Guidance Engine
          </span>
        </div>
      </div>
    );
  }

  // Standard Horizontal Layout
  return (
    <div className={`inline-flex items-center gap-2.5 font-sans select-none ${className}`}>
      <CareerPilotSymbol variant={variant} size={size} />
      
      <div className="flex items-center gap-1.5">
        <div className="flex items-baseline tracking-tight">
          <span className={`font-extrabold ${textColor}`} style={{ fontSize: `${Math.max(13, size * 0.48)}px` }}>
            Career
          </span>
          <span className={`font-black ${pilotColor}`} style={{ fontSize: `${Math.max(13, size * 0.48)}px` }}>
            Pilot
          </span>
        </div>

        {showBadge && (
          <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-full border ${
            isLight 
              ? 'bg-blue-50 text-blue-600 border-blue-200' 
              : 'bg-blue-950/60 text-blue-300 border-blue-500/30'
          }`}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * RAW SVG STRINGS FOR EASY COPY & EXPORT
 */
export const RAW_SVG_EXPORTS = {
  symbolDark: `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M 68 76 C 58 84, 44 86, 34 82 C 20 76, 12 62, 12 48 C 12 32, 22 18, 38 14 C 48 11, 60 13, 70 20" stroke="#F8FAFC" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 35 65 L 68 32" stroke="#3B82F6" stroke-width="11" stroke-linecap="round"/>
  <path d="M 46 25 L 78 22 L 75 54" stroke="#60A5FA" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="35" cy="65" r="4" fill="#3B82F6"/>
</svg>`,

  symbolLight: `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M 68 76 C 58 84, 44 86, 34 82 C 20 76, 12 62, 12 48 C 12 32, 22 18, 38 14 C 48 11, 60 13, 70 20" stroke="#0B0F17" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 35 65 L 68 32" stroke="#2563EB" stroke-width="11" stroke-linecap="round"/>
  <path d="M 46 25 L 78 22 L 75 54" stroke="#1D4ED8" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="35" cy="65" r="4" fill="#2563EB"/>
</svg>`,

  symbolMonochrome: `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M 68 76 C 58 84, 44 86, 34 82 C 20 76, 12 62, 12 48 C 12 32, 22 18, 38 14 C 48 11, 60 13, 70 20" stroke="currentColor" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 35 65 L 68 32" stroke="currentColor" stroke-width="11" stroke-linecap="round"/>
  <path d="M 46 25 L 78 22 L 75 54" stroke="currentColor" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,

  fullLogoDark: `<svg width="240" height="60" viewBox="0 0 240 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(6, 6) scale(0.48)">
    <path d="M 68 76 C 58 84, 44 86, 34 82 C 20 76, 12 62, 12 48 C 12 32, 22 18, 38 14 C 48 11, 60 13, 70 20" stroke="#F8FAFC" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 35 65 L 68 32" stroke="#3B82F6" stroke-width="11" stroke-linecap="round"/>
    <path d="M 46 25 L 78 22 L 75 54" stroke="#60A5FA" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="35" cy="65" r="4" fill="#3B82F6"/>
  </g>
  <text x="64" y="38" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="22" fill="#FFFFFF" letter-spacing="-0.5px">Career<tspan fill="#60A5FA" font-weight="900">Pilot</tspan></text>
</svg>`
};

/**
 * INTERACTIVE BRAND IDENTITY SHOWCASE MODAL
 * Presents all 5 user deliverables in an immaculate SaaS presentation studio.
 */
export const CareerPilotBrandShowcase: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'app-icon' | 'lockups' | 'themes' | 'construction'>('all');

  if (!isOpen) return null;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadSvg = (filename: string, svgString: string) => {
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <CareerPilotSymbol variant="dark" size={28} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-white tracking-tight">CareerPilot Brand Identity</h2>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  Design System
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Minimal “C + Career Path + Upward Arrow” Identity</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy('raw-symbol-dark', RAW_SVG_EXPORTS.symbolDark)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition"
            >
              {copiedKey === 'raw-symbol-dark' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy SVG</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2 border-b border-slate-800 bg-slate-950/30 flex gap-2 overflow-x-auto text-xs font-bold">
          {[
            { id: 'all', label: 'All 5 Deliverables' },
            { id: 'app-icon', label: '1. App Icon Matrix' },
            { id: 'lockups', label: '2. Wordmark Lockups' },
            { id: 'themes', label: '3-5. Light / Dark / Monochrome' },
            { id: 'construction', label: 'Geometric Grid' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          
          {/* ==================================================== */}
          {/* DELIVERABLE 1: SYMBOL-ONLY APP ICON */}
          {/* ==================================================== */}
          {(activeTab === 'all' || activeTab === 'app-icon') && (
            <div className="p-5 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">
                    Deliverable 1
                  </span>
                  <h3 className="text-sm font-extrabold text-white">Symbol-Only App Icon</h3>
                  <p className="text-xs text-slate-400">
                    High-contrast squircle optimized for mobile homescreens, browser favicons, and dock icons.
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadSvg('careerpilot-app-icon.svg', RAW_SVG_EXPORTS.symbolDark)}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-500/30"
                >
                  <Download className="w-3.5 h-3.5" /> Download SVG
                </button>
              </div>

              {/* Icon Scale Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center justify-items-center pt-2">
                {/* 96px Master Icon */}
                <div className="flex flex-col items-center gap-2">
                  <CareerPilotSymbol variant="dark" size={64} appIcon />
                  <span className="text-[10px] font-mono text-slate-400">96px &bull; Master</span>
                </div>

                {/* 48px Notification Icon */}
                <div className="flex flex-col items-center gap-2">
                  <CareerPilotSymbol variant="dark" size={36} appIcon />
                  <span className="text-[10px] font-mono text-slate-400">48px &bull; System</span>
                </div>

                {/* 32px Toolbar Icon */}
                <div className="flex flex-col items-center gap-2">
                  <CareerPilotSymbol variant="dark" size={24} appIcon />
                  <span className="text-[10px] font-mono text-slate-400">32px &bull; Favicon</span>
                </div>

                {/* 16px Micro Icon */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shadow">
                    <CareerPilotSymbol variant="dark" size={14} />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">16px &bull; Micro</span>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* DELIVERABLE 2: SYMBOL + WORDMARK */}
          {/* ==================================================== */}
          {(activeTab === 'all' || activeTab === 'lockups') && (
            <div className="p-5 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">
                    Deliverable 2
                  </span>
                  <h3 className="text-sm font-extrabold text-white">Symbol + “CareerPilot” Wordmark</h3>
                  <p className="text-xs text-slate-400">
                    Horizontal and stacked lockups with precise typographic tracking and negative space balance.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy('raw-full-logo', RAW_SVG_EXPORTS.fullLogoDark)}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-500/30"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Lockup SVG
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Horizontal Lockup */}
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col items-center justify-center space-y-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Primary Horizontal Lockup</span>
                  <div className="py-2">
                    <CareerPilotLogo variant="dark" size={32} showBadge badgeText="AI" />
                  </div>
                </div>

                {/* Vertical Stacked Lockup */}
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col items-center justify-center space-y-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Vertical / Centered Lockup</span>
                  <div className="py-1">
                    <CareerPilotLogo variant="dark" layout="vertical" size={28} showBadge />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* DELIVERABLES 3, 4, 5: LIGHT / DARK / MONOCHROME VERSIONS */}
          {/* ==================================================== */}
          {(activeTab === 'all' || activeTab === 'themes') && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">
                  Deliverables 3, 4 & 5
                </span>
                <h3 className="text-sm font-extrabold text-white">Colorway Variations</h3>
                <p className="text-xs text-slate-400">
                  Engineered for flawless contrast across light, dark, and pure monochrome surfaces.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 3. LIGHT-BACKGROUND VERSION */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200 text-slate-900 shadow-md flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">
                        3. Light Theme
                      </span>
                      <Sun className="w-4 h-4 text-amber-500" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 mt-1">Deep Charcoal + Royal Electric Blue</h4>
                  </div>

                  <div className="py-4 flex flex-col items-center justify-center gap-3">
                    <CareerPilotLogo variant="light" size={28} showBadge />
                    <CareerPilotSymbol variant="light" size={40} appIcon />
                  </div>

                  <button
                    onClick={() => handleCopy('light-svg', RAW_SVG_EXPORTS.symbolLight)}
                    className="w-full py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-1 transition"
                  >
                    <Copy className="w-3 h-3" /> Copy Light SVG
                  </button>
                </div>

                {/* 4. DARK-BACKGROUND VERSION */}
                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-md flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-blue-400 uppercase">
                        4. Dark Theme
                      </span>
                      <Moon className="w-4 h-4 text-blue-400" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-200 mt-1">Soft Silver + Electric Blue on Charcoal</h4>
                  </div>

                  <div className="py-4 flex flex-col items-center justify-center gap-3">
                    <CareerPilotLogo variant="dark" size={28} showBadge />
                    <CareerPilotSymbol variant="dark" size={40} appIcon />
                  </div>

                  <button
                    onClick={() => handleCopy('dark-svg', RAW_SVG_EXPORTS.symbolDark)}
                    className="w-full py-1.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-800 flex items-center justify-center gap-1 transition"
                  >
                    <Copy className="w-3 h-3" /> Copy Dark SVG
                  </button>
                </div>

                {/* 5. PURE MONOCHROME VERSION */}
                <div className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800 text-zinc-100 shadow-md flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">
                        5. Pure Monochrome
                      </span>
                      <Shield className="w-4 h-4 text-zinc-400" />
                    </div>
                    <h4 className="text-xs font-bold text-zinc-200 mt-1">Single-Ink (100% White / Black)</h4>
                  </div>

                  <div className="py-4 flex flex-col items-center justify-center gap-3">
                    <CareerPilotLogo variant="monochrome-dark" size={28} />
                    <div className="p-2 rounded-2xl bg-white">
                      <CareerPilotSymbol variant="monochrome-light" size={28} />
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy('mono-svg', RAW_SVG_EXPORTS.symbolMonochrome)}
                    className="w-full py-1.5 rounded-xl border border-zinc-800 text-xs font-bold text-zinc-300 hover:bg-zinc-800 flex items-center justify-center gap-1 transition"
                  >
                    <Copy className="w-3 h-3" /> Copy Mono SVG
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* GEOMETRIC CONSTRUCTION & DESIGN GUIDELINES */}
          {/* ==================================================== */}
          {(activeTab === 'all' || activeTab === 'construction') && (
            <div className="p-5 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-4">
              <div>
                <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">
                  Geometric Precision
                </span>
                <h3 className="text-sm font-extrabold text-white">Logo Concept & Construction Logic</h3>
                <p className="text-xs text-slate-400">
                  Mathematical alignment, negative space channels, and semantic meaning.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> Letter “C” Arc
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Represents <strong>CareerPilot</strong>. A rounded geometric arc providing structural stability and enclosing the user's career roadmap.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                    <ArrowUpRight className="w-4 h-4" /> Ascending Path
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Originates at the career foundation and climbs at a clean <strong>45° angle</strong>, visualizing structured progress, learning milestones, and skill growth.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-purple-400 font-bold text-xs">
                    <Sparkles className="w-4 h-4" /> Upward Arrow Crest
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Subtly points towards top-tier tech roles and career placement. Clean optical separation ensures crisp clarity from <strong>16px</strong> to billboard scale.
                  </p>
                </div>

              </div>

              {/* Color Code Specs */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Brand Color Palette Tokens</span>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-[#090D16] border border-slate-800 text-slate-300">
                    Canvas Charcoal: #090D16
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#2563EB] text-white font-bold">
                    Primary Blue: #2563EB
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#3B82F6] text-white font-bold">
                    Electric Blue: #3B82F6
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] text-slate-900 font-bold">
                    Soft Silver: #F8FAFC
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-black text-white border border-zinc-700">
                    Monochrome: #000000 / #FFFFFF
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0 text-xs">
          <span className="text-[11px] text-slate-400">
            Crafted for Linear/Notion-caliber SaaS elegance. Free of robot/brain/cap clichés.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
