from pydantic import BaseModel, Field
from typing import Dict, List, Optional

class NonManualExpression(BaseModel):
    eyebrows: str = "neutral"  # neutral, raised_question, furrowed_wh_question, alert_warning
    eyes: str = "neutral"      # wide, squint, blink, neutral
    mouth: str = "neutral"     # open_vowel, closed, polite_smile, tense
    head: str = "neutral"      # nod, tilt_left, tilt_right, shake, forward
    body_posture: str = "erect" # erect, lean_forward, lean_back

class HandArticulation(BaseModel):
    thumb: float = 0.0
    index: float = 0.0
    middle: float = 0.0
    ring: float = 0.0
    pinky: float = 0.0
    wrist_rotation: List[float] = Field(default_factory=lambda: [0.0, 0.0, 0.0])

class ISLGlossToken(BaseModel):
    id: str
    gloss: str
    grammar_role: str  # Time, Location, Subject, Object, Verb, Modifier, Question, Imperative
    duration: float = 0.6  # seconds
    timestamp_start: float = 0.0
    is_fingerspelled: bool = False
    fingerspell_letters: Optional[List[str]] = None
    non_manual: NonManualExpression = Field(default_factory=NonManualExpression)
    both_hands: bool = False
    dominant_hand: HandArticulation = Field(default_factory=HandArticulation)
    non_dominant_hand: Optional[HandArticulation] = None

class ISLSequencePayload(BaseModel):
    sequence_id: str
    source_sentence: str
    tokens: List[ISLGlossToken] = Field(default_factory=list)
    total_duration_sec: float = 0.0
    grammar_order: str = "ISL Time-Location-Subject-Object-Verb (TLSOV)"
    non_manual_cues: NonManualExpression = Field(default_factory=NonManualExpression)
    confidence_asr: float = 0.96
    confidence_sem: float = 0.95
    confidence_isl: float = 0.94
    confidence_mot: float = 0.99
    detected_language: str = "en"
    anaphora_resolved: Dict[str, str] = Field(default_factory=dict)

class AvatarAction(BaseModel):
    type: str = "PLAY_SEQUENCE"  # PLAY_SEQUENCE, REST_POSE, BLINK, GLOSS_CHANGE
    current_gloss: str = "REST"
    progress: float = 0.0
    fps: int = 120
    model: str = "Three.js VRM Humanoid"
