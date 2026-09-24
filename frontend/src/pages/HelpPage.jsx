import React from 'react';
import { 
  HelpCircle, 
  BookOpen, 
  Keyboard, 
  Cpu, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';

/**
 * Help & Architecture Documentation Page
 * Comprehensive user guide, ISL TLSOV grammar rules, official standards,
 * and keyboard navigation shortcuts.
 */
export default function HelpPage() {
  const keyboardShortcuts = [
    { key: 'Space', action: 'Toggle Pause / Resume Processing pipeline' },
    { key: 'M', action: 'Mute / Unmute continuous microphone capture' },
    { key: 'C', action: 'Enable / Disable camera gesture tracker' },
    { key: 'R', action: 'Restart active ISL sign animation sequence from beginning' },
    { key: 'F', action: 'Toggle Fullscreen Presentation View for judges/evaluators' },
    { key: 'Esc', action: 'Close any active modal dialog or popover overlay' },
  ];

  const pipelineStages = [
    { name: '1. Continuous Microphone Stream', desc: '16kHz mono PCM ingestion via WebAudio API with adaptive Voice Activity Detection (VAD).' },
    { name: '2. Indic Language ID (Indic-LID)', desc: 'Identifies speech in Tamil, Hindi, Malayalam, Telugu, Kannada, English and 8 other Indian languages.' },
    { name: '3. Streaming Multilingual ASR', desc: 'Converts acoustic frames to live partial and finalized word-by-word transcripts.' },
    { name: '4. Computer Vision (MediaPipe)', desc: 'Extracts 21-point hand joints and torso pose to classify deictic pointing and visual markers.' },
    { name: '5. JARVIS Multimodal Reasoner', desc: 'Gemma 4 E4B synthesizes speech + gesture into normalized canonical meaning and flags spatial contradictions.' },
    { name: '6. ISL Syntax Planner (TLSOV)', desc: 'Transforms canonical meaning into Time-Location-Subject-Object-Verb syntax with fingerspelling fallback.' },
    { name: '7. 3D WebGL Avatar (Three.js)', desc: 'Renders animated humanoid signer with procedural finger joints, eye gaze, and blendshapes.' },
  ];

  return (
    <div className="gov-container" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Help Center & Architecture Manual
        </h2>
        <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Official technical specification, ISLRTC sign language standards, and operational guidelines.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Architecture Overview */}
        <div className="gov-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.85rem' }}>
            <Cpu size={18} style={{ color: 'var(--crimson-primary)' }} />
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              End-to-End Processing Pipeline
            </h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '1rem' }}>
            G-SIGN XR operates on a sub-200ms latency budget to deliver real-time dubbing from continuous live speech into Indian Sign Language (ISL).
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {pipelineStages.map((stage, idx) => (
              <div key={idx} style={{ background: 'var(--bg-card-subtle)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-beige)' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--crimson-dark)', display: 'block' }}>
                  {stage.name}
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  {stage.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ISL Grammar & Keyboard Shortcuts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* ISL Grammar Rules */}
          <div className="gov-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.75rem' }}>
              <Sparkles size={18} style={{ color: 'var(--gold-accent)' }} />
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                ISL Linguistic Grammar (TLSOV)
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '0.75rem' }}>
              Unlike English or spoken Indian languages, authentic Indian Sign Language follows a strict <strong>Time ➔ Location ➔ Subject ➔ Object ➔ Verb</strong> syntax order.
            </p>
            <div style={{ background: 'var(--gold-soft)', border: '1px solid var(--gold-border)', borderRadius: 'var(--radius-xs)', padding: '0.75rem', fontSize: '0.76rem', color: '#78350f' }}>
              <strong>Zero-Hallucination Policy:</strong> If a spoken word lacks a standardized sign in the national ISL dictionary, the system strictly generates an official two-handed ISL fingerspelling sequence (<code>[FS:WORD]</code>) rather than inventing unverified gestures.
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="gov-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.75rem' }}>
              <Keyboard size={18} style={{ color: 'var(--crimson-primary)' }} />
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Global Keyboard Shortcuts
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {keyboardShortcuts.map((sc, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.65rem', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-beige)' }}>
                  <kbd style={{ background: 'var(--bg-card-elevated)', border: '1px solid var(--border-beige)', borderRadius: '4px', padding: '0.15rem 0.5rem', fontSize: '0.76rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {sc.key}
                  </kbd>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                    {sc.action}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
