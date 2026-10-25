import fs from 'fs';
import path from 'path';

// Helper to create a 44.1kHz 16-bit Mono or Stereo WAV Buffer
function createWavBuffer(sampleRate, channels, samples) {
  const bytesPerSample = 2;
  const blockAlign = channels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF Chunk
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Samples (float -1.0 to 1.0 clamped to int16)
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    const val = s < 0 ? s * 32768 : s * 32767;
    buffer.writeInt16LE(Math.floor(val), 44 + i * 2);
  }

  return buffer;
}

const sampleRate = 44100;

// 1. Launch Activation (2.5s) - Futuristic system activation & soft startup chime
function generateLaunchActivation() {
  const duration = 2.5;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    // Startup electronic tone rising from 220Hz to 440Hz
    const freq = 220 + 220 * (1 - Math.exp(-t * 3));
    const tone1 = Math.sin(2 * Math.PI * freq * t);
    const tone2 = 0.5 * Math.sin(2 * Math.PI * (freq * 1.5) * t);
    const tone3 = 0.25 * Math.sin(2 * Math.PI * (freq * 2.0) * t);
    
    // Soft high sparkle
    const shimmer = 0.15 * Math.sin(2 * Math.PI * 1760 * t) * Math.sin(2 * Math.PI * 8 * t);

    // Warm envelope
    let env = 0;
    if (t < 0.3) {
      env = t / 0.3;
    } else {
      env = Math.exp(-(t - 0.3) * 1.2);
    }

    samples[i] = (tone1 + tone2 + tone3 + shimmer) * env * 0.45;
  }
  return createWavBuffer(sampleRate, 1, samples);
}

// 2. Slide Whoosh (0.8s) - Smooth filtered air / transition whoosh
function generateSlideWhoosh() {
  const duration = 0.8;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  let noiseState = 0;
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    // Envelope: rise quickly and fall
    const env = Math.sin((t / duration) * Math.PI);
    
    // Filtered pink-ish noise
    const white = (Math.random() * 2 - 1);
    noiseState = noiseState * 0.92 + white * 0.08;
    
    // Subtle electronic pitch glide whoosh
    const fGlide = 350 + 400 * Math.sin((t / duration) * Math.PI);
    const synthTone = 0.25 * Math.sin(2 * Math.PI * fGlide * t);

    samples[i] = (noiseState * 0.75 + synthTone) * Math.pow(env, 1.8) * 0.38;
  }
  return createWavBuffer(sampleRate, 1, samples);
}

// 3. Logo Reveal (3.2s) - Gentle cinematic crystal chime & resonant harmonics
function generateLogoReveal() {
  const duration = 3.2;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  // E major pentatonic crystal notes: E5 (659.25), G#5 (830.61), B5 (987.77), E6 (1318.51)
  const notes = [
    { f: 659.25, delay: 0.0, vol: 0.35, decay: 1.5 },
    { f: 830.61, delay: 0.12, vol: 0.30, decay: 1.6 },
    { f: 987.77, delay: 0.25, vol: 0.32, decay: 1.8 },
    { f: 1318.51, delay: 0.40, vol: 0.25, decay: 2.2 },
    { f: 1975.53, delay: 0.55, vol: 0.15, decay: 2.0 },
  ];

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    let sum = 0;

    for (const n of notes) {
      if (t >= n.delay) {
        const dt = t - n.delay;
        const env = Math.exp(-dt * n.decay);
        // Pure bell-like sine + delicate octave overtone
        const chime = Math.sin(2 * Math.PI * n.f * dt) + 0.3 * Math.sin(2 * Math.PI * n.f * 2.01 * dt);
        sum += chime * env * n.vol;
      }
    }

    samples[i] = sum * 0.5;
  }
  return createWavBuffer(sampleRate, 1, samples);
}

// 4. Countdown Music (10.0s) - Premium cinematic electronic track
// Ambient synth chords, subtle rising energy, and pulsating technological heartbeat
function generateCountdownMusic() {
  const duration = 10.0;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  // 120 BPM pulse -> beat every 0.5s
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    
    // Overall track envelope (gentle fade in 0.5s, slow build, gentle fade out at end)
    let masterEnv = 1;
    if (t < 0.6) masterEnv = t / 0.6;
    if (t > 9.0) masterEnv = Math.max(0, (10.0 - t) / 1.0);

    // Warm Ambient Synth Pad Progression:
    // 0-3s: D minor (D4 293.66, F4 349.23, A4 440)
    // 3-6s: Bb major (Bb3 233.08, D4 293.66, F4 349.23)
    // 6-9s: F major add9 (F3 174.61, C4 261.63, G4 392, A4 440)
    // 9-10s: C major sus (C4 261.63, G4 392, D5 587.33)
    let chordFreqs;
    if (t < 3.0) {
      chordFreqs = [146.83, 293.66, 349.23, 440.0, 523.25]; // Dm9
    } else if (t < 6.0) {
      chordFreqs = [116.54, 233.08, 293.66, 349.23, 466.16]; // Bb maj7
    } else if (t < 8.5) {
      chordFreqs = [174.61, 261.63, 349.23, 392.0, 440.0];   // F add9
    } else {
      chordFreqs = [130.81, 261.63, 329.63, 392.0, 523.25];  // C major
    }

    let padSum = 0;
    for (let c = 0; c < chordFreqs.length; c++) {
      const f = chordFreqs[c];
      // Subtle chorus/detune for rich analog pad texture
      const osc1 = Math.sin(2 * Math.PI * f * t);
      const osc2 = Math.sin(2 * Math.PI * (f * 1.002) * t);
      padSum += (osc1 + osc2) * 0.12;
    }

    // Cinematic Heartbeat / Electronic Sub-Pulse every 0.5s (120 BPM)
    const beatTime = t % 0.5;
    const pulseEnv = Math.exp(-beatTime * 14.0);
    // 65Hz deep clean electronic sub kick with pitch bend
    const kickFreq = 65 * (1 + 2 * Math.exp(-beatTime * 40));
    const kick = Math.sin(2 * Math.PI * kickFreq * beatTime) * pulseEnv * 0.35;

    // Rising energy high shimmer / arpeggiator
    const arpSteps = [440, 523.25, 659.25, 880, 1046.5];
    const arpIndex = Math.floor(t * 4) % arpSteps.length;
    const arpTime = t % 0.25;
    const arpEnv = Math.exp(-arpTime * 10.0);
    // Intensity rises gradually across the 10 seconds
    const energyRamp = 0.05 + 0.12 * (t / 10.0);
    const arp = Math.sin(2 * Math.PI * arpSteps[arpIndex] * t) * arpEnv * energyRamp;

    samples[i] = (padSum + kick + arp) * masterEnv * 0.65;
  }
  return createWavBuffer(sampleRate, 1, samples);
}

// 5. Final Transition (3.0s) - Sub swell & triumphant release
function generateFinalTransition() {
  const duration = 3.0;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;

    // Sub bass riser swell in first 1.2s
    let riser = 0;
    if (t < 1.2) {
      const rProg = t / 1.2;
      const rFreq = 80 + 160 * Math.pow(rProg, 2);
      riser = Math.sin(2 * Math.PI * rFreq * t) * Math.pow(rProg, 2) * 0.4;
    }

    // Impact / Release at t = 1.2s
    let release = 0;
    if (t >= 1.2) {
      const dt = t - 1.2;
      const env = Math.exp(-dt * 1.5);
      // Bright major triad shimmer (D, F#, A, D)
      const c1 = Math.sin(2 * Math.PI * 587.33 * dt);
      const c2 = Math.sin(2 * Math.PI * 739.99 * dt);
      const c3 = Math.sin(2 * Math.PI * 880.00 * dt);
      const c4 = Math.sin(2 * Math.PI * 1174.66 * dt);
      release = (c1 + c2 * 0.8 + c3 * 0.7 + c4 * 0.5) * env * 0.35;
    }

    samples[i] = (riser + release) * 0.7;
  }
  return createWavBuffer(sampleRate, 1, samples);
}

const outDir = path.resolve('public', 'audio');
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, 'launch-activation.wav'), generateLaunchActivation());
fs.writeFileSync(path.join(outDir, 'slide-whoosh.wav'), generateSlideWhoosh());
fs.writeFileSync(path.join(outDir, 'logo-reveal.wav'), generateLogoReveal());
fs.writeFileSync(path.join(outDir, 'countdown-music.wav'), generateCountdownMusic());
fs.writeFileSync(path.join(outDir, 'final-transition.wav'), generateFinalTransition());

console.log('Successfully generated all 5 audio assets in public/audio/!');
