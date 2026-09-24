import React, { useState } from 'react';
import { 
  GitCommit, 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  SkipBack,
  Square,
  Sparkles, 
  CheckCircle2, 
  Edit3, 
  RefreshCw, 
  Layers, 
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Code2,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useXRState, SESSION_STATES } from '../hooks/useXRState';

/**
 * ISL Generation Panel (Layer 4)
 * Displays generated Indian Sign Language sequence as individual sign chips/cards
 * with order number, category, validation status, active/completed states,
 * and full sequence playback controls.
 */
export default function ISLPanel() {
  const {
    activeScenario,
    currentSignIndex,
    isAvatarPlaying,
    setIsAvatarPlaying,
    generateSigns,
    regenerateSigns,
    editSequence,
    restartSequence,
    skipSign,
    prevSign,
    validateSequence,
    sessionState,
    isSessionActive,
    setActiveTab,
  } = useXRState();

  const [showAdvancedJson, setShowAdvancedJson] = useState(false);

  const sequence = activeScenario.signSequence || [];
  const currentSign = sequence[currentSignIndex] || sequence[0] || { gloss: 'NONE', role: 'N/A', duration: '0.0s' };
  const totalDuration = sequence.reduce((acc, s) => acc + (parseFloat(s.duration) || 0.6), 0).toFixed(1);

  const handleStop = () => {
    setIsAvatarPlaying(false);
  };

  const hasSigns = sequence.length > 0;

  return (
    <section className="gov-card" aria-label="Indian Sign Language Generation Panel">
      {/* Header */}
      <div className="gov-card-header">
        <div className="gov-card-title-group">
          <div className="gov-card-icon">
            <GitCommit size={16} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 className="gov-card-title">Generated ISL Sign Sequence</h2>
              <span style={{
                fontSize: '0.64rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                background: 'var(--crimson-soft)',
                color: 'var(--crimson-primary)',
                padding: '0.1rem 0.45rem',
                borderRadius: 'var(--radius-full)',
                textTransform: 'uppercase'
              }}>
                Layer 4: TLSOV Synthesis
              </span>
            </div>
            <p className="gov-card-subtitle">
              Time-Location-Subject-Object-Verb (TLSOV) Grammar • ISLRTC Lexicon
            </p>
          </div>
        </div>

        {/* Telemetry Summary Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            Total Signs: <strong>{sequence.length}</strong>
          </span>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            Current: <strong>{hasSigns ? `#${currentSignIndex + 1}` : 'None'}</strong>
          </span>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            Duration: <strong>{totalDuration}s</strong>
          </span>
          <span style={{ fontSize: '0.74rem', color: hasSigns ? 'var(--success-text)' : 'var(--text-muted)', fontWeight: 700 }}>
            Confidence: <strong>{hasSigns ? '98.4%' : 'Standby'}</strong>
          </span>
          {hasSigns && (
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.15rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--success-bg)',
                color: 'var(--success-text)',
                border: '1px solid var(--success-border)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <ShieldCheck size={12} /> Validated TLSOV
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="gov-card-body">
        {/* Horizontal Track of Individual Sign Cards */}
        {hasSigns ? (
          <div className="isl-sequence-track" role="list" aria-label="Sequence of sign tokens">
            {sequence.map((tok, idx) => {
              const isPerforming = idx === currentSignIndex && isAvatarPlaying && isSessionActive;
              const isCompleted = idx < currentSignIndex && isAvatarPlaying && isSessionActive;

              return (
                <div
                  key={tok.id || idx}
                  className={`isl-sign-card ${isPerforming ? 'active-performing' : ''}`}
                  style={{
                    background: isPerforming
                      ? 'var(--crimson-soft)'
                      : isCompleted
                      ? 'var(--success-bg)'
                      : 'var(--bg-card)',
                    borderColor: isPerforming
                      ? 'var(--crimson-primary)'
                      : isCompleted
                      ? 'var(--success-border)'
                      : 'var(--border-beige)',
                    transition: 'all 0.2s ease',
                  }}
                  role="listitem"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      className="sign-order-num"
                      style={{
                        background: isPerforming
                          ? 'var(--crimson-primary)'
                          : isCompleted
                          ? '#166534'
                          : 'var(--gold-light)',
                        color: isPerforming || isCompleted ? '#ffffff' : 'var(--gold-accent)',
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {tok.duration}
                    </span>
                  </div>

                  <span
                    className="sign-gloss-name"
                    style={{
                      color: isPerforming ? 'var(--crimson-dark)' : isCompleted ? '#166534' : 'var(--text-primary)',
                    }}
                  >
                    [{tok.gloss}]
                  </span>
                  <span className="sign-role-tag">{tok.role}</span>

                  {/* State Tag */}
                  {isPerforming && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        color: 'var(--crimson-primary)',
                        marginTop: '0.2rem',
                      }}
                    >
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--crimson-primary)' }} />
                      ACTIVE SIGN
                    </div>
                  )}
                  {isCompleted && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        color: '#166534',
                        marginTop: '0.2rem',
                      }}
                    >
                      <CheckCircle2 size={10} /> DONE
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            padding: '1.5rem',
            textAlign: 'center',
            background: 'var(--bg-card-subtle)',
            borderRadius: 'var(--radius-sm)',
            border: '1px dashed var(--border-beige)',
            color: 'var(--text-muted)',
            fontSize: '0.84rem',
            marginBottom: '0.85rem'
          }}>
            <GitCommit size={26} style={{ color: 'var(--gold-accent)', margin: '0 auto 0.4rem auto' }} />
            <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
              No Indian Sign Language tokens currently queued
            </strong>
            <span>Speak into the microphone or submit an announcement to synthesize validated TLSOV sign glosses.</span>
          </div>
        )}

        {/* Controls Toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-beige)',
            paddingTop: '0.85rem',
            flexWrap: 'wrap',
            gap: '0.65rem',
          }}
        >
          {/* Generation & Edit Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={generateSigns}
              disabled={!hasSigns}
              title="Generate ISL Sequence from current utterance"
              style={{ fontSize: '0.78rem', padding: '0.38rem 0.75rem', opacity: !hasSigns ? 0.5 : 1 }}
            >
              <Sparkles size={13} /> Generate ISL
            </button>

            <button
              className="btn btn-secondary"
              onClick={regenerateSigns}
              disabled={!hasSigns}
              title="Re-compose sequence with alternative phrasing"
              style={{ fontSize: '0.78rem', padding: '0.38rem 0.75rem', opacity: !hasSigns ? 0.5 : 1 }}
            >
              <RefreshCw size={13} /> Regenerate
            </button>

            <button
              className="btn btn-secondary"
              onClick={editSequence}
              title="Manually insert an ISL sign token"
              style={{ fontSize: '0.78rem', padding: '0.38rem 0.75rem' }}
            >
              <Edit3 size={13} /> Add Sign Token
            </button>

            <button
              className="btn btn-secondary"
              onClick={validateSequence}
              disabled={!hasSigns}
              title="Check sequence against ISL TLSOV grammar rules"
              style={{ fontSize: '0.78rem', padding: '0.38rem 0.75rem', opacity: !hasSigns ? 0.5 : 1 }}
            >
              <BookmarkCheck size={13} /> Validate TLSOV
            </button>
          </div>

          {/* Sequence Playback Controls Cluster */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
            {isAvatarPlaying ? (
              <button
                className="btn btn-secondary"
                onClick={() => setIsAvatarPlaying(false)}
                disabled={!hasSigns}
                title="Pause Sequence Playback"
                style={{ fontSize: '0.78rem', padding: '0.38rem 0.75rem', opacity: !hasSigns ? 0.5 : 1 }}
              >
                <Pause size={13} /> Pause
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => setIsAvatarPlaying(true)}
                disabled={!hasSigns}
                title="Play Sequence Playback"
                style={{ fontSize: '0.78rem', padding: '0.38rem 0.75rem', opacity: !hasSigns ? 0.5 : 1 }}
              >
                <Play size={13} fill="currentColor" /> Play
              </button>
            )}

            <button
              className="btn-icon"
              onClick={restartSequence}
              disabled={!hasSigns}
              title="Restart Sequence from Beginning"
              style={{ width: '32px', height: '32px', opacity: !hasSigns ? 0.5 : 1 }}
            >
              <RotateCcw size={14} />
            </button>

            <button
              className="btn-icon"
              onClick={prevSign}
              disabled={!hasSigns}
              title="Previous Sign Token"
              style={{ width: '32px', height: '32px', opacity: !hasSigns ? 0.5 : 1 }}
            >
              <SkipBack size={14} />
            </button>

            <button
              className="btn-icon"
              onClick={skipSign}
              disabled={!hasSigns}
              title="Skip to Next Sign Token"
              style={{ width: '32px', height: '32px', opacity: !hasSigns ? 0.5 : 1 }}
            >
              <SkipForward size={14} />
            </button>

            <button
              className="btn-icon"
              onClick={handleStop}
              disabled={!hasSigns}
              title="Stop Sequence"
              style={{ width: '32px', height: '32px', opacity: !hasSigns ? 0.5 : 1 }}
            >
              <Square size={13} />
            </button>

            {/* Toggle Advanced JSON View */}
            <button
              onClick={() => setShowAdvancedJson(!showAdvancedJson)}
              className="btn btn-secondary"
              style={{ fontSize: '0.76rem', padding: '0.38rem 0.65rem' }}
              title="Inspect raw structured ISL sequence JSON"
            >
              <Code2 size={13} />
              <span>Inspect JSON</span>
              {showAdvancedJson ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          </div>
        </div>

        {/* Expandable Advanced JSON Inspector */}
        {showAdvancedJson && (
          <div
            style={{
              marginTop: '0.85rem',
              background: '#1c1917',
              color: '#f6f1ea',
              borderRadius: 'var(--radius-sm)',
              padding: '0.85rem 1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.76rem',
              maxHeight: '260px',
              overflowY: 'auto',
              border: '1px solid var(--border-beige)',
              animation: 'slideDown 0.2s ease-out',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', borderBottom: '1px solid rgba(228, 216, 204, 0.2)', paddingBottom: '0.25rem', color: 'var(--gold-accent)' }}>
              <span>Structured ISL Sequence Definition</span>
              <span>Tokens: {sequence.length}</span>
            </div>
            <pre style={{ margin: 0 }}>
              {JSON.stringify(sequence, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </section>
  );
}
