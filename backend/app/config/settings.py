import os
from pydantic import BaseModel, Field
from typing import List

class Settings(BaseModel):
    PROJECT_NAME: str = "G-SIGN XR Multilingual Audio-to-ISL Dubbing Engine"
    VERSION: str = "1.0.0"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ]

    # Ollama / JARVIS Configuration
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "gemma:4b")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Audio & Streaming Parameters
    SAMPLE_RATE: int = 16000
    CHANNELS: int = 1
    VAD_AGGRESSIVENESS: int = 3
    VAD_FRAME_MS: int = 30
    SILENCE_THRESHOLD_MS: int = 500

    # Model Defaults
    DEFAULT_LANGUAGE: str = "en"
    FALLBACK_TO_FINGERSPELLING: bool = True
    MAX_ROLLING_CONTEXT_SENTENCES: int = 5

settings = Settings()
