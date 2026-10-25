import React, { useState, useEffect } from 'react';
import {
  Settings,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  FastForward,
  ChevronRight,
  AlertTriangle,
  X,
  Clock,
  Layers,
} from 'lucide-react';

export default function AdminControls({
  status,
  soundMuted,
  onBegin,
  onTogglePause,
  onReset,
  onNextStatement,
  onToggleSound,
  onJumpToTime,
  isHidden = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        return;
      }

      // Space: Pause / Resume
      if (e.code === 'Space') {
        e.preventDefault();
        if (status === 'RUNNING' || status === 'PAUSED') {
          onTogglePause();
        }
      }

      // F: Toggle Fullscreen
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }

      // N: Next Problem Statement
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        onNextStatement();
      }

      // R: Reset confirmation
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setShowResetConfirm(true);
      }

      // M: Sound mute/unmute
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        onToggleSound();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, onTogglePause, onNextStatement, onToggleSound]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (isHidden) return null;

  return (
    <>
      {/* Floating Discrete Toggle Button in Bottom-Right */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={toggleFullscreen}
          className="p-2.5 rounded-full glass-panel hover:border-icePrimary text-iceText hover:text-icePrimary transition-all duration-300 shadow-lg cursor-pointer"
          title="Toggle Fullscreen (F)"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2.5 rounded-full glass-panel border ${isOpen ? 'border-icePrimary text-icePrimary shadow-ice-primary' : 'hover:border-icePrimary text-iceText'} transition-all duration-300 shadow-lg cursor-pointer flex items-center gap-1.5`}
          title="Open Operator Controls"
        >
          <Settings className={`w-4 h-4 ${isOpen ? 'rotate-90' : ''} transition-transform duration-300`} />
          <span className="text-xs font-rajdhani font-bold tracking-wider hidden sm:inline">
            OPERATOR
          </span>
        </button>
      </div>

      {/* Operator Drawer / Modal Panel */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 z-40 w-80 sm:w-96 bg-white/95 rounded-2xl p-5 border border-iceAccent/50 shadow-2xl backdrop-blur-2xl text-iceText animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-iceAccent/30">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-icePrimary animate-pulse" />
              <h4 className="text-sm font-orbitron font-bold text-iceText tracking-wider uppercase">
                Operator Console
              </h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-iceSurface text-iceTextSecondary hover:text-iceText transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Primary State Actions */}
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-2 gap-2">
              {status === 'IDLE' ? (
                <button
                  onClick={() => {
                    onBegin();
                    setIsOpen(false);
                  }}
                  className="col-span-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-orbitron text-xs font-bold bg-icePrimary text-white shadow-ice-primary hover:brightness-110 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>START HACKATHON</span>
                </button>
              ) : (
                <button
                  onClick={onTogglePause}
                  disabled={status === 'COMPLETED'}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-rajdhani text-xs font-bold border transition-colors cursor-pointer ${
                    status === 'PAUSED'
                      ? 'bg-emerald-500/15 border-emerald-400 text-emerald-700'
                      : 'bg-amber-500/15 border-amber-400 text-amber-700'
                  }`}
                >
                  {status === 'PAUSED' ? (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>RESUME [Space]</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>PAUSE [Space]</span>
                    </>
                  )}
                </button>
              )}

              {status !== 'IDLE' && (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-rajdhani text-xs font-bold bg-rose-500/15 border border-rose-500/40 text-rose-700 hover:bg-rose-500/25 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESET [R]</span>
                </button>
              )}
            </div>

            <button
              onClick={onNextStatement}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-rajdhani text-xs font-bold glass-panel hover:border-icePrimary text-iceText hover:text-icePrimary transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-icePrimary" />
              <span>Next Problem Statement [N]</span>
            </button>
          </div>

          {/* Operator Fast-Forward Testing Shortcuts */}
          <div className="pt-3 border-t border-iceAccent/30">
            <div className="text-[11px] font-rajdhani font-bold text-iceTextSecondary tracking-wider uppercase mb-2 flex items-center gap-1.5">
              <FastForward className="w-3 h-3 text-icePrimary" />
              <span>Simulation / Demo Jump</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => onJumpToTime(3600)}
                className="py-1 px-2 rounded-lg text-[10px] font-mono glass-panel hover:bg-iceSurface border border-iceAccent/30 text-amber-700 hover:border-amber-400 transition-colors text-left font-bold"
              >
                Jump: 60m (Amber)
              </button>
              <button
                onClick={() => onJumpToTime(1800)}
                className="py-1 px-2 rounded-lg text-[10px] font-mono glass-panel hover:bg-iceSurface border border-iceAccent/30 text-rose-700 hover:border-red-400 transition-colors text-left font-bold"
              >
                Jump: 30m (Red)
              </button>
              <button
                onClick={() => onJumpToTime(300)}
                className="py-1 px-2 rounded-lg text-[10px] font-mono glass-panel hover:bg-iceSurface border border-iceAccent/30 text-rose-700 hover:border-red-400 transition-colors text-left font-bold"
              >
                Jump: 5m (Critical)
              </button>
              <button
                onClick={() => onJumpToTime(10)}
                className="py-1 px-2 rounded-lg text-[10px] font-mono glass-panel hover:bg-iceSurface border border-iceAccent/30 text-icePrimary hover:border-icePrimary transition-colors text-left font-bold"
              >
                Jump: 10s (Finish)
              </button>
            </div>
          </div>

          {/* Keyboard Shortcuts Cheatsheet */}
          <div className="mt-4 pt-3 border-t border-iceAccent/30 text-[10px] font-rajdhani text-iceTextSecondary space-y-1 font-medium">
            <div className="flex justify-between">
              <span>Pause / Resume</span>
              <kbd className="px-1.5 py-0.5 rounded bg-iceSurface border border-iceAccent/40 text-iceText font-bold">Space</kbd>
            </div>
            <div className="flex justify-between">
              <span>Fullscreen</span>
              <kbd className="px-1.5 py-0.5 rounded bg-midnight border border-white/10 text-white">F</kbd>
            </div>
            <div className="flex justify-between">
              <span>Next Statement</span>
              <kbd className="px-1.5 py-0.5 rounded bg-midnight border border-white/10 text-white">N</kbd>
            </div>
            <div className="flex justify-between">
              <span>Mute Audio</span>
              <kbd className="px-1.5 py-0.5 rounded bg-midnight border border-white/10 text-white">M</kbd>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Reset to prevent accidental clicks */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-panel-red rounded-2xl p-6 max-w-sm w-full border border-red-500/60 shadow-red-glow animate-fade-in text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto mb-4 text-criticalRed">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-orbitron font-bold text-white mb-2">
              Reset Hackathon Timer?
            </h3>
            <p className="text-xs text-iceTextSecondary mb-6 font-sans">
              This will stop the active event, reset elapsed time to 05:00:00, and return to the initial welcome screen.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="py-2 px-4 rounded-xl border border-iceAccent/30 text-xs font-rajdhani font-semibold text-iceText hover:bg-iceSurface/50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onReset();
                  setShowResetConfirm(false);
                  setIsOpen(false);
                }}
                className="py-2 px-4 rounded-xl bg-criticalRed text-white text-xs font-orbitron font-bold hover:brightness-110 shadow-red-glow transition-all cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
