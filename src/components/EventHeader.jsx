import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

export default function EventHeader({ status }) {
  const isRunning = status === 'RUNNING';

  return (
    <header className="fixed top-0 left-0 right-0 h-[7vh] z-30 px-4 sm:px-6 md:px-8 bg-white/75 backdrop-blur-md border-b border-iceAccent/35 flex items-center justify-between text-iceText select-none shadow-sm">
      {/* LEFT: Official College Logo & Department */}
      <div className="flex items-center gap-3">
        <div className="h-[5vh] max-h-12 w-auto flex items-center">
          <img
            src="/mic-logo.png"
            alt="MIC College of Technology Logo"
            className="h-full w-auto object-contain filter drop-shadow-[0_2px_6px_rgba(56,121,201,0.25)]"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-[11px] sm:text-xs md:text-sm font-orbitron font-bold tracking-wider leading-tight text-iceText">
            DVR & Dr. HS MIC College of Technology
            <span className="text-icePrimary font-rajdhani font-bold text-[10px] sm:text-xs ml-1.5 opacity-90">
              (Autonomous)
            </span>
          </h1>
          <p className="text-[9px] sm:text-[10px] md:text-[11px] font-rajdhani font-bold text-icePrimary tracking-wide leading-tight uppercase">
            Department of Artificial Intelligence & Machine Learning
          </p>
        </div>
      </div>

      {/* CENTER: Hackathon Title & Subtitle */}
      <div className="hidden lg:flex flex-col items-center justify-center">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isRunning ? 'bg-icePrimary' : 'bg-iceAccent'} opacity-75`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isRunning ? 'bg-icePrimary' : 'bg-iceAccent'}`} />
          </span>
          <h2 className="text-sm md:text-base font-orbitron font-extrabold tracking-[0.25em] text-icePrimary">
            MIC TECH-HACK 2K26
          </h2>
        </div>
        <p className="text-[10px] font-rajdhani font-bold text-iceTextSecondary tracking-[0.2em] uppercase">
          A 5-Hour Hackathon
        </p>
      </div>

      {/* RIGHT: Date, Time & Venue */}
      <div className="flex items-center gap-4 text-right">
        <div className="flex flex-col justify-center text-[10px] sm:text-[11px] font-rajdhani">
          <div className="flex items-center justify-end gap-1.5 font-bold text-iceText">
            <Calendar className="w-3 h-3 text-icePrimary" />
            <span>27 October 2026</span>
            <span className="text-iceAccent">•</span>
            <Clock className="w-3 h-3 text-icePrimary ml-0.5" />
            <span>9:30 AM – 2:30 PM</span>
          </div>
          <div className="flex items-center justify-end gap-1 text-iceTextSecondary font-semibold">
            <MapPin className="w-3 h-3 text-icePrimary" />
            <span>Venue: EEE Seminar Hall</span>
          </div>
        </div>
      </div>
    </header>
  );
}
