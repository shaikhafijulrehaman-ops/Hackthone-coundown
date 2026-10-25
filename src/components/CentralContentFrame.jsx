import React from 'react';
import ProblemStatementSlide from './ProblemStatementSlide';
import { PDF_PROBLEM_STATEMENTS } from '../data/problemStatementsPdf';

/**
 * CentralContentFrame:
 * Occupies the upper-center sky region of the 16:9 college background.
 * Reference Coordinates (1920x1080):
 * Left: 21vw (21% of viewport width)
 * Top: 9vh (9% of viewport height)
 * Width: 58vw (58% of viewport width)
 * Height: 34vh (34% of viewport height)
 * 
 * Conditionally displays:
 * - STATE A: Original hackathon poster (activeStatementIndex === null)
 * - STATE B..F: Problem Statements 1 through 5 (activeStatementIndex 0..4)
 * NEVER displays poster and statement simultaneously.
 */
export default function CentralContentFrame({ activeStatementIndex }) {
  const isPosterActive = activeStatementIndex === null || activeStatementIndex === undefined;
  const currentStatement = !isPosterActive ? PDF_PROBLEM_STATEMENTS[activeStatementIndex] : null;

  return (
    <div
      className="fixed z-20 flex items-center justify-center select-none"
      style={{
        left: '21vw',
        top: '9vh',
        width: '58vw',
        height: '34vh',
      }}
    >
      {/* Outer Neon Cyber Bezel with Corner Brackets */}
      <div className="relative w-full h-full rounded-2xl glass-panel border border-cyan-400/40 shadow-2xl backdrop-blur-xl overflow-hidden flex items-center justify-center">
        {/* Futuristic Corner Brackets */}
        <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-electricCyan pointer-events-none z-30" />
        <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-electricCyan pointer-events-none z-30" />
        <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-electricCyan pointer-events-none z-30" />
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-electricCyan pointer-events-none z-30" />

        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-75 z-20" />

        {/* ======================================================== */}
        {/* STATE A: ORIGINAL HACKATHON POSTER                       */}
        {/* ======================================================== */}
        {isPosterActive && (
          <div className="w-full h-full flex items-center justify-center p-1 bg-midnight/60 animate-fade-in">
            <img
              src="/hackathon-poster.jpg"
              alt="MIC TECH-HACK 2K26 Official Hackathon Poster"
              className="w-full h-full object-contain block select-none pointer-events-none rounded-xl"
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* STATES B..F: PROBLEM STATEMENT SLIDES (1 OF 5)           */}
        {/* ======================================================== */}
        {!isPosterActive && currentStatement && (
          <ProblemStatementSlide
            key={currentStatement.id}
            statement={currentStatement}
            durationSeconds={5}
          />
        )}
      </div>
    </div>
  );
}
