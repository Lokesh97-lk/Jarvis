import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Info, 
  X, 
  Radio, 
  Sparkles, 
  Workflow 
} from 'lucide-react';
import { useXRState } from '../hooks/useXRState';
import { PIPELINE_NODES } from '../utils/constants';

export default function PipelineStatus() {
  const { pipelineNodes, pipelineDetailNode, setPipelineDetailNode } = useXRState();

  return (
    <section className="gov-card" aria-label="Real-Time Processing Pipeline Section">
      {/* Header */}
      <div className="gov-card-header">
        <div className="gov-card-title-group">
          <div className="gov-card-icon gold">
            <Workflow size={16} />
          </div>
          <div>
            <h2 className="gov-card-title">Real-Time Processing Pipeline</h2>
            <p className="gov-card-subtitle">
              End-to-End Multimodal Flow • Click any node to inspect model architecture and latency
            </p>
          </div>
        </div>

        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Target Latency SLA: <strong>&lt; 50ms</strong>
        </span>
      </div>

      {/* Body */}
      <div className="gov-card-body">
        {/* Horizontal Flow Graph */}
        <div className="pipeline-flow-track" role="list">
          {pipelineNodes.map((node, idx) => (
            <React.Fragment key={node.id}>
              <div
                className={`pipeline-node-btn ${pipelineDetailNode?.id === node.id ? 'active' : ''}`}
                onClick={() => setPipelineDetailNode(node)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setPipelineDetailNode(node)}
                title={`Inspect ${node.name}`}
              >
                <span className="node-title">{node.name}</span>
                <span className={`node-status-pill ${node.status}`}>
                  {node.status.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.64rem', fontFamily: 'var(--font-mono)', color: 'var(--gold-accent)', fontWeight: 700 }}>
                  {node.latency}
                </span>
              </div>

              {idx < pipelineNodes.length - 1 && (
                <div className="pipeline-arrow">
                  <ArrowRight size={14} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Clickable Detail Inspector Drawer / Box */}
        {pipelineDetailNode && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem 1.25rem',
            background: 'linear-gradient(135deg, #fffdf9 0%, #faf5eb 100%)',
            border: '1px solid var(--gold-border)',
            borderRadius: 'var(--radius-md)',
            position: 'relative',
          }}>
            <button
              onClick={() => setPipelineDetailNode(null)}
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
              title="Close detail"
              aria-label="Close details"
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Cpu size={16} style={{ color: 'var(--crimson-primary)' }} />
              <strong style={{ fontSize: '0.96rem', color: 'var(--text-primary)' }}>
                Component Telemetry: {pipelineDetailNode.name}
              </strong>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              {pipelineDetailNode.description}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.5rem',
              fontSize: '0.76rem',
              background: 'var(--bg-card)',
              padding: '0.6rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-beige)',
            }}>
              <div>Model: <strong style={{ color: 'var(--crimson-dark)' }}>{pipelineDetailNode.model}</strong></div>
              <div>Latency: <strong style={{ fontFamily: 'var(--font-mono)' }}>{pipelineDetailNode.latency}</strong></div>
              <div>Confidence: <strong style={{ color: 'var(--success-text)' }}>98.6%</strong></div>
              <div>Status: <strong style={{ color: 'var(--success-text)' }}>READY / ONLINE</strong></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
