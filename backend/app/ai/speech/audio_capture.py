"""
Audio Capture and Ring Buffer module.
Manages audio streams from WebSocket clients or local microphone.
"""

import base64
import numpy as np
from typing import Optional, List
import io
import wave

class AudioBufferManager:
    def __init__(self, sample_rate: int = 16000, max_buffer_seconds: int = 15):
        self.sample_rate = sample_rate
        self.max_samples = sample_rate * max_buffer_seconds
        self.buffer = np.zeros(0, dtype=np.float32)

    def append_raw_bytes(self, pcm_bytes: bytes) -> np.ndarray:
        """
        Convert 16-bit signed PCM little-endian bytes to float32 numpy array.
        """
        if not pcm_bytes:
            return np.zeros(0, dtype=np.float32)
        int16_data = np.frombuffer(pcm_bytes, dtype=np.int16)
        float_data = int16_data.astype(np.float32) / 32768.0
        self.buffer = np.append(self.buffer, float_data)
        if len(self.buffer) > self.max_samples:
            self.buffer = self.buffer[-self.max_samples:]
        return float_data

    def append_base64_chunk(self, b64_str: str) -> np.ndarray:
        """
        Decode base64 encoded audio chunk from browser client.
        """
        try:
            pcm_bytes = base64.b64decode(b64_str)
            return self.append_raw_bytes(pcm_bytes)
        except Exception as e:
            return np.zeros(0, dtype=np.float32)

    def get_latest_window(self, duration_ms: int = 3000) -> np.ndarray:
        """
        Get the most recent audio segment.
        """
        num_samples = int(self.sample_rate * (duration_ms / 1000.0))
        if len(self.buffer) == 0:
            return np.zeros(0, dtype=np.float32)
        return self.buffer[-num_samples:]

    def clear(self):
        self.buffer = np.zeros(0, dtype=np.float32)
