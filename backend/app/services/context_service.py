"""
Context Engine and Multilingual Semantic Normalization Service.
Normalizes arbitrary natural language utterances across Indian languages (Tamil, Hindi, Telugu,
Malayalam, Kannada, Marathi, English, etc.) into unified language-independent semantic representations.
Maintains a rolling context buffer across consecutive sentences for conversational discourse continuity.
"""

from typing import List, Dict, Optional, Any
from ..schemas.speech import SpeechSegment, SupportedLanguage
from ..schemas.gesture import GestureEvent
from ..schemas.jarvis import CanonicalMeaning, EntityItem
from ..ai.speech.multilingual_nlp import semantic_engine, SemanticFrame

class MultimodalContextEngine:
    def __init__(self, max_rolling_turns: int = 8):
        self.max_rolling_turns = max_rolling_turns
        self.rolling_history: List[Dict[str, Any]] = []
        self.active_entities: Dict[str, str] = {}

    def add_turn(
        self,
        segment: SpeechSegment,
        gesture: Optional[GestureEvent],
        canonical: CanonicalMeaning
    ):
        """
        Record current conversational turn into rolling context buffer.
        """
        turn = {
            "segment_id": segment.segment_id,
            "language": segment.language.value if hasattr(segment.language, "value") else str(segment.language),
            "original_transcript": segment.transcript,
            "canonical_meaning": canonical.model_dump(),
            "gesture": gesture.model_dump() if gesture else None,
        }
        self.rolling_history.append(turn)
        if len(self.rolling_history) > self.max_rolling_turns:
            self.rolling_history.pop(0)

        # Update persistent entities (locations, dates, people, objects)
        if canonical.location:
            self.active_entities["last_location"] = canonical.location
        if canonical.date:
            self.active_entities["last_date"] = canonical.date
        if canonical.time:
            self.active_entities["last_time"] = canonical.time
        if canonical.target:
            self.active_entities["last_target"] = canonical.target
        if canonical.action:
            self.active_entities["last_action"] = canonical.action

    def get_context_summary(self) -> Dict[str, Any]:
        return {
            "recent_turns_count": len(self.rolling_history),
            "active_entities": self.active_entities,
            "previous_sentences": [t["original_transcript"] for t in self.rolling_history[-3:]],
            "nlp_memory": semantic_engine.memory.get_summary()
        }

    def normalize_multilingual_speech(
        self,
        transcript: str,
        language: SupportedLanguage
    ) -> CanonicalMeaning:
        """
        Multilingual Normalization:
        Parses arbitrary natural language speech across Indian languages and English
        into an equivalent canonical meaning representation using the NLP semantic engine.
        """
        lang_str = language.value if hasattr(language, "value") else str(language)
        frame: SemanticFrame = semantic_engine.parse_utterance(transcript, lang_str)

        entities: List[EntityItem] = []
        for ent in frame.entities:
            entities.append(EntityItem(
                category=ent.category,
                value=ent.raw_text,
                normalized_value=ent.normalized_value,
                confidence=ent.confidence
            ))

        # Synthesize canonical fields
        date_val = frame.time_tokens[0] if frame.time_tokens else None
        time_val = frame.numbers[0] + " AM/PM" if frame.numbers and any(x in transcript.lower() for x in ["am", "pm", "மணி", "बजे"]) else None
        target_val = " ".join(frame.subject_tokens) if frame.subject_tokens else None
        action_val = " ".join(frame.action_tokens) if frame.action_tokens else None
        loc_val = " ".join(frame.location_tokens) if frame.location_tokens else None
        warning_val = "Alert: " + frame.intent if frame.urgency in ["emergency", "urgent"] else None

        instruction = transcript
        if frame.resolved_anaphora:
            anaphora_desc = ", ".join([f"{k} -> {v}" for k, v in frame.resolved_anaphora.items()])
            instruction += f" [Context Resolved: {anaphora_desc}]"

        return CanonicalMeaning(
            intent=frame.intent,
            urgency=frame.urgency,
            date=date_val,
            time=time_val,
            target=target_val,
            action=action_val,
            location=loc_val,
            purpose=" ".join(frame.object_tokens) if frame.object_tokens else None,
            warning=warning_val,
            instruction=instruction,
            entities=entities,
        )

context_engine = MultimodalContextEngine()
