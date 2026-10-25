// Web Audio API Synthesizer & Cinematic Asset Player for MIC TECH-HACK 2K26
// Conforms to browser autoplay policies (initialized on explicit click)
// Supports preloaded local audio assets from /audio/*.wav with real-time procedural synthesis fallback

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.buffers = {};
    this.loadingPromises = {};
    this.activeSources = new Set();
    this.musicSource = null;
    this.musicGainNode = null;
    this.masterGainNode = null;
    this.sfxGainNode = null;
    this.isInitialized = false;

    // Default comfortable volume balance
    this.masterVolume = 1.0;
    this.musicVolume = 0.28; // 28% (within 20–35% specification)
    this.sfxVolume = 0.35;   // 35% (within 25–40% specification)

    // Preload audio files if running in browser
    if (typeof window !== 'undefined') {
      this.preloadAudioAssets();
    }
  }

  // Preload local assets from /audio/*.wav
  preloadAudioAssets() {
    const assets = {
      'launch-activation': '/audio/launch-activation.wav',
      'slide-whoosh': '/audio/slide-whoosh.wav',
      'logo-reveal': '/audio/logo-reveal.wav',
      'countdown-music': '/audio/countdown-music.wav',
      'final-transition': '/audio/final-transition.wav',
    };

    Object.entries(assets).forEach(([name, url]) => {
      this.loadingPromises[name] = fetch(url)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.arrayBuffer();
        })
        .catch(err => {
          console.warn(`[Audio] Asset /audio/${name}.wav load failed, using procedural fallback:`, err.message);
          return null;
        });
    });
  }

  // Initialize Web Audio Context on explicit user gesture (e.g. BEGIN HACKATHON click)
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

        this.musicGainNode = this.ctx.createGain();
        this.musicGainNode.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
        this.musicGainNode.connect(this.masterGainNode);
      }

      // Decode preloaded array buffers into Web Audio AudioBuffers
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

      this.isInitialized = true;
    } catch (e) {
      console.warn('[Audio] Context init warning:', e);
    }
  }

  // Toggle or set mute state
  setMuted(isMuted) {
    this.muted = !!isMuted;
    if (this.masterGainNode && this.ctx) {
      const targetGain = this.muted ? 0 : this.masterVolume;
      this.masterGainNode.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
  }

  isMuted() {
    return this.muted;
  }

  // Helper to play an AudioBuffer or fall back to procedural synthesizer
  playBufferOrFallback(name, fallbackFn, isMusic = false) {
    if (this.muted) return null;
    this.init();
    if (!this.ctx) return null;

    const buffer = this.buffers[name];
    if (buffer) {
      try {
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        const targetGain = isMusic ? this.musicGainNode : this.sfxGainNode;
        source.connect(targetGain || this.ctx.destination);
        source.start();

        this.activeSources.add(source);
        source.onended = () => {
          this.activeSources.delete(source);
        };

        if (isMusic) {
          this.musicSource = source;
        }

        return source;
      } catch (err) {
        console.warn(`[Audio] Buffer playback error for ${name}, executing fallback:`, err);
      }
    }

    // Procedural synthesis fallback
    if (typeof fallbackFn === 'function') {
      return fallbackFn.call(this);
    }

    return null;
  }

  // 1. Launch Activation: Futuristic subtle startup activation
  playLaunchActivation() {
    return this.playBufferOrFallback('launch-activation', () => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.6);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc.connect(gain);
      gain.connect(this.sfxGainNode || this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.9);
    });
  }

  // 2. Slide Whoosh: Smooth electronic slide entrance whoosh
  playSlideWhoosh() {
    return this.playBufferOrFallback('slide-whoosh', () => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.25);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.6);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc.connect(gain);
      gain.connect(this.sfxGainNode || this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.7);
    });
  }

  // 3. Logo Reveal: Gentle cinematic crystal chime & resonant harmonics
  playLogoReveal() {
    return this.playBufferOrFallback('logo-reveal', () => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const freqs = [659.25, 830.61, 987.77, 1318.51]; // E5, G#5, B5, E6

      freqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const tStart = now + idx * 0.12;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, tStart);

        gain.gain.setValueAtTime(0, tStart);
        gain.gain.linearRampToValueAtTime(0.25 / freqs.length, tStart + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, tStart + 1.8);

        osc.connect(gain);
        gain.connect(this.sfxGainNode || this.ctx.destination);

        osc.start(tStart);
        osc.stop(tStart + 2.0);
      });
    });
  }

  // 4. Countdown Music: Premium cinematic electronic instrumental track
  startCountdownMusic() {
    if (this.musicSource) {
      try { this.musicSource.stop(); } catch {}
      this.musicSource = null;
    }

    if (this.musicGainNode && this.ctx) {
      this.musicGainNode.gain.cancelScheduledValues(this.ctx.currentTime);
      this.musicGainNode.gain.setValueAtTime(0, this.ctx.currentTime);
      this.musicGainNode.gain.linearRampToValueAtTime(this.musicVolume, this.ctx.currentTime + 0.6);
    }

    return this.playBufferOrFallback('countdown-music', () => {
      // Procedural pulsating synth pad fallback
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(146.83, now); // D3 warm pad

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.20, now + 0.8);

      osc.connect(gain);
      gain.connect(this.musicGainNode || this.ctx.destination);

      osc.start(now);
      this.musicSource = osc;
    }, true);
  }

  // Stop countdown music with smooth fade-out
  stopCountdownMusic(fadeDuration = 1.0) {
    if (!this.ctx) return;
    if (this.musicGainNode) {
      const now = this.ctx.currentTime;
      this.musicGainNode.gain.cancelScheduledValues(now);
      this.musicGainNode.gain.setValueAtTime(this.musicGainNode.gain.value, now);
      this.musicGainNode.gain.linearRampToValueAtTime(0, now + fadeDuration);
    }

    setTimeout(() => {
      if (this.musicSource) {
        try { this.musicSource.stop(); } catch {}
        this.musicSource = null;
      }
    }, (fadeDuration + 0.1) * 1000);
  }

  // 5. Final Transition: Sub swell & crystal impact release
  playFinalTransition() {
    return this.playBufferOrFallback('final-transition', () => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 1.0);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      osc.connect(gain);
      gain.connect(this.sfxGainNode || this.ctx.destination);

      osc.start(now);
      osc.stop(now + 2.6);
    });
  }

  // Safe Warning Alert (30m / 5m thresholds)
  playWarningAlert(level = 'amber') {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(level === 'red' ? 880 : 587.33, now);
      osc.frequency.exponentialRampToValueAtTime(level === 'red' ? 660 : 440, now + 0.4);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGainNode || this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.7);
    } catch {}
  }

  // Safe Completion celebration sound
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
