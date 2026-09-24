import React from 'react';
import { 
  GitCommit, 
  ArrowRight, 
  Play, 
  RotateCcw, 
  SlidersHorizontal,
  Bookmark
} from 'lucide-react';
import { useXRState } from '../hooks/useXRState';
import { SYSTEM_MODES } from '../utils/constants';

export default function SignSequencePanel() {
  const { scenario, currentSignIndex, mode } = useXRState();
  const sequence = scenario?.signSequence || [];

  return (
    <section className="xr-card" aria-label="Generated Sign Language Gloss Sequence">
      {/* Header */}
      <div className="xr-card-header">
        <div className="xr-card-title-group">
          <div className="xr-card-icon">
            <GitCommit size={16} />
          </div>
          <div>
            <h2 className="xr-card-title">Generated Sign Sequence</h2>
            <p className="xr-card-subtitle">Synthesized Gloss Tokens & Grammar Alignment Timeline</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Tokens: <strong>{sequence.length}</strong>
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="xr-card-body">
        {mode === SYSTEM_MODES.STANDBY || sequence.length === 0 ? (
          <div className="empty-state-card" style={{ padding: '1.5rem 1rem' }}>
            <Bookmark size={24} style={{ color: 'var(--text-subtle)' }} />
            <p style={{ fontSize: '0.86rem', fontWeight: 600 }}>Sequence Buffer Empty</p>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-subtle)' }}>
              Synthesized gloss timeline will assemble tokens as speech and gestures are processed.
            </span>
          </div>
        ) : (
          <div className="sequence-timeline-viewport">
            <div className="sequence-token-chain">
              {sequence.map((tok, idx) => {
                const isCurrent = idx === currentSignIndex;
                return (
                  <React.Fragment key={tok.id || idx}>
                    <div className={`sequence-token-chip ${isCurrent ? 'current-playing' : ''}`}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="token-grammar-role">{tok.role}</span>
                        <span className="token-duration">{tok.duration}</span>
                      </div>
                      <span className="token-gloss">[{tok.gloss}]</span>
                      {isCurrent && (
                        <span
                          style={{
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            color: 'var(--crimson-deep)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                          }}
                        >
                          <span
                            style={{
                              width: '5px',
                              height: '5px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--crimson-deep)',
                            }}
                          />
                          SIGNING
                        </span>
                      )}
                    </div>

                    {idx < sequence.length - 1 && (
                      <div className="sequence-arrow">
                        <ArrowRight size={16} />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
