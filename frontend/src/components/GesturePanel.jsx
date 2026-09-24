import React from 'react';
import { 
  Hand, 
  Layers, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Clock, 
  Compass, 
  Crosshair, 
  Activity, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useXRState } from '../hooks/useXRState';
import { formatPercent, formatCoord } from '../utils/formatters';

export default function GesturePanel() {
  const {
    activeScenario,
    isGestureEnabled,
    toggleGestureAnalysis,
    clearGesture,
    recentGestures,
    isCameraActive,
  } = useXRState();

  const gesture = activeScenario.gesture || {};
  const hasGesture = gesture.confidence > 0 && 
    gesture.name !== 'No intentional gesture detected' && 
    gesture.name !== 'No Gesture Tracked';

  return (
    <section className="gov-card" aria-label="Gesture and Visual Context Panel">
      {/* Header */}
      <div className="gov-card-header">
        <div className="gov-card-title-group">
          <div className="gov-card-icon gold">
            <Hand size={16} />
          </div>
          <div>
            <h2 className="gov-card-title">Gesture & Visual Context</h2>
            <p className="gov-card-subtitle">
              MediaPipe Holistic • Intentional vs Incidental Movement Filter
            </p>
          </div>
        </div>

        {/* Enable / Disable Analysis Control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            className={`btn btn-secondary ${isGestureEnabled ? 'gold' : ''}`}
            onClick={toggleGestureAnalysis}
            style={{ fontSize: '0.74rem', padding: '0.25rem 0.6rem' }}
            title={isGestureEnabled ? 'Disable gesture correlation' : 'Enable gesture correlation'}
          >
            {isGestureEnabled ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
            {isGestureEnabled ? 'Analysis Active' : 'Analysis Muted'}
          </button>

          <button
            className="btn-icon"
            onClick={clearGesture}
            disabled={!hasGesture}
            title="Clear active gesture telemetry"
            style={{ width: '30px', height: '30px', opacity: !hasGesture ? 0.5 : 1 }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="gov-card-body">
        {/* Tracking Status Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-card-subtle)',
          padding: '0.55rem 0.85rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-beige)',
          marginBottom: '0.85rem',
          fontSize: '0.76rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Activity size={14} style={{ color: isCameraActive ? 'var(--success-text)' : 'var(--text-muted)' }} />
            <span>
              Tracking: <strong>{isCameraActive ? '21 Joints / Hand Tracked' : 'Camera Stream Standby'}</strong>
            </span>
          </div>
          <div>
            Filter: <strong style={{ color: 'var(--gold-accent)' }}>Intentional Deictic Vectors Only</strong>
          </div>
        </div>

        {/* Detected Gesture Display Zone */}
        {hasGesture ? (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
            padding: '0.85rem',
            background: 'linear-gradient(135deg, #fffdf9 0%, #faf4ea 100%)',
            border: '1px solid var(--gold-border)',
            borderRadius: 'var(--radius-md)',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--gold-light)',
              color: 'var(--gold-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Crosshair size={28} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {gesture.name}
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.45rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--success-bg)',
                  color: 'var(--success-text)',
                  border: '1px solid var(--success-border)',
                }}>
                  {formatPercent(gesture.confidence)} Tracked
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                <Layers size={12} style={{ color: 'var(--crimson-primary)' }} />
                <span style={{ fontSize: '0.76rem', color: 'var(--crimson-dark)', fontWeight: 600 }}>
                  {gesture.taxonomy}
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.4rem',
                marginTop: '0.65rem',
                paddingTop: '0.55rem',
                borderTop: '1px solid var(--border-beige)',
                fontSize: '0.72rem',
              }}>
                <div>Direction: <strong>{gesture.direction}</strong></div>
                <div>Phase: <strong>{gesture.phase}</strong></div>
                <div>Velocity: <strong>{gesture.velocity}</strong></div>
              </div>
            </div>
          </div>
        ) : (
          /* Informative State When No Intentional Gesture Is Tracked */
          <div style={{
            padding: '1.25rem',
            textAlign: 'center',
            background: 'var(--bg-card-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-beige-strong)',
            color: 'var(--text-secondary)',
          }}>
            <Hand size={28} style={{ color: 'var(--text-muted)', margin: '0 auto 0.4rem auto' }} />
            <strong style={{ fontSize: '0.88rem', display: 'block', color: 'var(--text-primary)' }}>
              No intentional gesture detected
            </strong>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Incidental or resting body movements are filtered out. Speech-to-ISL pipeline functions completely on audio alone.
            </span>
          </div>
        )}

        {/* Recent Gesture History Timeline */}
        <div style={{ marginTop: '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Recent Deictic Cues
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {recentGestures.length > 0 ? `Last ${recentGestures.length} Events` : 'None in current session'}
            </span>
          </div>

          <div className="gesture-history-list">
            {recentGestures.length > 0 ? (
              recentGestures.map((rg) => (
                <div key={rg.id} className="gesture-history-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Clock size={12} style={{ color: 'var(--gold-accent)' }} />
                    <span style={{ fontWeight: 600 }}>{rg.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)' }}>
                    <span>{rg.confidence}%</span>
                    <span>{rg.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.35rem 0' }}>
                Awaiting deictic pointing gestures or spatial references...
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
