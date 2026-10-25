import React from 'react';
import { useHackathonTimer } from './hooks/useHackathonTimer';
import CollegeBackground from './components/CollegeBackground';
import VortexDust from './components/originkit/ui/vortex-dust';
import EventHeader from './components/EventHeader';
import InitialWelcomeScreen from './components/InitialWelcomeScreen';
import FullScreenPosterSlide from './components/FullScreenPosterSlide';
import MainPresentationStage from './components/MainPresentationStage';
import LaunchSequence from './components/LaunchSequence';
import CompletionScreen from './components/CompletionScreen';
import AdminControls from './components/AdminControls';
import { HACKATHON_CONFIG } from './data/hackathonData';

export default function App() {
  const {
    status,
    hours,
    minutes,
    seconds,
    remainingSeconds,
    elapsedSeconds,
    warningInfo,
    cyclePhase,
    cycleTime,
    activeStatementIndex,
    soundMuted,
    startLaunchSequence,
    completeLaunchAndStartEvent,
    togglePauseResume,
    resetTimer,
    jumpToTime,
    nextProblemStatement,
    toggleSound,
  } = useHackathonTimer();

  const isIdle = status === 'IDLE';
  const isLaunching = status === 'LAUNCHING';
  const isCompleted = status === 'COMPLETED';
  const isRunningOrPaused = status === 'RUNNING' || status === 'PAUSED';
  const isPosterActive = isRunningOrPaused && cyclePhase === 'POSTER';

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-iceBg text-iceText select-none">
      {/* 1. Holographic College Background */}
      <CollegeBackground isDimmed={isLaunching} />

      {/* 2. Originkit Vortex Dust: runs ONLY during the cinematic launch introduction */}
      {isLaunching && (
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden select-none transition-opacity duration-700">
          <VortexDust
            colorA="#FFFFFF"
            colorB="#8EB8E8"
            count={18}
            size={7}
            pull={10}
            speed={5}
            followPointer={false}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. INITIAL WELCOME SCREEN (status === 'IDLE')             */}
      {/* ======================================================== */}
      {isIdle && (
        <InitialWelcomeScreen onBegin={startLaunchSequence} />
      )}

      {/* ======================================================== */}
      {/* 4. CINEMATIC INTRODUCTION SEQUENCE (status === 'LAUNCHING')*/}
      {/* Controlled-pacing 7-stage sequence (~28.0s)              */}
      {/* ======================================================== */}
      {isLaunching && (
        <LaunchSequence onComplete={completeLaunchAndStartEvent} />
      )}

      {/* ======================================================== */}
      {/* 5. LIVE 47-SECOND PRESENTATION CYCLE (RUNNING / PAUSED)   */}
      {/* 00-15s: Phase A Live Countdown Timer in Ice Glass Stage  */}
      {/* 15-40s: Phase B Problem Statements 1-5 (5s each)         */}
      {/* 40-47s: Phase C Dedicated Full-Screen Poster Slide (7s)  */}
      {/* ======================================================== */}
      {isRunningOrPaused && (
        <>
          {/* Phase C: Dedicated True Full-Screen Poster Slide (40–47s) */}
          {/* Header, timer, stage, footer, and controls are hidden */}
          {isPosterActive && (
            <FullScreenPosterSlide isVisible={true} />
          )}

          {/* Phase A & B: Standard Live UI (00–40s: Timer & Problem Statements 1-5) */}
          {!isPosterActive && (
            <>
              {/* Top HUD Event Header */}
              <EventHeader status={status} />

              {/* Unified Enlarged Main Content Stage (88vw x 60vh, Crystal Ice Glass) */}
              <MainPresentationStage
                cyclePhase={cyclePhase}
                activeStatementIndex={activeStatementIndex}
                hours={hours}
                minutes={minutes}
                seconds={seconds}
                warningInfo={warningInfo}
                status={status}
              />

              {/* Bottom Status & Coordinator Footer Bar */}
              <footer className="fixed bottom-0 left-0 right-0 h-[4.5vh] z-30 px-6 bg-white/75 backdrop-blur-md border-t border-iceAccent/30 flex items-center justify-between text-[11px] font-rajdhani text-iceTextSecondary select-none shadow-sm">
                <div className="flex items-center gap-3">
                  <span>
                    <strong className="text-iceText">Convener:</strong> {HACKATHON_CONFIG.convener}
                  </span>
                  <span className="opacity-40">•</span>
                  <span>
                    <strong className="text-iceText">Faculty Coord:</strong> {HACKATHON_CONFIG.facultyCoordinator}
                  </span>
                  <span className="opacity-40">•</span>
                  <span>
                    <strong className="text-iceText">Co-Coord:</strong> {HACKATHON_CONFIG.coCoordinator}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-icePrimary font-mono font-bold tracking-wider">
                    {status === 'RUNNING'
                      ? `ELAPSED: ${Math.floor(elapsedSeconds / 60)}m ${elapsedSeconds % 60}s • 45s CYCLE [${cycleTime}s: ${cyclePhase}]`
                      : 'HACKATHON PAUSED'}
                  </span>
                </div>
              </footer>
            </>
          )}
        </>
      )}

      {/* ======================================================== */}
      {/* 6. EVENT COMPLETION SCREEN (at 00:00:00)                  */}
      {/* ======================================================== */}
      {isCompleted && (
        <CompletionScreen onReset={resetTimer} />
      )}

      {/* ======================================================== */}
      {/* 7. OPERATOR CONTROLS & KEYBOARD SHORTCUTS                 */}
      {/* Hidden during full-screen poster presentation slide       */}
      {/* ======================================================== */}
      <AdminControls
        status={status}
        soundMuted={soundMuted}
        onBegin={startLaunchSequence}
        onTogglePause={togglePauseResume}
        onReset={resetTimer}
        onNextStatement={nextProblemStatement}
        onToggleSound={toggleSound}
        onJumpToTime={jumpToTime}
        isHidden={isPosterActive}
      />
    </div>
  );
}
