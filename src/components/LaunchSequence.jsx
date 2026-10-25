import React, { useState, useEffect } from 'react';
import { HACKATHON_CONFIG } from '../data/hackathonData';
import { Cpu, Award, Users, Calendar, Clock, MapPin, Zap, ShieldCheck } from 'lucide-react';

/**
 * LaunchSequence:
 * Advanced Controlled-Pacing Cinematic Launch Sequence (~28.0s total) in Ice Glass Theme:
 *
 * Stage 1: Digital Activation (0.0s – 2.0s)
 *          "INITIALIZING HACKATHON SYSTEM" -> "MIC TECH-HACK 2K26"
 * Stage 2: Event Identity (2.0s – 5.0s)
 *          "MIC TECH-HACK 2K26", "A 5-HOUR HACKATHON", Dept of AI & ML
 * Stage 3: All 3 Officials Together (5.0s – 9.0s)
 *          "MEET THE ORGANIZERS" with Convener, Faculty Coord, Co-Coord simultaneously
 * Stage 4: Event Details Together (9.0s – 13.0s)
 *          Date, Time, Duration, Venue, Department together in balanced translucent layout
 * Stage 5: Circular College Logo Reveal (13.0s – 16.0s)
 *          EXACTLY 3.0s duration! 3D Y-axis spinning medallion with official transparent logo
 * Stage 6: Exact 3-Second Numerical Countdown (16.0s – 25.0s)
 *          EXACTLY 9.0s total: 3.0s for '3', 3.0s for '2', 3.0s for '1'
 * Stage 7: Grand Announcement (25.0s – 28.0s)
 *          "MIC TECH-HACK 2K26" -> "HACKATHON BEGINS NOW" + energy ring
 * At 28.0s -> onComplete() transitions directly to the live event display.
 */
export default function LaunchSequence({ onComplete }) {
  const [stage, setStage] = useState(1);
  const [stage1Title, setStage1Title] = useState('INITIALIZING HACKATHON SYSTEM');
  const [countdownNum, setCountdownNum] = useState(3);
  const [countdownProgress, setCountdownProgress] = useState(1); // 1 to 0 for circular progress
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Stage 1: Digital Activation (0.0s – 1.6s)
    const tStage1Text = setTimeout(() => {
      setStage1Title('MIC TECH-HACK 2K26');
    }, 800);

    // Stage 2: Event Identity (1.6s – 3.6s, ~2.0s hold)
    const tStage2 = setTimeout(() => {
      setStage(2);
    }, 1600);

    // Stage 3: All 3 Officials Together (3.6s – 5.8s, ~2.2s readable hold)
    const tStage3 = setTimeout(() => {
      setStage(3);
    }, 3600);

    // Stage 4: Event Details Together (5.8s – 8.0s, ~2.2s readable hold)
    const tStage4 = setTimeout(() => {
      setStage(4);
    }, 5800);

    // Stage 5: Circular College Logo Reveal (8.0s – 10.2s, ~2.2s hold)
    const tStage5 = setTimeout(() => {
      setStage(5);
    }, 8000);

    // Stage 6: Exact 3-Second Numerical Countdown (10.2s – 19.2s, exactly 9.0s total: 3.0s for 3, 3.0s for 2, 3.0s for 1)
    const tStage6_3 = setTimeout(() => {
      setStage(6);
      setCountdownNum(3);
    }, 10200);

    const tStage6_2 = setTimeout(() => {
      setCountdownNum(2);
    }, 13200);

    const tStage6_1 = setTimeout(() => {
      setCountdownNum(1);
    }, 16200);

    // Stage 7: Grand Begin Announcement (19.2s – 21.8s, ~2.6s)
    const tStage7 = setTimeout(() => {
      setStage(7);
    }, 19200);

    // Fade out and complete at 21.8s
    const tFade = setTimeout(() => {
      setIsFadingOut(true);
    }, 21400);

    const tComplete = setTimeout(() => {
      onComplete();
    }, 21800);

    return () => {
      clearTimeout(tStage1Text);
      clearTimeout(tStage2);
      clearTimeout(tStage3);
      clearTimeout(tStage4);
      clearTimeout(tStage5);
      clearTimeout(tStage6_3);
      clearTimeout(tStage6_2);
      clearTimeout(tStage6_1);
      clearTimeout(tStage7);
      clearTimeout(tFade);
      clearTimeout(tComplete);
    };
  }, [onComplete]);

  // Countdown 3-second progress timer animation
  useEffect(() => {
    if (stage !== 6) return;
    setCountdownProgress(1);
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const rem = Math.max(0, 1 - elapsed / 3000);
      setCountdownProgress(rem);
    }, 50);
    return () => clearInterval(interval);
  }, [stage, countdownNum]);

  return (
    <div
      className={`fixed inset-0 z-40 bg-iceBg/85 backdrop-blur-md flex items-center justify-center p-6 select-none transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background Ambient Ice Glow & Grid */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(142, 184, 232, 0.25) 0%, rgba(220, 232, 245, 0.6) 60%, rgba(244, 248, 252, 0.95) 100%)',
        }}
      />
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

      {/* Cyber Corner HUD Brackets in Ice Primary */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-icePrimary pointer-events-none opacity-70" />
      <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-icePrimary pointer-events-none opacity-70" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-icePrimary pointer-events-none opacity-70" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-icePrimary pointer-events-none opacity-70" />

      {/* ======================================================== */}
      {/* STAGE 1: DIGITAL ACTIVATION (0.0s – 2.0s)                */}
      {/* ======================================================== */}
      {stage === 1 && (
        <div className="flex flex-col items-center justify-center text-center animate-fade-in max-w-2xl">
          <div className="relative mb-6">
            <Cpu className="w-16 h-16 sm:w-20 sm:h-20 text-icePrimary animate-pulse-fast drop-shadow-[0_4px_16px_rgba(56,121,201,0.4)]" />
            <div className="absolute inset-0 rounded-full bg-iceAccent/20 blur-xl animate-ping" />
          </div>

          <h2 className="text-xs sm:text-sm font-rajdhani font-bold tracking-[0.4em] uppercase text-icePrimary mb-2">
            SYSTEM BOOT & DIGITAL INITIALIZATION
          </h2>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-orbitron font-extrabold text-iceText tracking-wider drop-shadow-sm">
            {stage1Title}
          </h1>

          {/* Animated Circuit Progress Line */}
          <div className="w-64 sm:w-80 h-1.5 bg-iceSurface rounded-full mt-6 overflow-hidden border border-iceAccent/40">
            <div className="h-full bg-gradient-to-r from-icePrimary to-iceAccent animate-pulse" style={{ width: '100%' }} />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE 2: EVENT IDENTITY (2.0s – 5.0s)                    */}
      {/* ======================================================== */}
      {stage === 2 && (
        <div className="flex flex-col items-center justify-center text-center animate-fade-in max-w-4xl px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-iceAccent/50 shadow-ice-glass mb-4">
            <span className="w-2 h-2 rounded-full bg-icePrimary animate-ping" />
            <span className="text-xs sm:text-sm font-rajdhani font-bold tracking-[0.3em] uppercase text-icePrimary">
              DEPARTMENT OF ARTIFICIAL INTELLIGENCE & MACHINE LEARNING
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-orbitron font-black text-iceText tracking-wider drop-shadow-sm mb-3">
            MIC TECH-HACK 2K26
          </h1>

          <div className="text-lg sm:text-2xl md:text-3xl font-orbitron font-extrabold text-icePrimary tracking-widest uppercase mb-4">
            A 5-HOUR HACKATHON
          </div>

          <p className="text-sm sm:text-base md:text-lg font-rajdhani font-bold text-iceTextSecondary max-w-2xl leading-relaxed">
            {HACKATHON_CONFIG.tagline}
          </p>

          <div className="mt-6 text-xs sm:text-sm font-rajdhani font-bold text-iceText tracking-wider">
            {HACKATHON_CONFIG.college}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE 3: ALL 3 OFFICIALS TOGETHER (5.0s – 9.0s)          */}
      {/* Balanced 3-column composition visible simultaneously     */}
      {/* ======================================================== */}
      {stage === 3 && (
        <div className="flex flex-col items-center justify-center text-center animate-fade-in w-full max-w-6xl px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/80 border border-iceAccent/40 mb-3 shadow-sm">
            <Users className="w-4 h-4 text-icePrimary" />
            <span className="text-xs sm:text-sm font-orbitron font-bold text-icePrimary uppercase tracking-widest">
              MEET THE ORGANIZERS
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-orbitron font-black text-iceText tracking-wider drop-shadow-sm mb-8">
            LEADERSHIP & COORDINATION
          </h2>

          {/* 3 Officials in One Balanced Glass Composition */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 w-full">
            {/* Convener */}
            <div className="relative rounded-2xl bg-white/60 backdrop-blur-md p-6 border border-iceAccent/40 flex flex-col items-center justify-between text-center shadow-ice-glass transition-transform hover:scale-[1.02]">
              <div className="w-14 h-14 rounded-full bg-icePrimary/15 border-2 border-icePrimary flex items-center justify-center text-icePrimary mb-4 shadow-sm">
                <Award className="w-7 h-7" />
              </div>
              <span className="px-3 py-0.5 rounded-full text-[11px] font-orbitron font-extrabold bg-icePrimary text-white tracking-wider uppercase mb-2">
                CONVENER
              </span>
              <h3 className="text-xl sm:text-2xl font-orbitron font-bold text-iceText mb-1">
                Dr. Bala Murali Krishna
              </h3>
              <p className="text-sm font-rajdhani font-bold text-icePrimary uppercase tracking-wider">
                Professor & Head
              </p>
              <span className="text-xs font-rajdhani font-semibold text-iceTextMuted mt-2">
                Dept of AI & ML
              </span>
            </div>

            {/* Faculty Coordinator */}
            <div className="relative rounded-2xl bg-white/60 backdrop-blur-md p-6 border border-iceAccent/40 flex flex-col items-center justify-between text-center shadow-ice-glass transition-transform hover:scale-[1.02]">
              <div className="w-14 h-14 rounded-full bg-iceAccent/30 border-2 border-icePrimary flex items-center justify-center text-icePrimary mb-4 shadow-sm">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <span className="px-3 py-0.5 rounded-full text-[11px] font-orbitron font-extrabold bg-icePrimary text-white tracking-wider uppercase mb-2">
                FACULTY COORDINATOR
              </span>
              <h3 className="text-xl sm:text-2xl font-orbitron font-bold text-iceText mb-1">
                Sayyed Nagulmeera
              </h3>
              <p className="text-sm font-rajdhani font-bold text-icePrimary uppercase tracking-wider">
                Assistant Professor
              </p>
              <span className="text-xs font-rajdhani font-semibold text-iceTextMuted mt-2">
                Dept of AI & ML
              </span>
            </div>

            {/* Co-Coordinator */}
            <div className="relative rounded-2xl bg-white/60 backdrop-blur-md p-6 border border-iceAccent/40 flex flex-col items-center justify-between text-center shadow-ice-glass transition-transform hover:scale-[1.02]">
              <div className="w-14 h-14 rounded-full bg-icePrimary/15 border-2 border-icePrimary flex items-center justify-center text-icePrimary mb-4 shadow-sm">
                <Zap className="w-7 h-7" />
              </div>
              <span className="px-3 py-0.5 rounded-full text-[11px] font-orbitron font-extrabold bg-icePrimary text-white tracking-wider uppercase mb-2">
                CO-COORDINATOR
              </span>
              <h3 className="text-xl sm:text-2xl font-orbitron font-bold text-iceText mb-1">
                M. Chaitanya
              </h3>
              <p className="text-sm font-rajdhani font-bold text-icePrimary uppercase tracking-wider">
                Assistant Professor
              </p>
              <span className="text-xs font-rajdhani font-semibold text-iceTextMuted mt-2">
                Dept of AI & ML
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE 4: EVENT DETAILS TOGETHER (9.0s – 13.0s)           */}
      {/* ======================================================== */}
      {stage === 4 && (
        <div className="flex flex-col items-center justify-center text-center animate-fade-in w-full max-w-5xl px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/80 border border-iceAccent/40 mb-3 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-icePrimary animate-ping" />
            <span className="text-xs sm:text-sm font-orbitron font-bold text-icePrimary uppercase tracking-widest">
              OFFICIAL EVENT SPECIFICATIONS
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-orbitron font-black text-iceText tracking-wider drop-shadow-sm mb-8">
            SCHEDULE & LOCATION
          </h2>

          {/* 4 Balanced Glass Detail Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full mb-6">
            {/* Date */}
            <div className="rounded-2xl bg-white/65 backdrop-blur-md p-5 border border-iceAccent/40 flex flex-col items-center text-center shadow-ice-glass">
              <Calendar className="w-8 h-8 text-icePrimary mb-2" />
              <span className="text-[11px] font-rajdhani font-bold text-iceTextMuted uppercase tracking-wider">
                EVENT DATE
              </span>
              <span className="text-lg sm:text-xl font-orbitron font-extrabold text-iceText mt-1">
                {HACKATHON_CONFIG.eventDate}
              </span>
              <span className="text-xs font-rajdhani font-bold text-icePrimary mt-0.5">
                OCTOBER 2026
              </span>
            </div>

            {/* Time */}
            <div className="rounded-2xl bg-white/65 backdrop-blur-md p-5 border border-iceAccent/40 flex flex-col items-center text-center shadow-ice-glass">
              <Clock className="w-8 h-8 text-icePrimary mb-2" />
              <span className="text-[11px] font-rajdhani font-bold text-iceTextMuted uppercase tracking-wider">
                TIMINGS
              </span>
              <span className="text-lg sm:text-xl font-orbitron font-extrabold text-iceText mt-1">
                9:30 AM – 2:30 PM
              </span>
              <span className="text-xs font-rajdhani font-bold text-icePrimary mt-0.5">
                5 HOURS DURATION
              </span>
            </div>

            {/* Venue */}
            <div className="rounded-2xl bg-white/65 backdrop-blur-md p-5 border border-iceAccent/40 flex flex-col items-center text-center shadow-ice-glass">
              <MapPin className="w-8 h-8 text-icePrimary mb-2" />
              <span className="text-[11px] font-rajdhani font-bold text-iceTextMuted uppercase tracking-wider">
                VENUE
              </span>
              <span className="text-lg sm:text-xl font-orbitron font-extrabold text-iceText mt-1">
                EEE SEMINAR HALL
              </span>
              <span className="text-xs font-rajdhani font-bold text-icePrimary mt-0.5">
                MIC CAMPUS
              </span>
            </div>

            {/* Duration */}
            <div className="rounded-2xl bg-white/65 backdrop-blur-md p-5 border border-iceAccent/40 flex flex-col items-center text-center shadow-ice-glass">
              <Zap className="w-8 h-8 text-icePrimary mb-2" />
              <span className="text-[11px] font-rajdhani font-bold text-iceTextMuted uppercase tracking-wider">
                TOTAL TIME
              </span>
              <span className="text-lg sm:text-xl font-orbitron font-extrabold text-iceText mt-1">
                18,000 SECONDS
              </span>
              <span className="text-xs font-rajdhani font-bold text-icePrimary mt-0.5">
                COUNTDOWN ENGINE
              </span>
            </div>
          </div>

          <div className="text-xs sm:text-sm font-rajdhani font-medium text-iceText bg-white/70 rounded-xl px-5 py-2.5 border border-iceAccent/30 shadow-sm">
            <strong className="text-icePrimary">Institution:</strong> {HACKATHON_CONFIG.college} — {HACKATHON_CONFIG.location}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE 5: CIRCULAR COLLEGE LOGO REVEAL (13.0s – 16.0s)    */}
      {/* EXACTLY 3.0 SECONDS DURATION!                            */}
      {/* ======================================================== */}
      {stage === 5 && (
        <div className="flex flex-col items-center justify-center text-center animate-fade-in max-w-3xl px-4">
          <div className="text-xs sm:text-sm font-orbitron font-bold text-icePrimary uppercase tracking-[0.3em] mb-4">
            INSTITUTIONAL IDENTITY
          </div>

          {/* 3D Spinning Circular Medallion Frame */}
          <div
            className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full flex items-center justify-center p-4 mb-6"
            style={{
              perspective: '1000px',
            }}
          >
            {/* Luminous Neon Border Ring */}
            <div
              className="absolute inset-0 rounded-full border-2 border-icePrimary shadow-[0_0_35px_rgba(56,121,201,0.4)]"
              style={{
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
            {/* Outer Subtle Accent Ring */}
            <div className="absolute -inset-2 rounded-full border border-iceAccent/40 animate-ping opacity-30 pointer-events-none" />

            {/* Inner Medallion Backdrop */}
            <div className="absolute inset-2 rounded-full bg-white/80 backdrop-blur-xl border border-iceAccent/50 shadow-inner" />

            {/* 3D Y-Axis Flipping Logo */}
            <div
              className="relative w-full h-full flex items-center justify-center p-3"
              style={{
                animation: 'logo3DFlip 3.0s ease-in-out forwards',
                transformStyle: 'preserve-3d',
              }}
            >
              <img
                src="/mic-logo.png"
                alt="MIC College of Technology Logo"
                className="max-w-[85%] max-h-[85%] object-contain filter drop-shadow-[0_4px_16px_rgba(56,121,201,0.35)]"
              />
            </div>
          </div>

          <h2 className="text-xl sm:text-3xl font-orbitron font-black text-iceText tracking-wider mb-2 drop-shadow-sm">
            DVR & Dr. HS MIC COLLEGE OF TECHNOLOGY
          </h2>
          <p className="text-xs sm:text-sm md:text-base font-rajdhani font-bold text-icePrimary uppercase tracking-widest">
            AUTONOMOUS • APPROVED BY AICTE • ACCREDITED BY NAAC WITH GRADE A+
          </p>

          <style>{`
            @keyframes logo3DFlip {
              0% {
                transform: rotateY(0deg) scale(0.9);
                opacity: 0.2;
              }
              50% {
                transform: rotateY(180deg) scale(1.08);
                opacity: 1;
              }
              100% {
                transform: rotateY(360deg) scale(1.0);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE 6: SINGLE CENTERED LOGO-BASED 3, 2, 1 COUNTDOWN    */}
      {/* EXACTLY 9.0s TOTAL (3.0s for 3, 3.0s for 2, 3.0s for 1)  */}
      {/* Single centered circular medallion:                      */}
      {/* 1. College logo visibly appears at start of each number   */}
      {/* 2. Performs smooth 3D Y-axis flip                        */}
      {/* 3. Reveals number in same central position & holds        */}
      {/* ======================================================== */}
      {stage === 6 && (
        <div className="flex flex-col items-center justify-center text-center animate-fade-in w-full max-w-2xl px-4">
          <div className="text-xs sm:text-sm md:text-base font-orbitron font-bold text-icePrimary uppercase tracking-[0.4em] mb-6">
            FINAL LAUNCH COUNTDOWN
          </div>

          {/* SINGLE CENTERED CIRCULAR MEDALLION */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full flex items-center justify-center p-3 select-none">
            {/* SVG 3-Second Radial Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="rgba(142, 184, 232, 0.25)"
                strokeWidth="3.5"
              />
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#3879C9"
                strokeWidth="4.5"
                strokeDasharray={2 * Math.PI * 46}
                strokeDashoffset={2 * Math.PI * 46 * (1 - countdownProgress)}
                strokeLinecap="round"
                className="transition-all duration-75"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(56, 121, 201, 0.55))',
                }}
              />
            </svg>

            {/* Translucent White Glass Frame */}
            <div className="absolute inset-2.5 rounded-full bg-white/75 backdrop-blur-xl border border-white/65 shadow-[0_16px_50px_rgba(56,121,201,0.20)]" />
            <div className="absolute inset-3.5 rounded-full border border-iceAccent/40 pointer-events-none" />

            {/* Inner 3D Flipping Content (Keyed to countdownNum so logo visibly returns & flips on each number) */}
            <div
              key={`medallion-flip-${countdownNum}`}
              className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full flex items-center justify-center"
              style={{
                perspective: '1200px',
              }}
            >
              <div
                className="relative w-full h-full rounded-full"
                style={{
                  transformStyle: 'preserve-3d',
                  animation: 'medallionFlipCycle 3000ms cubic-bezier(0.3, 0, 0.2, 1) forwards',
                }}
              >
                {/* FRONT FACE: Authentic College Logo (Visibly returns before each flip) */}
                <div
                  className="absolute inset-0 w-full h-full rounded-full flex flex-col items-center justify-center p-6"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(0deg)',
                  }}
                >
                  <img
                    src="/mic-logo.png"
                    alt="MIC College Logo"
                    className="max-w-[90%] max-h-[90%] object-contain filter drop-shadow-[0_4px_16px_rgba(56,121,201,0.30)]"
                  />
                </div>

                {/* BACK FACE: Revealed Number in the exact same central position */}
                <div
                  className="absolute inset-0 w-full h-full rounded-full flex flex-col items-center justify-center text-center"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <span className="text-8xl sm:text-9xl md:text-[10rem] font-orbitron font-black text-iceText select-none leading-none drop-shadow-[0_4px_20px_rgba(56,121,201,0.35)]">
                    {countdownNum}
                  </span>
                  <span className="text-[10px] sm:text-xs font-rajdhani font-bold text-icePrimary uppercase tracking-widest mt-1">
                    STAGE {4 - countdownNum} OF 3
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-xs sm:text-sm font-mono font-bold text-iceTextSecondary tracking-widest uppercase">
            DVR & Dr. HS MIC COLLEGE OF TECHNOLOGY • COMMENCING IN {countdownNum} SECONDS
          </div>

          <style>{`
            @keyframes medallionFlipCycle {
              0% {
                transform: rotateY(0deg);
              }
              18% {
                transform: rotateY(0deg);
              }
              45% {
                transform: rotateY(180deg);
              }
              100% {
                transform: rotateY(180deg);
              }
            }
          `}</style>
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE 7: GRAND BEGIN ANNOUNCEMENT (25.0s – 28.0s)        */}
      {/* ======================================================== */}
      {stage === 7 && (
        <div className="flex flex-col items-center justify-center text-center animate-fade-in max-w-4xl px-4">
          {/* Ice Shockwave Ring */}
          <div
            className="absolute rounded-full border-2 border-icePrimary pointer-events-none"
            style={{
              animation: 'energyShockwave 2.2s cubic-bezier(0.1, 0.8, 0.2, 1) forwards',
            }}
          />

          <div className="text-sm sm:text-lg md:text-xl font-orbitron font-bold text-icePrimary uppercase tracking-[0.4em] mb-4">
            THE WAIT IS OVER
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-orbitron font-black text-iceText tracking-wider drop-shadow-sm mb-4">
            MIC TECH-HACK 2K26
          </h2>

          <div className="px-8 py-3.5 rounded-2xl bg-white/80 border-2 border-icePrimary shadow-[0_10px_40px_rgba(56,121,201,0.25)] animate-pulse-fast">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-orbitron font-black text-icePrimary tracking-widest uppercase">
              HACKATHON BEGINS NOW
            </h1>
          </div>

          <div className="mt-8 text-sm sm:text-base font-rajdhani font-bold text-icePrimary uppercase tracking-widest animate-bounce">
            INITIALIZING LIVE AUDITORIUM PRESENTATION SYSTEM...
          </div>

          <style>{`
            @keyframes energyShockwave {
              0% {
                width: 50px;
                height: 50px;
                opacity: 1;
                box-shadow: 0 0 20px #8EB8E8;
              }
              100% {
                width: 900px;
                height: 900px;
                opacity: 0;
                box-shadow: 0 0 80px #3879C9;
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
