"""
Speech Service.
Orchestrates continuous audio capture, Voice Activity Detection,
Language Identification, and Streaming Multilingual ASR.
"""

from typing import Optional, Dict, Any
import numpy as np

from ..ai.speech.vad import VoiceActivityDetector
from ..ai.speech.audio_capture import AudioBufferManager
from ..ai.speech.whisper_engine import speech_engine
from ..schemas.speech import SpeechSegment, SupportedLanguage

class SpeechService:
    def __init__(self):
        self.vad = VoiceActivityDetector()
        self.buffer_manager = AudioBufferManager()
        self.active_transcript_accumulator = ""

    def process_incoming_audio_chunk(
        self,
        b64_audio: str,
        hint_text: Optional[str] = None,
        is_final: bool = False
    ) -> SpeechSegment:
        """
        Receives raw streaming audio chunk, applies VAD, and performs multilingual ASR.
        """
        audio_data = self.buffer_manager.append_base64_chunk(b64_audio)
        is_speech, rms = self.vad.process_frame(audio_data)

        text_to_use = hint_text if hint_text else self.active_transcript_accumulator
        if is_final:
            self.active_transcript_accumulator = ""

        segment = speech_engine.transcribe_streaming_chunk(
            audio_frame=audio_data,
            partial_text=text_to_use,
            is_final=is_final
        )
        return segment

speech_service = SpeechService()
