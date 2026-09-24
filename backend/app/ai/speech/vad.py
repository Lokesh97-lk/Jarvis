"""
Voice Activity Detection (VAD) module.
Segments incoming continuous audio frames into speech bursts and silences.
"""

import numpy as np
from typing import Tuple

class VoiceActivityDetector:
    def __init__(self, sample_rate: int = 16000, frame_duration_ms: int = 30):
        self.sample_rate = sample_rate
        self.frame_duration_ms = frame_duration_ms
        self.frame_size = int(sample_rate * (frame_duration_ms / 1000.0))
        self.energy_threshold = 0.012  # Dynamic RMS threshold
        self.consecutive_speech_frames = 0
        self.consecutive_silence_frames = 0
        self.is_speech_active = False

    def process_frame(self, audio_data: np.ndarray) -> Tuple[bool, float]:
        """
        Process an audio chunk (numpy float32 array in [-1.0, 1.0]).
        Returns (is_speech, energy_rms).
        """
        if len(audio_data) == 0:
            return False, 0.0

        # Calculate Root Mean Square (RMS) energy
        rms = float(np.sqrt(np.mean(audio_data ** 2)))
        
        # Zero Crossing Rate (ZCR) to differentiate fricatives/speech from hum
        zero_crossings = np.sum(np.abs(np.diff(np.sign(audio_data)))) / (2 * len(audio_data))

        # Combined speech detection heuristic
        is_speech_frame = (rms > self.energy_threshold) and (zero_crossings > 0.02)

        if is_speech_frame:
            self.consecutive_speech_frames += 1
            self.consecutive_silence_frames = 0
            if self.consecutive_speech_frames >= 2:
                self.is_speech_active = True
        else:
            self.consecutive_silence_frames += 1
            if self.consecutive_silence_frames >= 12:  # ~360ms silence
                self.consecutive_speech_frames = 0
                self.is_speech_active = False

        return self.is_speech_active, rms
