import { useState, useEffect, useRef, useCallback } from 'react';
import { HACKATHON_CONFIG } from '../data/hackathonData';
import { PDF_PROBLEM_STATEMENTS } from '../data/problemStatementsPdf';
import { sound } from '../utils/audio';

export function useHackathonTimer() {
  // Recover active running/paused event from localStorage on refresh, otherwise start cleanly in 'IDLE'
  const [timerState, setTimerState] = useState(() => {
    try {
      const saved = localStorage.getItem('mic_hackathon_active_event');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.status === 'RUNNING' || parsed.status === 'PAUSED')) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read saved hackathon state', e);
    }
    return {
      status: 'IDLE', // 'IDLE', 'LAUNCHING', 'RUNNING', 'PAUSED', 'COMPLETED'
      startTime: null,
      launchCompletedAt: null,
      pausedAt: null,
      totalPausedMs: 0,
      manualOffsetSeconds: 0,
    };
  });

  const [remainingSeconds, setRemainingSeconds] = useState(HACKATHON_CONFIG.durationSeconds);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [warningInfo, setWarningInfo] = useState({ level: 'normal', message: null });
  
  // 47-Second Deterministic Presentation Cycle State:
  // Phase A: 'TIMER' (00-15s) | Phase B: 'STATEMENT' (15-40s) | Phase C: 'POSTER' (40-47s)
  const [cyclePhase, setCyclePhase] = useState('TIMER');
  const [cycleTime, setCycleTime] = useState(0);
  const [activeStatementIndex, setActiveStatementIndex] = useState(null); // 0..4 during STATEMENT phase, null otherwise
  const [manualOverrideStatement, setManualOverrideStatement] = useState(null);
  const [soundMuted, setSoundMuted] = useState(false);

  // Helper to persist active state in localStorage
  const persistState = useCallback((state) => {
    try {
      if (state.status === 'RUNNING' || state.status === 'PAUSED') {
        localStorage.setItem('mic_hackathon_active_event', JSON.stringify(state));
      } else if (state.status === 'IDLE' || state.status === 'COMPLETED') {
        localStorage.removeItem('mic_hackathon_active_event');
      }
    } catch (e) {
      console.warn('Could not persist hackathon state', e);
    }
  }, []);

  // Guard to prevent duplicate starts
  const isStartingRef = useRef(false);

  // Keep sound system in sync
  useEffect(() => {
    sound.setMuted(soundMuted);
  }, [soundMuted]);

  // Calculate accurate remaining & elapsed seconds from the single authoritative start timestamp
  const calculateTiming = useCallback(() => {
    if (timerState.status === 'IDLE') {
      return { remaining: HACKATHON_CONFIG.durationSeconds, elapsed: 0 };
    }

    const now = timerState.status === 'PAUSED' && timerState.pausedAt ? timerState.pausedAt : Date.now();
    const effectiveStartTime = timerState.startTime || now;
    const effectiveTotalPaused = timerState.totalPausedMs || 0;

    const actualElapsedMs = Math.max(0, now - effectiveStartTime - effectiveTotalPaused);
    let calculatedElapsed = Math.floor(actualElapsedMs / 1000) + (timerState.manualOffsetSeconds || 0);
    calculatedElapsed = Math.max(0, calculatedElapsed);

    let remaining = Math.max(0, HACKATHON_CONFIG.durationSeconds - calculatedElapsed);
    
    return {
      remaining,
      elapsed: Math.min(HACKATHON_CONFIG.durationSeconds, calculatedElapsed)
    };
  }, [timerState]);

  // Warning state calculator
  const calculateWarning = useCallback((rem) => {
    if (rem <= 0) {
      return { level: 'completed', message: 'HACKATHON COMPLETED' };
    }
    if (rem <= 60) {
      return { level: 'critical', message: 'FINAL 60 SECONDS' };
    }
    if (rem <= 300) { // 5 minutes
      return { level: 'critical', message: 'FINAL 5 MINUTES' };
    }
    if (rem <= 600) { // 10 minutes
      return { level: 'critical', message: '10 MINUTES LEFT' };
    }
    if (rem <= 1200) { // 20 minutes
      return { level: 'critical', message: 'FINAL 20 MINUTES' };
    }
    if (rem <= 1800) { // 30 minutes
      return { level: 'red', message: '30 MINUTES TO GO' };
    }
    if (rem <= 3600) { // 60 minutes
      return { level: 'warning', message: 'ONE HOUR REMAINING' };
    }
    return { level: 'normal', message: null };
  }, []);

  const prevWarningLevelRef = useRef('normal');

  // Main high-precision interval loop
  useEffect(() => {
    const update = () => {
      const { remaining, elapsed } = calculateTiming();
      setRemainingSeconds(remaining);
      setElapsedSeconds(elapsed);

      const warning = calculateWarning(remaining);
      setWarningInfo(warning);

      // Play audio chime when crossing into critical thresholds
      if (
        warning.level !== prevWarningLevelRef.current &&
        (warning.level === 'warning' || warning.level === 'red' || warning.level === 'critical') &&
        timerState.status === 'RUNNING'
      ) {
        try {
          sound?.playWarningAlert?.(warning.level === 'warning' ? 'amber' : 'red');
        } catch (e) {
          console.warn('Audio alert safely handled:', e);
        }
      }
      prevWarningLevelRef.current = warning.level;

      // Handle Completion
      if (remaining === 0 && timerState.status === 'RUNNING') {
        setTimerState(prev => ({ ...prev, status: 'COMPLETED' }));
        try {
          sound?.playCompletionSound?.();
        } catch (e) {
          console.warn('Audio completion safely handled:', e);
        }
      }

      // ========================================================
      // DETERMINISTIC 47-SECOND PRESENTATION CYCLE
      // Phase A: 00-15s: Live Countdown Timer (15s)
      // Phase B: 15-40s: Problem Statements 1-5 (5s each, 25s total)
      //          15-20s: Problem Statement 1
      //          20-25s: Problem Statement 2
      //          25-30s: Problem Statement 3
      //          30-35s: Problem Statement 4
      //          35-40s: Problem Statement 5
      // Phase C: 40-47s: Dedicated Full-Screen Poster Slide (7s)
      // ========================================================
      if (timerState.status === 'RUNNING' || timerState.status === 'PAUSED') {
        if (manualOverrideStatement !== null) {
          setCyclePhase('STATEMENT');
          setActiveStatementIndex(manualOverrideStatement);
        } else {
          const nowTime = timerState.status === 'PAUSED' && timerState.pausedAt ? timerState.pausedAt : Date.now();
          const cycleBaseTime = timerState.launchCompletedAt || timerState.startTime || nowTime;
          const cycleElapsedMs = Math.max(0, nowTime - cycleBaseTime - (timerState.totalPausedMs || 0));
          const currentCycleSecond = Math.floor(cycleElapsedMs / 1000) % 47;
          setCycleTime(currentCycleSecond);

          if (currentCycleSecond < 15) {
            // Phase A: 00–15s: Live countdown timer in transparent Ice Glass field (15 seconds)
            setCyclePhase('TIMER');
            setActiveStatementIndex(null);
          } else if (currentCycleSecond < 20) {
            // Phase B: 15–20s: Problem Statement 1 (5 seconds)
            setCyclePhase('STATEMENT');
            setActiveStatementIndex(0);
          } else if (currentCycleSecond < 25) {
            // Phase B: 20–25s: Problem Statement 2 (5 seconds)
            setCyclePhase('STATEMENT');
            setActiveStatementIndex(1);
          } else if (currentCycleSecond < 30) {
            // Phase B: 25–30s: Problem Statement 3 (5 seconds)
            setCyclePhase('STATEMENT');
            setActiveStatementIndex(2);
          } else if (currentCycleSecond < 35) {
            // Phase B: 30–35s: Problem Statement 4 (5 seconds)
            setCyclePhase('STATEMENT');
            setActiveStatementIndex(3);
          } else if (currentCycleSecond < 40) {
            // Phase B: 35–40s: Problem Statement 5 (5 seconds)
            setCyclePhase('STATEMENT');
            setActiveStatementIndex(4);
          } else {
            // Phase C: 40–47s: Dedicated Full-Screen Hackathon Poster (7 seconds)
            setCyclePhase('POSTER');
            setActiveStatementIndex(null);
          }
        }
      } else {
        // IDLE or LAUNCHING
        setCyclePhase('IDLE');
        setActiveStatementIndex(null);
        setCycleTime(0);
      }
    };

    update();
    const interval = setInterval(update, 200); // 5 times a second for fluid synchronization
    return () => clearInterval(interval);
  }, [calculateTiming, calculateWarning, timerState.status, manualOverrideStatement]);

  // Actions
  const startLaunchSequence = useCallback(() => {
    if (timerState.status !== 'IDLE' || isStartingRef.current) return;
    isStartingRef.current = true;
    // Launch introduction is a pre-event sequence and does NOT consume the 5-hour duration
    setTimerState({
      status: 'LAUNCHING',
      startTime: null,
      launchCompletedAt: null,
      pausedAt: null,
      totalPausedMs: 0,
      manualOffsetSeconds: 0,
    });
  }, [timerState.status]);

  const completeLaunchAndStartEvent = useCallback(() => {
    // 5-hour hackathon officially starts when HACKATHON BEGINS NOW is reached
    const now = Date.now();
    const newState = {
      status: 'RUNNING',
      startTime: now,
      launchCompletedAt: now,
      pausedAt: null,
      totalPausedMs: 0,
      manualOffsetSeconds: 0,
    };
    setTimerState(newState);
    persistState(newState);
    isStartingRef.current = false;
  }, [persistState]);

  const pauseTimer = useCallback(() => {
    if (timerState.status !== 'RUNNING') return;
    const now = Date.now();
    setTimerState(prev => {
      const next = {
        ...prev,
        status: 'PAUSED',
        pausedAt: now,
      };
      persistState(next);
      return next;
    });
  }, [timerState.status, persistState]);

  const resumeTimer = useCallback(() => {
    if (timerState.status !== 'PAUSED') return;
    const now = Date.now();
    const pausedDuration = timerState.pausedAt ? (now - timerState.pausedAt) : 0;
    setTimerState(prev => {
      const next = {
        ...prev,
        status: 'RUNNING',
        pausedAt: null,
        totalPausedMs: prev.totalPausedMs + pausedDuration,
      };
      persistState(next);
      return next;
    });
  }, [timerState.status, timerState.pausedAt, persistState]);

  const togglePauseResume = useCallback(() => {
    if (timerState.status === 'RUNNING') {
      pauseTimer();
    } else if (timerState.status === 'PAUSED') {
      resumeTimer();
    }
  }, [timerState.status, pauseTimer, resumeTimer]);

  const resetTimer = useCallback(() => {
    isStartingRef.current = false;
    const newState = {
      status: 'IDLE',
      startTime: null,
      launchCompletedAt: null,
      pausedAt: null,
      totalPausedMs: 0,
      manualOffsetSeconds: 0,
    };
    setTimerState(newState);
    persistState(newState);
    setRemainingSeconds(HACKATHON_CONFIG.durationSeconds);
    setElapsedSeconds(0);
    setCyclePhase('TIMER');
    setCycleTime(0);
    setActiveStatementIndex(null);
    setManualOverrideStatement(null);
    prevWarningLevelRef.current = 'normal';
  }, [persistState]);

  const jumpToTime = useCallback((targetRemainingSeconds) => {
    const newOffset = HACKATHON_CONFIG.durationSeconds - targetRemainingSeconds;
    setTimerState(prev => {
      const now = Date.now();
      const next = {
        ...prev,
        status: prev.status === 'IDLE' ? 'RUNNING' : prev.status,
        startTime: prev.startTime || now,
        launchCompletedAt: prev.launchCompletedAt || now,
        manualOffsetSeconds: newOffset,
      };
      persistState(next);
      return next;
    });
  }, [persistState]);

  const nextProblemStatement = useCallback(() => {
    setManualOverrideStatement(prev => {
      if (prev === null) return 0;
      const next = (prev + 1) % PDF_PROBLEM_STATEMENTS.length;
      return next;
    });
    setTimeout(() => {
      setManualOverrideStatement(null);
    }, 8000);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundMuted(prev => !prev);
  }, []);

  // Format derived display components
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  // Timer visibility:
  // - Hidden during IDLE (initial welcome screen has the centered MovingGradientButton)
  // - Hidden during LAUNCHING (cinematic introduction active)
  // - When RUNNING or PAUSED: ONLY during TIMER phase (31–40s)
  const isTimerVisible = (timerState.status === 'RUNNING' || timerState.status === 'PAUSED') && cyclePhase === 'TIMER';

  return {
    status: timerState.status,
    remainingSeconds,
    elapsedSeconds,
    hours,
    minutes,
    seconds,
    warningInfo,
    cyclePhase,
    cycleTime,
    activeStatementIndex,
    isTimerVisible,
    soundMuted,
    startLaunchSequence,
    completeLaunchAndStartEvent,
    pauseTimer,
    resumeTimer,
    togglePauseResume,
    resetTimer,
    jumpToTime,
    nextProblemStatement,
    toggleSound,
  };
}
