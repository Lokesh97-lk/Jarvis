import React, { useState } from 'react';
import { X, Copy, Check, FileCode } from 'lucide-react';
import { useXRState } from '../hooks/useXRState';

export default function JsonViewerModal() {
  const {
    isJsonViewerOpen,
    setIsJsonViewerOpen,
    activeScenario,
    sessionId,
    addToast,
  } = useXRState();

  const [copied, setCopied] = useState(false);

  if (!isJsonViewerOpen) return null;

  const rawJson = {
    session_id: sessionId,
    timestamp: new Date().toISOString(),
    source_language: activeScenario.language,
    original_transcript: activeScenario.originalTranscript,
    normalized_meaning: activeScenario.normalizedMeaning,
    gesture_telemetry: activeScenario.gesture,
    jarvis_semantic_output: activeScenario.jarvis,
    isl_sequence: activeScenario.signSequence,
  };

  const jsonString = JSON.stringify(rawJson, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    addToast('JSON Copied', 'Copied raw telemetry payload to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="gov-modal-backdrop" onClick={() => setIsJsonViewerOpen(false)}>
      <div 
        className="gov-modal-dialog" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="json-dialog-title"
        style={{ maxWidth: '780px' }}
      >
        <div className="gov-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="gov-card-icon">
              <FileCode size={16} />
            </div>
            <div>
              <h3 id="json-dialog-title" style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                Raw Multimodal Telemetry Contract
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Structured JSON payload shared between Speech ASR, MediaPipe, JARVIS, and VRM Avatar
              </p>
            </div>
          </div>

          <button
            className="btn-icon"
            onClick={() => setIsJsonViewerOpen(false)}
            aria-label="Close JSON viewer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="gov-modal-body" style={{ padding: '0.85rem' }}>
          <pre style={{
            background: '#181412',
            color: '#f6f1ea',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            overflowX: 'auto',
            maxHeight: '55vh',
            lineHeight: '1.45',
          }}>
            {jsonString}
          </pre>
        </div>

        <div className="gov-modal-footer">
          <button
            className="btn btn-secondary"
            onClick={handleCopy}
            style={{ fontSize: '0.82rem' }}
          >
            {copied ? <Check size={14} color="#15803d" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy JSON'}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setIsJsonViewerOpen(false)}
            style={{ fontSize: '0.82rem' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
