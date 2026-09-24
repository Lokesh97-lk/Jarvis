import React from 'react';

/**
 * Reusable StatusIndicator component for pipeline stages and system status items
 * States: 'ready' | 'processing' | 'complete' | 'warning' | 'error' | 'connected' | 'degraded' | 'disconnected'
 */
export default function StatusIndicator({
  status = 'ready',
  label,
  sublabel,
  pulse = false,
  size = 'md',
  onClick,
  className = '',
  style = {},
}) {
  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case 'ready':
      case 'complete':
      case 'connected':
      case 'active':
        return {
          color: '#166534',
          bg: '#dcfce7',
          border: '#86efac',
          dot: '#16a34a',
          label: label || 'Ready',
        };
      case 'processing':
      case 'running':
        return {
          color: '#9b1c2c',
          bg: '#f3d6d8',
          border: '#e4d8cc',
          dot: '#9b1c2c',
          pulse: true,
          label: label || 'Processing',
        };
      case 'warning':
      case 'degraded':
      case 'paused':
        return {
          color: '#9a3412',
          bg: '#ffedd5',
          border: '#fdba74',
          dot: '#ea580c',
          label: label || 'Degraded',
        };
      case 'error':
      case 'disconnected':
      case 'inactive':
        return {
          color: '#991b1b',
          bg: '#fee2e2',
          border: '#fca5a5',
          dot: '#dc2626',
          label: label || 'Error',
        };
      default:
        return {
          color: '#5c534c',
          bg: '#f6f1ea',
          border: '#e4d8cc',
          dot: '#a8a29e',
          label: label || status,
        };
    }
  };

  const config = getStatusConfig();
  const shouldPulse = pulse || config.pulse;

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`gov-status-indicator ${onClick ? 'interactive' : ''} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: size === 'sm' ? '0.15rem 0.45rem' : '0.25rem 0.65rem',
        background: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: 'var(--radius-full)',
        color: config.color,
        fontSize: size === 'sm' ? '0.7rem' : '0.76rem',
        fontWeight: 700,
        fontFamily: 'var(--font-mono)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all var(--transition-fast)',
        ...style,
      }}
    >
      <span
        style={{
          width: size === 'sm' ? '6px' : '7px',
          height: size === 'sm' ? '6px' : '7px',
          borderRadius: '50%',
          backgroundColor: config.dot,
          display: 'inline-block',
          boxShadow: shouldPulse ? `0 0 0 2px ${config.bg}, 0 0 8px ${config.dot}` : 'none',
          animation: shouldPulse ? 'pulseDot 1.5s infinite ease-in-out' : 'none',
        }}
      />
      <span>{config.label}</span>
      {sublabel && (
        <span style={{ opacity: 0.75, fontWeight: 500, fontSize: '0.68rem' }}>
          • {sublabel}
        </span>
      )}
    </div>
  );
}
