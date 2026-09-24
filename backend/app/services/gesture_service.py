"""
Gesture Service.
Processes incoming vision frames and produces intentional gesture events.
"""

from typing import Dict, Any, Optional
from ..ai.gesture.mediapipe_engine import mediapipe_engine
from ..ai.gesture.gesture_classifier import gesture_classifier
from ..schemas.gesture import GestureEvent

class GestureService:
    def process_camera_frame(self, frame_payload: Dict[str, Any]) -> Optional[GestureEvent]:
        telemetry = mediapipe_engine.parse_client_landmarks(frame_payload)
        client_name = frame_payload.get("gestureName")
        gesture_event = gesture_classifier.classify_gesture(telemetry, client_name)
        return gesture_event

gesture_service = GestureService()
