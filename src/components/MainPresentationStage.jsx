import React from 'react';
import DigitGroup from './DigitGroup';
import ProblemStatementSlide from './ProblemStatementSlide';
import { PDF_PROBLEM_STATEMENTS } from '../data/problemStatementsPdf';
import { AlertTriangle, Sparkles } from 'lucide-react';

/**
 * MainPresentationStage:
 * Unified Ice Glass presentation stage for MIC TECH-HACK 2K26.
 * Dimensions: 88vw (max 1640px) x 60vh (max 700px), centered horizontally.
 * Styled in crystal-clear Ice Glass matching the user's reference glass plate.
 *
 * Cycle Timing:
 * - 00–06s: Live Countdown Timer (floating falling digits)
 * - 06–31s: Problem Statements 1–5 (5 seconds each)
 * - 31–45s: Hackathon Poster (handled in App.jsx via FullScreenPosterSlide)
 */
export default function MainPresentationStage({
  cyclePhase,
  activeStatementIndex,
  hours,
  minutes,
  seconds,
  warningInfo,
  status,
}) {
  // If in poster phase, the main presentation stage is hidden
  if (cyclePhase === 'POSTER') {
    return null;
  }

  const isPaused = status === 'PAUSED';
  const warningLevel = warningInfo?.level || 'normal';

  // Dynamic glass panel styling for warnings
  const getPanelClass = () => {
    if (warningLevel === 'critical' || warningLevel === 'red') {
      return 'main-stage-glass-panel-red animate-pulse-slow';
    }
    if (warningLevel === 'warning' || warningLevel === 'amber') {
      return 'main-stage-glass-panel-amber';
    }
    return 'main-stage-glass-panel';
  };

  const getBorderModifier = () => {
    if (warningLevel === 'critical' || warningLevel === 'red') {
      return 'border-red';
    }
    if (warningLevel === 'warning' || warningLevel === 'amber') {
      return 'border-amber';
    }
    return '';
  };

  const getColonClass = () => {
    if (warningLevel === 'critical' || warningLevel === 'red') {
      return 'text-criticalRed/70';
    }
    if (warningLevel === 'warning' || warningLevel === 'amber') {
      return 'text-warningAmber/70';
    }
    return 'text-icePrimary/75';
  };

  const currentStatement =
    activeStatementIndex !== null && activeStatementIndex !== undefined
      ? PDF_PROBLEM_STATEMENTS[activeStatementIndex]
      : null;

  return (
    <div
      className="fixed z-20 flex items-center justify-center select-none"
      style={{
        top: '8.5vh',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(88vw, 1580px)',
        height: 'min(58vh, 660px)',
      }}
    >
      {/* Outer Left Holographic Sci-Fi Circuit Traces (Image 2) */}
      <div className="absolute -left-12 sm:-left-20 top-1/2 -translate-y-1/2 w-16 sm:w-24 h-56 pointer-events-none opacity-70 hidden md:block">
        <svg viewBox="0 0 100 200" className="w-full h-full stroke-icePrimary fill-none" strokeWidth="1.5">
          <path d="M 100 20 L 40 20 L 20 40 L 20 160 L 40 180 L 100 180" opacity="0.6" />
          <path d="M 100 50 L 60 50 L 50 60 L 50 140 L 60 150 L 100 150" opacity="0.4" />
          <circle cx="20" cy="40" r="3.5" className="fill-icePrimary" />
          <circle cx="20" cy="160" r="3.5" className="fill-icePrimary" />
          <circle cx="50" cy="60" r="2.5" className="fill-white" />
          <circle cx="50" cy="140" r="2.5" className="fill-white" />
        </svg>
      </div>

      {/* Outer Right Holographic Sci-Fi Circuit Traces (Image 2) */}
      <div className="absolute -right-12 sm:-right-20 top-1/2 -translate-y-1/2 w-16 sm:w-24 h-56 pointer-events-none opacity-70 hidden md:block scale-x-[-1]">
        <svg viewBox="0 0 100 200" className="w-full h-full stroke-icePrimary fill-none" strokeWidth="1.5">
          <path d="M 100 20 L 40 20 L 20 40 L 20 160 L 40 180 L 100 180" opacity="0.6" />
          <path d="M 100 50 L 60 50 L 50 60 L 50 140 L 60 150 L 100 150" opacity="0.4" />
          <circle cx="20" cy="40" r="3.5" className="fill-icePrimary" />
          <circle cx="20" cy="160" r="3.5" className="fill-icePrimary" />
          <circle cx="50" cy="60" r="2.5" className="fill-white" />
          <circle cx="50" cy="140" r="2.5" className="fill-white" />
        </svg>
      </div>

      {/* Animated Moving Ice-Blue Perimeter Gradient Border */}
      <div className={`animated-glass-border-container ${getBorderModifier()} w-full h-full`}>
        {/* Crystal-Clear Ice Glass Panel */}
        <div
          className={`relative w-full h-full ${getPanelClass()} overflow-hidden flex flex-col justify-between transition-colors duration-700`}
        >
          {/* Subtle Top-Edge Glass Sheen (100% clear background visibility) */}
          <div 
            className="absolute inset-x-0 top-0 h-10 pointer-events-none rounded-t-[38px]"
            style={{
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, transparent 100%)',
            }}
          />

          {/* Top Edge Sparkling White Highlight Glints (matches reference image) */}
          <div className="absolute top-0 left-1/4 -translate-x-1/2 -translate-y-1/2 w-8 h-1 bg-white rounded-full blur-[1px] shadow-[0_0_10px_#ffffff] pointer-events-none z-30" />
          <div className="absolute top-0 right-1/3 -translate-x-1/2 -translate-y-1/2 w-6 h-1 bg-white rounded-full blur-[1px] shadow-[0_0_8px_#ffffff] pointer-events-none z-30" />
          <div className="absolute bottom-0 right-1/4 -translate-x-1/2 translate-y-1/2 w-9 h-1.5 bg-white rounded-full blur-[1px] shadow-[0_0_10px_#ffffff] pointer-events-none z-30" />

          {/* ======================================================== */}
          {/* CONTENT STATE 1: LIVE COUNTDOWN TIMER (Image 2 Design)   */}
          {/* ======================================================== */}
          {cyclePhase === 'TIMER' && (
            <div className="relative w-full h-full p-6 sm:p-10 flex flex-col items-center justify-between animate-fade-in z-10">
              {/* Top Header: Flanked by Circuit Line Accents matching Image 2 */}
              <div className="flex items-center justify-center gap-3 sm:gap-5 w-full select-none pt-2">
                <div className="flex items-center gap-1.5 opacity-80">
                  <div className="w-8 sm:w-16 md:w-24 h-[1.5px] bg-gradient-to-r from-transparent to-[#3879C9]" />
                  <span className="w-2 h-2 rounded-full bg-[#3879C9] shadow-[0_0_8px_rgba(56,121,201,0.6)]" />
                </div>

                <div className="flex items-center gap-2.5">
                  {isPaused && (
                    <span className="w-2.5 h-2.5 rounded-full bg-warningAmber animate-ping" />
                  )}
                  <h2 className="text-xs sm:text-sm md:text-base font-orbitron font-extrabold tracking-[0.35em] uppercase text-[#182A43] drop-shadow-sm text-center">
                    HACKATHON TIME REMAINING
                  </h2>
                  {isPaused && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-orbitron font-bold bg-amber-500/20 text-warningAmber border border-amber-500/40">
                      PAUSED
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 opacity-80">
                  <span className="w-2 h-2 rounded-full bg-[#3879C9] shadow-[0_0_8px_rgba(56,121,201,0.6)]" />
                  <div className="w-8 sm:w-16 md:w-24 h-[1.5px] bg-gradient-to-l from-transparent to-[#3879C9]" />
                </div>
              </div>

              {/* Centered Floating Digits with 3D Glowing Sphere Colons matching Image 2 */}
              <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-10 lg:gap-14 my-auto select-none">
                {/* Hours Group */}
                <DigitGroup
                  value={hours}
                  label="HOURS"
                  warningLevel={warningLevel}
                  size="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[8rem]"
                />

                {/* 3D Glowing Spherical Glass Orbs (Colon) */}
                <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 pb-6 sm:pb-8 px-1 sm:px-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 rounded-full bg-gradient-to-br from-[#93C5FD] via-[#3B82F6] to-[#1E3A8A] shadow-[0_0_14px_rgba(59,130,246,0.7),inset_0_1px_2px_rgba(255,255,255,0.95)]" />
                  <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 rounded-full bg-gradient-to-br from-[#93C5FD] via-[#3B82F6] to-[#1E3A8A] shadow-[0_0_14px_rgba(59,130,246,0.7),inset_0_1px_2px_rgba(255,255,255,0.95)]" />
                </div>

                {/* Minutes Group */}
                <DigitGroup
                  value={minutes}
                  label="MINUTES"
                  warningLevel={warningLevel}
                  size="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[8rem]"
                />

                {/* 3D Glowing Spherical Glass Orbs (Colon) */}
                <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 pb-6 sm:pb-8 px-1 sm:px-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 rounded-full bg-gradient-to-br from-[#93C5FD] via-[#3B82F6] to-[#1E3A8A] shadow-[0_0_14px_rgba(59,130,246,0.7),inset_0_1px_2px_rgba(255,255,255,0.95)]" />
                  <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 rounded-full bg-gradient-to-br from-[#93C5FD] via-[#3B82F6] to-[#1E3A8A] shadow-[0_0_14px_rgba(59,130,246,0.7),inset_0_1px_2px_rgba(255,255,255,0.95)]" />
                </div>

                {/* Seconds Group */}
                <DigitGroup
                  value={seconds}
                  label="SECONDS"
                  warningLevel={warningLevel}
                  size="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[8rem]"
                />
              </div>

              {/* Warning Alert Banner (only shows when critical or warning, keeping panel pristine) */}
              {warningInfo?.message && (
                <div className="w-full flex items-center justify-center pt-2">
                  <span className="text-criticalRed font-orbitron font-bold text-xs sm:text-sm uppercase tracking-wider animate-pulse flex items-center gap-2 px-4 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                    <AlertTriangle className="w-4 h-4" />
                    {warningInfo.message}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* CONTENT STATE 2: PROBLEM STATEMENTS 1-5 (06–31s, 5s each) */}
          {/* ======================================================== */}
          {cyclePhase === 'STATEMENT' && currentStatement && (
            <div className="relative w-full h-full p-4 sm:p-6 md:p-8 flex flex-col justify-between animate-fade-in z-10">
              <ProblemStatementSlide
                key={currentStatement.id}
                statement={currentStatement}
                durationSeconds={5}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
