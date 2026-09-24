"""
Model configuration for ASR, Vision, LLM, and Avatar synthesis.
"""

from typing import Dict, Any

MODEL_CONFIGS: Dict[str, Any] = {
    "asr": {
        "engine": "sherpa_onnx_modular",
        "supported_engines": ["sherpa_onnx", "indic_asr", "whisper_turbo"],
        "streaming_chunk_size_samples": 4800,  # 300ms at 16kHz
        "min_speech_duration_ms": 250,
        "silence_cutoff_ms": 600,
    },
    "lid": {
        "sample_duration_ms": 800,
        "confidence_threshold": 0.65,
    },
    "vision": {
        "fps_target": 60,
        "hand_confidence_threshold": 0.60,
        "pose_confidence_threshold": 0.65,
        "min_gesture_duration_ms": 200,
        "velocity_movement_threshold": 0.15,  # m/s to filter nervous fidgeting
    },
    "jarvis": {
        "engine_priority": ["ollama_gemma", "local_semantic_rules", "gemini_cloud"],
        "context_window_turns": 5,
        "temperature": 0.1,  # Low temperature for strict structural extraction
        "max_tokens": 1024,
    },
    "isl": {
        "grammar_system": "TLSOV",  # Time -> Location -> Subject -> Object -> Verb
        "default_sign_duration_sec": 0.60,
        "fingerspell_letter_duration_sec": 0.25,
        "transition_duration_sec": 0.15,
        "allow_unknown_invented_signs": False,  # Strict validated rule
    },
    "avatar": {
        "engine": "three_vrm",
        "target_fps": 120,
        "bone_interpolation": "cubic_hermite",
    }
}
