from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any
from ...schemas.avatar import ISLSequencePayload
from ...services.context_service import context_engine
from ...services.sign_service import sign_service
from ...schemas.speech import SupportedLanguage

router = APIRouter(prefix="/avatar", tags=["Avatar"])

class SignPlanRequest(BaseModel):
    sentence: str
    language: SupportedLanguage = SupportedLanguage.ENGLISH

@router.post("/plan", response_model=ISLSequencePayload)
async def plan_sequence(req: SignPlanRequest):
    canonical = context_engine.normalize_multilingual_speech(req.sentence, req.language)
    sequence = sign_service.plan_sign_sequence(canonical, req.sentence)
    return sequence
