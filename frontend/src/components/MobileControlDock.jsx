import React from 'react';
import { Play, Pause, Mic, MicOff, Camera, CameraOff, User, RotateCcw } from 'lucide-react';
import { useXRState } from '../hooks/useXRState';

/**
 * Mobile Control Dock
 * Fixed compact floating action dock displayed on mobile and tablet viewport screens.
 * Provides instant access to Start, Pause, Mic, Camera, and Avatar actions.
 */
export default function MobileControlDock() {
  const {
    sessionState,
    startSession,
    pauseProcessing,
    resumeProcessing,
    isMicActive,
    toggleMic,
    isCameraActive,
    toggleCamera,
    isAvatarPlaying,
    setIsAvatarPlaying,
    restartSequence,
  } = useXRState();

  return (
    <div
      className="gov-mobile-dock"
      style={{
        position: 'fixed',
        bottom: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 900,
        background: 'rgba(255, 253, 249, 0.95)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--border-beige)',
        borderRadius: 'var(--radius-full)',
        boxShadow: 'var(--shadow-lg)',
        padding: '0.4rem 0.85rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        maxWidth: '92vw',
      }}
      role="region"
      aria-label="Mobile Quick Control Dock"
    >
      {/* Session State Toggle */}
      {sessionState === 'active' ? (
        <button
          onClick={pauseProcessing}
          className="gov-btn"
          style={{
            background: 'var(--gold-accent)',
            color: '#ffffff',
            borderRadius: 'var(--radius-full)',
            padding: '0.45rem 0.85rem',
            fontSize: '0.78rem',
            fontWeight: 700,
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
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
            borderRadius: 'var(--radius-full)',
            padding: '0.45rem 0.85rem',
            fontSize: '0.78rem',
            fontWeight: 700,
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            boxShadow: 'var(--shadow-crimson)',
          }}
        >
          <Play size={14} /> Start
        </button>
      )}

      {/* Mic Toggle */}
      <button
        onClick={toggleMic}
        title={isMicActive ? 'Mute Mic' : 'Unmute Mic'}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: `1px solid ${isMicActive ? 'var(--crimson-primary)' : 'var(--border-beige)'}`,
          background: isMicActive ? 'var(--crimson-soft)' : 'var(--bg-card)',
          color: isMicActive ? 'var(--crimson-dark)' : 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        {isMicActive ? <Mic size={16} /> : <MicOff size={16} />}
      </button>

      {/* Camera Toggle */}
      <button
        onClick={toggleCamera}
        title={isCameraActive ? 'Disable Camera' : 'Enable Camera'}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: `1px solid ${isCameraActive ? 'var(--crimson-primary)' : 'var(--border-beige)'}`,
          background: isCameraActive ? 'var(--crimson-soft)' : 'var(--bg-card)',
          color: isCameraActive ? 'var(--crimson-dark)' : 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        {isCameraActive ? <Camera size={16} /> : <CameraOff size={16} />}
      </button>

      {/* Avatar Restart */}
      <button
        onClick={restartSequence}
        title="Restart ISL Animation"
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '1px solid var(--border-beige)',
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <RotateCcw size={15} />
      </button>
    </div>
  );
}
