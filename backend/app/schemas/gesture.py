from pydantic import BaseModel, Field
from typing import Dict, List, Optional

class Vector3D(BaseModel):
    x: float = 0.0
    y: float = 0.0
    z: float = 0.0

class Landmark3D(BaseModel):
    id: int
    name: str
    x: float
    y: float
    z: float
    visibility: float = 1.0

class HeadOrientation(BaseModel):
    roll: float = 0.0
    pitch: float = 0.0
    yaw: float = 0.0

class GestureTelemetry(BaseModel):
    wrist_left: Vector3D = Field(default_factory=Vector3D)
    wrist_right: Vector3D = Field(default_factory=Vector3D)
    head_rotation: HeadOrientation = Field(default_factory=HeadOrientation)
    velocity_mps: float = 0.0

class GestureEvent(BaseModel):
    gesture_id: str
    name: str
    taxonomy: str
    is_intentional: bool = True
    confidence: float = 0.90
    phase: str = "Hold"
    coordinates: GestureTelemetry = Field(default_factory=GestureTelemetry)
    spatial_direction: Optional[str] = None
    target_entity: Optional[str] = None

class SpeechGestureCorrelation(BaseModel):
    correlation_detected: bool = False
    is_consistent: bool = True
    conflict_detected: bool = False
    conflict_note: Optional[str] = None
    synthesis_note: str = ""
