// Web Audio API Synthesizer - Silenced per user request ("remove sound also")
// Wrapped with safe proxy to prevent any missing method invocation from throwing exceptions

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.muted = true;
    this.masterVolume = 0;
  }

  init() {}
  setMuted() { this.muted = true; }
  isMuted() { return true; }
  playActivationSound() {}
  playCountdownBeat() {}
  playTick() {}
  playEnergyReveal() {}
  playProblemStatementTransition() {}
  playWarningChime() {}
  playWarningAlert() {}
  playCompletionCelebration() {}
  playCompletionSound() {}
}

const baseSound = new SoundSystem();

// Proxy guarantees that calling sound.<anything>() will safely no-op instead of throwing TypeError
export const sound = new Proxy(baseSound, {
  get(target, prop) {
    if (prop in target) {
      return typeof target[prop] === 'function' ? target[prop].bind(target) : target[prop];
    }
    return () => {};
  }
});
