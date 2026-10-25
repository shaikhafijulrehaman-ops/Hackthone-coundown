import React, { useEffect, useRef } from 'react';

/**
 * VortexDust:
 * Lightweight GPU-accelerated 2D Canvas particle vortex system.
 * - Colors: Electric Cyan (#00E5FF) and Quantum Teal (#27F5D0)
 * - Swirling logarithmic vortex motion converging toward and orbiting the screen center
 * - Subtle particle density (60-80 particles) so text and college building remain crisp
 * - Clean requestAnimationFrame loop with unmount cancellation
 * - Respects prefers-reduced-motion
 */
export default function VortexDust() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool definition
    const PARTICLE_COUNT = 75;
    const colors = [
      'rgba(0, 229, 255, ',    // Electric Cyan
      'rgba(39, 245, 208, ',   // Quantum Teal
      'rgba(234, 251, 255, ',  // Soft Ice White
    ];

    const particles = [];
    const maxRadius = Math.sqrt(width * width + height * height) * 0.55;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        radius: Math.random() * maxRadius + 30,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (0.002 + Math.random() * 0.004) * (Math.random() > 0.5 ? 1 : 1),
        radialSpeed: 0.25 + Math.random() * 0.65,
        size: Math.random() * 2.2 + 0.8,
        colorBase: colors[Math.floor(Math.random() * colors.length)],
        baseAlpha: 0.15 + Math.random() * 0.45,
        alphaPulseSpeed: 0.02 + Math.random() * 0.03,
        alphaPhase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      time += 0.016;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          // Vortex spiral physics:
          // Angular movement faster near center, slower outward
          const speedFactor = Math.max(0.4, 1.2 - (p.radius / maxRadius) * 0.7);
          p.angle += p.angularSpeed * speedFactor;

          // Inward vortex pull
          p.radius -= p.radialSpeed * speedFactor;

          // Reset when particle reaches vortex eye
          if (p.radius < 25) {
            p.radius = maxRadius - Math.random() * 80;
            p.angle = Math.random() * Math.PI * 2;
          }
        }

        // Compute Cartesian coords with slight elliptical aspect
        const x = centerX + Math.cos(p.angle) * p.radius;
        const y = centerY + Math.sin(p.angle) * (p.radius * 0.65);

        // Alpha calculation based on distance and breathing pulse
        const distRatio = Math.min(1, Math.max(0, p.radius / maxRadius));
        const pulse = Math.sin(time * p.alphaPulseSpeed + p.alphaPhase) * 0.15;
        const currentAlpha = Math.max(0.05, Math.min(0.7, p.baseAlpha * (1 - distRatio * 0.5) + pulse));

        // Draw glowing particle
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.colorBase}${currentAlpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0, 229, 255, 0.6)';
        ctx.fill();

        // Delicate tail streak for faster particles
        if (!prefersReducedMotion && p.size > 1.4) {
          const tailAngle = p.angle - p.angularSpeed * 3;
          const tailX = centerX + Math.cos(tailAngle) * (p.radius + 1.2);
          const tailY = centerY + Math.sin(tailAngle) * ((p.radius + 1.2) * 0.65);

          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(tailX, tailY);
          ctx.strokeStyle = `${p.colorBase}${currentAlpha * 0.4})`;
          ctx.lineWidth = p.size * 0.6;
          ctx.stroke();
        }
      }

      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none select-none z-10"
      style={{
        mixBlendMode: 'screen',
      }}
    />
  );
}
