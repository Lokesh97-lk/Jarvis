import React from 'react';
import { 
  Play, 
  Square, 
  Pause, 
  RotateCcw, 
  PlusCircle, 
  Power, 
  Clock, 
  Shield,
  Loader2,
  Radio
} from 'lucide-react';
import { useXRState, SESSION_STATES } from '../hooks/useXRState';

export default function SessionControls() {
  const {
    sessionState,
    sessionMode,
    sessionId,
    formattedSessionTime,
    startSession,
    stopSession,
    pauseProcessing,
    resumeProcessing,
    resetSession,
    newSession,
    endSession,
    isSessionActive,
    isSessionPaused,
    isSessionIdle,
    isSessionEnded,
    isSessionTransitioning,
  } = useXRState();

  const getStatusBadge = () => {
    switch (sessionState) {
      case SESSION_STATES.ACTIVE:
        return { label: 'LIVE ACTIVE', className: 'status-pill-active', color: 'var(--success-text)' };
      case SESSION_STATES.PAUSED:
        return { label: 'PAUSED', className: 'status-pill-paused', color: 'var(--warning-text)' };
      case SESSION_STATES.STARTING:
        return { label: 'INITIALIZING...', className: 'status-pill-starting', color: 'var(--gold-accent)' };
      case SESSION_STATES.STOPPING:
        return { label: 'STOPPING...', className: 'status-pill-stopping', color: 'var(--text-muted)' };
      case SESSION_STATES.ENDED:
        return { label: 'CONCLUDED', className: 'status-pill-ended', color: 'var(--crimson-primary)' };
      case SESSION_STATES.IDLE:
      default:
        return { label: 'STANDBY', className: 'status-pill-idle', color: 'var(--text-muted)' };
    }
  };

  const badge = getStatusBadge();

  return (
    <section className="gov-session-controls-card" aria-label="Live Session Controls Area">
      {/* Session Metadata Group */}
      <div className="session-info-group">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Session Identifier
          </span>
          <span className="session-id-tag">{sessionId}</span>
        </div>

        <div className="gov-divider-v" />

        {/* State Machine Status Pill */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Lifecycle State
          </span>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            color: badge.color,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            {isSessionTransitioning ? (
              <Loader2 size={13} className="spin-animate" />
            ) : isSessionActive ? (
              <span className="rec-pulse-dot" style={{ width: '7px', height: '7px' }} />
            ) : (
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: badge.color }} />
            )}
            {badge.label}
          </span>
        </div>

        <div className="gov-divider-v" />

        {/* Live Timer */}
        <div className="session-time-tag">
          <Clock size={15} style={{ color: 'var(--gold-accent)' }} />
          <span>Duration: <strong style={{ fontFamily: 'var(--font-mono)' }}>{formattedSessionTime()}</strong></span>
        </div>
      </div>

      {/* Button Cluster (State-Aware with Invalid Actions Disabled) */}
      <div className="session-btn-cluster">
        {/* Start Button */}
        {(isSessionIdle || isSessionEnded) && (
          <button
            className="btn btn-primary"
            onClick={startSession}
            id="btn-start-session"
            disabled={isSessionTransitioning}
            title="Start live speech listening and ISL dubbing session"
          >
            {sessionState === SESSION_STATES.STARTING ? (
              <><Loader2 size={14} className="spin-animate" /> Starting...</>
            ) : (
              <><Play size={15} fill="currentColor" /> Start Session</>
            )}
          </button>
        )}

        {/* Pause Button */}
        {isSessionActive && (
          <button
            className="btn btn-secondary"
            onClick={pauseProcessing}
            id="btn-pause-session"
            disabled={isSessionTransitioning}
            title="Freeze live speech ingestion and avatar animation"
          >
            <Pause size={14} /> Pause Processing
          </button>
        )}

        {/* Resume Button */}
        {isSessionPaused && (
          <button
            className="btn btn-primary"
            onClick={resumeProcessing}
            id="btn-resume-session"
            disabled={isSessionTransitioning}
            title="Resume live speech listening and avatar animation"
          >
            <Play size={15} fill="currentColor" /> Resume Processing
          </button>
        )}

        {/* Stop Button */}
        {(isSessionActive || isSessionPaused) && (
          <button
            className="btn btn-stop"
            onClick={stopSession}
            id="btn-stop-session"
            disabled={isSessionTransitioning}
            title="Stop live session and save to session history"
          >
            <Square size={14} fill="currentColor" /> Stop Session
          </button>
        )}

        {/* Reset Session Button */}
        <button
          className="btn btn-secondary"
          onClick={resetSession}
          id="btn-reset-session"
          disabled={isSessionIdle || isSessionTransitioning}
          style={{ opacity: isSessionIdle || isSessionTransitioning ? 0.45 : 1, cursor: isSessionIdle ? 'not-allowed' : 'pointer' }}
          title="Reset session state, timers, and queues"
        >
          <RotateCcw size={14} /> Reset
        </button>

        {/* New Session Button */}
        <button
          className="btn btn-secondary"
          onClick={newSession}
          id="btn-new-session"
          disabled={isSessionTransitioning}
          title="Generate fresh session identifier"
        >
          <PlusCircle size={14} /> New Session
        </button>

        {/* End Session Button */}
        {(isSessionActive || isSessionPaused) && (
          <button
            className="btn btn-secondary"
            onClick={endSession}
            id="btn-end-session"
            disabled={isSessionTransitioning}
            title="Archive and conclude session"
            style={{ color: 'var(--crimson-primary)' }}
          >
            <Power size={14} /> End Session
          </button>
        )}
      </div>
    </section>
  );
}
