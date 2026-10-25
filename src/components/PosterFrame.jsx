import React from 'react';

export default function PosterFrame({ className = "" }) {
  return (
    <div className={`relative rounded-2xl p-1 bg-gradient-to-b from-cyan-400/40 via-teal-500/20 to-cyan-400/30 shadow-2xl ${className}`}>
      {/* Corner cyberpunk neon tabs */}
      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-electricCyan pointer-events-none" />
      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-electricCyan pointer-events-none" />
      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-electricCyan pointer-events-none" />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-electricCyan pointer-events-none" />

      {/* Frame Container */}
      <div className="relative rounded-xl overflow-hidden bg-midnight/90 border border-cyan-400/30">
        <img
          src="/hackathon-poster.jpg"
          alt="MIC TECH-HACK 2K26 Hackathon Official Poster"
          className="w-full h-auto object-contain block max-h-[36vh] sm:max-h-[42vh] mx-auto select-none pointer-events-none"
        />

        {/* Subtle holographic sheen overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/40 via-transparent to-white/5 pointer-events-none" />
      </div>
    </div>
  );
}
