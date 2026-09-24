import { useXRState } from './useXRState';

export function useGesture() {
  const { scenario, mode } = useXRState();
  return {
    gesture: scenario.gesture,
    isDetected: mode !== 'standby' && mode !== 'error',
    confidence: scenario.gesture.confidence,
  };
}
