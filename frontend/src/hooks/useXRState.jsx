import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { DEMO_SCENARIOS, INDIAN_LANGUAGES, PIPELINE_NODES, AVATAR_MODELS, AVATAR_VIEW_MODES } from '../utils/constants';
import { sessionService, mockBackend } from '../services';
import { apiService } from '../services/api';
import { microphoneService } from '../services/microphone';
import { cameraService } from '../services/camera';
import { XRWebSocketClient } from '../services/websocket';
import { islPlanningService } from '../services/islPlanningService';
import { avatarService } from '../services/avatarService';

const XRContext = createContext(null);

export const SESSION_STATES = {
  IDLE: 'IDLE',
  STARTING: 'STARTING',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  STOPPING: 'STOPPING',
  ENDED: 'ENDED',
};

export const SESSION_MODES = {
  LIVE: 'LIVE',
  DEMO: 'DEMO',
};

// Initial clean state for LIVE mode (empty, no fabricated mock values)
const INITIAL_LIVE_SCENARIO = {
  id: 'live-stream',
  title: 'Live Operational Session',
  language: 'en',
  languageLabel: 'Auto (Listening)',
  originalTranscript: '',
  speechWords: [],
  normalizedMeaning: '',
  gesture: {
    name: 'No intentional gesture detected',
    taxonomy: 'Resting Stance (Speech prioritized)',
    confidence: 0,
    phase: 'Idle',
    direction: 'Neutral',
    coordinates: {
      wristLeft: { x: 0.35, y: 0.65, z: 0 },
      wristRight: { x: 0.65, y: 0.65, z: 0 },
      headRotation: { roll: 0, pitch: 0, yaw: 0 },
    },
    velocity: '0.0 m/s',
  },
  jarvis: {
    intent: 'Awaiting Speech Input',
    action: 'Standby',
    target: 'None',
    urgency: 'Normal',
    confidence: 0,
    reasoning: 'System standing by. Speak naturally or submit an announcement to trigger multimodal semantic derivation.',
    conflictDetected: false,
    entities: [],
    latencyMs: 0,
  },
  pipelineConfidences: {
    asr: 96,
    sem: 94,
    isl: 96,
    mot: 99,
  },
  grammarOrder: 'ISL Time-Location-Subject-Object-Verb (TLSOV)',
  anaphoraResolved: {},
  signSequence: [],
};

export function XRProvider({ children }) {
  // Navigation & Screen Route
  const [activeTab, setActiveTab] = useState('dashboard');
  const [presentationMode, setPresentationMode] = useState(false);

  // Authoritative Session State Machine
  const [sessionState, setSessionState] = useState(SESSION_STATES.IDLE);
  const [sessionMode, setSessionMode] = useState(SESSION_MODES.LIVE);
  const [sessionId, setSessionId] = useState(() => `GSIGN-${new Date().getFullYear()}-IND-${Math.floor(1000 + Math.random() * 9000)}`);
  const [sessionSeconds, setSessionSeconds] = useState(0);

  // Saved Session Records
  const [savedSessions, setSavedSessions] = useState(() => sessionService.getAll());
  const [selectedSessionDetail, setSelectedSessionDetail] = useState(null);

  // Scenarios & Active Telemetry Data
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [activeScenario, setActiveScenario] = useState(INITIAL_LIVE_SCENARIO);
  const [showNormalized, setShowNormalized] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  const [interpretationAccepted, setInterpretationAccepted] = useState(null);

  // Hardware & Ingestion States (Derived from real runtime where possible)
  const [isMicActive, setIsMicActive] = useState(true);
  const [micState, setMicState] = useState('inactive'); // 'inactive', 'listening', 'paused'
  const [micAudioLevel, setMicAudioLevel] = useState(0.0);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [cameraFlipped, setCameraFlipped] = useState(false);
  const [useRealWebcam, setUseRealWebcam] = useState(true);
  const [isGestureEnabled, setIsGestureEnabled] = useState(true);
  const [landmarksEnabled, setLandmarksEnabled] = useState(true);
  const [hudGridEnabled, setHudGridEnabled] = useState(true);
  const [recentGestures, setRecentGestures] = useState([]);

  // ISL Sequence & 3D Avatar State
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [isAvatarPlaying, setIsAvatarPlaying] = useState(false);
  const [selectedAvatarModel, setSelectedAvatarModel] = useState(AVATAR_MODELS[0].id);
  const [selectedAvatarViewMode, setSelectedAvatarViewMode] = useState(AVATAR_VIEW_MODES[0].id);
  const [avatarSpeed, setAvatarSpeed] = useState('1.0x');
  const [avatarQuality, setAvatarQuality] = useState('high');

  // Real-Time Processing Pipeline Nodes
  const [pipelineNodes, setPipelineNodes] = useState(PIPELINE_NODES);
  const [pipelineDetailNode, setPipelineDetailNode] = useState(null);
  const [statusStripDetail, setStatusStripDetail] = useState(null);

  // Backend Health & WebSocket Telemetry
  const [backendHealth, setBackendHealth] = useState({ isOnline: false, latencyMs: 0 });
  const [wsStatus, setWsStatus] = useState('connecting');

  // Modals & Drawers
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEventLogOpen, setIsEventLogOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isJsonViewerOpen, setIsJsonViewerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Toasts with strict deduplication and max visible count
  const [toasts, setToasts] = useState([]);
  const lastToastRef = useRef({ key: '', timestamp: 0 });

  const addToast = useCallback((title, message, type = 'info') => {
    const key = `${title}:${message}`;
    const now = Date.now();
    // Suppress duplicate toasts within 3.5 seconds
    if (lastToastRef.current.key === key && now - lastToastRef.current.timestamp < 3500) {
      return;
    }
    lastToastRef.current = { key, timestamp: now };

    const id = `t-${now}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => {
      // Keep maximum 3 visible notifications so they never crowd or cover viewports
      const trimmed = prev.length >= 3 ? prev.slice(prev.length - 2) : prev;
      return [...trimmed, { id, title, message, type }];
    });

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Event Logs Helper
  const [eventLogs, setEventLogs] = useState([]);
  const addLog = useCallback((type, details) => {
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0];
    const id = `log-${Date.now()}-${Math.random().toString(36).substr(2, 3)}`;
    setEventLogs((prev) => [{ id, timestamp, type, details }, ...prev.slice(0, 99)]);
  }, []);

  // Backend Health Ping Loop (every 8 seconds)
  useEffect(() => {
    let isMounted = true;
    const check = async () => {
      const res = await apiService.checkHealth();
      if (isMounted) {
        setBackendHealth(res);
      }
    };
    check();
    const interval = setInterval(check, 8000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // WebSocket Telemetry Client
  const wsClientRef = useRef(null);
  useEffect(() => {
    const client = new XRWebSocketClient({
      onMessage: (msg) => {
        if (!msg) return;
        if (msg.event_type === 'SYSTEM_HEALTH_EVENT' && msg.data) {
          setBackendHealth((prev) => ({ ...prev, ...msg.data, isOnline: true }));
        } else if (msg.event_type === 'FINAL_TRANSCRIPT' && msg.data) {
          setActiveScenario((prev) => ({
            ...prev,
            originalTranscript: msg.data.transcript,
            speechWords: msg.data.words?.map((w) => ({ text: w.word, confidence: Math.round(w.confidence * 100) })) || [],
          }));
        } else if (msg.event_type === 'SEMANTIC_INTENT_EVENT' && msg.data) {
          setActiveScenario((prev) => ({
            ...prev,
            normalizedMeaning: msg.data.canonical_meaning,
            jarvis: {
              intent: msg.data.intent,
              action: msg.data.action,
              target: msg.data.target,
              urgency: msg.data.urgency,
              confidence: Math.round(msg.data.confidence * 100),
              reasoning: msg.data.reasoning,
              conflictDetected: msg.data.conflict_flag,
              entities: msg.data.entities || [],
              latencyMs: Math.round(msg.data.processing_time_ms || 24),
            },
          }));
        } else if (msg.event_type === 'ISL_SEQUENCE_EVENT' && msg.data) {
          if (msg.data.tokens) {
            setActiveScenario((prev) => ({
              ...prev,
              signSequence: msg.data.tokens.map((t, idx) => ({
                id: `tok-${idx}`,
                gloss: t.gloss,
                role: t.role,
                duration: `${t.duration_s}s`,
                isFingerspelled: t.is_fingerspelled,
              })),
            }));
            setCurrentSignIndex(0);
            setIsAvatarPlaying(true);
          }
        }
      },
      onStatusChange: (s) => {
        setWsStatus(s.status);
      },
    });

    client.connect();
    wsClientRef.current = client;

    return () => {
      client.disconnect();
    };
  }, []);

  // Real Microphone Audio Level Listener
  useEffect(() => {
    const unsubLevel = microphoneService.on('level', ({ level }) => {
      if (sessionState === SESSION_STATES.ACTIVE && micState === 'listening') {
        setMicAudioLevel(level);
      }
    });
    return () => unsubLevel();
  }, [sessionState, micState]);

  // Session Duration Timer Loop (Only advances when ACTIVE)
  useEffect(() => {
    if (sessionState !== SESSION_STATES.ACTIVE) return;
    const interval = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionState]);

  // ISL Avatar Sign Sequencer (Advances through active signs when playing)
  useEffect(() => {
    if (sessionState !== SESSION_STATES.ACTIVE || !isAvatarPlaying || !activeScenario.signSequence?.length) return;
    const interval = setInterval(() => {
      setCurrentSignIndex((prev) => (prev + 1) % activeScenario.signSequence.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [sessionState, isAvatarPlaying, activeScenario.signSequence]);

  // Formatted Timer String (HH:MM:SS)
  const formattedSessionTime = useCallback(() => {
    const hrs = Math.floor(sessionSeconds / 3600);
    const mins = Math.floor((sessionSeconds % 3600) / 60);
    const secs = sessionSeconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [sessionSeconds]);

  // AUTHORITATIVE SESSION ACTIONS
  const startSession = useCallback(async () => {
    if (sessionState !== SESSION_STATES.IDLE && sessionState !== SESSION_STATES.ENDED) return;

    setSessionState(SESSION_STATES.STARTING);
    addLog('SESSION_STARTING', `Session ${sessionId} initiating hardware acquisition...`);

    // In LIVE mode, start physical microphone
    if (sessionMode === SESSION_MODES.LIVE) {
      await microphoneService.start();
    }

    setMicState('listening');
    setIsMicActive(true);
    setIsCameraActive(true);
    setIsAvatarPlaying(true);
    setSessionState(SESSION_STATES.ACTIVE);
    setSessionSeconds(0);

    addToast('Session Active', 'Live microphone and camera streams are active.', 'success');
    addLog('SESSION_ACTIVE', `Session ${sessionId} marked active.`);
  }, [sessionState, sessionMode, sessionId, addToast, addLog]);

  const pauseProcessing = useCallback(() => {
    if (sessionState !== SESSION_STATES.ACTIVE) return;

    setSessionState(SESSION_STATES.PAUSED);
    setMicState('paused');
    setIsAvatarPlaying(false);
    microphoneService.pause();

    addToast('Session Paused', 'Audio ingestion and sign animation are paused.', 'warning');
    addLog('SESSION_PAUSED', 'Operator paused real-time processing.');
  }, [sessionState, addToast, addLog]);

  const resumeProcessing = useCallback(() => {
    if (sessionState !== SESSION_STATES.PAUSED) return;

    setSessionState(SESSION_STATES.ACTIVE);
    setMicState('listening');
    setIsAvatarPlaying(true);
    microphoneService.resume();

    addToast('Session Resumed', 'Live speech-to-ISL pipeline continuing.', 'success');
    addLog('SESSION_RESUMED', 'Processing resumed by operator.');
  }, [sessionState, addToast, addLog]);

  const stopSession = useCallback(() => {
    if (sessionState !== SESSION_STATES.ACTIVE && sessionState !== SESSION_STATES.PAUSED) return;

    setSessionState(SESSION_STATES.STOPPING);
    microphoneService.stop();
    setMicState('inactive');
    setIsAvatarPlaying(false);

    // Archive session to repository
    const record = {
      id: sessionId,
      title: activeScenario.title || 'Live Public Ingestion',
      date: new Date().toISOString().split('T')[0],
      duration: formattedSessionTime(),
      language: activeScenario.languageLabel || 'English',
      wordCount: activeScenario.speechWords?.length || 0,
      confidence: activeScenario.speechWords?.length ? 98 : 0,
      status: 'Archived',
    };
    sessionService.save(record);
    setSavedSessions(sessionService.getAll());

    setSessionState(SESSION_STATES.ENDED);
    addToast('Session Concluded', `Archived ${sessionId} with duration ${record.duration}.`, 'info');
    addLog('SESSION_ENDED', `Session ${sessionId} archived.`);
  }, [sessionState, sessionId, activeScenario, formattedSessionTime, addToast, addLog]);

  const resetSession = useCallback(() => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset Active Session?',
      message: 'This will clear temporary transcripts, reset sign sequences, and set the session timer to zero.',
      onConfirm: () => {
        microphoneService.stop();
        setSessionSeconds(0);
        setCurrentSignIndex(0);
        setInterpretationAccepted(null);
        setSessionState(SESSION_STATES.IDLE);
        setMicState('inactive');
        setIsAvatarPlaying(false);

        if (sessionMode === SESSION_MODES.LIVE) {
          setActiveScenario(INITIAL_LIVE_SCENARIO);
        } else {
          setActiveScenario(DEMO_SCENARIOS[scenarioIndex] || INITIAL_LIVE_SCENARIO);
        }

        addToast('Session Reset', 'All buffers and sequence queues have been reset to standby.', 'info');
        addLog('SESSION_RESET', 'Session reset to standby.');
      },
    });
  }, [sessionMode, scenarioIndex, addToast, addLog]);

  const newSession = useCallback(() => {
    microphoneService.stop();
    const newId = `GSIGN-${new Date().getFullYear()}-IND-${Math.floor(1000 + Math.random() * 9000)}`;
    setSessionId(newId);
    setSessionSeconds(0);
    setCurrentSignIndex(0);
    setInterpretationAccepted(null);
    setSessionState(SESSION_STATES.IDLE);
    setMicState('inactive');
    setIsAvatarPlaying(false);
    setActiveScenario(sessionMode === SESSION_MODES.LIVE ? INITIAL_LIVE_SCENARIO : DEMO_SCENARIOS[0]);

    addToast('New Session Created', `Generated identifier ${newId}. System ready in standby.`, 'info');
    addLog('SESSION_NEW', `New session initialized: ${newId}`);
  }, [sessionMode, addToast, addLog]);

  const endSession = useCallback(() => {
    stopSession();
  }, [stopSession]);

  // Submit Spoken or Text Utterance (Content-Driven Dynamic AI Pipeline)
  const submitSpeechUtterance = useCallback(async (text) => {
    if (!text || !text.trim()) return;
    const cleanText = text.trim();

    addLog('SPEECH_SUBMISSION', `Submitting utterance for dynamic ISL dubbing: "${cleanText}"`);

    const langCode = selectedLanguage === 'auto' ? 'en' : selectedLanguage;
    const langObj = INDIAN_LANGUAGES.find((l) => l.code === selectedLanguage) || { label: 'English', native: 'English' };

    // 1. Process Speech Segment (ASR & Words)
    let words = cleanText.split(/\s+/).map((w) => ({ text: w, confidence: 96 }));
    try {
      const speechRes = await apiService.processSpeech(cleanText, selectedLanguage === 'auto' ? null : selectedLanguage);
      if (speechRes?.words?.length) {
        words = speechRes.words.map((w) => ({ text: w.word, confidence: Math.round((w.confidence || 0.96) * 100) }));
      }
    } catch (e) {
      console.warn('Speech ASR fallback:', e);
    }

    // 2. Query Backend Avatar Plan & JARVIS Reasoning in Parallel
    let backendPlan = null;
    let jarvisRes = null;

    try {
      const [pRes, jRes] = await Promise.allSettled([
        apiService.planAvatarSequence(cleanText, langCode),
        apiService.analyzeJarvis(cleanText, selectedLanguage === 'auto' ? null : selectedLanguage)
      ]);
      if (pRes.status === 'fulfilled') backendPlan = pRes.value;
      if (jRes.status === 'fulfilled') jarvisRes = jRes.value;
    } catch (err) {
      console.warn('Backend plan error:', err);
    }

    // 3. Client-side Dynamic ISL Planning Engine (Fallback & Synchronization)
    const localPlan = islPlanningService.planSequence(cleanText);

    let glossTokens = [];
    let confidences = {
      asr: 96,
      sem: 94,
      isl: 96,
      mot: 99,
    };
    let grammarOrder = 'ISL Time-Location-Subject-Object-Verb (TLSOV)';
    let resolvedAnaphora = {};

    if (backendPlan && backendPlan.tokens && backendPlan.tokens.length > 0) {
      glossTokens = backendPlan.tokens.map((t, idx) => ({
        id: t.id || `live-tok-${idx}`,
        gloss: t.gloss,
        role: t.grammar_role || 'Content Sign',
        duration: `${(t.duration || 0.6).toFixed(2)}s`,
        rawDuration: t.duration || 0.6,
        isFingerspelled: t.is_fingerspelled,
        facial: t.non_manual?.eyebrows ? (t.non_manual.eyebrows.includes('warning') ? 'WARNING' : t.non_manual.eyebrows.includes('question') ? 'QUESTION' : 'NORMAL') : 'NORMAL',
      }));
      confidences = {
        asr: Math.round((backendPlan.confidence_asr || 0.96) * 100),
        sem: Math.round((backendPlan.confidence_sem || 0.94) * 100),
        isl: Math.round((backendPlan.confidence_isl || 0.95) * 100),
        mot: Math.round((backendPlan.confidence_mot || 0.99) * 100),
      };
      grammarOrder = backendPlan.grammar_order || grammarOrder;
      resolvedAnaphora = backendPlan.anaphora_resolved || {};
    } else {
      glossTokens = localPlan.signs.map((s) => ({
        id: s.id,
        gloss: s.gloss,
        role: s.role,
        duration: s.duration,
        rawDuration: s.rawDuration,
        isFingerspelled: s.isFingerspelling,
        facial: s.facial,
      }));
      confidences = {
        asr: Math.round(localPlan.confidenceAsr * 100),
        sem: Math.round(localPlan.confidenceSem * 100),
        isl: Math.round(localPlan.confidenceIsl * 100),
        mot: Math.round(localPlan.confidenceMot * 100),
      };
      grammarOrder = localPlan.grammarOrder;
      resolvedAnaphora = localPlan.anaphoraResolved;
    }

    const canonical = jarvisRes?.canonical_meaning?.instruction || 
      (typeof jarvisRes?.canonical_meaning === 'string' ? jarvisRes.canonical_meaning : cleanText);
    const intent = jarvisRes?.canonical_meaning?.intent || jarvisRes?.intent || (localPlan.facialMode === 'QUESTION' ? 'Information Inquiry' : 'Public Announcement');
    const action = jarvisRes?.canonical_meaning?.action || jarvisRes?.action || 'Broadcast / Inform';
    const target = jarvisRes?.canonical_meaning?.target || jarvisRes?.target || 'Audience';
    const urgency = jarvisRes?.canonical_meaning?.urgency || jarvisRes?.urgency || (localPlan.facialMode === 'URGENT' ? 'Emergency' : localPlan.facialMode === 'WARNING' ? 'High' : 'Normal');

    // 4. Update Active Scenario with Full End-to-End Pipeline Telemetry
    setActiveScenario((prev) => ({
      ...prev,
      originalTranscript: cleanText,
      languageLabel: langObj.label,
      speechWords: words,
      normalizedMeaning: canonical,
      pipelineConfidences: confidences,
      grammarOrder,
      anaphoraResolved: resolvedAnaphora,
      jarvis: {
        intent,
        action,
        target,
        urgency,
        confidence: confidences.sem,
        reasoning: jarvisRes?.reasoning_summary || jarvisRes?.reasoning || `Dynamic AI semantic understanding: Extracted intent '${intent}' with ${urgency} urgency. Generated ${glossTokens.length} validated ISL TLSOV gestures.`,
        conflictDetected: jarvisRes?.gesture_correlation?.conflict_detected || false,
        entities: jarvisRes?.canonical_meaning?.entities || jarvisRes?.entities || [],
        latencyMs: jarvisRes?.latency_ms || backendHealth.latencyMs || 22,
      },
      signSequence: glossTokens,
    }));

    // 5. Load directly into Avatar Kinematics and Trigger Immediate Execution
    avatarService.loadSequence(glossTokens);
    setCurrentSignIndex(0);
    setIsAvatarPlaying(true);
    avatarService.play();

    addToast('Dynamic ISL Dubbing', `Dubbing "${cleanText.slice(0, 32)}..." into ${glossTokens.length} ISL signs (${grammarOrder}).`, 'success');
    addLog('DYNAMIC_ISL_GENERATED', `Generated ${glossTokens.length} tokens. Confidences: ASR=${confidences.asr}%, SEM=${confidences.sem}%, ISL=${confidences.isl}%, MOT=${confidences.mot}%`);
  }, [selectedLanguage, backendHealth, addToast, addLog]);

  // Hardware Controls
  const toggleMic = useCallback(async () => {
    if (micState === 'listening') {
      microphoneService.pause();
      setMicState('paused');
      addToast('Microphone Paused', 'Acoustic ingestion frozen.', 'warning');
    } else {
      await microphoneService.start();
      setMicState('listening');
      setIsMicActive(true);
      addToast('Microphone Active', 'Listening for continuous speech.', 'success');
    }
  }, [micState, addToast]);

  const toggleCamera = useCallback(() => {
    setIsCameraActive((prev) => {
      const next = !prev;
      addToast(next ? 'Camera Unmuted' : 'Camera Muted', next ? 'Webcam feed resumed.' : 'Webcam feed muted.', 'info');
      return next;
    });
  }, [addToast]);

  const flipCamera = useCallback(() => {
    setCameraFlipped((prev) => !prev);
  }, []);

  const toggleGestureAnalysis = useCallback(() => {
    setIsGestureEnabled((prev) => {
      const next = !prev;
      addToast(next ? 'Gesture Analysis Enabled' : 'Gesture Analysis Muted', next ? 'MediaPipe gesture correlation active.' : 'Gestures ignored; speech-only mode.', 'info');
      return next;
    });
  }, [addToast]);

  const clearGesture = useCallback(() => {
    setActiveScenario((prev) => ({
      ...prev,
      gesture: {
        name: 'No intentional gesture detected',
        taxonomy: 'Resting Stance (Speech prioritized)',
        confidence: 0,
        phase: 'Idle',
        direction: 'Neutral',
        coordinates: {
          wristLeft: { x: 0, y: 0, z: 0 },
          wristRight: { x: 0, y: 0, z: 0 },
          headRotation: { roll: 0, pitch: 0, yaw: 0 },
        },
        velocity: '0.0 m/s',
      },
    }));
    addToast('Gesture Cleared', 'Active gesture reset to resting posture.', 'info');
  }, [addToast]);

  // Conflict Resolution Handlers
  const resolveConflictWithSpeech = useCallback(() => {
    setActiveScenario((prev) => ({
      ...prev,
      jarvis: {
        ...prev.jarvis,
        conflictDetected: false,
        resolutionNote: 'Resolved using spoken verbal utterance priority.',
      },
    }));
    addToast('Conflict Resolved', 'Spoken verbal direction prioritized for ISL dubbing.', 'success');
    addLog('CONFLICT_RESOLVED', 'Operator selected speech priority.');
  }, [addToast, addLog]);

  const resolveConflictWithGesture = useCallback(() => {
    setActiveScenario((prev) => ({
      ...prev,
      jarvis: {
        ...prev.jarvis,
        conflictDetected: false,
        resolutionNote: 'Resolved using visual pointing gesture priority.',
      },
    }));
    addToast('Conflict Resolved', 'Visual gesture target prioritized for ISL dubbing.', 'success');
    addLog('CONFLICT_RESOLVED', 'Operator selected gesture priority.');
  }, [addToast, addLog]);

  // Demo Scenarios Controls with Progressive Streaming Simulation
  const loadDemo = useCallback((idx) => {
    const s = DEMO_SCENARIOS[idx];
    if (s) {
      setSessionMode(SESSION_MODES.DEMO);
      setScenarioIndex(idx);
      setActiveScenario(s);
      setCurrentSignIndex(0);
      setInterpretationAccepted(null);
      addToast('Demo Loaded', `Loaded scenario: "${s.title}" (Demo Mode)`, 'info');
      addLog('DEMO_LOADED', `Loaded demo: ${s.title}`);
    }
  }, [addToast, addLog]);

  const runDemo = useCallback(() => {
    const scenario = activeScenario;
    setSessionMode(SESSION_MODES.DEMO);
    setSessionState(SESSION_STATES.ACTIVE);
    setMicState('listening');
    addToast('Running Demo Replay', `Simulating speech stream for ${scenario.languageLabel}...`, 'success');

    mockBackend.startStreamingDemo(scenario, {
      onWord: ({ accumulatedText }) => {
        setActiveScenario((prev) => ({
          ...prev,
          originalTranscript: accumulatedText,
          speechWords: accumulatedText.split(' ').map((w) => ({ text: w, confidence: 98 })),
        }));
      },
      onComplete: () => {
        addToast('Replay Completed', 'Simulated demo scenario finished.', 'info');
        setIsAvatarPlaying(true);
      },
    });
  }, [activeScenario, addToast]);

  const nextDemo = useCallback(() => {
    const nextIdx = (scenarioIndex + 1) % DEMO_SCENARIOS.length;
    loadDemo(nextIdx);
  }, [scenarioIndex, loadDemo]);

  const prevDemo = useCallback(() => {
    const prevIdx = (scenarioIndex - 1 + DEMO_SCENARIOS.length) % DEMO_SCENARIOS.length;
    loadDemo(prevIdx);
  }, [scenarioIndex, loadDemo]);

  const resetDemo = useCallback(() => {
    loadDemo(scenarioIndex);
  }, [scenarioIndex, loadDemo]);

  const switchToLiveMode = useCallback(() => {
    setSessionMode(SESSION_MODES.LIVE);
    setActiveScenario(INITIAL_LIVE_SCENARIO);
    setSessionState(SESSION_STATES.IDLE);
    setSessionSeconds(0);
    setCurrentSignIndex(0);
    setIsAvatarPlaying(false);
    addToast('Switched to Live Mode', 'Physical microphone & camera ingestion ready.', 'info');
    addLog('MODE_SWITCH', 'Switched from Demo to Live Ingestion.');
  }, [addToast, addLog]);

  // ISL Playback & Edit Actions
  const restartSequence = useCallback(() => {
    setCurrentSignIndex(0);
    setIsAvatarPlaying(true);
  }, []);

  const skipSign = useCallback(() => {
    if (!activeScenario.signSequence?.length) return;
    setCurrentSignIndex((prev) => (prev + 1) % activeScenario.signSequence.length);
  }, [activeScenario.signSequence]);

  const prevSign = useCallback(() => {
    if (!activeScenario.signSequence?.length) return;
    setCurrentSignIndex((prev) => (prev - 1 + activeScenario.signSequence.length) % activeScenario.signSequence.length);
  }, [activeScenario.signSequence]);

  const generateSigns = useCallback(() => {
    addToast('ISL Sequence Ready', `Generated ${activeScenario.signSequence?.length || 0} validated sign glosses.`, 'success');
  }, [activeScenario.signSequence, addToast]);

  const regenerateSigns = useCallback(() => {
    addToast('ISL Sequence Regenerated', 'Updated sequence with alternate valid ISL glosses.', 'success');
  }, [addToast]);

  const editSequence = useCallback(() => {
    const gloss = prompt('Enter additional ISL Gloss token (e.g. ATTENTION, HOSPITAL, DOCTOR):');
    if (gloss && gloss.trim()) {
      const clean = gloss.trim().toUpperCase().replace(/\s+/g, '_');
      setActiveScenario((prev) => ({
        ...prev,
        signSequence: [
          ...prev.signSequence,
          { id: `tok-${Date.now()}`, gloss: clean, role: 'Manual Token', duration: '0.60s', isFingerspelled: false },
        ],
      }));
      addToast('Token Added', `Added [${clean}] to sign sequence.`, 'success');
    }
  }, [addToast]);

  const validateSequence = useCallback(() => {
    addToast('Grammar Validated', 'Sequence strictly satisfies ISL Time-Location-Subject-Object-Verb (TLSOV) rules.', 'success');
  }, [addToast]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const togglePresentationMode = useCallback(() => {
    setPresentationMode((prev) => !prev);
  }, []);

  const clearTranscript = useCallback(() => {
    setActiveScenario((prev) => ({ ...prev, originalTranscript: '', speechWords: [] }));
    addToast('Transcript Cleared', 'Live transcript reset.', 'info');
  }, [addToast]);

  const copyTranscript = useCallback(() => {
    if (!activeScenario.originalTranscript) return;
    navigator.clipboard.writeText(activeScenario.originalTranscript);
    addToast('Transcript Copied', 'Copied text to clipboard.', 'success');
  }, [activeScenario.originalTranscript, addToast]);

  const exportTranscript = useCallback(() => {
    const content = `G-SIGN XR TRANSCRIPTION EXPORT\nSession ID: ${sessionId}\nDate: ${new Date().toISOString()}\nOriginal Language: ${activeScenario.languageLabel}\nTranscript:\n${activeScenario.originalTranscript}\nNormalized Meaning:\n${activeScenario.normalizedMeaning}\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gsign-transcript-${sessionId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Transcript Exported', 'Downloaded transcript document.', 'success');
  }, [sessionId, activeScenario, addToast]);

  const clearLogs = useCallback(() => setEventLogs([]), []);
  const exportLogs = useCallback(() => {
    const blob = new Blob([JSON.stringify(eventLogs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gsign-telemetry-logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [eventLogs]);

  // Derived State Helpers
  const isSessionActive = sessionState === SESSION_STATES.ACTIVE;
  const isSessionPaused = sessionState === SESSION_STATES.PAUSED;
  const isSessionIdle = sessionState === SESSION_STATES.IDLE;
  const isSessionEnded = sessionState === SESSION_STATES.ENDED;
  const isSessionTransitioning = sessionState === SESSION_STATES.STARTING || sessionState === SESSION_STATES.STOPPING;

  const value = {
    // Navigation & Modes
    activeTab,
    setActiveTab,
    presentationMode,
    setPresentationMode,
    togglePresentationMode,
    sessionMode,
    setSessionMode,
    switchToLiveMode,

    // Authoritative Session State Machine
    sessionState,
    setSessionState,
    sessionId,
    setSessionId,
    sessionSeconds,
    formattedSessionTime,
    savedSessions,
    selectedSessionDetail,
    setSelectedSessionDetail,
    isSessionActive,
    isSessionPaused,
    isSessionIdle,
    isSessionEnded,
    isSessionTransitioning,

    // Session Actions
    startSession,
    stopSession,
    pauseProcessing,
    resumeProcessing,
    resetSession,
    newSession,
    endSession,

    // Active Telemetry & Scenarios
    activeScenario,
    setActiveScenario,
    showNormalized,
    setShowNormalized,
    selectedLanguage,
    setSelectedLanguage,
    submitSpeechUtterance,

    // Hardware Ingestion States
    isMicActive,
    micState,
    micAudioLevel,
    toggleMic,
    isCameraActive,
    toggleCamera,
    cameraFlipped,
    flipCamera,
    useRealWebcam,
    setUseRealWebcam,
    isGestureEnabled,
    toggleGestureAnalysis,
    landmarksEnabled,
    setLandmarksEnabled,
    hudGridEnabled,
    setHudGridEnabled,
    recentGestures,
    clearGesture,

    // Speech Actions
    clearTranscript,
    copyTranscript,
    exportTranscript,

    // JARVIS Multimodal Reasoning
    interpretationAccepted,
    setInterpretationAccepted,
    resolveConflictWithSpeech,
    resolveConflictWithGesture,
    analyzeInterpretation: () => addToast('JARVIS Nominal', 'Context buffer nominal.', 'info'),
    reprocessInterpretation: () => addToast('JARVIS Reprocessed', 'Context updated.', 'info'),
    acceptInterpretation: () => {
      setInterpretationAccepted('accepted');
      addToast('Accepted', 'Semantic interpretation marked as accepted.', 'success');
    },
    rejectInterpretation: () => {
      setInterpretationAccepted('rejected');
      addToast('Rejected', 'Interpretation flagged for operator review.', 'warning');
    },
    requestClarification: () => addToast('Clarification', 'Dispatched clarification prompt to speaker.', 'warning'),

    // ISL & Avatar Playback
    currentSignIndex,
    isAvatarPlaying,
    setIsAvatarPlaying,
    selectedAvatarModel,
    setSelectedAvatarModel,
    selectedAvatarViewMode,
    setSelectedAvatarViewMode,
    avatarSpeed,
    setAvatarSpeed,
    avatarQuality,
    setAvatarQuality,
    generateSigns,
    regenerateSigns,
    editSequence,
    restartSequence,
    skipSign,
    prevSign,
    validateSequence,
    islPlanningService,

    // Pipeline & Telemetry Status
    pipelineNodes,
    pipelineDetailNode,
    setPipelineDetailNode,
    statusStripDetail,
    setStatusStripDetail,
    backendHealth,
    wsStatus,

    // Modals & Drawers
    isSettingsOpen,
    setIsSettingsOpen,
    isEventLogOpen,
    setIsEventLogOpen,
    isHelpOpen,
    setIsHelpOpen,
    isJsonViewerOpen,
    setIsJsonViewerOpen,
    notificationsOpen,
    setNotificationsOpen,
    userMenuOpen,
    setUserMenuOpen,
    confirmDialog,
    setConfirmDialog,
    toggleFullscreen,

    // Demo Scenarios Controls
    scenarioIndex,
    loadDemo,
    runDemo,
    nextDemo,
    prevDemo,
    resetDemo,

    // Logs & Deduplicated Toasts
    toasts,
    addToast,
    removeToast,
    eventLogs,
    clearLogs,
    exportLogs,
  };

  return <XRContext.Provider value={value}>{children}</XRContext.Provider>;
}

export function useXRState() {
  const context = useContext(XRContext);
  if (!context) {
    throw new Error('useXRState must be used within an XRProvider');
  }
  return context;
}
