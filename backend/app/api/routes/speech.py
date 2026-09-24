from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from ...schemas.speech import SpeechSegment, SupportedLanguage
from ...services.speech_service import speech_service
from ...ai.speech.whisper_engine import speech_engine

router = APIRouter(prefix="/speech", tags=["Speech"])

class TranscribeRequest(BaseModel):
    text: str
    language: Optional[SupportedLanguage] = None
    is_final: bool = True

@router.post("/process", response_model=SpeechSegment)
async def process_speech(req: TranscribeRequest):
    segment = speech_engine.transcribe_streaming_chunk(
        audio_frame=None,
        partial_text=req.text,
        is_final=req.is_final
    )
    return segment
