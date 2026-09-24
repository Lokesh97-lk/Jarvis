/**
 * Environment configuration for G-SIGN XR
 * Facilitates swapping between Standalone Mock Shell and Live Backend services.
 */

export const ENV = {
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEV: import.meta.env.DEV,
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/telemetry',
  DEFAULT_LANGUAGE: 'en-US',
  SIGN_LANGUAGE_LOCALE: 'ASL',
  ENABLE_LOCAL_SIMULATION: true,
  VERSION: '0.8.4-XR',
};
