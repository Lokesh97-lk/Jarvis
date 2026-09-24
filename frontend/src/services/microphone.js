/**
 * Microphone & Audio Ingestion Service
 * Handles browser microphone access, AudioContext, RMS level metering, and audio chunking.
 */

export class MicrophoneService {
  constructor() {
    this.audioContext = null;
    this.mediaStream = null;
    this.analyser = null;
    this.source = null;
    this.isListening = false;
    this.listeners = {
      level: [],
      state: [],
      error: [],
    };
    this.animationFrame = null;
  }

  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
    return () => {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    };
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((cb) => {
        try {
          cb(data);
        } catch (err) {
          console.error(`[MicrophoneService] Listener error for ${event}:`, err);
        }
      });
    }
  }

  async start() {
    if (this.isListening) return true;
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.source.connect(this.analyser);

      this.isListening = true;
      this.emit('state', { isListening: true });
      this.startMetering();
      return true;
    } catch (err) {
      console.warn('[MicrophoneService] Could not access physical microphone:', err.message);
      this.emit('error', { message: err.message });
      // Fallback: start simulated metering for seamless offline experience
      this.startSimulatedMetering();
      this.isListening = true;
      this.emit('state', { isListening: true, simulated: true });
      return true;
    }
  }

  startMetering() {
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    const loop = () => {
      if (!this.isListening || !this.analyser) return;
      this.analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;
      const normalizedLevel = Math.min(1.0, avg / 128);
      this.emit('level', { level: normalizedLevel, raw: avg });
      this.animationFrame = requestAnimationFrame(loop);
    };
    loop();
  }

  startSimulatedMetering() {
    const loop = () => {
      if (!this.isListening) return;
      const simulatedLevel = 0.15 + Math.random() * 0.45;
      this.emit('level', { level: simulatedLevel, simulated: true });
      this.animationFrame = setTimeout(loop, 120);
    };
    loop();
  }

  pause() {
    this.isListening = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      clearTimeout(this.animationFrame);
    }
    this.emit('state', { isListening: false, paused: true });
  }

  resume() {
    if (!this.isListening) {
      this.isListening = true;
      this.emit('state', { isListening: true });
      if (this.analyser) {
        this.startMetering();
      } else {
        this.startSimulatedMetering();
      }
    }
  }

  stop() {
    this.isListening = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      clearTimeout(this.animationFrame);
    }
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.emit('state', { isListening: false });
  }
}

export const microphoneService = new MicrophoneService();
