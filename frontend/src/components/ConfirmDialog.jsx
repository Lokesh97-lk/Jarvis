import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useXRState } from '../hooks/useXRState';

export default function ConfirmDialog() {
  const { confirmDialog, setConfirmDialog } = useXRState();

  if (!confirmDialog.isOpen) return null;

  const handleConfirm = () => {
    confirmDialog.onConfirm();
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCancel = () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="gov-modal-backdrop" onClick={handleCancel}>
      <div 
        className="gov-modal-dialog" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px' }}
        role="alertdialog"
        aria-modal="true"
      >
        <div className="gov-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} style={{ color: 'var(--crimson-primary)' }} />
            <strong style={{ fontSize: '0.98rem' }}>{confirmDialog.title}</strong>
          </div>
          <button className="btn-icon" onClick={handleCancel} aria-label="Cancel">
            <X size={16} />
          </button>
        </div>

        <div className="gov-modal-body">
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            {confirmDialog.message}
          </p>
        </div>

        <div className="gov-modal-footer">
          <button className="btn btn-secondary" onClick={handleCancel} style={{ fontSize: '0.82rem' }}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleConfirm} style={{ fontSize: '0.82rem' }}>
            Confirm Action
          </button>
        </div>
      </div>
    </div>
  );
}
