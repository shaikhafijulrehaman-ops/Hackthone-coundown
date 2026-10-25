import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { HACKATHON_CONFIG } from '../data/hackathonData';
import { RotateCcw } from 'lucide-react';

export default function CompletionScreen({ onReset }) {
  useEffect(() => {
    // Restrained Ice Blue and White confetti burst
    const end = Date.now() + 3000;
    const colors = ['#8EB8E8', '#3879C9', '#DCE8F5', '#FFFFFF'];

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 50,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 50,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-iceBg/85 backdrop-blur-md p-6 select-none animate-fade-in">
      <div className="relative max-w-2xl w-full bg-white/90 rounded-3xl p-6 sm:p-10 border border-iceAccent/50 shadow-2xl text-center flex flex-col items-center text-iceText">
        {/* Authentic College Logo - Constrained cleanly so it stays well above the college name without overlapping */}
        <div className="h-20 sm:h-24 w-full flex items-center justify-center mb-6">
          <img
            src="/mic-logo.png"
            alt="MIC College of Technology"
            className="h-full w-auto max-w-[240px] object-contain filter drop-shadow-[0_2px_10px_rgba(56,121,201,0.25)]"
          />
        </div>

        {/* College & Department Subtitle */}
        <div className="text-xs sm:text-sm font-rajdhani font-bold text-icePrimary tracking-[0.2em] uppercase mb-1.5 text-center">
          {HACKATHON_CONFIG.college}
        </div>
        <div className="text-[10px] sm:text-xs font-rajdhani font-semibold text-iceTextSecondary tracking-wider uppercase mb-4 text-center">
          {HACKATHON_CONFIG.department}
        </div>

        {/* Hackathon Name */}
        <h1 className="text-3xl sm:text-5xl font-orbitron font-black text-iceText tracking-wider mb-2 drop-shadow-sm">
          {HACKATHON_CONFIG.title}
        </h1>

        {/* HACKATHON COMPLETED Banner */}
        <div className="my-4 px-8 py-2.5 rounded-full bg-gradient-to-r from-icePrimary via-iceAccent to-icePrimary border border-icePrimary shadow-ice-primary">
          <span className="text-lg sm:text-2xl font-orbitron font-extrabold text-white tracking-[0.2em] uppercase">
            HACKATHON COMPLETED
          </span>
        </div>

        <p className="text-xs sm:text-sm text-iceTextSecondary max-w-lg font-sans font-medium mb-6">
          The 5-hour hackathon duration has concluded. Coding has ended. Teams please prepare for evaluation and presentation in EEE Seminar Hall.
        </p>

        {/* Statistics Bar */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-md mb-6 text-center">
          <div className="bg-iceSurface/70 p-2.5 rounded-xl border border-iceAccent/30">
            <span className="text-[10px] font-rajdhani font-bold text-iceTextSecondary uppercase block">Time Elapsed</span>
            <span className="text-sm sm:text-base font-orbitron font-bold text-icePrimary">05:00:00</span>
          </div>
          <div className="bg-iceSurface/70 p-2.5 rounded-xl border border-iceAccent/30">
            <span className="text-[10px] font-rajdhani font-bold text-iceTextSecondary uppercase block">Tracks</span>
            <span className="text-sm sm:text-base font-orbitron font-bold text-icePrimary">5 PS SLIDES</span>
          </div>
          <div className="bg-iceSurface/70 p-2.5 rounded-xl border border-iceAccent/30">
            <span className="text-[10px] font-rajdhani font-bold text-iceTextSecondary uppercase block">Next Stage</span>
            <span className="text-sm sm:text-base font-orbitron font-bold text-emerald-600">JURY EVAL</span>
          </div>
        </div>

        {/* Operator Reset Action */}
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-2 rounded-xl border border-iceAccent/40 text-xs font-rajdhani font-bold text-icePrimary hover:bg-iceSurface transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Display (Operator)</span>
        </button>
      </div>
    </div>
  );
}
