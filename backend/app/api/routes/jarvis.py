from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from ...schemas.jarvis import JARVISReasoningResult
from ...schemas.speech import SpeechSegment, SupportedLanguage
from ...services.jarvis_service import jarvis_service
from ...ai.speech.whisper_engine import speech_engine

router = APIRouter(prefix="/jarvis", tags=["JARVIS"])

class AnalyzeRequest(BaseModel):
    transcript: str
    language: Optional[SupportedLanguage] = None

@router.post("/analyze", response_model=JARVISReasoningResult)
async def analyze_statement(req: AnalyzeRequest):
    segment = speech_engine.transcribe_streaming_chunk(
        audio_frame=None,
        partial_text=req.transcript,
        is_final=True
    )
    result = await jarvis_service.analyze_multimodal_intent(segment=segment)
    return result

@router.get("/context")
async def get_conversational_context():
    from ...services.context_service import context_engine
    return context_engine.get_context_summary()
