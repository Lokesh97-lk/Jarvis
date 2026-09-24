"""
Sign Language Service.
Coordinates the ISL linguistic planner and motion sequence generation.
"""

from typing import Dict, Any
from ..ai.sign_language.sign_planner import isl_planner
from ..ai.sign_language.motion_sequence import motion_composer
from ..schemas.jarvis import CanonicalMeaning
from ..schemas.avatar import ISLSequencePayload

class SignService:
    def plan_sign_sequence(self, canonical: CanonicalMeaning, source_text: str) -> ISLSequencePayload:
        return isl_planner.plan_isl_sequence(canonical, source_text)

    def get_motion_keyframes(self, token) -> Dict[str, Any]:
        return motion_composer.compose_motion_keyframes(token)

sign_service = SignService()
