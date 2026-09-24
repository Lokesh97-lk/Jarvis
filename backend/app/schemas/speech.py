from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class SupportedLanguage(str, Enum):
    ENGLISH = "en"
    TAMIL = "ta"
    HINDI = "hi"
    TELUGU = "te"
    MALAYALAM = "ml"
    KANNADA = "kn"
    MARATHI = "mr"
    BENGALI = "bn"
    GUJARATI = "gu"
    PUNJABI = "pa"
    ODIA = "or"
    ASSAMESE = "as"
    URDU = "ur"

LANGUAGE_LABELS = {
    SupportedLanguage.ENGLISH: "English",
    SupportedLanguage.TAMIL: "தமிழ் (Tamil)",
    SupportedLanguage.HINDI: "हिन्दी (Hindi)",
    SupportedLanguage.TELUGU: "తెలుగు (Telugu)",
    SupportedLanguage.MALAYALAM: "മലയാളം (Malayalam)",
    SupportedLanguage.KANNADA: "ಕನ್ನಡ (Kannada)",
    SupportedLanguage.MARATHI: "मराठी (Marathi)",
    SupportedLanguage.BENGALI: "বাংলা (Bengali)",
    SupportedLanguage.GUJARATI: "ગુજરાતી (Gujarati)",
    SupportedLanguage.PUNJABI: "ਪੰਜਾਬੀ (Punjabi)",
    SupportedLanguage.ODIA: "ଓଡ଼ିଆ (Odia)",
    SupportedLanguage.ASSAMESE: "অসমীয়া (Assamese)",
    SupportedLanguage.URDU: "اردو (Urdu)",
}

class WordToken(BaseModel):
    text: str
    confidence: float = 1.0
    start_ms: int = 0
    end_ms: int = 0

class SpeechSegment(BaseModel):
    segment_id: str
    language: SupportedLanguage = SupportedLanguage.ENGLISH
    language_label: str = "English"
    transcript: str
    is_final: bool = False
    confidence: float = 0.95
    words: List[WordToken] = Field(default_factory=list)
    start_ms: int = 0
    end_ms: int = 0
    speaker_id: Optional[str] = "Speaker 1"
    volume_db: float = -18.0

class SpeechStreamPayload(BaseModel):
    audio_chunk_b64: Optional[str] = None
    sample_rate: int = 16000
    channels: int = 1
