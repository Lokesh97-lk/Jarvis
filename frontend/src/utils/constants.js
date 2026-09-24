/**
 * G-SIGN XR CONSTANTS & PRESETS
 * Comprehensive sample scenarios, Indian language metadata, and pipeline definitions.
 */

export const INDIAN_LANGUAGES = [
  { code: 'auto', label: 'Auto Detect', native: 'தானியங்கி / स्वतः' },
  { code: 'en', label: 'English (India)', native: 'English' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'as', label: 'Assamese', native: 'অসমীয়া' },
  { code: 'ur', label: 'Urdu', native: 'اردو' },
];

export const DEMO_SCENARIOS = [
  {
    id: 'demo-academic',
    title: '1. Academic Orientation Announcement (Tamil)',
    category: 'Education / Government',
    language: 'ta',
    languageLabel: 'தமிழ் (Tamil)',
    originalTranscript: 'நாளைய தினம் காலை 10 மணிக்கு அனைத்து மாணவர்களும் கருத்தரங்கு கூடத்திற்கு வரவேண்டும்',
    normalizedMeaning: 'Tomorrow at 10 AM, all students must report to the seminar hall for the orientation program.',
    speechWords: [
      { text: 'நாளைய', confidence: 99 },
      { text: 'தினம்', confidence: 98 },
      { text: 'காலை', confidence: 99 },
      { text: '10', confidence: 99 },
      { text: 'மணிக்கு', confidence: 97 },
      { text: 'அனைத்து', confidence: 98 },
      { text: 'மாணவர்களும்', confidence: 99 },
      { text: 'கருத்தரங்கு', confidence: 96 },
      { text: 'கூடத்திற்கு', confidence: 98 },
      { text: 'வரவேண்டும்', confidence: 99 },
    ],
    gesture: {
      name: 'Open Palm Welcoming (Both Hands)',
      taxonomy: 'Formal Academic Assembly Address',
      confidence: 96,
      phase: 'Hold Phase',
      direction: 'Audience Center [⊙]',
      coordinates: {
        wristLeft: { x: -0.32, y: 0.15, z: 0.42 },
        wristRight: { x: 0.35, y: 0.15, z: 0.45 },
        headRotation: { roll: 0.5, pitch: 4.2, yaw: 0.8 },
      },
      velocity: '0.42 m/s',
    },
    jarvis: {
      intent: 'Official Academic Assembly Announcement',
      action: 'Report / Assemble',
      target: 'All Students',
      entities: [
        { category: 'DATE', value: 'Tomorrow', normalized: '2026-09-25' },
        { category: 'TIME', value: '10:00 AM', normalized: '10:00' },
        { category: 'TARGET', value: 'Students', normalized: 'STUDENTS' },
        { category: 'LOCATION', value: 'Seminar Hall', normalized: 'SEMINAR_HALL' },
        { category: 'PURPOSE', value: 'Orientation Program', normalized: 'ORIENTATION' }
      ],
      context: 'University notice board audio broadcast to incoming cohort.',
      urgency: 'normal',
      confidence: 98.4,
      latencyMs: 22,
      gestureRelevance: 'Gesture provides courteous formal emphasis.',
      conflictDetected: false,
      conflictNote: null,
      reasoning: 'Synthesizing Tamil formal spoken announcement. Mapped temporal marker (tomorrow 10 AM) and spatial marker (seminar hall) into standardized academic intent.',
    },
    signSequence: [
      { id: 'tok-1', gloss: 'TOMORROW', role: 'Time Modifier', duration: '0.55s', isFingerspelled: false },
      { id: 'tok-2', gloss: 'TIME_10_AM', role: 'Time Specification', duration: '0.70s', isFingerspelled: false },
      { id: 'tok-3', gloss: 'SEMINAR_HALL', role: 'Spatial Location', duration: '0.75s', isFingerspelled: false },
      { id: 'tok-4', gloss: 'STUDENTS', role: 'Subject Entity', duration: '0.65s', isFingerspelled: false },
      { id: 'tok-5', gloss: 'ATTENTION', role: 'Purpose Focus', duration: '0.50s', isFingerspelled: false },
      { id: 'tok-6', gloss: 'REPORT_ASSEMBLE', role: 'Main Verb', duration: '0.70s', isFingerspelled: false },
    ]
  },

  {
    id: 'demo-railway',
    title: '2. Railway Platform Wayfinding (Hindi)',
    category: 'Public Transport',
    language: 'hi',
    languageLabel: 'हिन्दी (Hindi)',
    originalTranscript: 'कृपया ध्यान दें, चेन्नई एक्सप्रेस प्लेटफार्म नंबर 2 पर आ रही है, सीधे आगे जाएं',
    normalizedMeaning: 'Attention please, Chennai Express is arriving on Platform 2, proceed straight ahead.',
    speechWords: [
      { text: 'कृपया', confidence: 99 },
      { text: 'ध्यान', confidence: 98 },
      { text: 'दें,', confidence: 99 },
      { text: 'चेन्नई', confidence: 96 },
      { text: 'एक्सप्रेस', confidence: 98 },
      { text: 'प्लेटफार्म', confidence: 99 },
      { text: 'नंबर', confidence: 99 },
      { text: '2', confidence: 99 },
      { text: 'पर', confidence: 97 },
      { text: 'आ', confidence: 98 },
      { text: 'रही', confidence: 98 },
      { text: 'है,', confidence: 99 },
      { text: 'सीधे', confidence: 98 },
      { text: 'आगे', confidence: 99 },
      { text: 'जाएं', confidence: 97 },
    ],
    gesture: {
      name: 'Extended Index Directing Forward',
      taxonomy: 'Deictic Indexing Forward Corridor',
      confidence: 94,
      phase: 'Apex Hold',
      direction: 'Forward [↑]',
      coordinates: {
        wristLeft: { x: -0.15, y: -0.05, z: 0.28 },
        wristRight: { x: 0.20, y: 0.25, z: 0.65 },
        headRotation: { roll: 1.0, pitch: -2.0, yaw: 2.5 },
      },
      velocity: '1.2 m/s',
    },
    jarvis: {
      intent: 'Public Railway Transit Announcement',
      action: 'Proceed Straight to Platform',
      target: 'Chennai Express Commuters',
      entities: [
        { category: 'TARGET', value: 'Chennai Express', normalized: 'TRAIN_CHENNAI_EXP' },
        { category: 'LOCATION', value: 'Platform 2', normalized: 'PLATFORM_TWO' },
        { category: 'ACTION', value: 'Proceed Ahead', normalized: 'PROCEED_FORWARD' }
      ],
      context: 'Station concourse public address system.',
      urgency: 'medium',
      confidence: 97.6,
      latencyMs: 19,
      gestureRelevance: 'Pointing gesture grounds platform direction.',
      conflictDetected: false,
      conflictNote: null,
      reasoning: 'Synthesized Hindi railway PA audio with physical arm gesture. Verbal and spatial directions align on forward corridor.',
    },
    signSequence: [
      { id: 'tok-1', gloss: 'ATTENTION', role: 'Polite Form', duration: '0.50s', isFingerspelled: false },
      { id: 'tok-2', gloss: 'RAILWAY_STATION', role: 'Location Context', duration: '0.80s', isFingerspelled: false },
      { id: 'tok-3', gloss: 'PLATFORM_TWO', role: 'Spatial Target', duration: '0.75s', isFingerspelled: false },
      { id: 'tok-4', gloss: 'FOLLOW_PATH', role: 'Main Verb', duration: '0.65s', isFingerspelled: false },
    ]
  },

  {
    id: 'demo-hazard',
    title: '3. Emergency Gas Leak Hazard Warning (English)',
    category: 'Emergency / Safety Alert',
    language: 'en',
    languageLabel: 'English (US)',
    originalTranscript: 'Do not enter this area because there is a severe toxic gas leak.',
    normalizedMeaning: 'Hazard Alert: Chemical gas leak detected. Entry strictly prohibited; evacuate immediately.',
    speechWords: [
      { text: 'Do', confidence: 99 },
      { text: 'not', confidence: 99 },
      { text: 'enter', confidence: 98 },
      { text: 'this', confidence: 97 },
      { text: 'area', confidence: 99 },
      { text: 'because', confidence: 96 },
      { text: 'there', confidence: 98 },
      { text: 'is', confidence: 99 },
      { text: 'a', confidence: 99 },
      { text: 'severe', confidence: 95 },
      { text: 'toxic', confidence: 98 },
      { text: 'gas', confidence: 99 },
      { text: 'leak.', confidence: 99 },
    ],
    gesture: {
      name: 'Raised Open Palm (Halt Barrier)',
      taxonomy: 'ISL Barrier Marker • Immediate Halt',
      confidence: 97,
      phase: 'Sustained Hold',
      direction: 'Frontal Barrier [⊘]',
      coordinates: {
        wristLeft: { x: -0.10, y: 0.10, z: 0.35 },
        wristRight: { x: 0.15, y: 0.45, z: 0.40 },
        headRotation: { roll: -1.0, pitch: 6.0, yaw: -2.0 },
      },
      velocity: '1.8 m/s',
    },
    jarvis: {
      intent: 'Hazard Alert / Immediate Entry Restriction',
      action: 'Halt / Evacuate',
      target: 'All Civilians / Staff',
      entities: [
        { category: 'WARNING', value: 'Gas Leak Hazard', normalized: 'HAZARD_GAS_LEAK' },
        { category: 'ACTION', value: 'Do Not Enter', normalized: 'PROHIBITED_ENTRY' },
        { category: 'LOCATION', value: 'Current Sector', normalized: 'RESTRICTED_ZONE' }
      ],
      context: 'Emergency safety broadcast over industrial sensor trigger.',
      urgency: 'emergency',
      confidence: 99.2,
      latencyMs: 14,
      gestureRelevance: 'Raised palm strongly reinforces verbal prohibition.',
      conflictDetected: false,
      conflictNote: null,
      reasoning: 'Critical safety alert recognized. Priority elevated to emergency; non-manual facial alert triggered on avatar rig.',
    },
    signSequence: [
      { id: 'tok-1', gloss: 'DO_NOT_ENTER', role: 'Emergency Warning', duration: '0.75s', isFingerspelled: false },
      { id: 'tok-2', gloss: 'DANGER_GAS_LEAK', role: 'Hazard Warning', duration: '0.85s', isFingerspelled: false },
      { id: 'tok-3', gloss: 'STOP_IMMEDIATELY', role: 'Imperative Verb', duration: '0.60s', isFingerspelled: false },
    ]
  },

  {
    id: 'demo-conflict',
    title: '4. Speech–Gesture Contradiction (Left vs Right)',
    category: 'Ambiguity & Clarification',
    language: 'en',
    languageLabel: 'English (US)',
    originalTranscript: 'Take the road on the left side to reach the emergency clinic.',
    normalizedMeaning: 'Speech says turn left, but physical gesture points right. Flagged for clarification.',
    speechWords: [
      { text: 'Take', confidence: 99 },
      { text: 'the', confidence: 99 },
      { text: 'road', confidence: 98 },
      { text: 'on', confidence: 99 },
      { text: 'the', confidence: 99 },
      { text: 'left', confidence: 99 },
      { text: 'side', confidence: 97 },
      { text: 'to', confidence: 98 },
      { text: 'reach', confidence: 96 },
      { text: 'the', confidence: 99 },
      { text: 'clinic.', confidence: 98 },
    ],
    gesture: {
      name: 'Extended Index Directing Right (45° Azimuth)',
      taxonomy: 'Deictic Index Pointing Right',
      confidence: 95,
      phase: 'Apex Hold',
      direction: '45° Northeast [↗]',
      coordinates: {
        wristLeft: { x: -0.25, y: -0.10, z: 0.30 },
        wristRight: { x: 0.65, y: 0.28, z: 0.55 },
        headRotation: { roll: 2.0, pitch: -3.0, yaw: 18.0 },
      },
      velocity: '1.4 m/s',
    },
    jarvis: {
      intent: 'Navigational Guidance with Contradiction Flag',
      action: 'Directional Turn (Ambiguous)',
      target: 'Emergency Clinic',
      entities: [
        { category: 'LOCATION', value: 'Emergency Clinic', normalized: 'HOSPITAL' },
        { category: 'CONTRADICTION', value: 'Verbal Left vs Gesture Right', normalized: 'CONFLICT_DIRECTION' }
      ],
      context: 'Cross-modal discrepancy detected between acoustic phonemes and visual vector.',
      urgency: 'medium',
      confidence: 68.5,
      latencyMs: 25,
      gestureRelevance: 'Gesture contradicts spoken word.',
      conflictDetected: true,
      conflictNote: 'Speech contradiction: Speaker verbally instructed "left" while physically pointing to the right (45° Azimuth).',
      reasoning: 'Flagged cross-modal contradiction. Prioritizing verbal instruction with explicit ambiguity marker on ISL sequence.',
    },
    signSequence: [
      { id: 'tok-1', gloss: 'HOSPITAL', role: 'Spatial Target', duration: '0.65s', isFingerspelled: false },
      { id: 'tok-2', gloss: 'FOLLOW_PATH', role: 'Verb Form', duration: '0.65s', isFingerspelled: false },
      { id: 'tok-3', gloss: 'ATTENTION', role: 'Clarification Flag', duration: '0.50s', isFingerspelled: false },
    ]
  },

  {
    id: 'demo-hospital',
    title: '5. Hospital Triage Guidance (Malayalam)',
    category: 'Healthcare Access',
    language: 'ml',
    languageLabel: 'മലയാളം (Malayalam)',
    originalTranscript: 'ഡോക്ടറെ കാണാൻ അത്യാഹിത വിഭാഗത്തിലേക്ക് ഉടൻ പോകുക',
    normalizedMeaning: 'Please proceed immediately to the emergency triage room to consult the doctor.',
    speechWords: [
      { text: 'ഡോക്ടറെ', confidence: 98 },
      { text: 'കാണാൻ', confidence: 99 },
      { text: 'അത്യാഹിത', confidence: 97 },
      { text: 'വിഭാഗത്തിലേക്ക്', confidence: 98 },
      { text: 'ഉടൻ', confidence: 99 },
      { text: 'പോകുക', confidence: 98 },
    ],
    gesture: {
      name: 'Flat Palm Guiding Interpersonal',
      taxonomy: 'Direct Interpersonal Health Guidance',
      confidence: 96,
      phase: 'Hold Phase',
      direction: 'Direct Ahead [↑]',
      coordinates: {
        wristLeft: { x: -0.20, y: 0.05, z: 0.35 },
        wristRight: { x: 0.22, y: 0.15, z: 0.40 },
        headRotation: { roll: 0.0, pitch: 3.5, yaw: 0.0 },
      },
      velocity: '0.6 m/s',
    },
    jarvis: {
      intent: 'Medical Triage Route Instruction',
      action: 'Proceed to Doctor Consultation',
      target: 'Hospital Inpatients / Visitors',
      entities: [
        { category: 'TARGET', value: 'Doctor', normalized: 'DOCTOR' },
        { category: 'LOCATION', value: 'Emergency Triage Room', normalized: 'HOSPITAL' },
        { category: 'URGENCY', value: 'Immediate', normalized: 'HIGH_URGENCY' }
      ],
      context: 'Hospital reception and triage guidance.',
      urgency: 'high',
      confidence: 98.6,
      latencyMs: 20,
      gestureRelevance: 'Gentle guiding motion reinforces urgency.',
      conflictDetected: false,
      conflictNote: null,
      reasoning: 'Processed Malayalam healthcare directive. Identified medical doctor entity and emergency triage room.',
    },
    signSequence: [
      { id: 'tok-1', gloss: 'HOSPITAL', role: 'Spatial Location', duration: '0.65s', isFingerspelled: false },
      { id: 'tok-2', gloss: 'DOCTOR', role: 'Subject Entity', duration: '0.55s', isFingerspelled: false },
      { id: 'tok-3', gloss: 'GO_TOWARDS', role: 'Main Verb', duration: '0.50s', isFingerspelled: false },
      { id: 'tok-4', gloss: 'PLEASE', role: 'Polite Form', duration: '0.45s', isFingerspelled: false },
    ]
  }
];

export const PIPELINE_NODES = [
  { id: 'mic', name: 'Microphone', model: 'Web Audio API / Scarlett 2i2', latency: '2ms', status: 'ready', description: 'Continuous laptop microphone audio ingestion with VAD silence filtering.' },
  { id: 'lid', name: 'Language Detection', model: 'Indic Phonetic LID Engine', latency: '6ms', status: 'ready', description: 'Automatic identification across 13 Indian languages.' },
  { id: 'asr', name: 'Streaming ASR', model: 'Sherpa-ONNX / Indic Conformer', latency: '9ms', status: 'ready', description: 'Streaming acoustic transcription with word-level timestamps.' },
  { id: 'transcript', name: 'Transcript Normalization', model: 'Multilingual Semantic Aligner', latency: '4ms', status: 'ready', description: 'Preserves original transcript while extracting canonical meaning.' },
  { id: 'vision', name: 'Visual Context', model: 'MediaPipe Holistic 3D', latency: '12ms', status: 'ready', description: 'Tracks 21 hand joints & pose, filtering incidental movements.' },
  { id: 'jarvis', name: 'JARVIS Reasoner', model: 'Gemma 4 E4B (Ollama Local)', latency: '22ms', status: 'ready', description: 'Multimodal semantic synthesis, entity extraction, and contradiction checks.' },
  { id: 'planner', name: 'ISL Planner', model: 'TLSOV Grammar Synthesizer', latency: '7ms', status: 'ready', description: 'Converts canonical meaning to validated ISL sequence with fingerspelling fallback.' },
  { id: 'avatar', name: '3D VRM Avatar', model: 'Three.js VRM Rig (120 FPS)', latency: '16ms', status: 'ready', description: 'Continuous kinematic retargeting with finger articulation and facial blendshapes.' }
];

export const AVATAR_MODELS = [
  { id: 'maya', name: 'Maya v3.2 (National ISL Certified)', lang: 'ISL (Indian Sign Language)' },
  { id: 'arjun', name: 'Arjun v2.0 (High Contrast Rig)', lang: 'ISL (Government Standard)' },
  { id: 'cyber', name: 'XR Cyber Wireframe (Low Latency)', lang: 'Universal Kinematic' }
];

export const AVATAR_VIEW_MODES = [
  { id: 'studio', label: 'Studio Mesh' },
  { id: 'hologram', label: 'XR Hologram' },
  { id: 'skeleton', label: 'Skeleton Rig' }
];
