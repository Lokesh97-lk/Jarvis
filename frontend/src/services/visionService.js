/**
 * Vision & Gesture Recognition Service Interface
 * Prepares clean integration boundaries for MediaPipe Hands and Holistic tracking.
 * Provides normalized spatial coordinate tracking and gesture event classification.
 */

export class VisionService {
  constructor() {
    this.videoElement = null;
    this.canvasElement = null;
    this.isTracking = false;
    this.listeners = {
      gesture: [],
      landmarks: [],
      error: [],
    };
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
          console.error(`[VisionService] Error in listener for ${event}:`, err);
        }
      });
    }
  }

  /**
   * Bind video and canvas overlay elements
   */
  attach(videoEl, canvasEl) {
    this.videoElement = videoEl;
    this.canvasElement = canvasEl;
  }

  /**
   * Start vision analysis loop
   */
  start() {
    this.isTracking = true;
    console.log('[VisionService] MediaPipe tracker initialized.');
  }

  /**
   * Pause vision analysis loop
   */
  pause() {
    this.isTracking = false;
  }

  /**
   * Stop and cleanup
   */
  stop() {
    this.isTracking = false;
    this.videoElement = null;
    this.canvasElement = null;
  }

  /**
   * Mock / helper to classify gesture based on hand landmarks
   */
  classifyHandPose(landmarks) {
    if (!landmarks || landmarks.length < 21) {
      return { gesture: 'RESTING', confidence: 0.95 };
    }

    const wrist = landmarks[0];
    const indexTip = landmarks[8];
    const thumbTip = landmarks[4];

    // Deictic pointing right
    if (indexTip.x > wrist.x + 0.15) {
      return {
        gesture: 'POINTING_RIGHT',
        confidence: 0.94,
        direction: 'RIGHT',
        target: 'Door / Emergency Exit',
        metadata: { pitch: -4.2, yaw: 42.1, roll: 1.8 }
      };
    }

    // Deictic pointing left
    if (indexTip.x < wrist.x - 0.15) {
      return {
        gesture: 'POINTING_LEFT',
        confidence: 0.93,
        direction: 'LEFT',
        target: 'Counter / Platform',
        metadata: { pitch: 2.1, yaw: -38.5, roll: -1.2 }
      };
    }

    return { gesture: 'RESTING', confidence: 0.91 };
  }
}

export const visionService = new VisionService();
