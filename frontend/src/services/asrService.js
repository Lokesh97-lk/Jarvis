/**
 * ASR & Multilingual Speech Recognition Service Interface
 * Prepares clean integration boundaries for Sherpa-ONNX, IndicASR, and Whisper
 * Operates at 16kHz mono PCM for standard speech recognition engines.
 */

export class ASRService {
  constructor(options = {}) {
    this.targetSampleRate = options.sampleRate || 16000;
    this.audioContext = null;
    this.mediaStream = null;
    this.processorNode = null;
    this.isListening = false;
    this.listeners = {
      partial: [],
      final: [],
      vad: [],
      language: [],
      error: [],
    };
  }

  /**
   * Register event listener
   */
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
          console.error(`[ASRService] Listener error for ${event}:`, err);
        }
      });
    }
  }

  /**
   * Start microphone capture and audio pipeline
   */
  async startCapture() {
    if (this.isListening) return;

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: this.targetSampleRate,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: this.targetSampleRate,
      });

      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      
      // Standard ScriptProcessor/AudioWorklet for real-time PCM extraction
      const bufferSize = 4096;
      this.processorNode = this.audioContext.createScriptProcessor(bufferSize, 1, 1);

      this.processorNode.onaudioprocess = (e) => {
        if (!this.isListening) return;
        const inputData = e.inputBuffer.getChannelData(0);
        this.processAudioChunk(inputData);
      };

      source.connect(this.processorNode);
      this.processorNode.connect(this.audioContext.destination);

      this.isListening = true;
      this.emit('vad', { active: true, message: 'Microphone stream initialized' });

      return true;
    } catch (err) {
      console.warn('[ASRService] Microphone access error:', err);
      this.emit('error', { message: err.message });
      return false;
    }
  }

  /**
   * Process raw PCM chunk and pass to VAD / WebSocket
   */
  processAudioChunk(float32Chunk) {
    // Calculate RMS energy for VAD (Voice Activity Detection)
    let sum = 0;
    for (let i = 0; i < float32Chunk.length; i++) {
      sum += float32Chunk[i] * float32Chunk[i];
    }
    const rms = Math.sqrt(sum / float32Chunk.length);
    const speechActive = rms > 0.015;

    this.emit('vad', {
      rms,
      speechActive,
      timestamp: performance.now(),
    });
  }

  /**
   * Pause listening without releasing media hardware
   */
  pause() {
    this.isListening = false;
  }

  /**
   * Resume listening
   */
  resume() {
    this.isListening = true;
  }

  /**
   * Stop microphone capture and clean up audio context
   */
  stopCapture() {
    this.isListening = false;

    if (this.processorNode) {
      this.processorNode.disconnect();
      this.processorNode = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.emit('vad', { active: false, message: 'Audio stream terminated' });
  }

  /**
   * Query or override target Indian language
   */
  setLanguage(langCode) {
    this.currentLanguage = langCode;
    this.emit('language', { language: langCode });
  }
}

export const asrService = new ASRService();
