//! All the code implemented in this js is created with IA, i discovered this method to create sounds without implementing mp3 files and i hope you find it interesting too.


// ─── YellowBird Run · Sound Engine ───────────────────────────────────────────
const SoundEngine = (() => {
  let ctx = null;
  let engineNodes = null;
  let isRunning = false;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  function playStartup(onDone) {
    const ac = getCtx();
    if (ac.state === "suspended") ac.resume();
    const now = ac.currentTime;
    const duration = 2.2;

    const osc = ac.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(40, now);
    osc.frequency.linearRampToValueAtTime(110, now + 1.0);
    osc.frequency.linearRampToValueAtTime(85, now + duration);

    const osc2 = ac.createOscillator();
    osc2.type = "sawtooth";
    osc2.frequency.setValueAtTime(80, now);
    osc2.frequency.linearRampToValueAtTime(220, now + 1.0);
    osc2.frequency.linearRampToValueAtTime(170, now + duration);

    const bufSize = ac.sampleRate * 0.3;
    const noiseBuffer = ac.createBuffer(1, bufSize, ac.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ac.createBufferSource();
    noise.buffer = noiseBuffer;

    const noiseFilter = ac.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.value = 300;

    const gainMain = ac.createGain();
    gainMain.gain.setValueAtTime(0, now);
    gainMain.gain.linearRampToValueAtTime(0.01, now + 0.1);
    gainMain.gain.linearRampToValueAtTime(0.012g, now + duration - 0.2);
    gainMain.gain.linearRampToValueAtTime(0, now + duration);

    const gainNoise = ac.createGain();
    gainNoise.gain.setValueAtTime(0.03, now);
    gainNoise.gain.linearRampToValueAtTime(0, now + 0.4);

    osc.connect(gainMain);
    osc2.connect(gainMain);
    gainMain.connect(ac.destination);
    noise.connect(noiseFilter);
    noiseFilter.connect(gainNoise);
    gainNoise.connect(ac.destination);

    osc.start(now); osc2.start(now); noise.start(now);
    osc.stop(now + duration); osc2.stop(now + duration); noise.stop(now + 0.4);

    if (typeof onDone === "function") setTimeout(onDone, duration * 1000);
  }

  function startEngineLoop() {
    if (isRunning) return;
    const ac = getCtx();
    if (ac.state === "suspended") ac.resume();
    isRunning = true;
    const now = ac.currentTime;

    const osc1 = ac.createOscillator();
    osc1.type = "sawtooth";
    osc1.frequency.value = 85;

    const osc2 = ac.createOscillator();
    osc2.type = "sawtooth";
    osc2.frequency.value = 170;

    const osc3 = ac.createOscillator();
    osc3.type = "square";
    osc3.frequency.value = 255;

    const lfo = ac.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 6;

    const lfoGain = ac.createGain();
    lfoGain.gain.value = 3;
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfoGain.connect(osc2.frequency);

    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 600;
    filter.Q.value = 1.5;

    const g1 = ac.createGain(); g1.gain.value = 0.05;
    const g2 = ac.createGain(); g2.gain.value = 0.02;
    const g3 = ac.createGain(); g3.gain.value = 0.010;

    const masterGain = ac.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.05, now + 0.03);

    osc1.connect(g1); g1.connect(filter);
    osc2.connect(g2); g2.connect(filter);
    osc3.connect(g3); g3.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ac.destination);

    osc1.start(); osc2.start(); osc3.start(); lfo.start();
    engineNodes = { osc1, osc2, osc3, lfo, masterGain };
  }

  function stopEngineLoop() {
    if (!isRunning || !engineNodes) return;
    const ac = getCtx();
    const { osc1, osc2, osc3, lfo, masterGain } = engineNodes;
    const now = ac.currentTime;
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(0, now + 0.5);
    setTimeout(() => {
      try { osc1.stop(); osc2.stop(); osc3.stop(); lfo.stop(); } catch (_) {}
      engineNodes = null;
      isRunning = false;
    }, 600);
  }

  function playCollision() {
    const ac = getCtx();
    if (ac.state === "suspended") ac.resume();
    const now = ac.currentTime;

    const bufSize = ac.sampleRate * 0.3;
    const noiseBuffer = ac.createBuffer(1, bufSize, ac.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ac.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ac.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 180;
    filter.Q.value = 0.8;

    const osc = ac.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);

    const gainNoise = ac.createGain();
    gainNoise.gain.setValueAtTime(0.1, now);
    gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    const gainOsc = ac.createGain();
    gainOsc.gain.setValueAtTime(0.1, now);
    gainOsc.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    noise.connect(filter);
    filter.connect(gainNoise);
    gainNoise.connect(ac.destination);
    osc.connect(gainOsc);
    gainOsc.connect(ac.destination);

    noise.start(now); noise.stop(now + 0.3);
    osc.start(now);  osc.stop(now + 0.3);
  }

  return { playStartup, startEngineLoop, stopEngineLoop, playCollision };
})();


// ─── YellowBird Run · Music Player ───────────────────────────────────────────
const MusicPlayer = (() => {
  const tracks = [
    { title: "El Cocaino",         file: "/sounds/BSO/ElCocaino.mp3" },
    { title: "Running in the 90s", file: "/sounds/BSO/RunningInThe90s.mp3" },
    { title: "Sultans of Swing",   file: "/sounds/BSO/SultansOfSwing.mp3" },
  ];

  let currentIndex = 0;
  let audio = null;
  let isPreviewing = false;
  const titleEl = document.getElementById("music-title");
  const playBtn = document.getElementById("music-play");

  function updateUI() {
    if (titleEl) titleEl.textContent = tracks[currentIndex].title;
    if (playBtn) {
      playBtn.textContent = isPreviewing ? "⏸" : "▶";
      playBtn.classList.toggle("playing", isPreviewing);
    }
  }

  function play(index) {
    if (audio) { audio.pause(); audio.src = ""; }
    currentIndex = ((index % tracks.length) + tracks.length) % tracks.length;
    audio = new Audio(tracks[currentIndex].file);
    audio.volume = 0.03;
    audio.loop = false;
    audio.play();
    audio.addEventListener("ended", () => play(currentIndex + 1));
    isPreviewing = false;
    updateUI();
  }

  function stop() {
    if (audio) { audio.pause(); audio.src = ""; audio = null; }
    isPreviewing = false;
    updateUI();
  }

  function togglePreview() {
    if (!isPreviewing) {
      if (audio) { audio.pause(); audio.src = ""; }
      audio = new Audio(tracks[currentIndex].file);
      audio.volume = 0.04;
      audio.loop = false;
      audio.play();
      audio.addEventListener("ended", () => {
        isPreviewing = false;
        updateUI();
      });
      isPreviewing = true;
    } else {
      if (audio) { audio.pause(); audio.src = ""; audio = null; }
      isPreviewing = false;
    }
    updateUI();
  }

  function selectPrev() {
    const wasPlaying = isPreviewing;
    if (audio) { audio.pause(); audio.src = ""; audio = null; }
    isPreviewing = false;
    currentIndex = ((currentIndex - 1) % tracks.length + tracks.length) % tracks.length;
    updateUI();
    if (wasPlaying) togglePreview();
  }

  function selectNext() {
    const wasPlaying = isPreviewing;
    if (audio) { audio.pause(); audio.src = ""; audio = null; }
    isPreviewing = false;
    currentIndex = ((currentIndex + 1) % tracks.length + tracks.length) % tracks.length;
    updateUI();
    if (wasPlaying) togglePreview();
  }

  function next() { play(currentIndex + 1); }
  function prev() { play(currentIndex - 1); }

  updateUI();

  return { play, stop, next, prev, selectPrev, selectNext, togglePreview, get currentIndex() { return currentIndex; } };
})();