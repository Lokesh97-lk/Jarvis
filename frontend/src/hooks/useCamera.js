import { useState, useEffect, useRef, useCallback } from 'react';
import { cameraService } from '../services/camera';

export function useCamera({ enabled = true, useRealStream = true } = {}) {
  const [stream, setStream] = useState(null);
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(null); // null: prompt, true: granted, false: denied
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    cameraService.getVideoDevices().then(setDevices).catch(() => {});
  }, []);

  const startStream = useCallback(async () => {
    if (!enabled || !useRealStream) {
      if (stream) {
        cameraService.stopStream(stream);
        setStream(null);
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const s = await cameraService.requestCameraStream({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false,
      });
      setStream(s);
      setHasPermission(true);
      setError(null);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        try {
          await videoRef.current.play();
        } catch {
          // Auto-play was prevented or video already playing
        }
      }
    } catch (err) {
      console.warn('[useCamera] Camera stream acquisition notice:', err.name, err.message);
      setError(err.name || err.message);
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, useRealStream]);

  useEffect(() => {
    startStream();

    return () => {
      if (stream) {
        cameraService.stopStream(stream);
      }
    };
  }, [startStream]);

  const requestPermission = useCallback(() => {
    return startStream();
  }, [startStream]);

  return { stream, videoRef, devices, error, hasPermission, isLoading, requestPermission };
}
