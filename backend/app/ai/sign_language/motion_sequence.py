"""
Motion Primitive Composer and Kinematic Retargeting.
Maps ISL gloss tokens to 3D joint rotations, finger curl angles, and facial morph targets
for the Three.js VRM Avatar.
"""

from typing import Dict, List, Any
from ...schemas.avatar import ISLGlossToken

# Motion Primitive Keyframe Library for VRM humanoid bones
MOTION_PRIMITIVES: Dict[str, Dict[str, Any]] = {
    "TOMORROW": {
        "right_arm": {"shoulder": [0.2, -0.4, 0.3], "elbow": [-0.6, 0.0, 0.8], "wrist": [0.1, 0.4, 0.0]},
        "fingers": {"thumb": 0.2, "index": 0.1, "middle": 0.8, "ring": 0.8, "pinky": 0.8},
        "blendshapes": {"happy": 0.2, "neutral": 0.8}
    },
    "SEMINAR_HALL": {
        "right_arm": {"shoulder": [0.4, 0.2, 0.5], "elbow": [-0.8, 0.2, 0.4], "wrist": [0.0, 0.2, 0.0]},
        "left_arm": {"shoulder": [0.4, -0.2, -0.5], "elbow": [-0.8, -0.2, -0.4], "wrist": [0.0, -0.2, 0.0]},
        "fingers": {"thumb": 0.1, "index": 0.0, "middle": 0.0, "ring": 0.0, "pinky": 0.0},
        "blendshapes": {"neutral": 1.0}
    },
    "STUDENTS": {
        "right_arm": {"shoulder": [0.3, 0.1, 0.4], "elbow": [-0.7, 0.1, 0.5], "wrist": [0.2, 0.0, 0.0]},
        "left_arm": {"shoulder": [0.3, -0.1, -0.4], "elbow": [-0.7, -0.1, -0.5], "wrist": [0.2, 0.0, 0.0]},
        "fingers": {"thumb": 0.3, "index": 0.2, "middle": 0.2, "ring": 0.2, "pinky": 0.2},
        "blendshapes": {"neutral": 1.0}
    },
    "REPORT_ASSEMBLE": {
        "right_arm": {"shoulder": [0.4, -0.3, 0.2], "elbow": [-0.9, 0.3, 0.6], "wrist": [-0.1, 0.2, 0.0]},
        "left_arm": {"shoulder": [0.4, 0.3, -0.2], "elbow": [-0.9, -0.3, -0.6], "wrist": [-0.1, -0.2, 0.0]},
        "fingers": {"thumb": 0.8, "index": 0.0, "middle": 0.9, "ring": 0.9, "pinky": 0.9},
        "blendshapes": {"neutral": 0.9, "focused": 0.5}
    },
    "DANGER_GAS_LEAK": {
        "right_arm": {"shoulder": [0.5, 0.0, 0.4], "elbow": [-1.0, 0.0, 0.8], "wrist": [0.3, 0.2, -0.2]},
        "left_arm": {"shoulder": [0.5, 0.0, -0.4], "elbow": [-1.0, 0.0, -0.8], "wrist": [0.3, -0.2, 0.2]},
        "fingers": {"thumb": 0.5, "index": 0.6, "middle": 0.6, "ring": 0.6, "pinky": 0.6},
        "blendshapes": {"angry": 0.7, "surprise": 0.6}
    },
    "DO_NOT_ENTER": {
        "right_arm": {"shoulder": [0.6, -0.5, 0.1], "elbow": [-1.2, 0.4, 0.9], "wrist": [0.0, 0.0, 0.0]},
        "left_arm": {"shoulder": [0.6, 0.5, -0.1], "elbow": [-1.2, -0.4, -0.9], "wrist": [0.0, 0.0, 0.0]},
        "fingers": {"thumb": 0.0, "index": 0.0, "middle": 0.0, "ring": 0.0, "pinky": 0.0},
        "blendshapes": {"angry": 0.8, "neutral": 0.2}
    },
    "THANK_YOU": {
        "right_arm": {"shoulder": [0.3, 0.0, 0.2], "elbow": [-0.5, 0.0, 0.4], "wrist": [0.1, 0.3, 0.0]},
        "fingers": {"thumb": 0.1, "index": 0.0, "middle": 0.0, "ring": 0.0, "pinky": 0.0},
        "blendshapes": {"happy": 0.9, "neutral": 0.3}
    }
}

class MotionSequenceComposer:
    def compose_motion_keyframes(self, token: ISLGlossToken) -> Dict[str, Any]:
        """
        Retrieves or interpolates VRM kinematic keyframes for a given token.
        """
        gloss_key = token.gloss
        if gloss_key in MOTION_PRIMITIVES:
            return MOTION_PRIMITIVES[gloss_key]
        
        # Default neutral signing posture
        return {
            "right_arm": {"shoulder": [0.2, 0.0, 0.2], "elbow": [-0.6, 0.0, 0.5], "wrist": [0.0, 0.0, 0.0]},
            "fingers": {"thumb": 0.2, "index": 0.1, "middle": 0.3, "ring": 0.4, "pinky": 0.5},
            "blendshapes": {"neutral": 1.0}
        }

motion_composer = MotionSequenceComposer()
