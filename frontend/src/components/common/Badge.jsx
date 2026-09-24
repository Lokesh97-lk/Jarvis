import React from 'react';

/**
 * Reusable Badge component for G-SIGN XR Gov Design System
 * Variants: 'crimson', 'success', 'warning', 'error', 'info', 'gold', 'neutral'
 * Types: 'pill', 'square', 'dot'
 */
export default function Badge({
  children,
  variant = 'neutral',
  icon: Icon = null,
  dot = false,
  size = 'md',
  className = '',
  style = {},
  ...props
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'crimson':
        return {
          background: 'var(--crimson-soft)',
          color: 'var(--crimson-dark)',
          border: '1px solid var(--crimson-border)',
        };
      case 'success':
        return {
          background: 'var(--success-bg)',
          color: 'var(--success-text)',
          border: '1px solid var(--success-border)',
        };
      case 'warning':
        return {
          background: 'var(--warning-bg)',
          color: 'var(--warning-text)',
          border: '1px solid var(--warning-border)',
        };
      case 'error':
        return {
          background: 'var(--error-bg)',
          color: 'var(--error-text)',
          border: '1px solid var(--error-border)',
        };
      case 'info':
        return {
          background: 'var(--info-bg)',
          color: 'var(--info-text)',
          border: '1px solid var(--info-border)',
        };
      case 'gold':
        return {
          background: 'var(--gold-light)',
          color: '#92400e',
          border: '1px solid var(--gold-border)',
        };
      case 'neutral':
      default:
        return {
          background: 'var(--bg-card-subtle)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-beige)',
        };
    }
  };

  const getDotColor = () => {
    switch (variant) {
      case 'crimson': return 'var(--crimson-primary)';
      case 'success': return '#166534';
      case 'warning': return '#b45309';
      case 'error': return '#991b1b';
      case 'info': return '#1e3a5f';
      case 'gold': return '#b45309';
      default: return 'var(--text-muted)';
    }
  };

  const isSmall = size === 'sm';

  return (
    <span
      className={`gov-badge gov-badge-${variant} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        fontSize: isSmall ? '0.7rem' : '0.76rem',
        fontWeight: 700,
        fontFamily: 'var(--font-mono)',
        padding: isSmall ? '0.12rem 0.45rem' : '0.2rem 0.6rem',
        borderRadius: 'var(--radius-full)',
        lineHeight: 1.3,
        letterSpacing: '0.02em',
        ...getVariantStyles(),
        ...style,
      }}
      {...props}
    >
      {dot && (
        <span
          style={{
            width: isSmall ? '5px' : '6px',
            height: isSmall ? '5px' : '6px',
            borderRadius: '50%',
            backgroundColor: getDotColor(),
            display: 'inline-block',
          }}
        />
      )}
      {Icon && <Icon size={isSmall ? 11 : 13} />}
      {children}
    </span>
  );
}
