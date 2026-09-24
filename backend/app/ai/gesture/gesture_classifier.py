"""
Gesture Classifier and Speech-Gesture Correlation Module.
Distinguishes intentional gestures from incidental movement and identifies
semantic alignment or conflicts between speech and non-verbal cues.
"""

from typing import Optional, Tuple
from ...schemas.gesture import GestureEvent, GestureTelemetry, SpeechGestureCorrelation

class GestureClassifier:
    def __init__(self):
        self.min_intentional_velocity = 0.18  # m/s threshold

    def classify_gesture(
        self,
        telemetry: GestureTelemetry,
        client_name: Optional[str] = None
    ) -> Optional[GestureEvent]:
        """
        Filters out incidental fidgeting and identifies communicative gestures.
        Returns GestureEvent if intentional, else None.
        """
        # If explicitly passed or detected
        rx = telemetry.wrist_right.x
        ry = telemetry.wrist_right.y
        rz = telemetry.wrist_right.z

        # Right Hand Pointing / Index Extension
        if rx > 0.35 and ry > 0.15:
            direction = "45° Northeast [↗]" if rx > 0.5 else "Forward [↑]"
            return GestureEvent(
                gesture_id="gst-pointing-right",
                name="Extended Index Directing 45°",
                taxonomy="ASL/ISL 1-Handshape • Deictic Spatial Index",
                is_intentional=True,
                confidence=0.94,
                phase="Apex Hold",
                coordinates=telemetry,
                spatial_direction=direction,
                target_entity="Right Egress / Directional Vector",
            )

        # Raised Palm / Stop
        if ry > 0.40 and abs(rx) < 0.3:
            return GestureEvent(
                gesture_id="gst-stop",
                name="Raised Open Palm (Stop / Halt)",
                taxonomy="ISL Open Palm • Barrier Marker",
                is_intentional=True,
                confidence=0.96,
                phase="Hold",
                coordinates=telemetry,
                spatial_direction="Frontal Barrier [⊘]",
                target_entity="Immediate Trajectory",
            )

        # Hand over heart / Gratitude
        if abs(rx) < 0.15 and abs(ry) < 0.15 and rz < 0.35:
            return GestureEvent(
                gesture_id="gst-gratitude",
                name="Flat Palm Over Heart & Nod",
                taxonomy="ISL Respectful Greeting / Gratitude",
                is_intentional=True,
                confidence=0.95,
                phase="Hold",
                coordinates=telemetry,
                spatial_direction="Interpersonal [⊙]",
                target_entity="Interlocutor",
            )

        # If client provided an active recognized gesture
        if client_name and "No" not in client_name:
            return GestureEvent(
                gesture_id="gst-client",
                name=client_name,
                taxonomy="Intentional Communicative Gesture",
                is_intentional=True,
                confidence=0.90,
                coordinates=telemetry,
            )

        # Incidental / Resting movement (Ignored)
        return None

    def correlate_with_speech(
        self,
        spoken_text: str,
        gesture: Optional[GestureEvent]
    ) -> SpeechGestureCorrelation:
        """
        Correlates speech content with detected gesture to find semantic agreement
        or detect contradictions (e.g., saying 'left' while pointing 'right').
        """
        if not gesture or not gesture.is_intentional:
            return SpeechGestureCorrelation(
                correlation_detected=False,
                is_consistent=True,
                conflict_detected=False,
                synthesis_note="No active gesture; proceeding purely on acoustic speech stream."
            )

        text_lower = spoken_text.lower()

        # Check Conflict: Spoken 'left' while pointing right
        if "left" in text_lower and ("right" in gesture.name.lower() or "northeast" in str(gesture.spatial_direction).lower()):
            return SpeechGestureCorrelation(
                correlation_detected=True,
                is_consistent=False,
                conflict_detected=True,
                conflict_note="Speech contradiction: Speaker verbally instructed 'left' while physically pointing to the right.",
                synthesis_note="Ambiguity flagged for clarification; prioritizing verbal instruction with conflict marker."
            )

        # Consistent Pointing
        if any(w in text_lower for w in ["there", "gate", "door", "path", "exit", "hospital", "hall", "go"]):
            return SpeechGestureCorrelation(
                correlation_detected=True,
                is_consistent=True,
                conflict_detected=False,
                synthesis_note=f"Deictic gesture grounds verbal instruction to spatial vector ({gesture.spatial_direction})."
            )

        # Consistent Stop / Halt
        if any(w in text_lower for w in ["stop", "wait", "halt", "don't", "danger"]):
            return SpeechGestureCorrelation(
                correlation_detected=True,
                is_consistent=True,
                conflict_detected=False,
                synthesis_note="Raised palm reinforces urgent verbal stop instruction."
            )

        return SpeechGestureCorrelation(
            correlation_detected=True,
            is_consistent=True,
            conflict_detected=False,
            synthesis_note="Gesture provides complementary conversational emphasis."
        )

gesture_classifier = GestureClassifier()
