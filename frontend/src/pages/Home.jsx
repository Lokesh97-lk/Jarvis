import React from 'react';
import { FlaskConical, Radio } from 'lucide-react';
import { useXRState, SESSION_MODES } from '../hooks/useXRState';
import SessionControls from '../components/SessionControls';
import CurrentCommunicationPanel from '../components/CurrentCommunicationPanel';
import ConflictResolutionCard from '../components/ConflictResolutionCard';
import MultilingualLanguagePanel from '../components/MultilingualLanguagePanel';
import CameraPanel from '../components/CameraPanel';
import AvatarPanel from '../components/AvatarPanel';
import SpeechPanel from '../components/SpeechPanel';
import GesturePanel from '../components/GesturePanel';
import JarvisPanel from '../components/JarvisPanel';
import ISLPanel from '../components/ISLPanel';
import PipelineStatus from '../components/PipelineStatus';
import DemoPanel from '../components/DemoPanel';

/**
 * Central Dashboard Home Workspace
 * Master operational view integrating real-time speaker video, 3D ISL avatar,
 * speech recognition, multimodal context, and sign planning.
 */
export default function Home() {
  const { sessionMode, switchToLiveMode } = useXRState();

  return (
    <div className="gov-container">
      {/* Prominent Demo Mode Isolation Banner */}
      {sessionMode === SESSION_MODES.DEMO && (
        <div 
          role="alert"
          style={{
            background: 'var(--gold-light)',
            border: '1px solid var(--gold-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.65rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '0.85rem',
            fontSize: '0.82rem',
            color: 'var(--gold-accent)',
            fontWeight: 700,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FlaskConical size={16} />
            <span>DEMO REPLAY MODE: Replaying curated verification dataset. Physical microphone & webcam ingestion are in simulation.</span>
          </div>
          <button
            className="btn btn-primary"
            onClick={switchToLiveMode}
            style={{ fontSize: '0.74rem', padding: '0.3rem 0.75rem' }}
          >
            <Radio size={12} /> Switch to LIVE Ingestion
          </button>
        </div>
      )}

      {/* Session Controls Area */}
      <SessionControls />

      {/* Human Communication Summary for Evaluators and Citizens */}
      <CurrentCommunicationPanel />

      {/* Conditional Speech-Gesture Contradiction Resolution Card */}
      <ConflictResolutionCard />

      {/* Multilingual Architecture Control Panel */}
      <MultilingualLanguagePanel />

      {/* Prominent Large Viewports: Live Speaker & 3D ISL Avatar */}
      <section className="gov-viewports-grid" aria-label="Live Video Ingestion and 3D Avatar Viewports">
        <CameraPanel />
        <AvatarPanel />
      </section>

      {/* Telemetry and Linguistic Panels Grid */}
      <div className="gov-cards-grid">
        {/* Row 1: Live Speech & Gesture Context */}
        <div className="col-6">
          <SpeechPanel />
        </div>
        <div className="col-6">
          <GesturePanel />
        </div>

        {/* Row 2: JARVIS Multimodal Semantic Reasoner */}
        <div className="col-12">
          <JarvisPanel />
        </div>

        {/* Row 3: Generated Indian Sign Language Sequence */}
        <div className="col-12">
          <ISLPanel />
        </div>

        {/* Row 4: Real-Time Processing Pipeline Flow */}
        <div className="col-12">
          <PipelineStatus />
        </div>

        {/* Row 5: Interactive Demo and Scenario Evaluation Suite */}
        <div className="col-12">
          <DemoPanel />
        </div>
      </div>
    </div>
  );
}
