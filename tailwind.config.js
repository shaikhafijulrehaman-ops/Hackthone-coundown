/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Official Ice Glass Palette
        iceBg: "#F4F8FC",
        iceSurface: "#DCE8F5",
        iceAccent: "#8EB8E8",
        icePrimary: "#3879C9",
        iceText: "#182A43",
        iceTextSecondary: "#3E577A",
        iceTextMuted: "#6B85A8",

        // Aliased tokens for global migration to Ice Glass
        midnight: "#F4F8FC",
        deepNavy: "#DCE8F5",
        panelNavy: "#DCE8F5",
        electricCyan: "#3879C9",
        quantumTeal: "#8EB8E8",
        softIce: "#182A43",
        mutedBlue: "#6B85A8",
        warningAmber: "#E68A00",
        criticalRed: "#D93848",
      },
      fontFamily: {
        orbitron: ["'Orbitron'", "sans-serif"],
        rajdhani: ["'Rajdhani'", "sans-serif"],
        mono: ["'Share Tech Mono'", "'JetBrains Mono'", "monospace"],
        sans: ["'Space Grotesk'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'ice-glass': '0 10px 30px rgba(56, 121, 201, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.75)',
        'ice-glow': '0 0 25px rgba(142, 184, 232, 0.45)',
        'ice-primary': '0 0 30px rgba(56, 121, 201, 0.35)',
        'cyan-glow': '0 0 25px rgba(56, 121, 201, 0.30)',
        'cyan-glow-lg': '0 0 45px rgba(56, 121, 201, 0.45)',
        'teal-glow': '0 0 25px rgba(142, 184, 232, 0.35)',
        'amber-glow': '0 0 35px rgba(230, 138, 0, 0.35)',
        'red-glow': '0 0 40px rgba(217, 56, 72, 0.40)',
        'glass-panel': '0 10px 30px rgba(56, 121, 201, 0.10)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'energy-ring': 'energyRing 2s cubic-bezier(0.1, 0.8, 0.2, 1) forwards',
        'circuit-pulse': 'circuitPulse 4s ease-in-out infinite alternate',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        circuitPulse: {
          '0%': { opacity: '0.4', filter: 'drop-shadow(0 0 4px rgba(56, 121, 201, 0.4))' },
          '100%': { opacity: '0.9', filter: 'drop-shadow(0 0 14px rgba(56, 121, 201, 0.8))' },
        },
      }
    },
  },
  plugins: [],
}
