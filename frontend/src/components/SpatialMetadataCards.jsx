import React from 'react';
import { 
  Compass, 
  MapPin, 
  AlertTriangle, 
  Target, 
  CheckCircle2, 
  Gauge, 
  Sparkles,
  Navigation
} from 'lucide-react';
import { useXRState } from '../hooks/useXRState';
import { formatPercent, getUrgencyClass } from '../utils/formatters';
import { SYSTEM_MODES } from '../utils/constants';

export function IntentCard() {
  const { scenario, mode } = useXRState();
  const jarvis = scenario?.jarvis || {};

  return (
    <div className="meta-chip-card" aria-label="Classified Interaction Intent">
      <div className="meta-chip-header">
        <span className="meta-chip-title">Intent</span>
        <div className="meta-chip-icon">
          <Target size={14} />
        </div>
      </div>
      <div className="meta-chip-value">
        {mode === SYSTEM_MODES.STANDBY ? 'Standby' : jarvis.intent || 'Analyzing...'}
      </div>
      <div className="meta-chip-footer">
        Classification: {mode === SYSTEM_MODES.STANDBY ? '0.0%' : '98.2% Accurate'}
      </div>
    </div>
  );
}

export function DirectionCard() {
  const { scenario, mode } = useXRState();
  const jarvis = scenario?.jarvis || {};

  return (
    <div className="meta-chip-card" aria-label="Spatial Vector & Direction">
      <div className="meta-chip-header">
        <span className="meta-chip-title">Direction</span>
        <div className="meta-chip-icon" style={{ background: 'var(--gold-light)', color: 'var(--gold-muted)' }}>
          <Compass size={14} />
        </div>
      </div>
      <div className="meta-chip-value" style={{ color: 'var(--crimson-dark)' }}>
        {mode === SYSTEM_MODES.STANDBY ? 'Neutral [—]' : jarvis.direction || 'Calculating...'}
      </div>
      <div className="meta-chip-footer">
        Spatial Azimuth: 45.2° Rel
      </div>
    </div>
  );
}

export function TargetCard() {
  const { scenario, mode } = useXRState();
  const jarvis = scenario?.jarvis || {};

  return (
    <div className="meta-chip-card" aria-label="Target Entity or Object">
      <div className="meta-chip-header">
        <span className="meta-chip-title">Target</span>
        <div className="meta-chip-icon">
          <MapPin size={14} />
        </div>
      </div>
      <div className="meta-chip-value">
        {mode === SYSTEM_MODES.STANDBY ? 'None' : jarvis.target || 'None Selected'}
      </div>
      <div className="meta-chip-footer">
        Grounding: {mode === SYSTEM_MODES.STANDBY ? 'Unassigned' : 'Visual Anchor #1'}
      </div>
    </div>
  );
}

export function UrgencyCard() {
  const { scenario, mode } = useXRState();
  const jarvis = scenario?.jarvis || {};
  const urgency = jarvis.urgency || 'normal';
  const urgencyClass = getUrgencyClass(urgency);

  return (
    <div className="meta-chip-card" aria-label="Priority and Urgency Level">
      <div className="meta-chip-header">
        <span className="meta-chip-title">Urgency</span>
        <div className="meta-chip-icon" style={{ background: 'var(--gold-light)', color: 'var(--gold-muted)' }}>
          <AlertTriangle size={14} />
        </div>
      </div>
      <div style={{ marginTop: '0.2rem' }}>
        <span className={`urgency-pill ${urgencyClass}`}>
          {mode === SYSTEM_MODES.STANDBY ? 'Standby' : `${urgency.toUpperCase()} PRIORITY`}
        </span>
      </div>
      <div className="meta-chip-footer" style={{ marginTop: '0.3rem' }}>
        SLA Threshold: &lt; 250ms
      </div>
    </div>
  );
}

export function ConfidenceCard() {
  const { scenario, mode } = useXRState();
  const overall = scenario?.jarvis?.confidence || 0;
  const speechConf = scenario?.speech?.confidence || 0;
  const gestureConf = scenario?.gesture?.confidence || 0;

  // Gauge calculations
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overall / 100) * circumference;

  return (
    <section className="xr-card" aria-label="Overall Telemetry Confidence Metrics">
      <div className="xr-card-header">
        <div className="xr-card-title-group">
          <div className="xr-card-icon">
            <Gauge size={16} />
          </div>
          <div>
            <h2 className="xr-card-title">Confidence Metric</h2>
            <p className="xr-card-subtitle">Multi-tier Sensor & Reasoning Convergence</p>
          </div>
        </div>

        <span
          style={{
            fontSize: '0.74rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: 'var(--crimson-dark)',
          }}
        >
          {formatPercent(overall)}
        </span>
      </div>

      <div className="xr-card-body">
        <div className="confidence-hero-wrap">
          {/* Circular SVG Gauge */}
          <div className="confidence-gauge-container">
            <svg className="confidence-gauge-svg" viewBox="0 0 76 76">
              <circle
                className="gauge-bg-circle"
                cx="38"
                cy="38"
                r={radius}
              />
              <circle
                className="gauge-fill-circle"
                cx="38"
                cy="38"
                r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={mode === SYSTEM_MODES.STANDBY ? circumference : strokeDashoffset}
              />
            </svg>
            <div className="gauge-center-text">
              <span>{mode === SYSTEM_MODES.STANDBY ? '0%' : `${Math.round(overall)}%`}</span>
              <span className="gauge-subtext">SCORE</span>
            </div>
          </div>

          {/* Sub-Metric Bars */}
          <div className="confidence-breakdown-list">
            {/* Speech */}
            <div>
              <div className="breakdown-row">
                <span className="breakdown-name">Acoustic Speech</span>
                <span className="breakdown-val">{formatPercent(speechConf)}</span>
              </div>
              <div className="breakdown-track">
                <div className="breakdown-bar" style={{ width: `${speechConf}%` }} />
              </div>
            </div>

            {/* Gesture */}
            <div>
              <div className="breakdown-row">
                <span className="breakdown-name">Pose Tracking</span>
                <span className="breakdown-val">{formatPercent(gestureConf)}</span>
              </div>
              <div className="breakdown-track">
                <div className="breakdown-bar" style={{ width: `${gestureConf}%` }} />
              </div>
            </div>

            {/* Synthesizer */}
            <div>
              <div className="breakdown-row">
                <span className="breakdown-name">XR Sign Convergence</span>
                <span className="breakdown-val">
                  {mode === SYSTEM_MODES.STANDBY ? '0.0%' : '98.5%'}
                </span>
              </div>
              <div className="breakdown-track">
                <div 
                  className="breakdown-bar" 
                  style={{ width: mode === SYSTEM_MODES.STANDBY ? '0%' : '98.5%' }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
