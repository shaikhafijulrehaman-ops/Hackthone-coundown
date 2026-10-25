import React from 'react';

/**
 * FullScreenPosterSlide:
 * Dedicated, pristine full-screen presentation slide for the authentic MIC TECH-HACK 2K26 poster.
 * - Active during 31–45s of the 45-second presentation cycle.
 * - position: fixed, inset: 0, 100vw x 100vh, z-index 50.
 * - Centered horizontally & vertically.
 * - Preserves original 2:1 widescreen aspect ratio with object-fit: contain.
 * - Maximize screen coverage without cropping, borders, cards, or website chrome.
 * - Ice Glass ambient background with soft blue vignette.
 */
export default function FullScreenPosterSlide({ isVisible }) {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 w-screen h-screen bg-iceBg flex items-center justify-center p-0 m-0 overflow-hidden select-none pointer-events-none"
      style={{
        animation: 'posterSlideFade 500ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      {/* Subtle Ice atmospheric background vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(142, 184, 232, 0.25) 0%, rgba(220, 232, 245, 0.85) 65%, #F4F8FC 100%)',
        }}
      />

      {/* Pristine Full-Screen Poster Slide (Widescreen 2:1) */}
      <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
        <img
          src="/hackathon-poster.jpg"
          alt="MIC TECH-HACK 2K26 Official Hackathon Poster"
          className="w-full h-full object-contain filter contrast-[1.03] drop-shadow-[0_10px_50px_rgba(56,121,201,0.25)] transition-transform duration-700"
          style={{
            maxHeight: '100vh',
            maxWidth: '100vw',
          }}
        />
      </div>

      <style>{`
        @keyframes posterSlideFade {
          0% {
            opacity: 0;
            transform: scale(0.99);
          }
          100% {
            opacity: 1;
            transform: scale(1.0);
          }
        }
      `}</style>
    </div>
  );
}
