from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from .gesture import SpeechGestureCorrelation

class EntityItem(BaseModel):
    category: str  # DATE, TIME, TARGET, ACTION, LOCATION, PURPOSE, QUANTITY, WARNING, PERSON
    value: str
    normalized_value: str
    confidence: float = 0.95

class CanonicalMeaning(BaseModel):
    intent: str
    urgency: str = "normal"  # normal, medium, high, emergency
    date: Optional[str] = None
    time: Optional[str] = None
    target: Optional[str] = None
    action: Optional[str] = None
    location: Optional[str] = None
    purpose: Optional[str] = None
    warning: Optional[str] = None
    instruction: Optional[str] = None
    entities: List[EntityItem] = Field(default_factory=list)

class JARVISReasoningResult(BaseModel):
    session_id: str
    source_language: str
    original_transcript: str
    canonical_meaning: CanonicalMeaning
    reasoning_summary: str
    context_tags: List[str] = Field(default_factory=list)
    gesture_correlation: SpeechGestureCorrelation = Field(default_factory=SpeechGestureCorrelation)
    confidence: float = 0.96
    model_used: str = "Gemma 4 E4B (Ollama / Local Reasoner)"
    latency_ms: int = 24
