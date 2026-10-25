import React from 'react';
import DigitGroup from './DigitGroup';
import { Play, Pause, AlertTriangle } from 'lucide-react';

export default function GlassTimer({
  hours,
  minutes,
  seconds,
  status,
  warningInfo,
  onBegin,
  onTogglePause,
  isLiveOnlyPhase = false,
}) {
  const isIdle = status === 'IDLE';
  const isPaused = status === 'PAUSED';
  const warningLevel = warningInfo?.level || 'normal';

  // Dynamic glass panel styling based on warning level
  const getPanelClass = () => {
    if (warningLevel === 'critical' || warningLevel === 'red') {
      return 'timer-glass-panel-red border-red-500/50 shadow-red-glow animate-pulse-slow';
    }
    if (warningLevel === 'warning' || warningLevel === 'amber') {
      return 'timer-glass-panel-amber border-amber-500/50 shadow-amber-glow';
    }
    return 'timer-glass-panel border-cyan-400/35 shadow-cyan-glow';
  };

  const getColonClass = () => {
    if (warningLevel === 'critical' || warningLevel === 'red') {
      return 'text-criticalRed/60';
    }
    if (warningLevel === 'warning' || warningLevel === 'amber') {
      return 'text-warningAmber/60';
    }
    return 'text-electricCyan/50';
  };

  // ==========================================================
  // FORMAT A: LIVE TIMER-ONLY PHASE (31–40s in the 40s cycle)
  // Prominently centered in the upper sky area
  // ==========================================================
  if (isLiveOnlyPhase) {
    return (
      <div
        className="fixed z-20 flex items-center justify-center select-none animate-fade-in"
        style={{
          left: '20vw',
          top: '11vh',
          width: '60vw',
          height: '32vh',
        }}
      >
        <div
          className={`relative w-full h-full rounded-3xl ${getPanelClass()} px-6 sm:px-12 py-5 sm:py-6 flex flex-col items-center justify-between transition-all duration-700 overflow-hidden`}
        >
          {/* Subtle Glass Top Reflection Sheen */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.08] via-transparent to-transparent pointer-events-none rounded-t-3xl" />

          {/* Thin Futuristic Corner Accents */}
          <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-electricCyan/70 pointer-events-none" />
          <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-electricCyan/70 pointer-events-none" />
          <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-electricCyan/70 pointer-events-none" />
          <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-electricCyan/70 pointer-events-none" />

          {/* Top Label & Status */}
          <div className="flex items-center gap-3 relative z-10">
            <span
              className={`w-2 h-2 rounded-full ${
                isPaused ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'
              } shadow-cyan-glow`}
            />
            <span className="text-xs sm:text-sm font-rajdhani font-bold tracking-[0.28em] uppercase text-softIce">
              HACKATHON TIME REMAINING
            </span>
            {isPaused && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-rajdhani font-bold bg-amber-500/20 text-warningAmber border border-amber-500/40">
                PAUSED
              </span>
            )}
          </div>

          {/* Unified Floating Digits Display: 04 : 59 : 43 */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-8 my-auto relative z-10">
            {/* Hours Group */}
            <DigitGroup
              value={hours}
              label="HOURS"
              warningLevel={warningLevel}
              size="text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
            />

            {/* Stationary Colon */}
            <div className="flex flex-col items-center justify-center pb-6">
              <span
                className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-mono font-bold select-none ${getColonClass()} transition-colors duration-500`}
              >
                :
              </span>
            </div>

            {/* Minutes Group */}
            <DigitGroup
              value={minutes}
              label="MINUTES"
              warningLevel={warningLevel}
              size="text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
            />

            {/* Stationary Colon */}
            <div className="flex flex-col items-center justify-center pb-6">
              <span
                className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-mono font-bold select-none ${getColonClass()} transition-colors duration-500`}
              >
                :
              </span>
            </div>

            {/* Seconds Group */}
            <DigitGroup
              value={seconds}
              label="SECONDS"
              warningLevel={warningLevel}
              size="text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
            />
          </div>

          {/* Bottom Bar: Engine Status & Active Warnings */}
          <div className="w-full flex items-center justify-between pt-2 border-t border-white/10 text-[10px] sm:text-xs font-rajdhani relative z-10">
            <span className="text-quantumTeal uppercase tracking-widest flex items-center gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-quantumTeal animate-ping" />
              LIVE COUNTDOWN PHASE (31–40s) • 18,000s ENGINE
            </span>
            {warningInfo?.message && (
              <span className="text-criticalRed font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {warningInfo.message}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // FORMAT B: INITIAL WELCOME SCREEN (status === 'IDLE')
  // Unified glass panel positioned below the welcome poster
  // ==========================================================
  return (
    <div
      className="fixed z-20 flex items-center justify-center select-none animate-fade-in"
      style={{
        left: '21vw',
        top: '44vh',
        width: '58vw',
        height: '9.5vh',
      }}
    >
      <div
        className={`relative w-full h-full rounded-2xl ${getPanelClass()} px-5 sm:px-8 flex items-center justify-between transition-all duration-700 shadow-2xl overflow-hidden`}
      >
        {/* Subtle Glass Top Sheen */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.08] via-transparent to-transparent pointer-events-none rounded-t-2xl" />

        {/* Thin Corner Accents */}
        <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-electricCyan/70 pointer-events-none" />
        <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-electricCyan/70 pointer-events-none" />
        <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-electricCyan/70 pointer-events-none" />
        <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-electricCyan/70 pointer-events-none" />

        {/* Left Section: Time Remaining Label */}
        <div className="flex flex-col justify-center min-w-[130px] sm:min-w-[170px] relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-cyan-glow" />
            <span className="text-[10px] sm:text-xs font-rajdhani font-bold tracking-[0.24em] uppercase text-softIce">
              HACKATHON TIME REMAINING
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] font-rajdhani font-medium text-quantumTeal tracking-wider mt-0.5">
            5-HOUR SYNCHRONIZED CLOCK
          </span>
        </div>

        {/* Center: Floating Digits Display (05 : 00 : 00) */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 relative z-10">
          <DigitGroup
            value={hours}
            label="HOURS"
            warningLevel={warningLevel}
            size="text-2xl sm:text-3xl md:text-4xl"
          />

          <div className="flex flex-col items-center justify-center pb-4">
            <span className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold select-none text-electricCyan/50">
              :
            </span>
          </div>

          <DigitGroup
            value={minutes}
            label="MINUTES"
            warningLevel={warningLevel}
            size="text-2xl sm:text-3xl md:text-4xl"
          />

          <div className="flex flex-col items-center justify-center pb-4">
            <span className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold select-none text-electricCyan/50">
              :
            </span>
          </div>

          <DigitGroup
            value={seconds}
            label="SECONDS"
            warningLevel={warningLevel}
            size="text-2xl sm:text-3xl md:text-4xl"
          />
        </div>

        {/* Right Section: Prominent BEGIN HACKATHON Action Button */}
        <div className="flex items-center justify-end min-w-[120px] sm:min-w-[160px] relative z-10">
          {isIdle ? (
            <button
              onClick={onBegin}
              className="group relative inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-orbitron font-bold uppercase tracking-widest text-midnight bg-gradient-to-r from-electricCyan via-quantumTeal to-electricCyan rounded-xl shadow-cyan-glow hover:shadow-[0_0_35px_rgba(0,229,255,0.9)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform" />
              <Play className="w-3.5 h-3.5 fill-current text-midnight" />
              <span>BEGIN HACKATHON</span>
            </button>
          ) : (
            <button
              onClick={onTogglePause}
              className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-rajdhani font-bold border transition-colors cursor-pointer ${
                isPaused
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 hover:bg-emerald-500/30'
                  : 'bg-white/5 border-white/20 text-softIce hover:border-cyan-400 hover:text-electricCyan'
              }`}
              title="Pause/Resume countdown [Space]"
            >
              {isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3 fill-current" />}
              <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
