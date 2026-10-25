import React from 'react';
import { PROBLEM_STATEMENTS } from '../data/hackathonData';
import { Sparkles, Terminal, FileSpreadsheet, Camera, ShoppingBag, Video } from 'lucide-react';

const ICONS = [
  Terminal, // PS-01
  Camera,   // PS-02
  ShoppingBag, // PS-03
  FileSpreadsheet, // PS-04
  Video, // PS-05
];

export default function ProblemStatementOverlay({ activeIndex, onSelectStatement }) {
  if (activeIndex === null || activeIndex === undefined) return null;

  const current = PROBLEM_STATEMENTS[activeIndex];
  if (!current) return null;

  const IconComponent = ICONS[activeIndex] || Sparkles;

  return (
    <div
      className="relative z-30 w-full max-w-4xl mx-auto px-4 mt-4 animate-fade-in-up"
      style={{
        animation: 'slideUpSmooth 450ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
      }}
    >
      <div className="relative glass-panel rounded-2xl p-5 sm:p-7 border border-cyan-400/30 shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Subtle accent gradient glow at top */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${current.badgeColor}`} />

        {/* Ambient colored background glow matching the problem category */}
        <div
          className="absolute -right-20 -top-20 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: current.glowColor }}
        />

        {/* Top Header Row: Category Badge & Step Dots */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-rajdhani font-bold tracking-wider uppercase bg-midnight/80 border border-cyan-400/40 text-electricCyan flex items-center gap-1.5 shadow-sm">
              <IconComponent className="w-3.5 h-3.5 text-quantumTeal" />
              <span>{current.id}</span>
            </span>
            <span className="text-xs font-rajdhani uppercase tracking-widest text-mutedBlue">
              {current.category}
            </span>
          </div>

          {/* 5-step indicator dots */}
          <div className="flex items-center gap-2 bg-midnight/60 px-3 py-1 rounded-full border border-white/5">
            {PROBLEM_STATEMENTS.map((ps, idx) => (
              <button
                key={ps.id}
                onClick={() => onSelectStatement && onSelectStatement(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === activeIndex
                    ? 'w-6 h-2 bg-electricCyan shadow-cyan-glow'
                    : 'w-2 h-2 bg-white/20 hover:bg-white/50'
                }`}
                title={ps.title}
              />
            ))}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl md:text-3xl font-orbitron font-bold text-softIce tracking-wide mb-2">
          {current.title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg text-softIce/85 font-sans leading-relaxed">
          {current.description}
        </p>

        {/* 5-Second Timer Progress Bar at Bottom of Card */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-rajdhani text-quantumTeal uppercase tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-quantumTeal animate-ping" />
            LIVE ROTATION • DISPLAYING 5s
          </span>
          <div className="w-32 sm:w-48 h-1.5 bg-midnight rounded-full overflow-hidden border border-white/10">
            <div
              key={`progress-${activeIndex}`}
              className="h-full bg-gradient-to-r from-electricCyan to-quantumTeal rounded-full"
              style={{
                animation: 'linearProgress 5s linear forwards',
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUpSmooth {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes linearProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
