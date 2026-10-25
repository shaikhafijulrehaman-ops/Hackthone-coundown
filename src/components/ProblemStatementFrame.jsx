import React from 'react';
import ProblemStatementSlide from './ProblemStatementSlide';
import { PDF_PROBLEM_STATEMENTS } from '../data/problemStatementsPdf';

/**
 * ProblemStatementFrame:
 * Dedicated fixed presentation container in the upper-center sky region.
 * Displays each of the 5 problem statements sequentially (06–31s in the 40s cycle).
 * - Fixed size container to prevent jumps or resizing.
 * - Subtle animated cyan/teal border independent of content rotation.
 * - Sits safely above the college building roofline.
 */
export default function ProblemStatementFrame({ activeIndex }) {
  if (activeIndex === null || activeIndex === undefined) return null;

  const currentStatement = PDF_PROBLEM_STATEMENTS[activeIndex];
  if (!currentStatement) return null;

  return (
    <div
      className="fixed z-20 flex items-center justify-center select-none"
      style={{
        left: '19vw',
        top: '8.5vh',
        width: '62vw',
        height: '38vh',
      }}
    >
      {/* Fixed-size glass presentation frame with subtle animated cyan/teal border */}
      <div className="relative w-full h-full rounded-2xl glass-panel-cyan border border-cyan-400/50 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col transition-all duration-300">
        {/* Subtle animated cyan-teal border glow line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-electricCyan via-quantumTeal to-electricCyan animate-pulse opacity-85 z-20" />

        {/* Futuristic Cyber Corner Tabs */}
        <div className="absolute top-1 left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-electricCyan pointer-events-none z-30" />
        <div className="absolute top-1 right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-electricCyan pointer-events-none z-30" />
        <div className="absolute bottom-1 left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-electricCyan pointer-events-none z-30" />
        <div className="absolute bottom-1 right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-electricCyan pointer-events-none z-30" />

        {/* Problem Statement Content */}
        <div className="w-full h-full">
          <ProblemStatementSlide
            key={currentStatement.id}
            statement={currentStatement}
            durationSeconds={5}
          />
        </div>
      </div>
    </div>
  );
}
