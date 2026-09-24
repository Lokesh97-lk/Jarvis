import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Pause, 
  Play, 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  Globe, 
  Repeat, 
  Volume2, 
  Radio, 
  Send,
  Loader2
} from 'lucide-react';
import { useXRState, SESSION_STATES, SESSION_MODES } from '../hooks/useXRState';
import { INDIAN_LANGUAGES } from '../utils/constants';
import LanguagePanel from './LanguagePanel';

export default function SpeechPanel() {
  const {
    activeScenario,
    sessionMode,
    sessionState,
    isSessionActive,
    isMicActive,
    micState,
    micAudioLevel,
    toggleMic,
    clearTranscript,
    copyTranscript,
    exportTranscript,
    submitSpeechUtterance,
    addToast,
  } = useXRState();

  const [inputVal, setInputVal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await submitSpeechUtterance(inputVal.trim());
      setInputVal('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMicBadgeClass = () => {
    if (micState === 'listening' && isSessionActive) return 'listening';
    if (micState === 'paused' || sessionState === SESSION_STATES.PAUSED) return 'paused';
    return 'inactive';
  };

  const getMicBadgeText = () => {
    if (micState === 'listening' && isSessionActive) return 'LISTENING ACTIVE';
    if (micState === 'paused' || sessionState === SESSION_STATES.PAUSED) return 'MICROPHONE PAUSED';
    return 'MICROPHONE STANDBY';
  };

  const hasWords = activeScenario?.speechWords && activeScenario.speechWords.length > 0;
  const avgConfidence = hasWords
    ? Math.round(activeScenario.speechWords.reduce((acc, w) => acc + (w.confidence || 95), 0) / activeScenario.speechWords.length)
    : 0;

  return (
    <section className="gov-card" aria-label="Live Speech Recognition and Transcript Panel">
      {/* Header */}
      <div className="gov-card-header">
        <div className="gov-card-title-group">
          <div className="gov-card-icon">
            <Mic size={16} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <h2 className="gov-card-title">Live Speech & Transcript</h2>
              {sessionMode === SESSION_MODES.DEMO && (
                <span style={{
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  padding: '0.1rem 0.45rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--gold-light)',
                  color: 'var(--gold-accent)',
                  border: '1px solid var(--gold-border)'
                }}>
                  DEMO REPLAY
                </span>
              )}
            </div>
            <p className="gov-card-subtitle">
              Streaming Sherpa/Indic Multilingual ASR • Sub-10ms Acoustic Ingestion
            </p>
          </div>
        </div>

        {/* Microphone State Pill & Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span className={`mic-status-badge ${getMicBadgeClass()}`}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: micState === 'listening' ? '#166534' : micState === 'paused' ? '#9a3412' : '#786f67',
              }}
            />
            {getMicBadgeText()}
          </span>

          <button
            className={`btn-icon ${micState === 'listening' ? 'active' : ''}`}
            onClick={toggleMic}
            title={micState === 'listening' ? 'Pause Listening' : 'Resume Listening'}
            aria-label="Toggle microphone state"
          >
            {micState === 'listening' ? <Mic size={15} /> : <MicOff size={15} />}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="gov-card-body">
        {/* Indian Language Control Area */}
        <LanguagePanel compact />

        {/* Live Streaming Transcript Viewbox (Layer 1: Spoken Audio Stream) */}
        <div className="speech-transcript-box" role="region" aria-label="Speech transcription text" style={{ minHeight: '90px' }}>
          {hasWords ? (
            <div>
              <span style={{ fontSize: '0.70rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--crimson-primary)', display: 'block', marginBottom: '0.35rem' }}>
                LAYER 1: Original Spoken Audio Stream ({activeScenario.languageLabel}):
              </span>
              {activeScenario.speechWords.map((w, idx) => (
                <span
                  key={idx}
                  className={`transcript-word ${idx === activeScenario.speechWords.length - 1 ? 'active' : ''}`}
                  title={`Confidence: ${w.confidence}%`}
                >
                  {w.text}
                </span>
              ))}
              {micState === 'listening' && isSessionActive && (
                <span
                  style={{
                    display: 'inline-block',
                    width: '2px',
                    height: '1.1em',
                    backgroundColor: 'var(--crimson-primary)',
                    verticalAlign: 'middle',
                    marginLeft: '3px',
                    animation: 'pulseLive 0.8s infinite',
                  }}
                />
              )}
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.84rem', fontStyle: 'italic', padding: '0.5rem 0' }}>
              {isSessionActive
                ? 'Microphone streaming. Speak naturally in Tamil, Hindi, Malayalam, or English to see live speech transcript...'
                : 'Session in standby. Click "Start Session" or type an announcement below to process speech into ISL.'}
            </div>
          )}
        </div>

        {/* Real Acoustic Audio Wave Meter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.5rem', padding: '0.3rem 0.5rem', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)' }}>
          <Volume2 size={13} style={{ color: micAudioLevel > 0.05 ? 'var(--gold-accent)' : 'var(--text-muted)' }} />
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>Audio Ingestion Level:</span>
          <div style={{ flex: 1, height: '4px', background: 'var(--border-beige)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, Math.round(micAudioLevel * 100))}%`,
              background: micAudioLevel > 0.75 ? 'var(--crimson-primary)' : 'var(--gold-accent)',
              transition: 'width 0.1s ease-out'
            }} />
          </div>
          <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
            {Math.round(micAudioLevel * 100)}%
          </span>
        </div>

        {/* Manual Speech Input / Testing Form */}
        <form onSubmit={handleCustomSubmit} style={{ marginTop: '0.75rem', display: 'flex', gap: '0.45rem' }}>
          <input
            type="text"
            className="settings-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type or paste announcement (e.g. Train 12625 is arriving on Platform 4)..."
            disabled={isSubmitting}
            style={{
              flex: 1,
              padding: '0.5rem 0.75rem',
              fontSize: '0.82rem',
              border: '1px solid var(--border-beige)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-card)',
            }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !inputVal.trim()}
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem', opacity: !inputVal.trim() ? 0.6 : 1 }}
          >
            {isSubmitting ? (
              <><Loader2 size={13} className="spin-animate" /> Processing</>
            ) : (
              <><Send size={13} /> Dub to ISL</>
            )}
          </button>
        </form>

        {/* Quick Natural Language Test Chips (Content-Driven Real-World Scenarios) */}
        <div style={{ marginTop: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Quick General Speech / Text Inquiries (Dynamic AI Execution):
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {[
              {
                label: '🚆 Train 12625 Delay',
                text: 'Attention passengers, Train 12625 is delayed by 30 minutes on Platform 3.',
                category: 'Transit'
              },
              {
                label: '🏥 Hospital Triage Inquiry',
                text: 'Where is the emergency department? The patient has severe chest pain.',
                category: 'Health'
              },
              {
                label: '🎓 Academic Deadline',
                text: 'All students must submit the science assignment by tomorrow 10 AM.',
                category: 'Education'
              },
              {
                label: '⚡ Civic Wire Hazard',
                text: 'Do not touch the broken electric wire near the main gate.',
                category: 'Safety'
              },
              {
                label: '🇮🇳 Hindi Gas Alert',
                text: 'इस क्षेत्र में प्रवेश न करें क्योंकि यहां गैस रिसाव हुआ है',
                category: 'Hindi'
              },
              {
                label: '🏛️ Tamil Wayfinding',
                text: 'தயவுசெய்து 4ஆம் எண் வெளிவாயில் வழியே செல்லவும்',
                category: 'Tamil'
              },
            ].map((chip, cIdx) => (
              <button
                key={cIdx}
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setInputVal(chip.text);
                  submitSpeechUtterance(chip.text);
                }}
                title={`Click to dub: "${chip.text}"`}
                style={{
                  fontSize: '0.70rem',
                  padding: '0.22rem 0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-beige)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Stage Independent Confidence Metric Strip */}
        <div style={{
          marginTop: '0.65rem',
          padding: '0.45rem 0.65rem',
          background: 'var(--bg-card-subtle)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-beige)',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.5rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 700 }}>C_ASR (Acoustic)</div>
            <div style={{ fontSize: '0.80rem', fontWeight: 800, color: 'var(--success-text)' }}>
              {activeScenario?.pipelineConfidences?.asr || 96}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 700 }}>C_SEM (Interlingua)</div>
            <div style={{ fontSize: '0.80rem', fontWeight: 800, color: 'var(--info-text)' }}>
              {activeScenario?.pipelineConfidences?.sem || 94}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 700 }}>C_ISL (TLSOV Lexicon)</div>
            <div style={{ fontSize: '0.80rem', fontWeight: 800, color: 'var(--gold-accent)' }}>
              {activeScenario?.pipelineConfidences?.isl || 96}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 700 }}>C_MOT (Joint Safety)</div>
            <div style={{ fontSize: '0.80rem', fontWeight: 800, color: '#15803d' }}>
              {activeScenario?.pipelineConfidences?.mot || 99}%
            </div>
          </div>
        </div>

        {/* Action Controls Row */}
        <div className="speech-controls-row">
          {/* Metadata */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
            <span>Grammar: <strong style={{ color: 'var(--crimson-primary)' }}>{activeScenario?.grammarOrder || 'ISL TLSOV'}</strong></span>
            <span>•</span>
            <span>Language: <strong>{activeScenario.languageLabel}</strong></span>
          </div>

          {/* Action Buttons Cluster */}
          <div className="speech-actions-cluster">
            {/* Clear Transcript */}
            <button
              className="btn btn-secondary"
              onClick={clearTranscript}
              disabled={!hasWords}
              title="Clear transcript text"
              style={{ fontSize: '0.76rem', padding: '0.35rem 0.65rem', opacity: !hasWords ? 0.5 : 1 }}
            >
              <Trash2 size={13} /> Clear
            </button>

            {/* Copy Transcript */}
            <button
              className="btn btn-secondary"
              onClick={copyTranscript}
              disabled={!hasWords}
              title="Copy transcript text to clipboard"
              style={{ fontSize: '0.76rem', padding: '0.35rem 0.65rem', opacity: !hasWords ? 0.5 : 1 }}
            >
              <Copy size={13} /> Copy
            </button>

            {/* Export Transcript */}
            <button
              className="btn btn-secondary"
              onClick={exportTranscript}
              disabled={!hasWords}
              title="Export and download transcript document"
              style={{ fontSize: '0.76rem', padding: '0.35rem 0.65rem', opacity: !hasWords ? 0.5 : 1 }}
            >
              <Download size={13} /> Export
            </button>

            {/* Pause Listening */}
            <button
              className="btn btn-secondary"
              onClick={toggleMic}
              title="Pause or resume acoustic speech ingestion"
              style={{ fontSize: '0.76rem', padding: '0.35rem 0.65rem' }}
            >
              {micState === 'listening' ? <Pause size={13} /> : <Play size={13} />}
              {micState === 'listening' ? 'Pause Listening' : 'Resume'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
