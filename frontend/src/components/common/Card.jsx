import React from 'react';

/**
 * Reusable Card component for G-SIGN XR Gov Design System
 * Features: Elevated card background (#fffdf9), 16px radius, soft shadow, structured header & body
 */
export default function Card({
  children,
  title,
  subtitle,
  icon: Icon = null,
  headerAction = null,
  elevated = false,
  className = '',
  bodyStyle = {},
  style = {},
  ariaLabel,
  ...props
}) {
  return (
    <article
      className={`gov-card ${elevated ? 'gov-card-elevated' : ''} ${className}`}
      aria-label={ariaLabel || title}
      style={{
        background: elevated ? 'var(--bg-card-elevated)' : 'var(--bg-card)',
        border: '1px solid var(--border-beige)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
        ...style,
      }}
      {...props}
    >
      {(title || Icon || headerAction) && (
        <div
          className="gov-card-header"
          style={{
            padding: '0.85rem 1.15rem',
            borderBottom: '1px solid var(--border-beige)',
            background: 'var(--bg-card-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {Icon && (
              <div
                className="gov-card-icon"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--crimson-soft)',
                  color: 'var(--crimson-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={16} />
              </div>
            )}
            <div>
              {title && (
                <h3
                  className="gov-card-title"
                  style={{
                    margin: 0,
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <p
                  className="gov-card-subtitle"
                  style={{
                    margin: 0,
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    marginTop: '0.1rem',
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {headerAction && (
            <div className="gov-card-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {headerAction}
            </div>
          )}
        </div>
      )}

      <div
        className="gov-card-body"
        style={{
          padding: '1.15rem',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          ...bodyStyle,
        }}
      >
        {children}
      </div>
    </article>
  );
}
