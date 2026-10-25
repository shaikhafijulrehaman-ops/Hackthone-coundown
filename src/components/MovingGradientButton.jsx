import React from 'react';
import { Play } from 'lucide-react';

/**
 * MovingGradientButton:
 * Premium animated moving gradient button for the initial welcome screen.
 * - Restyled in the Ice Glass theme (#8EB8E8, #3879C9, and complementary lighter blue tones).
 * - Continuous smooth moving gradient border.
 * - Prominent and elegant against the light background.
 * - Preserves size, placement, label, hover effect, and click behavior.
 */
export default function MovingGradientButton({ onClick, disabled = false }) {
  return (
    <div className="relative group p-[2.5px] rounded-2xl overflow-hidden shadow-[0_10px_35px_rgba(56,121,201,0.30)] transition-transform duration-300 hover:scale-105 active:scale-95">
      {/* Animated Moving Ice Gradient Border */}
      <div
        className="absolute inset-0 moving-gradient-border opacity-95 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(90deg, #3879C9, #8EB8E8, #FFFFFF, #8EB8E8, #3879C9)',
          backgroundSize: '300% 300%',
          animation: 'movingGradient 3.5s linear infinite',
        }}
      />

      {/* Outer Soft Luminous Blue Aura */}
      <div className="absolute -inset-1 bg-gradient-to-r from-icePrimary via-iceAccent to-icePrimary rounded-2xl blur-md opacity-35 group-hover:opacity-65 transition-opacity duration-300 pointer-events-none" />

      {/* Button Inner Surface */}
      <button
        onClick={onClick}
        disabled={disabled}
        className="relative z-10 w-full px-8 sm:px-12 py-4 sm:py-5 rounded-2xl bg-gradient-to-b from-[#3879C9] to-[#255da1] text-white flex items-center justify-center gap-3.5 cursor-pointer select-none transition-all duration-300 group-hover:brightness-105 shadow-inner overflow-hidden focus:outline-none focus:ring-4 focus:ring-icePrimary/50"
      >
        {/* Subtle glass reflection sheen */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.22] via-transparent to-transparent pointer-events-none rounded-t-2xl" />

        {/* Shimmer sweep effect on hover */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform pointer-events-none" />

        {/* Play Icon */}
        <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
          <Play className="w-4 h-4 text-white fill-white ml-0.5" />
        </div>

        {/* Exact Label */}
        <span className="text-base sm:text-lg md:text-xl font-orbitron font-extrabold tracking-[0.25em] text-white drop-shadow-sm uppercase">
          BEGIN HACKATHON
        </span>
      </button>

      <style>{`
        @keyframes movingGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
