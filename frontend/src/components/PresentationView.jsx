import React from 'react';
import { X, Maximize2, Minimize2, Play, Pause, RotateCcw, Volume2, Globe, Sparkles } from 'lucide-react';
import { useXRState } from '../hooks/useXRState';
import CameraPanel from './CameraPanel';
import AvatarPanel from './AvatarPanel';

/**
 * Fullscreen Judge Presentation View
 * Strips away administrative widgets and presents an ultra-clean, high-impact demonstration
 * containing: Live Speaker, Transcript, JARVIS Intent Summary, ISL Sign Sequence, and 3D Avatar.
 */
export default function PresentationView() {
  const {
    presentationMode,
    togglePresentationMode,
    activeScenario,
    sessionState,
    pauseProcessing,
    resumeProcessing,
    restartSequence,
    currentSignIndex,
    isAvatarPlaying,
  } = useXRState();

  if (!presentationMode) return null;

  return (
    <div
      className="gov-presentation-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'var(--bg-main)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'fadeIn 0.25s ease-out',
      }}
    >
      {/* Top Banner */}
      <div
        style={{
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-beige)',
          padding: '0.65rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--crimson-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={18} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              G-SIGN XR • Live Accessibility Dubbing
            </h2>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
              Presentation Demonstration Mode • Real-Time Speech to Indian Sign Language
            </span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {sessionState === 'active' ? (
            <button
              onClick={pauseProcessing}
              className="gov-btn"
              style={{
                background: 'var(--gold-accent)',
                color: '#ffffff',
                border: 'none',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
              }}
            >
              <Pause size={14} /> Pause
            </button>
          ) : (
            <button
              onClick={resumeProcessing}
              className="gov-btn"
              style={{
                background: 'var(--crimson-primary)',
                color: '#ffffff',
                border: 'none',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
              }}
            >
              <Play size={14} /> Resume
            </button>
          )}

          <button
            onClick={restartSequence}
            className="gov-btn"
            style={{
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-beige)',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={14} /> Restart Sequence
          </button>

          <button
            onClick={togglePresentationMode}
            className="gov-btn"
            style={{
              background: 'var(--crimson-soft)',
              color: 'var(--crimson-dark)',
              border: '1px solid var(--crimson-border)',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
            }}
          >
            <Minimize2 size={14} /> Exit Presentation View
          </button>
        </div>
      </div>

      {/* Main Split Viewport */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          padding: '1rem 1.5rem',
          overflow: 'hidden',
        }}
      >
        <div style={{ height: '100%', overflow: 'hidden' }}>
          <CameraPanel />
        </div>
        <div style={{ height: '100%', overflow: 'hidden' }}>
          <AvatarPanel />
        </div>
      </div>

      {/* Bottom Floating Telemetry & ISL Gloss Bar */}
      <div
        style={{
          background: 'var(--bg-card)',
          borderTop: '1px solid var(--border-beige)',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.55rem',
        }}
      >
        {/* Human Interpretation Summary */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span
              style={{
                background: 'var(--crimson-primary)',
                color: '#ffffff',
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.72rem',
                fontWeight: 800,
                textTransform: 'uppercase',
              }}
            >
              Interpreted Meaning
            </span>
            <span style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              “{activeScenario.normalizedMeaning}”
            </span>
          </div>

          <span
            style={{
              fontSize: '0.76rem',
              fontWeight: 700,
              color: 'var(--success-text)',
              background: 'var(--success-bg)',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--success-border)',
            }}
          >
            {activeScenario.languageLabel} ➔ Indian Sign Language
          </span>
        </div>

        {/* Live Sign Chips Sequence */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>
            Live ISL Tokens:
          </span>
          {activeScenario.signSequence.map((sign, idx) => {
            const isActive = idx === currentSignIndex && isAvatarPlaying && sessionState === 'active';
            return (
              <span
                key={sign.id || idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.2rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  background: isActive ? 'var(--crimson-primary)' : 'var(--bg-card-subtle)',
                  color: isActive ? '#ffffff' : 'var(--text-primary)',
                  border: `1.5px solid ${isActive ? 'var(--crimson-dark)' : 'var(--border-beige)'}`,
                  boxShadow: isActive ? 'var(--shadow-crimson)' : 'none',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ opacity: isActive ? 0.9 : 0.5, fontSize: '0.7rem' }}>#{idx + 1}</span>
                {sign.gloss}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
