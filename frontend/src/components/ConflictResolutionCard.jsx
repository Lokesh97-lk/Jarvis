import React from 'react';
import { AlertTriangle, ArrowRightLeft, Check, RefreshCw, HelpCircle, ShieldAlert } from 'lucide-react';
import { useXRState } from '../hooks/useXRState';

/**
 * Speech-Gesture Conflict Card
 * Only visible when a cross-modal contradiction is detected (e.g. speech says LEFT, gesture points RIGHT)
 * Uses the warning palette (#ffedd5, #9a3412, #fdba74)
 */
export default function ConflictResolutionCard() {
  const {
    activeScenario,
    resolveConflictWithSpeech,
    resolveConflictWithGesture,
    reprocessInterpretation,
    requestClarification,
  } = useXRState();

  const isConflict = Boolean(activeScenario?.jarvis?.conflictDetected);

  // If no conflict exists, keep completely unobtrusive as requested
  if (!isConflict) return null;

  const note = activeScenario.jarvis.conflictNote || 
    'Acoustic verbal direction contradicts physical arm gesture (Speech indicates RIGHT, gesture points LEFT). Spatial grounding resolution required for ISL generation.';

  return (
    <div
      className="gov-card"
      style={{
        background: 'var(--warning-bg)',
        border: '1.5px solid var(--warning-border)',
        borderRadius: 'var(--radius-card)',
        padding: '1rem 1.25rem',
        marginBottom: '1rem',
        animation: 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 8px 24px rgba(154, 52, 18, 0.12)',
      }}
      role="alert"
      aria-live="assertive"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.65rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: '#ea580c',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShieldAlert size={18} />
          </div>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '0.96rem',
                fontWeight: 800,
                color: 'var(--warning-text)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              Cross-Modal Conflict Detected: Speech vs. Gesture
            </h3>
            <span style={{ fontSize: '0.74rem', color: '#7c2d12', fontWeight: 600 }}>
              AI Confidence: 94.2% • Human In-The-Loop Disambiguation
            </span>
          </div>
        </div>

        {/* Warning Badge */}
        <span
          style={{
            background: '#ffedd5',
            color: '#9a3412',
            border: '1px solid #ea580c',
            borderRadius: 'var(--radius-full)',
            padding: '0.2rem 0.6rem',
            fontSize: '0.72rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
          }}
        >
          CONFLICT MARKER
        </span>
      </div>

      {/* Explanation Box */}
      <p
        style={{
          margin: '0 0 0.85rem 0',
          fontSize: '0.84rem',
          lineHeight: 1.45,
          color: '#7c2d12',
          background: 'rgba(255, 255, 255, 0.6)',
          padding: '0.65rem 0.85rem',
          borderRadius: 'var(--radius-xs)',
          border: '1px solid rgba(234, 88, 12, 0.25)',
        }}
      >
        <strong>Discrepancy:</strong> {note}
      </p>

      {/* Action Buttons Cluster */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={resolveConflictWithSpeech}
          className="gov-btn"
          style={{
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid #ea580c',
            padding: '0.35rem 0.75rem',
            fontSize: '0.78rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <Check size={14} style={{ color: '#16a34a' }} />
          Resolve with Speech Priority
        </button>

        <button
          onClick={resolveConflictWithGesture}
          className="gov-btn"
          style={{
            background: '#ea580c',
            color: '#ffffff',
            border: '1px solid #c2410c',
            padding: '0.35rem 0.75rem',
            fontSize: '0.78rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            boxShadow: '0 2px 8px rgba(234, 88, 12, 0.25)',
          }}
        >
          <ArrowRightLeft size={14} />
          Resolve with Gesture (Spatial Priority)
        </button>

        <button
          onClick={reprocessInterpretation}
          className="gov-btn"
          style={{
            background: 'transparent',
            color: 'var(--warning-text)',
            border: '1px solid rgba(154, 52, 18, 0.35)',
            padding: '0.35rem 0.65rem',
            fontSize: '0.78rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <RefreshCw size={13} />
          Reprocess
        </button>

        <button
          onClick={requestClarification}
          className="gov-btn"
          style={{
            background: 'transparent',
            color: 'var(--warning-text)',
            border: '1px solid rgba(154, 52, 18, 0.35)',
            padding: '0.35rem 0.65rem',
            fontSize: '0.78rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <HelpCircle size={13} />
          Request Clarification
        </button>
      </div>
    </div>
  );
}
