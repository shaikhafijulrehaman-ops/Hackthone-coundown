import React, { useState, useEffect, useRef } from 'react';

/**
 * AnimatedDigit:
 * Renders a single character inside an invisible overflow-hidden viewport.
 * - NO visible background, NO border, NO box shadow, NO card styling.
 * - The character appears to float naturally inside the unified glass panel.
 * - Outgoing digit falls vertically downward (translateY 0% -> 125%) and fades out.
 * - Incoming digit enters from above (translateY -125% -> 0%) and settles smoothly.
 * - Unchanged digits remain completely still with zero animation.
 */
export default function AnimatedDigit({ digit, size = "text-6xl sm:text-7xl md:text-8xl", warningLevel = "normal" }) {
  const [displayDigit, setDisplayDigit] = useState(digit);
  const [prevDigit, setPrevDigit] = useState(null);
  const [animating, setAnimating] = useState(false);
  const prevPropRef = useRef(digit);
  const animTimeoutRef = useRef(null);

  useEffect(() => {
    if (digit !== prevPropRef.current) {
      const oldVal = prevPropRef.current;
      prevPropRef.current = digit;

      setPrevDigit(oldVal);
      setDisplayDigit(digit);
      setAnimating(true);

      if (animTimeoutRef.current) {
        clearTimeout(animTimeoutRef.current);
      }

      // 400ms duration matching cubic-bezier(0.22, 1, 0.36, 1)
      animTimeoutRef.current = setTimeout(() => {
        setPrevDigit(null);
        setAnimating(false);
      }, 400);
    }
  }, [digit]);

  useEffect(() => {
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, []);

  // Text color and restrained glow based on event warning state matching Image 2
  const getDigitColorStyle = () => {
    if (warningLevel === 'critical' || warningLevel === 'red') {
      return 'timer-digit-gradient-red';
    }
    if (warningLevel === 'warning' || warningLevel === 'amber') {
      return 'timer-digit-gradient-amber';
    }
    return 'timer-digit-gradient';
  };

  return (
    <div
      className={`digit-viewport relative inline-flex items-center justify-center font-orbitron font-black select-none overflow-hidden ${size} w-[0.78em] h-[1.12em] transition-colors duration-500`}
      style={{
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        borderRadius: '0',
      }}
    >
      {/* Outgoing falling digit (moves down and fades out) */}
      {animating && prevDigit !== null && (
        <span
          key={`prev-${prevDigit}`}
          className={`digit-fall-exit absolute inset-0 flex items-center justify-center ${getDigitColorStyle()} font-orbitron font-black leading-none`}
          aria-hidden="true"
        >
          {prevDigit}
        </span>
      )}

      {/* Incoming digit (enters from above and settles into normal position) */}
      <span
        key={`curr-${displayDigit}`}
        className={`flex items-center justify-center ${animating ? 'digit-fall-enter' : ''} ${getDigitColorStyle()} font-orbitron font-black leading-none w-full h-full`}
      >
        {displayDigit}
      </span>
    </div>
  );
}
