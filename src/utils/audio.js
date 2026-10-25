// Web Audio API Synthesizer & Cinematic Audio Controller for MIC TECH-HACK 2K26
// Coordinates a single continuous cinematic music track with distinct, non-repetitive sound accents

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.buffers = {};
    this.loadingPromises = {};
    this.activeSources = new Set();
    
    // Continuous launch soundtrack source & gain
    this.launchMusicSource = null;
    this.launchMusicGainNode = null;
    this.isMusicPlaying = false;

    // Master & SFX gain nodes
    this.masterGainNode = null;
    this.sfxGainNode = null;

    // Professional balanced audio targets per specification:
    // Background music: ~20–30% volume
    // Transition effects: ~20–35% volume
    // Final announcement impact: ~30–40% volume
    this.masterVolume = 1.0;
    this.musicVolume = 0.25;  // 25% continuous soundtrack level
    this.sfxVolume = 0.30;    // 30% sound effects level

    if (typeof window !== 'undefined') {
      this.preloadAudioAssets();
    }
  }

  // Preload local assets from /audio/*.wav and /audio/*.mp3
  preloadAudioAssets() {
    const assets = {
      'launch-music': '/audio/launch-music.wav',
      'sfx-activation': '/audio/sfx-activation.wav',
      'sfx-transition': '/audio/sfx-transition.wav',
      'sfx-logo-reveal': '/audio/sfx-logo-reveal.wav',
      'sfx-countdown-3': '/audio/sfx-countdown-3.wav',
      'sfx-countdown-2': '/audio/sfx-countdown-2.wav',
      'sfx-countdown-1': '/audio/sfx-countdown-1.wav',
      'sfx-launch-impact': '/audio/sfx-launch-impact.wav',
    };

    Object.entries(assets).forEach(([name, url]) => {
      this.loadingPromises[name] = fetch(url)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.arrayBuffer();
        })
        .catch(err => {
          console.warn(`[Audio] Asset ${url} failed to load, procedural fallback active:`, err.message);
          return null;
        });
    });
  }

  // Initialize Web Audio Context on explicit user gesture (BEGIN HACKATHON click)
  init() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        this.ctx = new AudioCtx();
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      if (!this.masterGainNode) {
        this.masterGainNode = this.ctx.createGain();
        this.masterGainNode.gain.setValueAtTime(this.muted ? 0 : this.masterVolume, this.ctx.currentTime);
        this.masterGainNode.connect(this.ctx.destination);

        this.sfxGainNode = this.ctx.createGain();
        this.sfxGainNode.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
        this.sfxGainNode.connect(this.masterGainNode);

        this.launchMusicGainNode = this.ctx.createGain();
        this.launchMusicGainNode.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
        this.launchMusicGainNode.connect(this.masterGainNode);
      }

      // Decode preloaded buffers into Web Audio AudioBuffers
      Object.entries(this.loadingPromises).forEach(([name, promise]) => {
        if (promise && !this.buffers[name]) {
          promise.then(arrayBuffer => {
            if (arrayBuffer && this.ctx) {
              this.ctx.decodeAudioData(
                arrayBuffer.slice(0),
                decoded => { this.buffers[name] = decoded; },
                () => {}
              );
            }
          });
        }
      });
    } catch (e) {
      console.warn('[Audio] Init exception handled:', e);
    }
  }

  setMuted(isMuted) {
    this.muted = !!isMuted;
    if (this.masterGainNode && this.ctx) {
      const target = this.muted ? 0 : this.masterVolume;
      this.masterGainNode.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
  }

  isMuted() {
    return this.muted;
  }

  // Helper to play an AudioBuffer or fall back to procedural synthesizer
  playBuffer(name, gainNode, fallbackFn) {
    if (this.muted) return null;
    this.init();
    if (!this.ctx) return null;

    const buffer = this.buffers[name];
    if (buffer) {
      try {
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(gainNode || this.sfxGainNode || this.ctx.destination);
        source.start();

        this.activeSources.add(source);
        source.onended = () => {
          this.activeSources.delete(source);
        };
        return source;
      } catch (err) {
        console.warn(`[Audio] Buffer error for ${name}:`, err);
      }
    }

    if (typeof fallbackFn === 'function') {
      return fallbackFn.call(this);
    }
    return null;
  }

  // ========================================================
  // 1. CONTINUOUS CINEMATIC MUSIC TRACK
  // Starts ONCE when BEGIN HACKATHON is clicked.
  // Plays continuously through all slides, logo, and countdown.
  // ========================================================
  startLaunchMusic() {
    if (this.isMusicPlaying) return; // Prevent duplicate playback
    this.init();
    if (!this.ctx) return;

    this.isMusicPlaying = true;
    const now = this.ctx.currentTime;

    if (this.launchMusicGainNode) {
      this.launchMusicGainNode.gain.cancelScheduledValues(now);
      this.launchMusicGainNode.gain.setValueAtTime(0, now);
      // Gentle 1.5s fade-in at the beginning
      this.launchMusicGainNode.gain.linearRampToValueAtTime(this.musicVolume, now + 1.5);
    }

    const source = this.playBuffer('launch-music', this.launchMusicGainNode, () => {
      // Procedural fallback continuous pad
      const osc = this.ctx.createOscillator();
      const padGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(146.83, now); // D3
      padGain.gain.setValueAtTime(0, now);
      padGain.gain.linearRampToValueAtTime(0.20, now + 1.5);
      osc.connect(padGain);
      padGain.connect(this.launchMusicGainNode);
      osc.start(now);
      return osc;
    });

    this.launchMusicSource = source;
  }

  // Smoothly fade out the continuous soundtrack after HACKATHON BEGINS NOW
  stopLaunchMusic(fadeDuration = 2.0) {
    if (!this.isMusicPlaying) return;
    this.isMusicPlaying = false;

    if (this.ctx && this.launchMusicGainNode) {
      const now = this.ctx.currentTime;
      this.launchMusicGainNode.gain.cancelScheduledValues(now);
      this.launchMusicGainNode.gain.setValueAtTime(this.launchMusicGainNode.gain.value, now);
      this.launchMusicGainNode.gain.linearRampToValueAtTime(0, now + fadeDuration);
    }

    setTimeout(() => {
      if (this.launchMusicSource) {
        try { this.launchMusicSource.stop(); } catch {}
        this.launchMusicSource = null;
      }
    }, (fadeDuration + 0.1) * 1000);
  }

  // ========================================================
  // 2. DISTINCT SOUND EFFECTS (Triggered once per visual event)
  // ========================================================

  // Slide 1: System Activation (plays once at t = 0)
  playActivation() {
    return this.playBuffer('sfx-activation', this.sfxGainNode, () => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.6);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      osc.connect(gain);
      gain.connect(this.sfxGainNode || this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.6);
    });
  }

  // Slide 2, 3, 4: Major Slide Transition (plays once per slide entrance)
  playTransition() {
    return this.playBuffer('sfx-transition', this.sfxGainNode, () => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.5);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.20, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc.connect(gain);
      gain.connect(this.sfxGainNode || this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    });
  }

  // Slide 5: College Logo Reveal Chime (plays once at t = 16s)
  playLogoReveal() {
    return this.playBuffer('sfx-logo-reveal', this.sfxGainNode, () => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [659.25, 830.61, 987.77, 1318.51].forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const tStart = now + idx * 0.1;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, tStart);
        gain.gain.setValueAtTime(0, tStart);
        gain.gain.linearRampToValueAtTime(0.08, tStart + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, tStart + 1.6);
        osc.connect(gain);
        gain.connect(this.sfxGainNode || this.ctx.destination);
        osc.start(tStart);
        osc.stop(tStart + 1.7);
      });
    });
  }

  // Countdown Accents:
  // When number 3 appears: one restrained cinematic pulse
  // When number 2 appears: a stronger pulse
  // When number 1 appears: the strongest countdown accent with rising tension
  playCountdownAccent(number) {
    const assetName = `sfx-countdown-${number}`;
    return this.playBuffer(assetName, this.sfxGainNode, () => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const baseFreq = number === 3 ? 55 : number === 2 ? 65 : 80;
      const vol = number === 3 ? 0.25 : number === 2 ? 0.32 : 0.40;
      osc.frequency.setValueAtTime(baseFreq + 30, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.3);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (number === 1 ? 1.4 : 0.9));
      osc.connect(gain);
      gain.connect(this.sfxGainNode || this.ctx.destination);
      osc.start(now);
      osc.stop(now + (number === 1 ? 1.5 : 1.0));
    });
  }

  // Stage 7: Distinctive Cinematic Impact at "HACKATHON BEGINS NOW" (plays once at t = 29s)
  playLaunchImpact() {
    return this.playBuffer('sfx-launch-impact', this.sfxGainNode, () => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.8);
      gain.gain.setValueAtTime(0.38, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);
      osc.connect(gain);
      gain.connect(this.sfxGainNode || this.ctx.destination);
      osc.start(now);
      osc.stop(now + 2.5);
    });
  }

  // ========================================================
  // Backward compatibility & Normal Event Mode Handlers
  // ========================================================
  playLaunchActivation() {
    return this.playActivation();
  }

  playSlideWhoosh() {
    return this.playTransition();
  }

  startCountdownMusic() {
    // Music is already continuously playing through the countdown!
  }

  stopCountdownMusic(fadeDuration = 1.5) {
    this.stopLaunchMusic(fadeDuration);
  }

  playFinalTransition() {
    return this.playLaunchImpact();
  }

  playWarningAlert(level = 'amber') {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(level === 'red' ? 880 : 587.33, now);
      osc.frequency.exponentialRampToValueAtTime(level === 'red' ? 660 : 440, now + 0.35);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc.connect(gain);
      gain.connect(this.sfxGainNode || this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.65);
    } catch {}
  }

  playCompletionSound() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const tStart = now + idx * 0.15;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, tStart);
        gain.gain.setValueAtTime(0.15, tStart);
        gain.gain.exponentialRampToValueAtTime(0.001, tStart + 1.2);
        osc.connect(gain);
        gain.connect(this.sfxGainNode || this.ctx.destination);
        osc.start(tStart);
        osc.stop(tStart + 1.3);
      });
    } catch {}
  }
}

const baseSound = new SoundSystem();

// Proxy guarantees that calling sound.<anything>() safely no-ops instead of throwing TypeError
export const sound = new Proxy(baseSound, {
  get(target, prop) {
    if (prop in target) {
      return typeof target[prop] === 'function' ? target[prop].bind(target) : target[prop];
    }
    return () => {};
  }
});
