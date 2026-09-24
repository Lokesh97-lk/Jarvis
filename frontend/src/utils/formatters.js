/**
 * Formatting utilities for telemetry coordinates, numbers, percentages and labels.
 */

export const formatPercent = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '0.0%';
  return `${Number(val).toFixed(1)}%`;
};

export const formatCoord = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '0.00';
  const prefix = val >= 0 ? '+' : '';
  return `${prefix}${Number(val).toFixed(2)}`;
};

export const formatAngle = (deg) => {
  if (deg === undefined || deg === null || isNaN(deg)) return '0.0°';
  const prefix = deg >= 0 ? '+' : '';
  return `${prefix}${Number(deg).toFixed(1)}°`;
};

export const formatLatency = (ms) => {
  if (ms === undefined || ms === null || isNaN(ms)) return '0ms';
  return `${Math.round(ms)}ms`;
};

export const getConfidenceColor = (confidence) => {
  if (confidence >= 85) return 'var(--status-success)';
  if (confidence >= 60) return 'var(--gold-muted)';
  return 'var(--crimson-deep)';
};

export const getUrgencyClass = (urgency) => {
  switch (urgency?.toLowerCase()) {
    case 'high':
    case 'critical':
      return 'high';
    case 'medium':
    case 'moderate':
      return 'medium';
    default:
      return 'normal';
  }
};
