"""
Avatar Service.
Coordinates 3D VRM humanoid avatar actions and keyframe playback.
"""

from typing import Dict, Any, List
from ..schemas.avatar import AvatarAction, ISLSequencePayload

class AvatarService:
    def format_avatar_action(self, sequence: ISLSequencePayload) -> AvatarAction:
        first_gloss = sequence.tokens[0].gloss if sequence.tokens else "REST"
        return AvatarAction(
            type="PLAY_SEQUENCE",
            current_gloss=first_gloss,
            progress=0.0,
            fps=120,
            model="Three.js VRM Humanoid"
        )

avatar_service = AvatarService()
