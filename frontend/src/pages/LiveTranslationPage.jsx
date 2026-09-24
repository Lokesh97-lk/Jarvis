import React from 'react';
import CameraPanel from '../components/CameraPanel';
import AvatarPanel from '../components/AvatarPanel';
import SpeechPanel from '../components/SpeechPanel';
import CurrentCommunicationPanel from '../components/CurrentCommunicationPanel';
import ConflictResolutionCard from '../components/ConflictResolutionCard';
import SessionControls from '../components/SessionControls';
import { useXRState } from '../hooks/useXRState';
import { Sparkles, Maximize2, Radio, CheckCircle2 } from 'lucide-react';

/**
 * Live Translation Screen
 * Dedicated focused translation workspace with side-by-side live video and 3D avatar dubbing,
 * streaming captions, and real-time ISL gloss generation.
 */
export default function LiveTranslationPage() {
  const { activeScenario, sessionState, togglePresentationMode } = useXRState();

  return (
    <div className="gov-container" style={{ paddingBottom: '2.5rem' }}>
      {/* Header Quick Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Live Translation Workspace
          </h2>
          <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Real-time Continuous Dubbing • Acoustic Ingestion ➔ Multimodal Semantic Grounding ➔ 3D ISL Output
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <button
            onClick={togglePresentationMode}
            className="gov-btn"
            style={{
              background: 'var(--crimson-primary)',
              color: '#ffffff',
              border: 'none',
              padding: '0.45rem 0.95rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-crimson)',
            }}
          >
            <Maximize2 size={14} /> Fullscreen Presentation View
          </button>
        </div>
      </div>

      {/* Session Controls */}
      <SessionControls />

      {/* Human Communication Summary */}
      <CurrentCommunicationPanel />

      {/* Conditional Conflict Alert */}
      <ConflictResolutionCard />

      {/* Prominent Large Dual Viewports */}
      <section className="gov-viewports-grid" aria-label="Live Speaker and 3D Avatar Dual Viewports">
        <CameraPanel />
        <AvatarPanel />
      </section>

      {/* Live Speech Workspace */}
      <div style={{ marginTop: '1.25rem' }}>
        <SpeechPanel />
      </div>
    </div>
  );
}
