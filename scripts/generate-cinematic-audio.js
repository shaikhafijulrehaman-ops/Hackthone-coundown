import fs from 'fs';
import path from 'path';

function createWavBuffer(sampleRate, channels, samplesL, samplesR = null) {
  const isStereo = channels === 2 && samplesR !== null;
  const numChannels = isStereo ? 2 : 1;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const numFrames = samplesL.length;
  const dataSize = numFrames * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34);

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < numFrames; i++) {
    const sL = Math.max(-1, Math.min(1, samplesL[i]));
    const valL = sL < 0 ? sL * 32768 : sL * 32767;
    buffer.writeInt16LE(Math.floor(valL), offset);
    offset += 2;

    if (isStereo) {
      const sR = Math.max(-1, Math.min(1, samplesR[i]));
      const valR = sR < 0 ? sR * 32768 : sR * 32767;
      buffer.writeInt16LE(Math.floor(valR), offset);
      offset += 2;
    }
  }

  return buffer;
}

const sampleRate = 44100;

// 1. CONTINUOUS CINEMATIC MUSIC TRACK (35.0s)
// Features: Ambient opening -> warm string pads -> rhythmic suspense build-up -> countdown crescendo -> triumph climax -> smooth fade out
function generateLaunchMusic() {
  const duration = 35.0;
  const totalSamples = Math.floor(sampleRate * duration);
  const left = new Float32Array(totalSamples);
  const right = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;

    // Master Envelope:
    // 0.0s - 1.5s: Gentle fade-in
    // 1.5s - 20.0s: Steady warm presence
    // 20.0s - 29.0s: Rising tension build-up
    // 29.0s - 31.6s: Climax announcement release
    // 31.6s - 35.0s: Smooth fade-out to silence
    let masterEnv = 1.0;
    if (t < 1.5) {
      masterEnv = t / 1.5;
    } else if (t > 31.6) {
      masterEnv = Math.max(0, (35.0 - t) / 3.4);
    }

    // --- Atmospheric Drone & Sub Bass ---
    // Deep fundamental D1 (73.4Hz) with subtle pitch drift and warmth
    const subFreq = 73.416;
    const subDrone = Math.sin(2 * Math.PI * subFreq * t) * 0.22 +
                     Math.sin(2 * Math.PI * (subFreq * 0.5) * t) * 0.12;

    // --- Chord Harmonies across stages ---
    // 0.0s – 8.0s (Slides 1 & 2): D minor 9 (D3, F3, A3, C4, E4)
    // 8.0s – 16.0s (Slides 3 & 4): Bb major 7 / F add9 (Bb2, F3, A3, D4)
    // 16.0s – 20.0s (Slide 5 Logo): G minor 7 / A sus (G2, D3, F3, Bb3, D4)
    // 20.0s – 29.0s (Countdown 3, 2, 1): D minor rising staccatos (D3, A3, D4, F4) with rising octave tension
    // 29.0s – 35.0s (HACKATHON BEGINS NOW): D Major triumphant chord (D3, F#3, A3, D4, F#4)
    let chordNotes;
    if (t < 8.0) {
      chordNotes = [146.83, 174.61, 220.00, 261.63, 329.63];
    } else if (t < 16.0) {
      chordNotes = [116.54, 174.61, 220.00, 293.66, 349.23];
    } else if (t < 20.0) {
      chordNotes = [98.00, 146.83, 174.61, 233.08, 293.66];
    } else if (t < 29.0) {
      // Countdown tension: intensity increases smoothly as t progresses
      chordNotes = [146.83, 220.00, 293.66, 349.23, 440.00, 587.33];
    } else {
      // Triumphant D Major climax
      chordNotes = [146.83, 185.00, 220.00, 293.66, 369.99, 440.00];
    }

    let padL = 0;
    let padR = 0;
    for (let c = 0; c < chordNotes.length; c++) {
      const f = chordNotes[c];
      // Stereo detuned oscillators for lush analog chorus
      const detuneL = 1.0015;
      const detuneR = 0.9985;
      const oscL = Math.sin(2 * Math.PI * (f * detuneL) * t);
      const oscR = Math.sin(2 * Math.PI * (f * detuneR) * t);
      const weight = 0.08 / Math.sqrt(chordNotes.length);
      padL += oscL * weight;
      padR += oscR * weight;
    }

    // --- Cinematic Rhythmic Pulse & Riser during Countdown (20.0s – 29.0s) ---
    let pulseL = 0;
    let pulseR = 0;
    if (t >= 18.0 && t < 29.0) {
      const countdownProgress = (t - 18.0) / 11.0; // 0 to 1
      // 120 BPM pulse (every 0.5s)
      const beatPhase = (t % 0.5) / 0.5;
      const beatEnv = Math.exp(-beatPhase * 10.0);
      const kickFreq = 55 + 40 * (1 - beatPhase);
      const kick = Math.sin(2 * Math.PI * kickFreq * t) * beatEnv * (0.2 + 0.3 * countdownProgress);

      // Rising tension synth arpeggio (faster 16th notes during final countdown)
      const arpFreqs = [293.66, 349.23, 440.00, 523.25, 587.33, 698.46, 880.00];
      const arpSpeed = t >= 26.0 ? 8 : 4; // faster during 1
      const arpIdx = Math.floor(t * arpSpeed) % arpFreqs.length;
      const arpPhase = (t * arpSpeed) % 1;
      const arpEnv = Math.exp(-arpPhase * 8.0);
      const arpTone = Math.sin(2 * Math.PI * arpFreqs[arpIdx] * t) * arpEnv * (0.05 + 0.15 * countdownProgress);

      // Low riser sweep
      const riserFreq = 80 + 350 * Math.pow(countdownProgress, 2.5);
      const riser = Math.sin(2 * Math.PI * riserFreq * t) * Math.pow(countdownProgress, 2) * 0.18;

      pulseL = (kick + arpTone * 0.8 + riser * 0.7);
      pulseR = (kick + arpTone * 1.2 + riser * 0.7);
    }

    // --- Climax Resonance at 29.0s ---
    let climaxL = 0;
    let climaxR = 0;
    if (t >= 29.0) {
      const dt = t - 29.0;
      const climEnv = Math.exp(-dt * 0.8);
      const shimmer = Math.sin(2 * Math.PI * 1174.66 * dt) * 0.08 +
                      Math.sin(2 * Math.PI * 1760.00 * dt) * 0.05;
      climaxL = shimmer * climEnv;
      climaxR = shimmer * climEnv;
    }

    const totalL = (subDrone + padL + pulseL + climaxL) * masterEnv;
    const totalR = (subDrone + padR + pulseR + climaxR) * masterEnv;

    left[i] = totalL * 0.65;
    right[i] = totalR * 0.65;
  }

  return createWavBuffer(sampleRate, 2, left, right);
}

// 2. SFX: System Activation (Slide 1, t = 0)
function generateSfxActivation() {
  const duration = 2.0;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const freq = 220 + 220 * (1 - Math.exp(-t * 4));
    const tone = Math.sin(2 * Math.PI * freq * t) + 0.4 * Math.sin(2 * Math.PI * freq * 2 * t);
    const env = t < 0.2 ? (t / 0.2) : Math.exp(-(t - 0.2) * 1.8);
    samples[i] = tone * env * 0.4;
  }
  return createWavBuffer(sampleRate, 1, samples);
}

// 3. SFX: Subtle Slide Transition Whoosh (Slide 2, 3, 4)
function generateSfxTransition() {
  const duration = 0.75;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  let noiseState = 0;
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const env = Math.sin((t / duration) * Math.PI);
    const white = Math.random() * 2 - 1;
    noiseState = noiseState * 0.90 + white * 0.10;
    const glide = 300 + 350 * Math.sin((t / duration) * Math.PI);
    const tone = 0.2 * Math.sin(2 * Math.PI * glide * t);
    samples[i] = (noiseState * 0.6 + tone) * Math.pow(env, 2) * 0.35;
  }
  return createWavBuffer(sampleRate, 1, samples);
}

// 4. SFX: College Logo Reveal Chime (Slide 5, t = 16s)
function generateSfxLogoReveal() {
  const duration = 2.8;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  const notes = [
    { f: 659.25, d: 0.00, v: 0.32, k: 1.4 },
    { f: 830.61, d: 0.10, v: 0.28, k: 1.5 },
    { f: 987.77, d: 0.22, v: 0.30, k: 1.7 },
    { f: 1318.51, d: 0.36, v: 0.25, k: 2.0 },
    { f: 1975.53, d: 0.50, v: 0.16, k: 2.2 },
  ];

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    let s = 0;
    for (const n of notes) {
      if (t >= n.d) {
        const dt = t - n.d;
        const env = Math.exp(-dt * n.k);
        const chime = Math.sin(2 * Math.PI * n.f * dt) + 0.25 * Math.sin(2 * Math.PI * n.f * 2.01 * dt);
        s += chime * env * n.v;
      }
    }
    samples[i] = s * 0.5;
  }
  return createWavBuffer(sampleRate, 1, samples);
}

// 5. SFX: Countdown 3 — Restrained cinematic pulse
function generateSfxCountdown3() {
  const duration = 1.2;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * 3.5);
    // Deep warm pulse at 80Hz falling to 55Hz
    const freq = 55 + 25 * Math.exp(-t * 12);
    const tone = Math.sin(2 * Math.PI * freq * t) + 0.3 * Math.sin(2 * Math.PI * freq * 2 * t);
    samples[i] = tone * env * 0.45;
  }
  return createWavBuffer(sampleRate, 1, samples);
}

// 6. SFX: Countdown 2 — Stronger cinematic pulse
function generateSfxCountdown2() {
  const duration = 1.2;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * 3.0);
    // Punchier pulse with higher harmonic bite
    const freq = 65 + 40 * Math.exp(-t * 15);
    const tone = Math.sin(2 * Math.PI * freq * t) + 
                 0.45 * Math.sin(2 * Math.PI * freq * 2 * t) +
                 0.20 * Math.sin(2 * Math.PI * freq * 3 * t);
    samples[i] = tone * env * 0.55;
  }
  return createWavBuffer(sampleRate, 1, samples);
}

// 7. SFX: Countdown 1 — Strongest accent with rising tension energy
function generateSfxCountdown1() {
  const duration = 1.6;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    // Initial punch
    const punchEnv = Math.exp(-t * 2.8);
    const freq = 80 + 60 * Math.exp(-t * 18);
    const punch = (Math.sin(2 * Math.PI * freq * t) + 0.5 * Math.sin(2 * Math.PI * freq * 2 * t)) * punchEnv * 0.6;

    // Short rising tension riser leading into 0
    let riser = 0;
    if (t > 0.3) {
      const rt = (t - 0.3) / 1.3;
      const rFreq = 120 + 380 * Math.pow(rt, 2);
      riser = Math.sin(2 * Math.PI * rFreq * t) * Math.pow(rt, 2) * 0.35;
    }

    samples[i] = (punch + riser) * 0.7;
  }
  return createWavBuffer(sampleRate, 1, samples);
}

// 8. SFX: Final Launch Impact (at "HACKATHON BEGINS NOW", t = 29s)
function generateSfxLaunchImpact() {
  const duration = 3.0;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;

    // Heavy low cinematic sub boom
    const boomEnv = Math.exp(-t * 1.5);
    const boomFreq = 50 + 60 * Math.exp(-t * 10);
    const boom = Math.sin(2 * Math.PI * boomFreq * t) * boomEnv * 0.7;

    // Crystal major triad chord release
    const chordEnv = Math.exp(-t * 1.2);
    const c1 = Math.sin(2 * Math.PI * 587.33 * t);
    const c2 = Math.sin(2 * Math.PI * 739.99 * t);
    const c3 = Math.sin(2 * Math.PI * 880.00 * t);
    const c4 = Math.sin(2 * Math.PI * 1174.66 * t);
    const chord = (c1 + c2 * 0.8 + c3 * 0.7 + c4 * 0.5) * chordEnv * 0.35;

    samples[i] = (boom + chord) * 0.8;
  }
  return createWavBuffer(sampleRate, 1, samples);
}

const outDir = path.resolve('public', 'audio');
fs.mkdirSync(outDir, { recursive: true });

// Continuous Soundtrack
const musicBuffer = generateLaunchMusic();
fs.writeFileSync(path.join(outDir, 'launch-music.wav'), musicBuffer);
// Also write launch-music.mp3 so both filenames exist seamlessly
fs.writeFileSync(path.join(outDir, 'launch-music.mp3'), musicBuffer);

// Distinct Sound Effects
fs.writeFileSync(path.join(outDir, 'sfx-activation.wav'), generateSfxActivation());
fs.writeFileSync(path.join(outDir, 'sfx-transition.wav'), generateSfxTransition());
fs.writeFileSync(path.join(outDir, 'sfx-logo-reveal.wav'), generateSfxLogoReveal());
fs.writeFileSync(path.join(outDir, 'sfx-countdown-3.wav'), generateSfxCountdown3());
fs.writeFileSync(path.join(outDir, 'sfx-countdown-2.wav'), generateSfxCountdown2());
fs.writeFileSync(path.join(outDir, 'sfx-countdown-1.wav'), generateSfxCountdown1());
fs.writeFileSync(path.join(outDir, 'sfx-launch-impact.wav'), generateSfxLaunchImpact());

console.log('Successfully generated launch-music and distinct SFX in public/audio/!');
