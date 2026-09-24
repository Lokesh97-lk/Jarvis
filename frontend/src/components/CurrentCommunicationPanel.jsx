import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, MessageSquare, Volume2, Shield, Radio, Clock } from 'lucide-react';
import { useXRState, SESSION_STATES } from '../hooks/useXRState';

/**
 * Current Communication Summary Panel
 * Designed for judges, accessibility officers, and non-technical observers
 * Gives a clean human-readable summary of speech interpretation and ISL output status.
 */
export default function CurrentCommunicationPanel() {
  const { activeScenario, sessionState, isSessionActive, isAvatarPlaying, currentSignIndex } = useXRState();

  const hasData = activeScenario.normalizedMeaning || (activeScenario.speechWords && activeScenario.speechWords.length > 0);
  const hasSigns = activeScenario.signSequence && activeScenario.signSequence.length > 0;

  const getHumanReadableSummary = () => {
    if (activeScenario.normalizedMeaning) {
      return activeScenario.normalizedMeaning;
    }
    if (activeScenario.originalTranscript) {
      return activeScenario.originalTranscript;
    }
    if (isSessionActive) {
      return 'Microphone streaming. Listening for spoken announcements, instructions, or lectures...';
    }
    return 'System standing by. Start a session or enter an announcement to begin live speech-to-ISL dubbing.';
  };

  return (
    <div
      className="gov-card"
      style={{
        background: 'linear-gradient(135deg, #fffdf9 0%, #fcf6ee 100%)',
        border: '1px solid var(--border-beige)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
        padding: '1.15rem 1.4rem',
        marginBottom: '1rem',
      }}
      aria-label="Current Communication Summary"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '0.65rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-xs)',
              background: 'var(--crimson-soft)',
              color: 'var(--crimson-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MessageSquare size={15} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              Current Communication Summary
            </h3>
            <span style={{ fontSize: '0.73rem', color: 'var(--text-secondary)' }}>
              Human-centric interpretation for non-technical evaluators & citizens
            </span>
          </div>
        </div>

        {/* State Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              background: hasSigns ? 'var(--success-bg)' : isSessionActive ? 'var(--gold-light)' : 'var(--bg-card-subtle)',
              color: hasSigns ? 'var(--success-text)' : isSessionActive ? 'var(--gold-accent)' : 'var(--text-muted)',
              border: `1px solid ${hasSigns ? 'var(--success-border)' : isSessionActive ? 'var(--gold-border)' : 'var(--border-beige)'}`,
              fontSize: '0.74rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
            }}
          >
            {hasSigns ? (
              <><CheckCircle2 size={13} /> ISL OUTPUT ACTIVE</>
            ) : isSessionActive ? (
              <><Radio size={13} className="rec-pulse-dot" /> LISTENING (ACOUSTIC VAD)</>
            ) : (
              <><Clock size={13} /> STANDBY</>
            )}
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-card-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-beige)',
              fontSize: '0.74rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
            }}
          >
            {activeScenario.languageLabel || 'Auto-Detect'}
          </span>
        </div>
      </div>

      {/* Main Human Readable Statement */}
      <div
        style={{
          background: 'var(--bg-card-elevated)',
          border: '1px solid var(--border-beige)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.85rem 1.1rem',
          margin: '0.65rem 0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
          <span
            style={{
              display: 'inline-block',
              background: hasData ? 'var(--crimson-primary)' : 'var(--text-muted)',
              color: '#ffffff',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '0.15rem 0.45rem',
              borderRadius: 'var(--radius-xs)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginTop: '0.15rem',
              flexShrink: 0,
            }}
          >
            {hasData ? 'Speaker Intent' : 'Status'}
          </span>
          <p
            style={{
              margin: 0,
              fontSize: '0.98rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1.45,
            }}
          >
            “{getHumanReadableSummary()}”
          </p>
        </div>
      </div>

      {/* Sequence Chips Flow Preview */}
      {hasSigns ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', marginRight: '0.2rem' }}>
            ISL Synthesis Tokens:
          </span>
          {activeScenario.signSequence.map((sign, idx) => {
            const isActive = idx === currentSignIndex && isAvatarPlaying && isSessionActive;
            return (
              <span
                key={sign.id || idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.74rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  background: isActive ? 'var(--crimson-primary)' : 'var(--bg-card-elevated)',
                  color: isActive ? '#ffffff' : 'var(--text-primary)',
                  border: `1px solid ${isActive ? 'var(--crimson-dark)' : 'var(--border-beige)'}`,
                  boxShadow: isActive ? 'var(--shadow-crimson)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ opacity: isActive ? 0.9 : 0.5, fontSize: '0.66rem' }}>#{idx + 1}</span>
                {sign.gloss}
              </span>
            );
          })}
        </div>
      ) : (
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.35rem' }}>
          No sign tokens queued. Spoken phrases will synthesize into ISL gloss chips here.
        </div>
      )}
    </div>
  );
}
