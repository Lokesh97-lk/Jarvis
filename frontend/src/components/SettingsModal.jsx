import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Globe, 
  Sliders, 
  Bot, 
  Radio, 
  Volume2, 
  RotateCcw, 
  Check, 
  ShieldCheck 
} from 'lucide-react';
import { useXRState } from '../hooks/useXRState';
import { INDIAN_LANGUAGES } from '../utils/constants';

export default function SettingsModal() {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    selectedLanguage,
    setSelectedLanguage,
    avatarSpeed,
    setAvatarSpeed,
    addToast,
    addLog,
  } = useXRState();

  const [displayMode, setDisplayMode] = useState('bilingual');
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);
  const [gestureSensitivity, setGestureSensitivity] = useState(65);
  const [animQuality, setAnimQuality] = useState('120fps');
  const [autoPlay, setAutoPlay] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);
  const [backendUrl, setBackendUrl] = useState('ws://localhost:8000/ws/telemetry');

  if (!isSettingsOpen) return null;

  const handleSave = () => {
    setIsSettingsOpen(false);
    addToast('Settings Saved', 'User preferences and hardware thresholds updated.', 'success');
    addLog('SETTINGS_UPDATE', 'Settings updated by operator.');
  };

  const handleResetDefaults = () => {
    setDisplayMode('bilingual');
    setConfidenceThreshold(75);
    setGestureSensitivity(65);
    setAnimQuality('120fps');
    setAutoPlay(true);
    setSoundAlerts(false);
    addToast('Defaults Restored', 'Configuration reset to standard government parameters.', 'info');
  };

  return (
    <div className="gov-modal-backdrop" onClick={() => setIsSettingsOpen(false)}>
      <div 
        className="gov-modal-dialog" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-dialog-title"
      >
        {/* Header */}
        <div className="gov-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="gov-card-icon">
              <Settings size={16} />
            </div>
            <h3 id="settings-dialog-title" style={{ fontSize: '1.1rem', fontWeight: 800 }}>
              G-SIGN XR Platform Configuration
            </h3>
          </div>
          <button
            className="btn-icon"
            onClick={() => setIsSettingsOpen(false)}
            aria-label="Close settings"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="gov-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Language Preference */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>
              Primary Spoken Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-beige)', background: 'var(--bg-card-subtle)', fontSize: '0.85rem' }}
            >
              {INDIAN_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label} ({l.native})
                </option>
              ))}
            </select>
          </div>

          {/* Transcript Display Mode */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>
              Transcript Display Preference
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['bilingual', 'original_only', 'normalized_only'].map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`btn btn-secondary ${displayMode === m ? 'active' : ''}`}
                  onClick={() => setDisplayMode(m)}
                  style={{
                    flex: 1,
                    fontSize: '0.78rem',
                    background: displayMode === m ? 'var(--crimson-soft)' : 'var(--bg-card-subtle)',
                    color: displayMode === m ? 'var(--crimson-primary)' : 'var(--text-secondary)',
                    fontWeight: displayMode === m ? 700 : 500,
                  }}
                >
                  {m === 'bilingual' ? 'Side-by-Side' : m === 'original_only' ? 'Original Only' : 'Normalized'}
                </button>
              ))}
            </div>
          </div>

          {/* Threshold Sliders */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Confidence Threshold</label>
                <strong style={{ color: 'var(--crimson-primary)', fontFamily: 'var(--font-mono)' }}>{confidenceThreshold}%</strong>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--crimson-primary)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Gesture Sensitivity</label>
                <strong style={{ color: 'var(--gold-accent)', fontFamily: 'var(--font-mono)' }}>{gestureSensitivity}%</strong>
              </div>
              <input
                type="range"
                min="40"
                max="90"
                value={gestureSensitivity}
                onChange={(e) => setGestureSensitivity(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--gold-accent)' }}
              />
            </div>
          </div>

          {/* Avatar Speed & Animation Quality */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                Avatar Playback Speed
              </label>
              <select
                value={avatarSpeed}
                onChange={(e) => setAvatarSpeed(e.target.value)}
                style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-beige)' }}
              >
                <option value="0.5x">0.5x (Slow)</option>
                <option value="0.75x">0.75x</option>
                <option value="1.0x">1.0x (Standard)</option>
                <option value="1.25x">1.25x</option>
                <option value="1.5x">1.5x (Fast)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                Kinematic Quality Target
              </label>
              <select
                value={animQuality}
                onChange={(e) => setAnimQuality(e.target.value)}
                style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-beige)' }}
              >
                <option value="120fps">120 FPS High-Definition</option>
                <option value="60fps">60 FPS Standard</option>
              </select>
            </div>
          </div>

          {/* Backend Connection URL */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
              Backend Telemetry WebSocket URL
            </label>
            <input
              type="text"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              style={{ width: '100%', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-beige)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="gov-modal-footer">
          <button
            className="btn btn-secondary"
            onClick={handleResetDefaults}
          >
            <RotateCcw size={14} /> Restore Defaults
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
          >
            <Check size={14} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
