/**
 * Camera Service for G-SIGN XR
 * Handles browser media device streams or simulates realistic synthetic camera feeds.
 */

export const cameraService = {
  /**
   * Request user webcam stream
   */
  async requestCameraStream(constraints = { video: { width: 1280, height: 720 }, audio: false }) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('MediaDevices API not available in this browser environment');
    }
    return await navigator.mediaDevices.getUserMedia(constraints);
  },

  /**
   * Stop active stream tracks
   */
  stopStream(stream) {
    if (stream && stream.getTracks) {
      stream.getTracks().forEach((track) => track.stop());
    }
  },

  /**
   * Enumerate available video inputs
   */
  async getVideoDevices() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return [];
    }
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === 'videoinput');
  }
};
