import React from 'react';
import AnimatedDigit from './AnimatedDigit';

export default function DigitGroup({ value, label, size, warningLevel = "normal" }) {
  const strVal = String(value).padStart(2, '0');
  const dTens = strVal[0];
  const dOnes = strVal[1];

  const getLabelColor = () => {
    if (warningLevel === 'critical' || warningLevel === 'red') return 'text-criticalRed';
    if (warningLevel === 'warning' || warningLevel === 'amber') return 'text-warningAmber';
    return 'text-icePrimary';
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Tens and Ones Digits floating together without individual boxes */}
      <div className="flex items-center justify-center gap-0 tracking-tight">
        <AnimatedDigit digit={dTens} size={size} warningLevel={warningLevel} />
        <AnimatedDigit digit={dOnes} size={size} warningLevel={warningLevel} />
      </div>

      {/* Uppercase label framed by horizontal accent lines matching Image 2 */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mt-3 sm:mt-4 select-none">
        <div className="w-8 sm:w-14 md:w-20 h-[1.5px] bg-gradient-to-r from-transparent to-icePrimary/60" />
        <span className={`text-[10px] sm:text-xs md:text-sm font-orbitron font-bold tracking-[0.32em] uppercase ${getLabelColor()} transition-colors duration-500 text-center`}>
          {label}
        </span>
        <div className="w-8 sm:w-14 md:w-20 h-[1.5px] bg-gradient-to-l from-transparent to-icePrimary/60" />
      </div>
    </div>
  );
}
