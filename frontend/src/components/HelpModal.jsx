import React from 'react';
import { 
  X, 
  HelpCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Keyboard, 
  Globe, 
  Workflow 
} from 'lucide-react';
import { useXRState } from '../hooks/useXRState';

export default function HelpModal() {
  const { isHelpOpen, setIsHelpOpen } = useXRState();

  if (!isHelpOpen) return null;

  return (
    <div className="gov-modal-backdrop" onClick={() => setIsHelpOpen(false)}>
      <div 
        className="gov-modal-dialog" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-dialog-title"
      >
        {/* Header */}
        <div className="gov-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="gov-card-icon">
              <HelpCircle size={16} />
            </div>
            <div>
              <h3 id="help-dialog-title" style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                About G-SIGN XR & National Accessibility
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Government Multimodal Speech-to-ISL Dubbing Architecture
              </p>
            </div>
          </div>

          <button
            className="btn-icon"
            onClick={() => setIsHelpOpen(false)}
            aria-label="Close help"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="gov-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.85rem' }}>
          <div>
            <h4 style={{ fontSize: '0.92rem', color: 'var(--crimson-dark)', marginBottom: '0.35rem' }}>
              Mission & Core Architecture
            </h4>
            <p style={{ lineHeight: '1.55', color: 'var(--text-secondary)' }}>
              G-SIGN XR is engineered as a national public accessibility platform that continuously ingests spoken announcements, lectures, meetings, healthcare directives, and railway communications across Indian languages and renders certified Indian Sign Language (ISL) through an expressive 3D humanoid avatar.
            </p>
          </div>

          <div style={{ background: 'var(--bg-card-subtle)', border: '1px solid var(--border-beige)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
            <h5 style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
              Key Operational Principles:
            </h5>
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <li><strong>Continuous Live Speech:</strong> Listens without waiting for predefined push-to-talk commands.</li>
              <li><strong>Original Transcript Preservation:</strong> Tamil, Hindi, or Malayalam text is preserved and displayed live.</li>
              <li><strong>Parallel Visual Context:</strong> Gestures are an additional channel; if no gesture is made, dubbing continues normally.</li>
              <li><strong>Speech–Gesture Contradiction Detection:</strong> Detects ambiguities (e.g. saying left while pointing right).</li>
              <li><strong>Zero Hallucination ISL:</strong> Only validated ISL lexicon signs or fingerspelling fallbacks are permitted.</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
              <Keyboard size={15} style={{ color: 'var(--gold-accent)' }} /> Keyboard Accessibility Shortcuts
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.78rem' }}>
              <div><kbd style={{ background: '#eee', padding: '0.1rem 0.35rem', borderRadius: '3px' }}>Space</kbd> Play / Pause Avatar</div>
              <div><kbd style={{ background: '#eee', padding: '0.1rem 0.35rem', borderRadius: '3px' }}>M</kbd> Mute / Unmute Microphone</div>
              <div><kbd style={{ background: '#eee', padding: '0.1rem 0.35rem', borderRadius: '3px' }}>C</kbd> Toggle Camera Feed</div>
              <div><kbd style={{ background: '#eee', padding: '0.1rem 0.35rem', borderRadius: '3px' }}>R</kbd> Restart ISL Sequence</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="gov-modal-footer">
          <button
            className="btn btn-primary"
            onClick={() => setIsHelpOpen(false)}
            style={{ fontSize: '0.82rem' }}
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
