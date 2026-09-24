from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from enum import Enum

class EventType(str, Enum):
    PARTIAL_TRANSCRIPT = "PARTIAL_TRANSCRIPT"
    FINAL_TRANSCRIPT = "FINAL_TRANSCRIPT"
    LANGUAGE_DETECTED = "LANGUAGE_DETECTED"
    GESTURE_EVENT = "GESTURE_EVENT"
    SEMANTIC_INTENT_EVENT = "SEMANTIC_INTENT_EVENT"
    ISL_SEQUENCE_EVENT = "ISL_SEQUENCE_EVENT"
    AVATAR_ACTION_EVENT = "AVATAR_ACTION_EVENT"
    SYSTEM_HEALTH_EVENT = "SYSTEM_HEALTH_EVENT"
    ERROR_EVENT = "ERROR_EVENT"

class HealthState(str, Enum):
    MIC_CONNECTED = "MIC_CONNECTED"
    CAMERA_CONNECTED = "CAMERA_CONNECTED"
    ASR_READY = "ASR_READY"
    LANGUAGE_DETECTED = "LANGUAGE_DETECTED"
    VISION_READY = "VISION_READY"
    JARVIS_READY = "JARVIS_READY"
    ISL_PLANNER_READY = "ISL_PLANNER_READY"
    AVATAR_READY = "AVATAR_READY"
    WEBSOCKET_READY = "WEBSOCKET_READY"

class SystemHealthReport(BaseModel):
    mic_connected: bool = True
    camera_connected: bool = True
    asr_ready: bool = True
    language_detected: bool = True
    vision_ready: bool = True
    jarvis_ready: bool = True
    isl_planner_ready: bool = True
    avatar_ready: bool = True
    websocket_ready: bool = True
    roundtrip_latency_ms: int = 24
    active_language: str = "en"
    mode: str = "nominal"

class WebSocketMessage(BaseModel):
    event_type: EventType
    timestamp: float
    data: Dict[str, Any] = Field(default_factory=dict)
