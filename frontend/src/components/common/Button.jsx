import React from 'react';

/**
 * Reusable Button component matching G-SIGN XR Gov Design System
 * Variants: 'primary' (crimson), 'secondary' (cream/border), 'ghost', 'danger', 'gold', 'icon'
 * Sizes: 'sm', 'md', 'lg'
 */
export default function Button({
  children,
  variant = 'secondary',
  size = 'md',
  icon: Icon = null,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  active = false,
  className = '',
  onClick,
  type = 'button',
  title,
  ariaLabel,
  style = {},
  ...props
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'var(--crimson-primary)',
          color: '#ffffff',
          border: '1px solid var(--crimson-dark)',
          boxShadow: 'var(--shadow-crimson)',
        };
      case 'gold':
        return {
          background: 'var(--gold-accent)',
          color: '#ffffff',
          border: '1px solid #92400e',
        };
      case 'danger':
        return {
          background: 'var(--error-bg)',
          color: 'var(--error-text)',
          border: '1px solid var(--error-border)',
        };
      case 'success':
        return {
          background: 'var(--success-bg)',
          color: 'var(--success-text)',
          border: '1px solid var(--success-border)',
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: 'var(--text-secondary)',
          border: '1px solid transparent',
        };
      case 'icon':
        return {
          background: active ? 'var(--crimson-primary)' : 'var(--bg-card)',
          color: active ? '#ffffff' : 'var(--text-secondary)',
          border: `1px solid ${active ? 'var(--crimson-primary)' : 'var(--border-beige)'}`,
          padding: '0.45rem',
          borderRadius: 'var(--radius-sm)',
        };
      case 'secondary':
      default:
        return {
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-beige)',
        };
    }
  };

  const getSizeStyles = () => {
    if (variant === 'icon') return {};
    switch (size) {
      case 'sm':
        return { padding: '0.3rem 0.65rem', fontSize: '0.78rem', gap: '0.35rem' };
      case 'lg':
        return { padding: '0.65rem 1.4rem', fontSize: '0.95rem', gap: '0.6rem' };
      case 'md':
      default:
        return { padding: '0.45rem 0.95rem', fontSize: '0.85rem', gap: '0.45rem' };
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel || title}
      className={`gov-btn gov-btn-${variant} ${active ? 'active' : ''} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-main)',
        fontWeight: 600,
        borderRadius: 'var(--radius-sm)',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        transition: 'all var(--transition-fast)',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
      {...props}
    >
      {loading ? (
        <span
          className="gov-spinner"
          style={{
            width: '14px',
            height: '14px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
        </>
      )}
    </button>
  );
}
