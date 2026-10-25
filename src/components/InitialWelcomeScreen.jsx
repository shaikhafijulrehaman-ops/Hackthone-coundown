import React, { useState } from 'react';
import MovingGradientButton from './MovingGradientButton';
import { HACKATHON_CONFIG } from '../data/hackathonData';
import { sound } from '../utils/audio';
import { Cpu, Calendar, Clock, MapPin } from 'lucide-react';

export default function InitialWelcomeScreen({ onBegin }) {
  const [isClicked, setIsClicked] = useState(false);

  const handleBeginClick = () => {
    if (isClicked) return;
    setIsClicked(true);
    sound.init();
    onBegin();
  };

  return (
    <div className="fixed inset-0 z-30 flex flex-col justify-between select-none">
      {/* Subtle College Branding Header in Ice Glass */}
      <header className="w-full px-6 sm:px-10 py-3.5 bg-white/70 backdrop-blur-md border-b border-iceAccent/30 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-9 w-auto flex items-center">
            <img
              src="/mic-logo.png"
              alt="MIC College Logo"
              className="h-full w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(56,121,201,0.25)]"
            />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-orbitron font-bold text-iceText tracking-wider leading-tight">
              {HACKATHON_CONFIG.college}
            </h1>
            <p className="text-[10px] sm:text-xs font-rajdhani font-bold text-icePrimary uppercase tracking-wider">
              {HACKATHON_CONFIG.department}
            </p>
          </div>
        </div>

        {/* Date, Time & Venue */}
        <div className="hidden sm:flex items-center gap-4 text-right text-[11px] font-rajdhani">
          <div className="flex items-center gap-1.5 font-bold text-iceText">
            <Calendar className="w-3.5 h-3.5 text-icePrimary" />
            <span>{HACKATHON_CONFIG.eventDate}</span>
            <span className="text-iceAccent">•</span>
            <Clock className="w-3.5 h-3.5 text-icePrimary ml-0.5" />
            <span>{HACKATHON_CONFIG.eventTime}</span>
          </div>
          <div className="flex items-center gap-1 text-iceTextSecondary font-semibold">
            <MapPin className="w-3.5 h-3.5 text-icePrimary" />
            <span>{HACKATHON_CONFIG.venue}</span>
          </div>
        </div>
      </header>

      {/* Main Center Stage: Hackathon Title & Centered Moving Gradient Button */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-6">
        <div className="flex flex-col items-center text-center max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-iceAccent/50 mb-4 shadow-ice-glass">
            <Cpu className="w-3.5 h-3.5 text-icePrimary animate-pulse" />
            <span className="text-xs font-rajdhani font-bold text-icePrimary tracking-[0.25em] uppercase">
              A 5-HOUR STATE-LEVEL HACKATHON
            </span>
          </div>

          {/* Majestic Event Title in Ice Theme */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-orbitron font-black text-iceText tracking-wider drop-shadow-sm mb-3">
            {HACKATHON_CONFIG.title}
          </h1>

          {/* Subtitle / Theme */}
          <p className="text-xs sm:text-sm md:text-base font-rajdhani font-bold text-iceTextSecondary tracking-[0.2em] uppercase max-w-xl mb-8">
            {HACKATHON_CONFIG.tagline}
          </p>

          {/* Centered Moving Gradient BEGIN HACKATHON Button */}
          <div className="w-full max-w-md flex justify-center">
            <MovingGradientButton
              onClick={handleBeginClick}
              disabled={isClicked}
            />
          </div>

          {/* Subtle Operator Instruction */}
          <p className="mt-5 text-[11px] font-rajdhani font-semibold text-icePrimary tracking-widest uppercase">
            CLICK TO LAUNCH CINEMATIC INTRODUCTION & START 5-HOUR ENGINE
          </p>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="w-full px-6 py-2.5 bg-white/60 backdrop-blur-md border-t border-iceAccent/25 flex items-center justify-between text-[11px] font-rajdhani text-iceTextSecondary">
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
        <span className="text-[10px] text-icePrimary font-mono font-bold tracking-wider">
          STATUS: STANDBY • AWAITING OPERATOR BEGIN
        </span>
      </footer>
    </div>
  );
}
