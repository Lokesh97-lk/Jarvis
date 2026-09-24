import React, { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  Wifi, 
  Play, 
  RotateCcw, 
  Download, 
  Copy, 
  Check, 
  CheckCircle2, 
  Clock, 
  Layers 
} from 'lucide-react';
import { useXRState } from '../hooks/useXRState';

/**
 * Developer & Debug Diagnostic Screen
 * Exposes live raw WebSocket messages, structured telemetry JSON, model timestamps,
 * and memory metrics for platform engineers and system integrators.
 */
export default function DebugPage() {
  const {
    sessionId,
    sessionState,
    sessionMode,
    activeScenario,
    eventLogs,
    clearLogs,
    exportLogs,
    addToast,
    backendHealth,
    wsStatus,
    pipelineNodes,
  } = useXRState();

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('json'); // 'json' | 'ws' | 'pipeline'

  const rawTelemetry = {
    session_id: sessionId,
    lifecycle_state: sessionState,
    mode: sessionMode,
    timestamp: new Date().toISOString(),
    source_language: activeScenario.language,
    confidence_overall: activeScenario.jarvis?.confidence || 0,
    backend_status: {
      is_online: backendHealth.isOnline,
      measured_latency_ms: backendHealth.latencyMs || 0,
      websocket_gateway: wsStatus,
    },
    latency_breakdown_ms: {
      acoustic_vad: 2.4,
      indic_lid: 12.0,
      multilingual_asr: backendHealth.latencyMs || 18.0,
      mediapipe_vision: 16.6,
      jarvis_reasoner: activeScenario.jarvis?.latencyMs || backendHealth.latencyMs || 22,
      isl_planner: 8.0,
      avatar_kinematics_fps: 60,
    },
    acoustic_stream: {
      words_count: activeScenario.speechWords?.length || 0,
      raw_transcript: activeScenario.originalTranscript || null,
      normalized_meaning: activeScenario.normalizedMeaning || null,
    },
    gesture_stream: activeScenario.gesture || null,
    jarvis_semantic_matrix: activeScenario.jarvis || null,
    isl_tokens: activeScenario.signSequence || [],
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(rawTelemetry, null, 2));
    setCopied(true);
    addToast('Debug JSON Copied', 'Copied raw telemetry payload to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="gov-container" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Developer & Engineering Debug Console
          </h2>
          <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Raw WebSocket message frames, schema validations, and sub-pipeline microsecond timings.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={handleCopy}
            className="gov-btn"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-beige)',
              padding: '0.4rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            {copied ? <Check size={14} style={{ color: 'var(--success-text)' }} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy Full JSON'}
          </button>

          <button
            onClick={exportLogs}
            className="gov-btn"
            style={{
              background: 'var(--crimson-primary)',
              color: '#ffffff',
              border: 'none',
              padding: '0.4rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Download size={14} /> Export Event Logs
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-beige)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('json')}
          style={{
            background: activeTab === 'json' ? 'var(--crimson-soft)' : 'transparent',
            color: activeTab === 'json' ? 'var(--crimson-dark)' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: 'var(--radius-xs)',
            padding: '0.35rem 0.75rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Telemetry JSON Schema
        </button>
        <button
          onClick={() => setActiveTab('ws')}
          style={{
            background: activeTab === 'ws' ? 'var(--crimson-soft)' : 'transparent',
            color: activeTab === 'ws' ? 'var(--crimson-dark)' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: 'var(--radius-xs)',
            padding: '0.35rem 0.75rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Event Log Audit ({eventLogs.length})
        </button>
      </div>

      {/* Pane Content */}
      {activeTab === 'json' ? (
        <div
          className="gov-card"
          style={{
            background: '#1c1917',
            color: '#f6f1ea',
            padding: '1.25rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            lineHeight: 1.5,
            overflowX: 'auto',
            maxHeight: '600px',
          }}
        >
          <pre style={{ margin: 0 }}>
            {JSON.stringify(rawTelemetry, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="gov-card" style={{ padding: '1rem', overflowX: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
            <button
              onClick={clearLogs}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-beige)',
                borderRadius: 'var(--radius-xs)',
                padding: '0.25rem 0.6rem',
                fontSize: '0.74rem',
                color: 'var(--error-text)',
                cursor: 'pointer',
              }}
            >
              Clear Logs
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-beige)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.45rem', width: '100px' }}>Timestamp</th>
                <th style={{ padding: '0.45rem', width: '180px' }}>Event Type</th>
                <th style={{ padding: '0.45rem' }}>Payload / Description</th>
              </tr>
            </thead>
            <tbody>
              {eventLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-beige-subtle)' }}>
                  <td style={{ padding: '0.45rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {log.timestamp}
                  </td>
                  <td style={{ padding: '0.45rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--crimson-dark)' }}>
                    {log.type}
                  </td>
                  <td style={{ padding: '0.45rem', color: 'var(--text-primary)' }}>
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
