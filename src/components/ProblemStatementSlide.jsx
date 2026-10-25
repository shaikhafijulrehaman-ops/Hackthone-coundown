import React from 'react';

/**
 * ProblemStatementSlide:
 * Renders one of the five authentic problem statements from the official PDF inside the Ice Glass stage.
 * - Text in primary dark blue (#182A43) for high contrast and readability.
 * - Accents and highlights in #3879C9 and #8EB8E8.
 * - Translucent inner cards maintaining visibility of the college architecture.
 * - 5-second dynamic linear progress bar.
 */
export default function ProblemStatementSlide({ statement, durationSeconds = 5 }) {
  if (!statement) return null;

  return (
    <div className="relative w-full h-full flex flex-col justify-between text-iceText select-none">
      {/* Top Banner Row: PS Badge, Category, Subtitle & PDF Page */}
      <div className="flex items-center justify-between border-b border-iceAccent/35 pb-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1 rounded-full text-xs sm:text-sm font-orbitron font-extrabold bg-icePrimary text-white shadow-ice-primary">
            {statement.id}
          </span>
          <span className="text-xs sm:text-sm md:text-base font-rajdhani font-bold text-icePrimary uppercase tracking-wider">
            {statement.category}
          </span>
        </div>
        <span className="text-xs font-mono text-iceTextMuted uppercase tracking-widest font-semibold">
          PDF Page {statement.pageNumber} of 6
        </span>
      </div>

      {/* Prominent, Large Problem Title and Subtitle */}
      <div className="mb-4">
        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.4rem] font-orbitron font-extrabold text-iceText leading-tight tracking-wide drop-shadow-sm">
          {statement.title}
        </h3>
        <p className="text-sm sm:text-base md:text-lg font-rajdhani font-bold text-icePrimary mt-1">
          {statement.subtitle}
        </p>
      </div>

      {/* Spacious Two-Column Content Body (with hidden scrollbar for long text) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 flex-1 overflow-y-auto pr-2 text-xs sm:text-sm md:text-base leading-relaxed no-scrollbar mb-3">
        {/* Left Column (Span 6): Scenario, Background & Core Problem */}
        <div className="md:col-span-6 space-y-4 bg-white/45 p-4 sm:p-5 rounded-2xl border border-iceAccent/35 backdrop-blur-md flex flex-col justify-between shadow-sm">
          <div>
            <span className="font-rajdhani font-bold text-icePrimary uppercase tracking-wider text-xs sm:text-sm block mb-1">
              Persona & Scenario:
            </span>
            <p className="text-iceText font-medium">
              {statement.scenario}
            </p>
          </div>

          <div className="pt-3 border-t border-iceAccent/25">
            <span className="font-rajdhani font-bold text-icePrimary uppercase tracking-wider text-xs sm:text-sm block mb-1">
              Core Problem:
            </span>
            <p className="text-iceText font-bold">
              {statement.problem}
            </p>
          </div>
        </div>

        {/* Right Column (Span 6): Expected Output & Technical Requirements */}
        <div className="md:col-span-6 space-y-4 bg-white/45 p-4 sm:p-5 rounded-2xl border border-iceAccent/35 backdrop-blur-md flex flex-col justify-between shadow-sm">
          <div>
            <span className="font-rajdhani font-bold text-icePrimary uppercase tracking-wider text-xs sm:text-sm block mb-2">
              Expected Output:
            </span>
            <ul className="space-y-2">
              {statement.expectedOutputs.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-iceText font-medium">
                  <span className="text-icePrimary font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t border-iceAccent/25 flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm">
            <div>
              <span className="font-bold text-icePrimary">Techniques: </span>
              <span className="text-iceTextSecondary font-medium">{statement.suggestedTechniques}</span>
            </div>
            {statement.suggestedDataOrTools && (
              <div>
                <span className="font-bold text-icePrimary">Data / Tools: </span>
                <span className="text-iceTextSecondary font-medium">{statement.suggestedDataOrTools}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar: 5-Second Linear Progress Bar */}
      <div className="pt-3 border-t border-iceAccent/35 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-rajdhani font-bold text-icePrimary tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-icePrimary animate-ping" />
          <span>PROBLEM STATEMENT ROTATION • 5s PER TRACK</span>
        </div>

        {/* Dynamic 5s progress bar */}
        <div className="w-44 sm:w-64 h-2 bg-iceSurface rounded-full overflow-hidden border border-iceAccent/40">
          <div
            key={statement.id}
            className="h-full bg-gradient-to-r from-icePrimary to-iceAccent"
            style={{
              animation: `slideProgress ${durationSeconds}s linear forwards`,
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes slideProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
