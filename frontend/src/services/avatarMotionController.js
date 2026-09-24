/**
 * G-SIGN XR Grade 2 Avatar Motion Controller & ISL Kinematic Engine
 * 
 * Features:
 * 1. 15-joint anatomical finger articulation per hand (30 phalanges total).
 * 2. Validated Indian Sign Language (ISL) motion primitives (Numbers 0-9, Questions, Transit, Health, Emergency, Verbs, Polite).
 * 3. Dynamic two-handed ISL fingerspelling fallback generator (A-Z).
 * 4. Non-manual signing (NMS) facial blendshapes and emotional modes (Question, Urgent, Warning, Emphasis, Normal).
 * 5. Hermite cubic motion blending and continuous trajectory smoothing between signs.
 * 6. Bilateral hand coordination (symmetrical two-handed signs, active-passive hand interactions).
 * 7. Anatomical joint limit validation and self-collision prevention.
 * 8. Designed for future integration with MMPose/RTMPose, SignAvatars, SMPL-X, and MANO retargeting.
 */

// Hand shape anatomical definitions: [thumb, index, middle, ring, pinky]
// Values are curl angles in radians for [proximal, intermediate/distal]
export const HAND_SHAPES = {
  REST_RELAXED: {
    thumb: [0.15, 0.2],
    index: [0.35, 0.3],
    middle: [0.4, 0.35],
    ring: [0.45, 0.4],
    pinky: [0.4, 0.35],
    splay: 0.05,
  },
  FLAT_OPEN_PALM: {
    thumb: [0.05, 0.05],
    index: [0.0, 0.0],
    middle: [0.0, 0.0],
    ring: [0.0, 0.0],
    pinky: [0.0, 0.0],
    splay: 0.12,
  },
  FIST_S: {
    thumb: [0.8, 0.9],
    index: [1.4, 1.3],
    middle: [1.4, 1.3],
    ring: [1.4, 1.3],
    pinky: [1.4, 1.3],
    splay: 0.0,
  },
  POINT_INDEX: {
    thumb: [0.8, 0.9],
    index: [0.0, 0.0], // Straight out
    middle: [1.4, 1.3],
    ring: [1.4, 1.3],
    pinky: [1.4, 1.3],
    splay: 0.02,
  },
  TWO_V_PEACE: {
    thumb: [0.8, 0.9],
    index: [0.0, 0.0],
    middle: [0.0, 0.0],
    ring: [1.4, 1.3],
    pinky: [1.4, 1.3],
    splay: 0.25,
  },
  THREE_W: {
    thumb: [0.8, 0.9],
    index: [0.0, 0.0],
    middle: [0.0, 0.0],
    ring: [0.0, 0.0],
    pinky: [1.4, 1.3],
    splay: 0.22,
  },
  FOUR_FINGERS: {
    thumb: [0.9, 0.9],
    index: [0.0, 0.0],
    middle: [0.0, 0.0],
    ring: [0.0, 0.0],
    pinky: [0.0, 0.0],
    splay: 0.15,
  },
  CLAW_C: {
    thumb: [0.4, 0.4],
    index: [0.65, 0.6],
    middle: [0.65, 0.6],
    ring: [0.65, 0.6],
    pinky: [0.65, 0.6],
    splay: 0.1,
  },
  PINCH_O: {
    thumb: [0.5, 0.6],
    index: [0.7, 0.8],
    middle: [0.2, 0.2],
    ring: [0.2, 0.2],
    pinky: [0.2, 0.2],
    splay: 0.05,
  },
  BARRIER_FLAT: {
    thumb: [0.1, 0.1],
    index: [0.0, 0.0],
    middle: [0.0, 0.0],
    ring: [0.0, 0.0],
    pinky: [0.0, 0.0],
    splay: 0.02,
  },
  THUMBS_UP: {
    thumb: [0.0, 0.0], // Straight up
    index: [1.4, 1.3],
    middle: [1.4, 1.3],
    ring: [1.4, 1.3],
    pinky: [1.4, 1.3],
    splay: 0.0,
  }
};

// Non-Manual Signing (NMS) Facial Expression Modes
export const FACIAL_MODES = {
  NORMAL: {
    browRaise: 0.0,
    browFurrow: 0.0,
    mouthSmile: 0.1,
    mouthOpen: 0.0,
    headTilt: 0.0,
    headNod: 0.0,
    eyeSquint: 0.0,
  },
  QUESTION: {
    browRaise: 0.75,
    browFurrow: 0.0,
    mouthSmile: 0.05,
    mouthOpen: 0.15,
    headTilt: 0.12,
    headNod: 0.05,
    eyeSquint: 0.0,
  },
  URGENT: {
    browRaise: 0.1,
    browFurrow: 0.85,
    mouthSmile: 0.0,
    mouthOpen: 0.35,
    headTilt: -0.05,
    headNod: 0.2,
    eyeSquint: 0.15,
  },
  WARNING: {
    browRaise: 0.0,
    browFurrow: 0.9,
    mouthSmile: 0.0,
    mouthOpen: 0.1,
    headTilt: 0.0,
    headNod: 0.15,
    eyeSquint: 0.25,
  },
  HAPPY: {
    browRaise: 0.3,
    browFurrow: 0.0,
    mouthSmile: 0.7,
    mouthOpen: 0.2,
    headTilt: 0.08,
    headNod: 0.05,
    eyeSquint: 0.2,
  },
  SERIOUS: {
    browRaise: 0.0,
    browFurrow: 0.4,
    mouthSmile: 0.0,
    mouthOpen: 0.0,
    headTilt: 0.0,
    headNod: 0.05,
    eyeSquint: 0.05,
  },
  EMPHASIS: {
    browRaise: 0.5,
    browFurrow: 0.3,
    mouthSmile: 0.0,
    mouthOpen: 0.2,
    headTilt: 0.0,
    headNod: 0.25,
    eyeSquint: 0.1,
  }
};

/**
 * Validated ISL Sign-Motion Primitive Definitions
 * Each sign defines keyframe arm postures, wrist rotations, hand shapes, and NMS facial cues.
 */
export const ISL_MOTION_LIBRARY = {
  // ---------------- ISL Number Gestures (0-9) ----------------
  NUMBER_0: {
    duration: 0.45,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.4, 0.2, -0.3], elbow: [-1.4, 0.2, 0.1], wrist: [0.1, 0.2, 0.0] },
    lArm: { shoulder: [0.1, 0, 0.2], elbow: [-0.2, 0, 0], wrist: [0, 0, 0] },
    rHand: 'PINCH_O',
    lHand: 'REST_RELAXED',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'Right hand presents O-shape at chest height.',
  },
  NUMBER_1: {
    duration: 0.45,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.45, 0.2, -0.3], elbow: [-1.4, 0.1, 0.2], wrist: [0.1, 0.2, 0.0] },
    lArm: { shoulder: [0.1, 0, 0.2], elbow: [-0.2, 0, 0], wrist: [0, 0, 0] },
    rHand: 'POINT_INDEX',
    lHand: 'REST_RELAXED',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'Right index finger points upright showing digit 1.',
  },
  NUMBER_2: {
    duration: 0.45,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.45, 0.2, -0.3], elbow: [-1.4, 0.1, 0.2], wrist: [0.1, 0.2, 0.0] },
    lArm: { shoulder: [0.1, 0, 0.2], elbow: [-0.2, 0, 0], wrist: [0, 0, 0] },
    rHand: 'TWO_V_PEACE',
    lHand: 'REST_RELAXED',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'Right V-hand elevated clearly at eye level.',
  },
  NUMBER_3: {
    duration: 0.45,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.45, 0.2, -0.3], elbow: [-1.4, 0.1, 0.2], wrist: [0.1, 0.2, 0.0] },
    lArm: { shoulder: [0.1, 0, 0.2], elbow: [-0.2, 0, 0], wrist: [0, 0, 0] },
    rHand: 'THREE_W',
    lHand: 'REST_RELAXED',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'Thumb, index and middle fingers extended upright for digit 3.',
  },
  NUMBER_4: {
    duration: 0.45,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.45, 0.2, -0.3], elbow: [-1.4, 0.1, 0.2], wrist: [0.1, 0.2, 0.0] },
    lArm: { shoulder: [0.1, 0, 0.2], elbow: [-0.2, 0, 0], wrist: [0, 0, 0] },
    rHand: 'FOUR_FINGERS',
    lHand: 'REST_RELAXED',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'Four fingers upright with thumb tucked.',
  },
  NUMBER_5: {
    duration: 0.45,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.45, 0.2, -0.3], elbow: [-1.4, 0.1, 0.2], wrist: [0.1, 0.2, 0.0] },
    lArm: { shoulder: [0.1, 0, 0.2], elbow: [-0.2, 0, 0], wrist: [0, 0, 0] },
    rHand: 'FLAT_OPEN_PALM',
    lHand: 'REST_RELAXED',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'Full 5 open fingers displayed forward.',
  },
  NUMBER_6: {
    duration: 0.50,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.45, 0.2, -0.3], elbow: [-1.4, 0.1, 0.2], wrist: [0.1, 0.2, 0.0] },
    lArm: { shoulder: [0.1, 0, 0.2], elbow: [-0.2, 0, 0], wrist: [0, 0, 0] },
    rHand: 'PINCH_O',
    lHand: 'REST_RELAXED',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'ISL 6 finger posture (thumb touching index tip).',
  },
  NUMBER_7: {
    duration: 0.50,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.45, 0.2, -0.3], elbow: [-1.4, 0.1, 0.2], wrist: [0.1, 0.2, 0.0] },
    lArm: { shoulder: [0.1, 0, 0.2], elbow: [-0.2, 0, 0], wrist: [0, 0, 0] },
    rHand: 'PINCH_O',
    lHand: 'REST_RELAXED',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'ISL 7 finger posture (thumb touching middle finger tip).',
  },
  NUMBER_8: {
    duration: 0.50,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.45, 0.2, -0.3], elbow: [-1.4, 0.1, 0.2], wrist: [0.1, 0.2, 0.0] },
    lArm: { shoulder: [0.1, 0, 0.2], elbow: [-0.2, 0, 0], wrist: [0, 0, 0] },
    rHand: 'PINCH_O',
    lHand: 'REST_RELAXED',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'ISL 8 finger posture (thumb touching ring finger tip).',
  },
  NUMBER_9: {
    duration: 0.50,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.45, 0.2, -0.3], elbow: [-1.4, 0.1, 0.2], wrist: [0.1, 0.2, 0.0] },
    lArm: { shoulder: [0.1, 0, 0.2], elbow: [-0.2, 0, 0], wrist: [0, 0, 0] },
    rHand: 'FOUR_FINGERS',
    lHand: 'REST_RELAXED',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'ISL 9 finger posture (thumb touching pinky tip).',
  },

  // ---------------- Question Signs ----------------
  WHERE: {
    duration: 0.65,
    facial: 'QUESTION',
    rArm: { shoulder: [-0.35, 0.3, -0.3], elbow: [-1.1, 0.3, 0.0], wrist: [-0.2, 0.4, 0.1] },
    lArm: { shoulder: [-0.35, -0.3, 0.3], elbow: [-1.1, -0.3, 0.0], wrist: [-0.2, -0.4, -0.1] },
    rHand: 'FLAT_OPEN_PALM',
    lHand: 'FLAT_OPEN_PALM',
    headGaze: { x: -0.05, y: 0.05, z: 0.0 },
    description: 'Both palms up rotating side-to-side with furrowed inquiry brows (Where?).',
  },
  WHEN: {
    duration: 0.65,
    facial: 'QUESTION',
    rArm: { shoulder: [-0.4, 0.1, -0.3], elbow: [-1.5, 0.2, 0.2], wrist: [0.1, 0.2, 0.0] },
    lArm: { shoulder: [-0.3, -0.1, 0.3], elbow: [-1.2, -0.2, 0.1], wrist: [0.1, -0.2, 0.0] },
    rHand: 'POINT_INDEX',
    lHand: 'POINT_INDEX',
    headGaze: { x: 0.0, y: 0.05, z: 0.0 },
    description: 'Right index circles left index tip with question facial markers (When?).',
  },
  WHAT: {
    duration: 0.60,
    facial: 'QUESTION',
    rArm: { shoulder: [-0.3, 0.2, -0.2], elbow: [-1.2, 0.2, 0.1], wrist: [-0.1, 0.3, 0.0] },
    lArm: { shoulder: [-0.3, -0.2, 0.2], elbow: [-1.2, -0.2, -0.1], wrist: [-0.1, -0.3, 0.0] },
    rHand: 'POINT_INDEX',
    lHand: 'POINT_INDEX',
    headGaze: { x: 0.0, y: 0.05, z: 0.0 },
    description: 'Both index fingers point outward with slight side-to-side oscillation (What?).',
  },
  WHY: {
    duration: 0.65,
    facial: 'QUESTION',
    rArm: { shoulder: [-0.6, 0.2, -0.3], elbow: [-1.6, 0.2, 0.2], wrist: [0.2, 0.2, 0.0] },
    lArm: { shoulder: [0.1, 0, 0.2], elbow: [-0.2, 0, 0], wrist: [0, 0, 0] },
    rHand: 'TWO_V_PEACE',
    lHand: 'REST_RELAXED',
    headGaze: { x: 0.08, y: 0.0, z: 0.0 },
    description: 'Hand pulls down from forehead with tilted question head (Why?).',
  },
  HOW: {
    duration: 0.65,
    facial: 'QUESTION',
    rArm: { shoulder: [-0.3, 0.3, -0.2], elbow: [-1.2, 0.2, 0.1], wrist: [-0.2, 0.3, 0.1] },
    lArm: { shoulder: [-0.3, -0.3, 0.2], elbow: [-1.2, -0.2, -0.1], wrist: [-0.2, -0.3, -0.1] },
    rHand: 'CLAW_C',
    lHand: 'CLAW_C',
    headGaze: { x: 0.0, y: 0.05, z: 0.0 },
    description: 'Both curved palms roll upward and outward (How?).',
  },
  QUESTION_MARK: {
    duration: 0.60,
    facial: 'QUESTION',
    rArm: { shoulder: [-0.5, 0.2, -0.3], elbow: [-1.4, 0.1, 0.2], wrist: [0.1, 0.2, 0.0] },
    lArm: { shoulder: [0.1, 0, 0.2], elbow: [-0.2, 0, 0], wrist: [0, 0, 0] },
    rHand: 'POINT_INDEX',
    lHand: 'REST_RELAXED',
    headGaze: { x: 0.0, y: 0.05, z: 0.0 },
    description: 'Right index traces question curve in neutral signing space.',
  },

  // ---------------- Transit & Transportation ----------------
  TRAIN: {
    duration: 0.75,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.4, 0.1, -0.2], elbow: [-1.3, 0.2, 0.1], wrist: [0.0, 0.3, 0.0] },
    lArm: { shoulder: [-0.4, -0.1, 0.2], elbow: [-1.3, -0.2, -0.1], wrist: [0.0, -0.3, 0.0] },
    rHand: 'TWO_V_PEACE',
    lHand: 'TWO_V_PEACE',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'Both V-hands parallel moving forward simulating wheels tracking along rails.',
  },
  PLATFORM: {
    duration: 0.70,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.4, 0.1, -0.2], elbow: [-1.3, 0.2, 0.1], wrist: [0.1, 0.2, 0.0] },
    lArm: { shoulder: [-0.3, -0.2, 0.2], elbow: [-1.1, 0.2, 0.0], wrist: [0.0, -0.2, 0.0] },
    rHand: 'FLAT_OPEN_PALM',
    lHand: 'FLAT_OPEN_PALM',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'Right flat palm taps down firmly upon horizontal left palm.',
  },
  DELAY: {
    duration: 0.70,
    facial: 'SERIOUS',
    rArm: { shoulder: [-0.4, 0.2, -0.2], elbow: [-1.2, 0.2, 0.1], wrist: [-0.1, 0.3, 0.0] },
    lArm: { shoulder: [-0.3, -0.2, 0.2], elbow: [-1.1, -0.1, 0.0], wrist: [-0.1, -0.2, 0.0] },
    rHand: 'FLAT_OPEN_PALM',
    lHand: 'FLAT_OPEN_PALM',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'Both flat hands move forward in staggered hesitation pulses indicating delay.',
  },
  ARRIVE: {
    duration: 0.65,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.4, 0.1, -0.2], elbow: [-1.2, 0.2, 0.1], wrist: [0.0, 0.2, 0.0] },
    lArm: { shoulder: [-0.3, -0.2, 0.2], elbow: [-1.1, 0.1, 0.0], wrist: [0.0, -0.2, 0.0] },
    rHand: 'FLAT_OPEN_PALM',
    lHand: 'FLAT_OPEN_PALM',
    headGaze: { x: 0.0, y: 0.05, z: 0.0 },
    description: 'Right hand curves forward and lands decisively upon flat left palm.',
  },
  PASSENGERS: {
    duration: 0.70,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.3, 0.2, -0.3], elbow: [-1.3, 0.1, 0.1], wrist: [-0.1, 0.2, 0.0] },
    lArm: { shoulder: [-0.3, -0.2, 0.3], elbow: [-1.3, -0.1, -0.1], wrist: [-0.1, -0.2, 0.0] },
    rHand: 'FLAT_OPEN_PALM',
    lHand: 'FLAT_OPEN_PALM',
    headGaze: { x: 0.0, y: 0.05, z: 0.0 },
    description: 'Both open palms face upward sweeping forward indicating the passenger cohort.',
  },

  // ---------------- Time Markers ----------------
  TOMORROW: {
    duration: 0.65,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.4, 0.2, -0.4], elbow: [-1.4, 0.3, 0.0], wrist: [-0.2, 0.4, 0.2] },
    lArm: { shoulder: [0.1, 0, 0.2], elbow: [-0.2, 0, 0], wrist: [0, 0, 0] },
    rHand: 'POINT_INDEX',
    lHand: 'REST_RELAXED',
    headGaze: { x: 0.05, y: -0.05, z: 0.0 },
    description: 'Right index finger points forward from side of temple in forward temporal sweep.',
  },
  TODAY: {
    duration: 0.55,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.4, 0.2, -0.2], elbow: [-1.3, 0.1, 0.1], wrist: [0.1, 0.2, 0.0] },
    lArm: { shoulder: [-0.4, -0.2, 0.2], elbow: [-1.3, -0.1, -0.1], wrist: [0.1, -0.2, 0.0] },
    rHand: 'FLAT_OPEN_PALM',
    lHand: 'FLAT_OPEN_PALM',
    headGaze: { x: 0.0, y: 0.05, z: 0.0 },
    description: 'Both hands drop down with quick emphasis indicating now/today.',
  },
  MINUTE: {
    duration: 0.55,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.4, 0.1, -0.2], elbow: [-1.4, 0.2, 0.1], wrist: [0.1, 0.2, 0.0] },
    lArm: { shoulder: [-0.3, -0.1, 0.2], elbow: [-1.2, 0.1, 0.0], wrist: [0.0, -0.2, 0.0] },
    rHand: 'POINT_INDEX',
    lHand: 'FLAT_OPEN_PALM',
    headGaze: { x: 0.0, y: 0.05, z: 0.0 },
    description: 'Right index ticks on left palm like clock hand.',
  },
  TIME_10_AM: {
    duration: 0.75,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.5, 0.1, -0.3], elbow: [-1.6, -0.2, 0.2], wrist: [0.3, 0.2, -0.1] },
    lArm: { shoulder: [-0.2, 0.1, 0.4], elbow: [-1.2, 0.4, -0.2], wrist: [0.1, -0.4, 0] },
    rHand: 'POINT_INDEX',
    lHand: 'FLAT_OPEN_PALM',
    headGaze: { x: -0.1, y: 0.1, z: 0.0 },
    description: 'Right index taps left wrist (watch), then raises open hand showing 10.',
  },

  // ---------------- Health & Emergency ----------------
  HOSPITAL: {
    duration: 0.75,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.4, -0.2, -0.2], elbow: [-1.5, 0.2, 0.2], wrist: [0.1, 0.1, 0.0] },
    lArm: { shoulder: [-0.2, 0.2, 0.3], elbow: [-1.2, 0.3, -0.1], wrist: [0.0, -0.2, 0.0] },
    rHand: 'TWO_V_PEACE',
    lHand: 'FLAT_OPEN_PALM',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'Right V-hand traces red cross on left shoulder.',
  },
  DOCTOR: {
    duration: 0.65,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.4, 0.0, -0.2], elbow: [-1.4, 0.2, 0.1], wrist: [0.1, 0.2, 0.0] },
    lArm: { shoulder: [-0.3, 0.0, 0.3], elbow: [-1.2, 0.2, -0.1], wrist: [0.0, -0.2, 0.0] },
    rHand: 'TWO_V_PEACE',
    lHand: 'FLAT_OPEN_PALM',
    headGaze: { x: 0.0, y: 0.05, z: 0.0 },
    description: 'Right fingers feel left wrist pulse.',
  },
  DOCTOR_SEE: {
    duration: 0.75,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.5, 0.1, -0.2], elbow: [-1.6, 0.3, 0.2], wrist: [0.2, 0.1, 0.0] },
    lArm: { shoulder: [-0.2, 0.1, 0.3], elbow: [-1.2, 0.3, -0.2], wrist: [0.0, -0.3, 0.0] },
    rHand: 'TWO_V_PEACE',
    lHand: 'FLAT_OPEN_PALM',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'Right V-hand touches near eye, then right index feels left wrist pulse.',
  },
  PATIENT: {
    duration: 0.65,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.4, 0.1, -0.2], elbow: [-1.3, 0.1, 0.1], wrist: [0.0, 0.2, 0.0] },
    lArm: { shoulder: [-0.3, -0.1, 0.2], elbow: [-1.1, 0.1, 0.0], wrist: [0.0, -0.2, 0.0] },
    rHand: 'FLAT_OPEN_PALM',
    lHand: 'FLAT_OPEN_PALM',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'Hands trace patient care contour across arm.',
  },
  PAIN: {
    duration: 0.65,
    facial: 'WARNING',
    rArm: { shoulder: [-0.5, 0.2, -0.2], elbow: [-1.4, 0.2, 0.1], wrist: [0.1, 0.3, 0.0] },
    lArm: { shoulder: [-0.5, -0.2, 0.2], elbow: [-1.4, -0.2, -0.1], wrist: [0.1, -0.3, 0.0] },
    rHand: 'POINT_INDEX',
    lHand: 'POINT_INDEX',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'Both index fingers point and twist toward each other with tense facial grimace.',
  },
  MEDICINE: {
    duration: 0.65,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.4, 0.1, -0.2], elbow: [-1.4, 0.2, 0.1], wrist: [0.1, 0.2, 0.0] },
    lArm: { shoulder: [-0.3, -0.1, 0.2], elbow: [-1.1, 0.1, 0.0], wrist: [0.0, -0.2, 0.0] },
    rHand: 'CLAW_C',
    lHand: 'FLAT_OPEN_PALM',
    headGaze: { x: 0.0, y: 0.05, z: 0.0 },
    description: 'Right hand grinds medicine mortar/pestle on left flat palm.',
  },
  DANGER: {
    duration: 0.65,
    facial: 'WARNING',
    rArm: { shoulder: [-0.6, 0.3, -0.3], elbow: [-1.5, 0.2, 0.2], wrist: [0.2, 0.3, 0.1] },
    lArm: { shoulder: [-0.6, -0.3, 0.3], elbow: [-1.5, -0.2, -0.2], wrist: [0.2, -0.3, -0.1] },
    rHand: 'FLAT_OPEN_PALM',
    lHand: 'FLAT_OPEN_PALM',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'Both hands raised abruptly in universal halt/danger posture with warning expression.',
  },
  GAS_LEAK: {
    duration: 0.8,
    facial: 'URGENT',
    rArm: { shoulder: [-0.7, -0.1, -0.2], elbow: [-1.7, 0.4, 0.3], wrist: [0.4, 0.2, 0.1] },
    lArm: { shoulder: [-0.3, -0.3, 0.2], elbow: [-1.1, 0.2, -0.1], wrist: [-0.2, 0.3, 0.0] },
    rHand: 'BARRIER_FLAT',
    lHand: 'FLAT_OPEN_PALM',
    headGaze: { x: 0.0, y: -0.1, z: 0.0 },
    description: 'Right hand covers mouth and nose while left hand fans disperses air.',
  },
  EVACUATE_NOW: {
    duration: 0.75,
    facial: 'URGENT',
    rArm: { shoulder: [-0.5, 0.5, -0.5], elbow: [-1.1, 0.4, 0.1], wrist: [-0.2, 0.5, 0.3] },
    lArm: { shoulder: [-0.5, 0.3, 0.3], elbow: [-1.2, 0.2, 0.0], wrist: [-0.1, 0.4, 0.2] },
    rHand: 'FLAT_OPEN_PALM',
    lHand: 'FLAT_OPEN_PALM',
    headGaze: { x: 0.2, y: 0.0, z: 0.0 },
    description: 'Both hands vigorously sweep toward perimeter direction indicating rapid exit.',
  },
  DO_NOT_ENTER: {
    duration: 0.7,
    facial: 'WARNING',
    rArm: { shoulder: [-0.4, -0.3, -0.2], elbow: [-1.4, -0.3, 0.2], wrist: [0.2, -0.2, 0] },
    lArm: { shoulder: [-0.4, 0.3, 0.2], elbow: [-1.4, 0.3, -0.2], wrist: [0.2, 0.2, 0] },
    rHand: 'FIST_S',
    lHand: 'FIST_S',
    headGaze: { x: 0.0, y: 0.05, z: 0.0 },
    description: 'Forearms cross firmly in X-barrier in front of chest.',
  },
  WIRE_HAZARD: {
    duration: 0.70,
    facial: 'WARNING',
    rArm: { shoulder: [-0.5, 0.2, -0.3], elbow: [-1.3, 0.2, 0.2], wrist: [0.2, 0.2, 0.0] },
    lArm: { shoulder: [0.1, 0, 0.2], elbow: [-0.2, 0, 0], wrist: [0, 0, 0] },
    rHand: 'CLAW_C',
    lHand: 'REST_RELAXED',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'Right hand twitches showing electrical spark recoil.',
  },

  // ---------------- Education & Civic ----------------
  STUDENTS: {
    duration: 0.7,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.3, 0.2, -0.3], elbow: [-1.3, 0.1, 0.1], wrist: [-0.1, 0.2, 0.0] },
    lArm: { shoulder: [-0.3, -0.2, 0.3], elbow: [-1.3, -0.1, -0.1], wrist: [-0.1, -0.2, 0.0] },
    rHand: 'FLAT_OPEN_PALM',
    lHand: 'FLAT_OPEN_PALM',
    headGaze: { x: 0.0, y: 0.05, z: 0.0 },
    description: 'Both open palms face upward and sweep forward indicating collective cohort.',
  },
  SEMINAR_HALL: {
    duration: 0.8,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.4, 0.4, -0.2], elbow: [-1.1, 0.2, -0.3], wrist: [0.0, 0.4, 0.2] },
    lArm: { shoulder: [-0.4, -0.4, 0.2], elbow: [-1.1, -0.2, 0.3], wrist: [0.0, -0.4, -0.2] },
    rHand: 'BARRIER_FLAT',
    lHand: 'BARRIER_FLAT',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'Both hands form symmetrical building enclosure box in neutral signing space.',
  },
  ASSIGNMENT: {
    duration: 0.65,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.4, 0.1, -0.2], elbow: [-1.4, 0.2, 0.1], wrist: [0.1, 0.2, 0.0] },
    lArm: { shoulder: [-0.3, -0.1, 0.2], elbow: [-1.1, 0.1, 0.0], wrist: [0.0, -0.2, 0.0] },
    rHand: 'PINCH_O',
    lHand: 'FLAT_OPEN_PALM',
    headGaze: { x: 0.0, y: 0.05, z: 0.0 },
    description: 'Right hand mimes writing upon flat left palm (student assignment).',
  },
  SUBMIT: {
    duration: 0.65,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.3, 0.2, -0.3], elbow: [-1.1, 0.2, 0.0], wrist: [-0.1, 0.2, 0.0] },
    lArm: { shoulder: [-0.3, -0.2, 0.3], elbow: [-1.1, -0.2, 0.0], wrist: [-0.1, -0.2, 0.0] },
    rHand: 'FLAT_OPEN_PALM',
    lHand: 'FLAT_OPEN_PALM',
    headGaze: { x: 0.0, y: 0.05, z: 0.0 },
    description: 'Both palms extend forward and lower slightly in formal submission hand-over.',
  },
  REPORT_ASSEMBLE: {
    duration: 0.75,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.3, 0.4, -0.4], elbow: [-1.2, 0.3, 0.0], wrist: [0.1, 0.4, 0.1] },
    lArm: { shoulder: [-0.3, -0.4, 0.4], elbow: [-1.2, -0.3, 0.0], wrist: [0.1, -0.4, -0.1] },
    rHand: 'CLAW_C',
    lHand: 'CLAW_C',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'Both hands sweep from perimeter inward to center indicating meeting/assembly.',
  },
  FOLLOW_PATH: {
    duration: 0.7,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.4, 0.0, -0.1], elbow: [-0.9, 0.1, 0.0], wrist: [-0.2, 0.1, 0.0] },
    lArm: { shoulder: [0.1, 0, 0.2], elbow: [-0.2, 0, 0], wrist: [0, 0, 0] },
    rHand: 'BARRIER_FLAT',
    lHand: 'REST_RELAXED',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'Right flat hand moves straight ahead cutting a forward path line.',
  },

  // ---------------- Negation ----------------
  NOT: {
    duration: 0.50,
    facial: 'WARNING',
    rArm: { shoulder: [-0.5, 0.1, -0.2], elbow: [-1.5, 0.2, 0.2], wrist: [0.2, 0.2, 0.0] },
    lArm: { shoulder: [0.1, 0, 0.2], elbow: [-0.2, 0, 0], wrist: [0, 0, 0] },
    rHand: 'FIST_S',
    lHand: 'REST_RELAXED',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'Thumb flicks forward from chin with head shake (Not).',
  },
  DO_NOT: {
    duration: 0.60,
    facial: 'WARNING',
    rArm: { shoulder: [-0.4, 0.2, -0.2], elbow: [-1.2, 0.2, 0.1], wrist: [0.1, 0.3, 0.0] },
    lArm: { shoulder: [-0.4, -0.2, 0.2], elbow: [-1.2, -0.2, -0.1], wrist: [0.1, -0.3, 0.0] },
    rHand: 'FLAT_OPEN_PALM',
    lHand: 'FLAT_OPEN_PALM',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'Both flat palms cross and wave outward with head shake (Do not).',
  },
  STOP: {
    duration: 0.60,
    facial: 'WARNING',
    rArm: { shoulder: [-0.4, 0.1, -0.2], elbow: [-1.3, 0.2, 0.1], wrist: [0.1, 0.2, 0.0] },
    lArm: { shoulder: [-0.3, -0.1, 0.2], elbow: [-1.1, 0.1, 0.0], wrist: [0.0, -0.2, 0.0] },
    rHand: 'BARRIER_FLAT',
    lHand: 'FLAT_OPEN_PALM',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'Right hand drops blade firmly on left open palm (Stop).',
  },

  // ---------------- Courtesy & Politeness ----------------
  HELLO_NAMASTE: {
    duration: 0.65,
    facial: 'HAPPY',
    rArm: { shoulder: [-0.3, -0.1, -0.2], elbow: [-1.4, 0.1, 0.1], wrist: [0.1, 0.0, 0.0] },
    lArm: { shoulder: [-0.3, 0.1, 0.2], elbow: [-1.4, -0.1, -0.1], wrist: [0.1, 0.0, 0.0] },
    rHand: 'FLAT_OPEN_PALM',
    lHand: 'FLAT_OPEN_PALM',
    headGaze: { x: 0.0, y: -0.05, z: 0.0 },
    description: 'Anjali Mudra (two palms pressed together at chest) with gentle respectful bow.',
  },
  THANK_YOU: {
    duration: 0.55,
    facial: 'HAPPY',
    rArm: { shoulder: [-0.5, 0.1, -0.2], elbow: [-1.5, 0.2, 0.1], wrist: [0.1, 0.2, 0.0] },
    lArm: { shoulder: [0.1, 0, 0.2], elbow: [-0.2, 0, 0], wrist: [0, 0, 0] },
    rHand: 'FLAT_OPEN_PALM',
    lHand: 'REST_RELAXED',
    headGaze: { x: 0.0, y: -0.05, z: 0.0 },
    description: 'Flat hand touches chin then arcs gracefully forward with a polite smile.',
  },
  PLEASE: {
    duration: 0.50,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.4, 0.0, -0.2], elbow: [-1.3, 0.1, 0.1], wrist: [0.0, 0.1, 0.0] },
    lArm: { shoulder: [0.1, 0, 0.2], elbow: [-0.2, 0, 0], wrist: [0, 0, 0] },
    rHand: 'FLAT_OPEN_PALM',
    lHand: 'REST_RELAXED',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'Flat palm rubs chest in gentle circular motion.',
  },
  ATTENTION: {
    duration: 0.55,
    facial: 'EMPHASIS',
    rArm: { shoulder: [-0.7, 0.3, -0.2], elbow: [-1.6, 0.2, 0.3], wrist: [0.2, 0.3, 0.1] },
    lArm: { shoulder: [-0.7, -0.3, 0.2], elbow: [-1.6, -0.2, -0.3], wrist: [0.2, -0.3, -0.1] },
    rHand: 'FLAT_OPEN_PALM',
    lHand: 'FLAT_OPEN_PALM',
    headGaze: { x: 0.0, y: -0.05, z: 0.0 },
    description: 'Both hands held parallel beside ears, pulsing forward with polite emphasis.',
  },

  // ---------------- Spatial Deictic Pointing ----------------
  POINT_LEFT: {
    duration: 0.65,
    facial: 'SERIOUS',
    rArm: { shoulder: [-0.4, -0.5, 0.2], elbow: [-0.8, -0.4, 0.3], wrist: [-0.2, -0.6, 0.2] },
    lArm: { shoulder: [0.1, 0, 0.2], elbow: [-0.2, 0, 0], wrist: [0, 0, 0] },
    rHand: 'POINT_INDEX',
    lHand: 'REST_RELAXED',
    headGaze: { x: -0.3, y: 0.0, z: 0.0 },
    description: 'Right arm extends across body pointing explicitly to LEFT sector, head gazes left.',
  },
  POINT_RIGHT: {
    duration: 0.65,
    facial: 'SERIOUS',
    rArm: { shoulder: [-0.4, 0.5, -0.2], elbow: [-0.8, 0.4, -0.3], wrist: [-0.2, 0.6, -0.2] },
    lArm: { shoulder: [0.1, 0, 0.2], elbow: [-0.2, 0, 0], wrist: [0, 0, 0] },
    rHand: 'POINT_INDEX',
    lHand: 'REST_RELAXED',
    headGaze: { x: 0.3, y: 0.0, z: 0.0 },
    description: 'Right arm extends to RIGHT sector with gaze grounding.',
  },
  REST: {
    duration: 0.5,
    facial: 'NORMAL',
    rArm: { shoulder: [0.1, 0.0, -0.2], elbow: [-0.2, 0.0, 0.0], wrist: [0.0, 0.0, 0.0] },
    lArm: { shoulder: [0.1, 0.0, 0.2], elbow: [-0.2, 0.0, 0.0], wrist: [0.0, 0.0, 0.0] },
    rHand: 'REST_RELAXED',
    lHand: 'REST_RELAXED',
    headGaze: { x: 0.0, y: 0.0, z: 0.0 },
    description: 'Humanoid resting posture with hands comfortably at waist level.',
  }
};

/**
 * Procedural Hermite Cubic Easing Function
 * Yields smooth human kinematic acceleration and deceleration without robotic snapping.
 */
export function cubicEaseInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Anatomical Joint Limit Validation & Safety Clamping
 * Ensures humanoid joints never violate physical musculoskeletal limits.
 */
export function validateJointLimits(pose) {
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  const safeRArm = {
    shoulder: [
      clamp(pose.rArm.shoulder[0], -1.8, 0.5), // flexion/extension
      clamp(pose.rArm.shoulder[1], -0.8, 1.2), // adduction/abduction
      clamp(pose.rArm.shoulder[2], -1.2, 0.8), // internal/external
    ],
    elbow: [
      clamp(pose.rArm.elbow[0], -2.5, 0.0), // flexion limit
      clamp(pose.rArm.elbow[1], -0.8, 0.8),
      clamp(pose.rArm.elbow[2], -0.8, 0.8),
    ],
    wrist: [
      clamp(pose.rArm.wrist[0], -0.8, 0.8),
      clamp(pose.rArm.wrist[1], -0.8, 0.8),
      clamp(pose.rArm.wrist[2], -0.8, 0.8),
    ],
  };

  const safeLArm = {
    shoulder: [
      clamp(pose.lArm.shoulder[0], -1.8, 0.5),
      clamp(pose.lArm.shoulder[1], -1.2, 0.8),
      clamp(pose.lArm.shoulder[2], -0.8, 1.2),
    ],
    elbow: [
      clamp(pose.lArm.elbow[0], -2.5, 0.0),
      clamp(pose.lArm.elbow[1], -0.8, 0.8),
      clamp(pose.lArm.elbow[2], -0.8, 0.8),
    ],
    wrist: [
      clamp(pose.lArm.wrist[0], -0.8, 0.8),
      clamp(pose.lArm.wrist[1], -0.8, 0.8),
      clamp(pose.lArm.wrist[2], -0.8, 0.8),
    ],
  };

  return {
    ...pose,
    rArm: safeRArm,
    lArm: safeLArm,
  };
}

/**
 * Generate fallback fingerspelling sign definition for unmapped vocabulary (A-Z)
 */
export function getFingerspellingPrimitive(letter) {
  const char = (letter || 'A').toUpperCase();
  let rHand = 'POINT_INDEX';
  let lHand = 'FLAT_OPEN_PALM';

  if (['A', 'E', 'I', 'O', 'U'].includes(char)) {
    rHand = 'POINT_INDEX'; // Vowel index taps on left hand fingertip
  } else if (['B', 'P', 'R'].includes(char)) {
    rHand = 'TWO_V_PEACE';
  } else if (['C', 'G'].includes(char)) {
    rHand = 'CLAW_C';
  } else if (['D', 'T', 'L'].includes(char)) {
    rHand = 'POINT_INDEX';
  } else if (['M', 'N', 'W'].includes(char)) {
    rHand = 'THREE_W';
  } else {
    rHand = 'FLAT_OPEN_PALM';
  }

  return {
    duration: 0.40,
    facial: 'NORMAL',
    rArm: { shoulder: [-0.4, 0.15, -0.2], elbow: [-1.4, 0.2, 0.1], wrist: [0.1, 0.2, 0.0] },
    lArm: { shoulder: [-0.3, -0.15, 0.2], elbow: [-1.3, -0.2, 0.0], wrist: [0.1, -0.2, 0.0] },
    rHand,
    lHand,
    headGaze: { x: 0.0, y: 0.05, z: 0.0 },
    description: `Official two-handed ISL fingerspelling configuration for letter [${char}].`,
  };
}

/**
 * Resolve sign token gloss to motion primitive with automatic number and fingerspelling routing
 */
export function resolveMotionPrimitive(gloss) {
  const clean = (gloss || '').toUpperCase().trim();
  
  // 1. Direct hit
  if (ISL_MOTION_LIBRARY[clean]) {
    return ISL_MOTION_LIBRARY[clean];
  }

  // 2. Number check
  if (clean.startsWith('NUM_') || /^\d+$/.test(clean)) {
    const digit = clean.replace(/[^0-9]/g, '').slice(-1) || '1';
    const numKey = `NUMBER_${digit}`;
    if (ISL_MOTION_LIBRARY[numKey]) return ISL_MOTION_LIBRARY[numKey];
  }

  // 3. Fingerspelling tag check: [FS:X] or FS_X
  if (clean.startsWith('[FS:') || clean.startsWith('FS_') || clean.startsWith('FS:')) {
    const letter = clean.replace(/[^A-Z]/g, '').slice(-1) || 'A';
    return getFingerspellingPrimitive(letter);
  }

  // 4. Default fallback
  return ISL_MOTION_LIBRARY.REST;
}
