import React from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  Cpu, 
  AlertTriangle, 
  Check, 
  X, 
  RotateCw, 
  HelpCircle, 
  FileCode, 
  Tag, 
  Target, 
  Clock, 
  MapPin, 
  ShieldAlert,
  CheckCircle2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useXRState } from '../hooks/useXRState';
import { formatPercent } from '../utils/formatters';

export default function JarvisPanel() {
  const {
    activeScenario,
    analyzeInterpretation,
    reprocessInterpretation,
    acceptInterpretation,
    rejectInterpretation,
    requestClarification,
    interpretationAccepted,
    setActiveTab,
    addToast,
  } = useXRState();

  const jarvis = activeScenario.jarvis || {};
  const hasConflict = jarvis.conflictDetected;
  const hasData = jarvis.confidence > 0 || (activeScenario.speechWords && activeScenario.speechWords.length > 0);

  const handleCopyInterpretation = () => {
    const text = `JARVIS SEMANTIC INTERPRETATION
Intent: ${jarvis.intent || 'N/A'}
Action: ${jarvis.action || 'N/A'}
Target: ${jarvis.target || 'N/A'}
Urgency: ${jarvis.urgency || 'NORMAL'}
Confidence: ${jarvis.confidence || 0}%
Normalized Meaning (Layer 2):
${activeScenario.normalizedMeaning || 'N/A'}
`;
    navigator.clipboard.writeText(text);
    addToast('Interpretation Copied', 'Copied structured semantic result to clipboard.', 'success');
  };

  const getUrgencyClass = (u) => {
    switch (u?.toLowerCase()) {
      case 'emergency': return 'error';
      case 'high': return 'warning';
      default: return 'success';
    }
  };

  return (
    <section className="gov-card jarvis-panel-hero" aria-label="JARVIS Multimodal Interpretation Panel">
      {/* Header */}
      <div className="gov-card-header" style={{ background: 'linear-gradient(180deg, #fffdf8 0%, #faf3e6 100%)' }}>
        <div className="gov-card-title-group">
          <div className="gov-card-icon" style={{ background: 'var(--gold-light)', color: 'var(--gold-accent)' }}>
            <BrainCircuit size={17} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 className="gov-card-title">
                JARVIS Multimodal Semantic Reasoner
              </h2>
              <span style={{
                fontSize: '0.64rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                background: 'var(--crimson-primary)',
                color: '#fff',
                padding: '0.1rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                textTransform: 'uppercase'
              }}>
                Gemma 4 E4B
              </span>
            </div>
            <p className="gov-card-subtitle">
              Speech-Vision Semantic Grounding • Intent Normalization • Contradiction Resolution
            </p>
          </div>
        </div>

        {/* AI Processing State & Latency Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: 'var(--gold-accent)',
            background: 'var(--bg-card)',
            padding: '0.2rem 0.55rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-beige)'
          }}>
            ⚡ {jarvis.latencyMs || 22}ms SLA
          </span>

          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '0.2rem 0.55rem',
            borderRadius: 'var(--radius-full)',
            background: hasConflict ? 'var(--warning-bg)' : hasData ? 'var(--success-bg)' : 'var(--bg-card-subtle)',
            color: hasConflict ? 'var(--warning-text)' : hasData ? 'var(--success-text)' : 'var(--text-muted)',
            border: `1px solid ${hasConflict ? 'var(--warning-border)' : hasData ? 'var(--success-border)' : 'var(--border-beige)'}`,
          }}>
            {hasConflict ? 'AMBIGUITY FLAGGED' : hasData ? 'REASONING NOMINAL' : 'STANDBY'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="gov-card-body">
        {/* LAYER 2: Normalized Meaning Layer */}
        {activeScenario.normalizedMeaning && (
          <div style={{
            background: 'linear-gradient(135deg, #fffcf7 0%, #faf3e8 100%)',
            border: '1px solid var(--gold-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.65rem 0.95rem',
            marginBottom: '0.75rem',
          }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--gold-accent)', display: 'block', marginBottom: '0.2rem' }}>
              LAYER 2: Canonical Normalized Meaning (Cross-Lingual Pivot)
            </span>
            <p style={{ margin: 0, fontSize: '0.90rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              "{activeScenario.normalizedMeaning}"
            </p>
          </div>
        )}

        {/* Speech–Gesture Contradiction Warning Alert (if flagged) */}
        {hasConflict && (
          <div className="conflict-alert-box" role="alert" style={{ marginBottom: '0.75rem' }}>
            <AlertTriangle size={18} style={{ color: 'var(--warning-text)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.88rem' }}>Speech–Gesture Conflict Detected:</strong>
              <span>{jarvis.conflictNote}</span>
            </div>
          </div>
        )}

        {/* LAYER 3: Semantic Narrative & Derivation */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-beige)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          fontSize: '0.86rem',
          lineHeight: '1.5',
          color: 'var(--text-primary)',
        }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--crimson-primary)', display: 'block', marginBottom: '0.25rem' }}>
            LAYER 3: JARVIS Cross-Modal Grounding & Intent Normalization
          </span>
          <p style={{ margin: 0 }}>{jarvis.reasoning}</p>
        </div>

        {/* Structured Semantic Meta Matrix (Intent, Action, Target, Urgency) */}
        <div className="jarvis-meta-matrix" style={{ marginTop: '0.75rem' }}>
          {/* Intent */}
          <div className="jarvis-matrix-box">
            <span className="matrix-label">Classified Intent</span>
            <span className="matrix-val" style={{ color: 'var(--crimson-dark)' }}>
              {jarvis.intent || 'STANDBY'}
            </span>
          </div>

          {/* Action */}
          <div className="jarvis-matrix-box">
            <span className="matrix-label">Canonical Action</span>
            <span className="matrix-val">
              {jarvis.action || 'STANDBY'}
            </span>
          </div>

          {/* Target / Location */}
          <div className="jarvis-matrix-box">
            <span className="matrix-label">Target / Location</span>
            <span className="matrix-val" style={{ color: 'var(--gold-accent)' }}>
              {jarvis.target || 'NONE'}
            </span>
          </div>

          {/* Urgency */}
          <div className="jarvis-matrix-box">
            <span className="matrix-label">Urgency SLA</span>
            <div style={{ marginTop: '0.2rem' }}>
              <span className={`node-status-pill ${getUrgencyClass(jarvis.urgency)}`}>
                {(jarvis.urgency || 'NORMAL').toUpperCase()} PRIORITY
              </span>
            </div>
          </div>
        </div>

        {/* Extracted Entities Chips */}
        {jarvis.entities && jarvis.entities.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginTop: '0.65rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Entities:
            </span>
            {jarvis.entities.map((ent, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-xs)',
                  background: 'var(--bg-card-subtle)',
                  border: '1px solid var(--border-beige)',
                  color: 'var(--text-primary)',
                }}
              >
                <strong>{ent.category}:</strong> {ent.value}
              </span>
            ))}
          </div>
        )}

        {/* Conversational Context Memory (Rolling Discourse Buffer & Anaphora Tracking) */}
        <div style={{
          marginTop: '0.75rem',
          padding: '0.55rem 0.85rem',
          background: 'var(--bg-card-subtle)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-beige)',
          fontSize: '0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', fontSize: '0.66rem' }}>
              🧠 Conversational Discourse Memory (Rolling Interlingua Buffer):
            </span>
            <span style={{ fontSize: '0.64rem', fontFamily: 'var(--font-mono)', color: 'var(--gold-accent)', fontWeight: 700 }}>
              Grammar: Time → Location → Subject → Object → Verb → Negation → Question
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', color: 'var(--text-secondary)' }}>
            <span>
              Target: <strong style={{ color: 'var(--text-primary)' }}>{jarvis.target || activeScenario?.anaphoraResolved?.subject || 'All Commuters/Audience'}</strong>
            </span>
            <span>•</span>
            <span>
              Action: <strong style={{ color: 'var(--text-primary)' }}>{jarvis.action || 'Disseminate Announcement'}</strong>
            </span>
            <span>•</span>
            <span>
              Anaphora Resolution: <strong style={{ color: 'var(--crimson-primary)' }}>
                {activeScenario?.anaphoraResolved && Object.keys(activeScenario.anaphoraResolved).length > 0
                  ? Object.entries(activeScenario.anaphoraResolved).map(([k, v]) => `${k} ➔ ${v}`).join(', ')
                  : 'Direct Nominal Grounding'}
              </strong>
            </span>
          </div>
        </div>

        {/* Operator Feedback & Action Controls Bar */}
        <div className="jarvis-actions-bar" style={{ marginTop: '0.85rem' }}>
          {interpretationAccepted && (
            <span style={{
              marginRight: 'auto',
              fontSize: '0.76rem',
              fontWeight: 700,
              color: interpretationAccepted === 'accepted' ? 'var(--success-text)' : 'var(--warning-text)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <CheckCircle2 size={14} />
              Operator Status: {interpretationAccepted.toUpperCase()}
            </span>
          )}

          {/* Analyze */}
          <button
            className="btn btn-primary"
            onClick={analyzeInterpretation}
            disabled={!hasData}
            title="Trigger real-time LLM inference"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem', opacity: !hasData ? 0.5 : 1 }}
          >
            <Sparkles size={13} /> Analyze
          </button>

          {/* Reprocess */}
          <button
            className="btn btn-secondary"
            onClick={reprocessInterpretation}
            disabled={!hasData}
            title="Reprocess context buffer"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem', opacity: !hasData ? 0.5 : 1 }}
          >
            <RotateCw size={13} /> Reprocess
          </button>

          {/* Accept Interpretation */}
          <button
            className="btn btn-secondary"
            onClick={acceptInterpretation}
            disabled={!hasData}
            title="Accept semantic interpretation as valid"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem', color: 'var(--success-text)', opacity: !hasData ? 0.5 : 1 }}
          >
            <Check size={14} /> Accept
          </button>

          {/* Reject Interpretation */}
          <button
            className="btn btn-secondary"
            onClick={rejectInterpretation}
            disabled={!hasData}
            title="Reject or flag interpretation"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem', color: 'var(--crimson-primary)', opacity: !hasData ? 0.5 : 1 }}
          >
            <X size={14} /> Reject
          </button>

          {/* Copy Interpretation */}
          <button
            className="btn btn-secondary"
            onClick={handleCopyInterpretation}
            disabled={!hasData}
            title="Copy structured semantic interpretation to clipboard"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem', opacity: !hasData ? 0.5 : 1 }}
          >
            <Copy size={13} /> Copy
          </button>

          {/* Developer Telemetry Link (Navigates to Debug page with scrollable panel) */}
          <button
            className="btn btn-secondary"
            onClick={() => {
              setActiveTab('debug');
              addToast('Telemetry Console', 'Opened Developer / Telemetry page.', 'info');
            }}
            title="View complete raw JSON telemetry in Developer Page"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
          >
            <FileCode size={14} /> Raw Telemetry
          </button>
        </div>
      </div>
    </section>
  );
}
