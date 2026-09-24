import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useXRState } from '../hooks/useXRState';

export default function Toast() {
  const { toasts, removeToast } = useXRState();

  if (!toasts || toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={16} style={{ color: 'var(--success-text)', flexShrink: 0 }} />;
      case 'warning':
      case 'error':
        return <AlertCircle size={16} style={{ color: 'var(--crimson-primary)', flexShrink: 0 }} />;
      default:
        return <Info size={16} style={{ color: 'var(--gold-accent)', flexShrink: 0 }} />;
    }
  };

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div key={t.id} className="toast-message" role="status">
          {getIcon(t.type)}
          <div style={{ flex: 1 }}>
            <strong style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
              {t.title}
            </strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              {t.message}
            </span>
          </div>
          <button
            onClick={() => removeToast(t.id)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
            aria-label="Dismiss toast"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
