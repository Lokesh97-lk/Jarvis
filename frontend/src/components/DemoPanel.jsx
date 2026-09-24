import React from 'react';
import { 
  Play, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Layers, 
  Globe, 
  CheckCircle2, 
  FlaskConical,
  Radio
} from 'lucide-react';
import { useXRState, SESSION_MODES } from '../hooks/useXRState';
import { DEMO_SCENARIOS } from '../utils/constants';

export default function DemoPanel() {
  const {
    scenarioIndex,
    loadDemo,
    runDemo,
    nextDemo,
    prevDemo,
    resetDemo,
    sessionMode,
    switchToLiveMode,
  } = useXRState();

  const current = DEMO_SCENARIOS[scenarioIndex];

  return (
    <section className="gov-card" aria-label="Interactive Demo and Sample Testing Suite">
      {/* Header */}
      <div className="gov-card-header">
        <div className="gov-card-title-group">
          <div className="gov-card-icon" style={{ background: 'var(--gold-light)', color: 'var(--gold-accent)' }}>
            <FlaskConical size={16} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <h2 className="gov-card-title">Demo & Scenario Evaluation Suite</h2>
              <span style={{
                fontSize: '0.64rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                background: sessionMode === SESSION_MODES.DEMO ? 'var(--gold-light)' : 'var(--bg-card-subtle)',
                color: sessionMode === SESSION_MODES.DEMO ? 'var(--gold-accent)' : 'var(--text-muted)',
                padding: '0.1rem 0.45rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--gold-border)',
                textTransform: 'uppercase'
              }}>
                {sessionMode === SESSION_MODES.DEMO ? 'DEMO ACTIVE' : 'STANDALONE SUITE'}
              </span>
            </div>
            <p className="gov-card-subtitle">
              Pre-recorded official evaluation scenarios for rail, healthcare, classroom, and public address speeches
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {sessionMode === SESSION_MODES.DEMO && (
            <button
              className="btn btn-secondary"
              onClick={switchToLiveMode}
              title="Exit demo replay and return to physical microphone/camera ingestion"
              style={{ fontSize: '0.76rem', padding: '0.35rem 0.65rem', color: 'var(--crimson-primary)' }}
            >
              <Radio size={13} /> Switch to LIVE Ingestion
            </button>
          )}

          <button
            className="btn btn-secondary"
            onClick={prevDemo}
            title="Previous Scenario"
            style={{ fontSize: '0.76rem', padding: '0.35rem 0.65rem' }}
          >
            <ChevronLeft size={14} /> Previous
          </button>

          <button
            className="btn btn-primary"
            onClick={runDemo}
            title="Run simulated live speech, gesture, and sign dubbing"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}
          >
            <Play size={14} fill="currentColor" /> Run Demo
          </button>

          <button
            className="btn btn-secondary"
            onClick={nextDemo}
            title="Next Scenario"
            style={{ fontSize: '0.76rem', padding: '0.35rem 0.65rem' }}
          >
            Next <ChevronRight size={14} />
          </button>

          <button
            className="btn btn-secondary"
            onClick={resetDemo}
            title="Reset to First Example"
            style={{ fontSize: '0.76rem', padding: '0.35rem 0.65rem' }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Body: Scenario Selector Grid */}
      <div className="gov-card-body">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.65rem',
          marginBottom: '1rem',
        }}>
          {DEMO_SCENARIOS.map((sc, idx) => {
            const isSelected = idx === scenarioIndex && sessionMode === SESSION_MODES.DEMO;
            return (
              <button
                key={sc.id}
                onClick={() => loadDemo(idx)}
                style={{
                  textAlign: 'left',
                  background: isSelected ? 'var(--crimson-soft)' : 'var(--bg-card-subtle)',
                  border: isSelected ? '2px solid var(--crimson-primary)' : '1px solid var(--border-beige)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.65rem 0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--gold-accent)', textTransform: 'uppercase' }}>
                    {sc.category}
                  </span>
                  {isSelected && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--crimson-primary)' }} />}
                </div>
                <strong style={{ fontSize: '0.82rem', color: isSelected ? 'var(--crimson-dark)' : 'var(--text-primary)' }}>
                  {sc.title.split('.')[1] || sc.title}
                </strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {sc.languageLabel}
                </span>
              </button>
            );
          })}
        </div>

        {/* Current Active Scenario Summary Banner */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-beige)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.85rem 1rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          fontSize: '0.82rem',
        }}>
          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>
              Sample Spoken Utterance ({current.languageLabel}):
            </span>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem', margin: '0.2rem 0 0 0' }}>
              "{current.originalTranscript}"
            </p>
          </div>

          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--gold-accent)', display: 'block' }}>
              Associated Non-Verbal Cue:
            </span>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem', margin: '0.2rem 0 0 0' }}>
              {current.gesture.name} ({current.gesture.direction})
            </p>
          </div>

          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--crimson-primary)', display: 'block' }}>
              Generated ISL Sequence:
            </span>
            <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--crimson-dark)', marginTop: '0.2rem', margin: '0.2rem 0 0 0' }}>
              {current.signSequence.map((t) => `[${t.gloss}]`).join(' ')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
