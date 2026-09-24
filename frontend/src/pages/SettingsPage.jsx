import React, { useState } from 'react';
import { 
  Sliders, 
  Globe, 
  Mic, 
  Camera, 
  Cpu, 
  Sparkles, 
  User, 
  Accessibility, 
  Wifi, 
  Shield, 
  Check, 
  RotateCcw,
  Volume2
} from 'lucide-react';
import { useXRState } from '../hooks/useXRState';
import { INDIAN_LANGUAGES, AVATAR_MODELS } from '../utils/constants';

/**
 * Settings Page
 * Full 10-category platform configuration system:
 * 1. General 2. Language 3. Audio 4. Camera 5. AI Models
 * 6. ISL Output 7. Avatar 8. Accessibility 9. Connection 10. Privacy
 */
export default function SettingsPage() {
  const {
    selectedLanguage,
    setSelectedLanguage,
    selectedAvatarModel,
    setSelectedAvatarModel,
    avatarSpeed,
    setAvatarSpeed,
    avatarQuality,
    setAvatarQuality,
    cameraFlipped,
    flipCamera,
    addToast,
    addLog,
  } = useXRState();

  const [activeCategory, setActiveCategory] = useState('general');

  // Form State
  const [defaultLandingPage, setDefaultLandingPage] = useState('dashboard');
  const [autoDetectLanguage, setAutoDetectLanguage] = useState(true);
  const [vadSensitivity, setVadSensitivity] = useState(75);
  const [cameraResolution, setCameraResolution] = useState('720p');
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [facialExpressions, setFacialExpressions] = useState(true);
  const [avatarBackground, setAvatarBackground] = useState('cream');
  const [fontScaling, setFontScaling] = useState('standard');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [backendUrl, setBackendUrl] = useState('http://localhost:8000');
  const [wsUrl, setWsUrl] = useState('ws://localhost:8000/ws/telemetry');
  const [transcriptRetention, setTranscriptRetention] = useState('session_only');

  const categories = [
    { id: 'general', label: 'General', icon: Sliders },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'audio', label: 'Audio & ASR', icon: Mic },
    { id: 'camera', label: 'Camera & Vision', icon: Camera },
    { id: 'models', label: 'AI Models', icon: Cpu },
    { id: 'isl', label: 'ISL Output', icon: Sparkles },
    { id: 'avatar', label: '3D Avatar', icon: User },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
    { id: 'connection', label: 'Connection', icon: Wifi },
    { id: 'privacy', label: 'Privacy & Storage', icon: Shield },
  ];

  const handleSave = () => {
    addToast('Settings Saved', 'Platform parameters updated successfully.', 'success');
    addLog('SETTINGS_SAVED', 'Configuration parameters updated.');
  };

  const handleReset = () => {
    setVadSensitivity(75);
    setConfidenceThreshold(85);
    setCameraResolution('720p');
    addToast('Settings Reset', 'Restored national platform default configuration.', 'info');
  };

  return (
    <div className="gov-container" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Platform Settings & Configuration
        </h2>
        <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Operational thresholds, hardware peripherals, neural models, and accessibility preferences.
        </p>
      </div>

      {/* Main Settings Layout (Sidebar + Form) */}
      <div
        className="gov-card"
        style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr',
          padding: 0,
          overflow: 'hidden',
          minHeight: '520px',
        }}
      >
        {/* Category Sidebar */}
        <div
          style={{
            background: 'var(--bg-card-subtle)',
            borderRight: '1px solid var(--border-beige)',
            padding: '1rem 0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem',
          }}
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.55rem 0.85rem',
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  background: isActive ? 'var(--crimson-soft)' : 'transparent',
                  color: isActive ? 'var(--crimson-dark)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.82rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <Icon size={15} style={{ color: isActive ? 'var(--crimson-primary)' : 'var(--text-muted)' }} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Pane */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* General */}
            {activeCategory === 'general' && (
              <div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  General System Preferences
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      Visual Identity Theme
                    </label>
                    <select
                      disabled
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-beige)', borderRadius: 'var(--radius-xs)', padding: '0.4rem 0.6rem', fontSize: '0.82rem', width: '320px', maxWidth: '100%' }}
                    >
                      <option>National Warm Accessibility Theme (Approved)</option>
                    </select>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Standardized Indian Gov-Tech color token palette (#f6f1ea, #9b1c2c, #b45309).
                    </span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      Default Landing Screen
                    </label>
                    <select
                      value={defaultLandingPage}
                      onChange={(e) => setDefaultLandingPage(e.target.value)}
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-beige)', borderRadius: 'var(--radius-xs)', padding: '0.4rem 0.6rem', fontSize: '0.82rem', width: '320px', maxWidth: '100%' }}
                    >
                      <option value="dashboard">Real-Time Central Dashboard</option>
                      <option value="live_translation">Focused Live Translation View</option>
                      <option value="sessions">Session Audit History</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Language */}
            {activeCategory === 'language' && (
              <div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Language Engine Settings
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={autoDetectLanguage}
                        onChange={(e) => setAutoDetectLanguage(e.target.checked)}
                      />
                      Enable Automatic Language Identification (Auto-LID) by Default
                    </label>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginLeft: '1.4rem', marginTop: '0.2rem' }}>
                      Classifies incoming audio against 13 official Indian languages within first 1.2 seconds.
                    </span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      Fallback Default Spoken Language
                    </label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-beige)', borderRadius: 'var(--radius-xs)', padding: '0.4rem 0.6rem', fontSize: '0.82rem', width: '320px', maxWidth: '100%' }}
                    >
                      {INDIAN_LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code}>{l.label} ({l.native})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Audio */}
            {activeCategory === 'audio' && (
              <div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Audio Capture & VAD Parameters
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      Voice Activity Detection (VAD) Sensitivity: {vadSensitivity}%
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="95"
                      value={vadSensitivity}
                      onChange={(e) => setVadSensitivity(Number(e.target.value))}
                      style={{ width: '320px', maxWidth: '100%' }}
                    />
                    <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Controls silence trimming threshold for noisy railway stations, classrooms, and halls.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Camera */}
            {activeCategory === 'camera' && (
              <div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Camera & Computer Vision Configuration
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      Ingestion Resolution
                    </label>
                    <select
                      value={cameraResolution}
                      onChange={(e) => setCameraResolution(e.target.value)}
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-beige)', borderRadius: 'var(--radius-xs)', padding: '0.4rem 0.6rem', fontSize: '0.82rem', width: '320px', maxWidth: '100%' }}
                    >
                      <option value="720p">720p HD @ 30 FPS (Recommended)</option>
                      <option value="1080p">1080p FHD @ 30 FPS</option>
                      <option value="480p">480p SD (Low Bandwidth)</option>
                    </select>
                  </div>

                  <div>
                    <button
                      onClick={flipCamera}
                      className="gov-btn"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-beige)', padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: 'var(--radius-xs)', cursor: 'pointer' }}
                    >
                      Toggle Horizontal Mirror View ({cameraFlipped ? 'Flipped' : 'Normal'})
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* AI Models */}
            {activeCategory === 'models' && (
              <div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Configured AI Engines & Model Registry
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ background: 'var(--bg-card-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-beige)' }}>
                    <strong>ASR Engine:</strong> Sherpa-ONNX Multilingual Streaming Zipformer (16kHz PCM)
                  </div>
                  <div style={{ background: 'var(--bg-card-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-beige)' }}>
                    <strong>Vision Tracking:</strong> MediaPipe Holistic + 21-point Hand Landmarks (WASM SIMD)
                  </div>
                  <div style={{ background: 'var(--bg-card-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-beige)' }}>
                    <strong>Multimodal Reasoner:</strong> Gemma 4 E4B / JARVIS Zero-Hallucination Semantic Reasoner
                  </div>
                  <div style={{ background: 'var(--bg-card-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-beige)' }}>
                    <strong>ISL Planner:</strong> Indian Sign Language TLSOV Grammar Rule Engine & Fingerspelling Dictionary
                  </div>
                </div>
              </div>
            )}

            {/* ISL Output */}
            {activeCategory === 'isl' && (
              <div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ISL Generation & Verification Rules
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      Confidence Acceptance Threshold: {confidenceThreshold}%
                    </label>
                    <input
                      type="range"
                      min="60"
                      max="98"
                      value={confidenceThreshold}
                      onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                      style={{ width: '320px', maxWidth: '100%' }}
                    />
                    <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Interpretations below this score automatically flag for operator confirmation or clarification.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Avatar */}
            {activeCategory === 'avatar' && (
              <div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  3D Avatar & WebGL Kinematics
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      Active Avatar Model
                    </label>
                    <select
                      value={selectedAvatarModel}
                      onChange={(e) => setSelectedAvatarModel(e.target.value)}
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-beige)', borderRadius: 'var(--radius-xs)', padding: '0.4rem 0.6rem', fontSize: '0.82rem', width: '320px', maxWidth: '100%' }}
                    >
                      {AVATAR_MODELS.map((m) => (
                        <option key={m.id} value={m.id}>{m.name} ({m.type})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      Playback Speed
                    </label>
                    <select
                      value={avatarSpeed}
                      onChange={(e) => setAvatarSpeed(e.target.value)}
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-beige)', borderRadius: 'var(--radius-xs)', padding: '0.4rem 0.6rem', fontSize: '0.82rem', width: '320px', maxWidth: '100%' }}
                    >
                      <option value="0.75x">0.75× (Slow / Learning)</option>
                      <option value="1.0x">1.0× (Standard Natural Signing)</option>
                      <option value="1.25x">1.25× (Fluent Native Pace)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Accessibility */}
            {activeCategory === 'accessibility' && (
              <div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  National Accessibility Standards (GIGW / WCAG 2.1 AAA)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={highContrast}
                      onChange={(e) => setHighContrast(e.target.checked)}
                    />
                    High Contrast Text Borders (WCAG AAA)
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={reducedMotion}
                      onChange={(e) => setReducedMotion(e.target.checked)}
                    />
                    Reduced Motion & Suppressed Micro-Animations
                  </label>
                </div>
              </div>
            )}

            {/* Connection */}
            {activeCategory === 'connection' && (
              <div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Backend Endpoints & WebSocket Bus
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      FastAPI Base URL
                    </label>
                    <input
                      type="text"
                      value={backendUrl}
                      onChange={(e) => setBackendUrl(e.target.value)}
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-beige)', borderRadius: 'var(--radius-xs)', padding: '0.4rem 0.6rem', fontSize: '0.82rem', width: '380px', maxWidth: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      WebSocket Live Telemetry Endpoint
                    </label>
                    <input
                      type="text"
                      value={wsUrl}
                      onChange={(e) => setWsUrl(e.target.value)}
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-beige)', borderRadius: 'var(--radius-xs)', padding: '0.4rem 0.6rem', fontSize: '0.82rem', width: '380px', maxWidth: '100%' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Privacy */}
            {activeCategory === 'privacy' && (
              <div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Data Sovereignty & Local Privacy Controls
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      Transcript Retention Policy
                    </label>
                    <select
                      value={transcriptRetention}
                      onChange={(e) => setTranscriptRetention(e.target.value)}
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-beige)', borderRadius: 'var(--radius-xs)', padding: '0.4rem 0.6rem', fontSize: '0.82rem', width: '320px', maxWidth: '100%' }}
                    >
                      <option value="session_only">In-Memory Only (Discard on browser close)</option>
                      <option value="local_encrypted">Encrypted Local Storage (Audit trail)</option>
                      <option value="disabled">Strict Ephemeral (No buffers retained)</option>
                    </select>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Zero audio recordings or camera video frames are uploaded to external cloud endpoints.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.65rem', borderTop: '1px solid var(--border-beige)', paddingTop: '1rem', marginTop: '1.5rem' }}>
            <button
              onClick={handleReset}
              className="gov-btn"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-beige)', padding: '0.45rem 0.95rem', fontSize: '0.8rem', fontWeight: 600, borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
            >
              <RotateCcw size={13} /> Reset to Defaults
            </button>
            <button
              onClick={handleSave}
              className="gov-btn"
              style={{ background: 'var(--crimson-primary)', color: '#ffffff', border: 'none', padding: '0.45rem 1.1rem', fontSize: '0.82rem', fontWeight: 700, borderRadius: 'var(--radius-sm)', cursor: 'pointer', boxShadow: 'var(--shadow-crimson)' }}
            >
              <Check size={14} /> Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
