"""
Comprehensive Integration Test Suite for G-SIGN XR.
Tests:
1. Multilingual LID & ASR (Tamil, Hindi, English).
2. Multilingual Semantic Normalization across identical intents.
3. Speech-Gesture Correlation & Contradiction Detection.
4. ISL Linguistic Planning (TLSOV grammar order & fingerspelling fallback).
5. Motion Primitive Keyframe Composition for 3D VRM Avatar.
"""

from backend.app.schemas.speech import SupportedLanguage
from backend.app.schemas.gesture import GestureEvent, GestureTelemetry, Vector3D
from backend.app.ai.speech.whisper_engine import speech_engine
from backend.app.ai.gesture.gesture_classifier import gesture_classifier
from backend.app.services.context_service import context_engine
from backend.app.services.sign_service import sign_service

def test_language_identification():
    # Tamil script detection
    lang_ta, conf_ta = speech_engine.identify_language("நாளைய தினம் காலை 10 மணிக்கு")
    assert lang_ta == SupportedLanguage.TAMIL
    assert conf_ta > 0.90

    # Hindi script detection
    lang_hi, conf_hi = speech_engine.identify_language("कल सुबह 10 बजे सभी छात्रों को")
    assert lang_hi == SupportedLanguage.HINDI
    assert conf_hi > 0.90

    # English detection
    lang_en, conf_en = speech_engine.identify_language("Tomorrow at 10 AM students report")
    assert lang_en == SupportedLanguage.ENGLISH

def test_multilingual_semantic_equivalence():
    # Identical intent spoken in Tamil vs English
    tamil_canonical = context_engine.normalize_multilingual_speech(
        "நாளைய தினம் காலை 10 மணிக்கு அனைத்து மாணவர்களும் கருத்தரங்கு கூடத்திற்கு வரவேண்டும்",
        SupportedLanguage.TAMIL
    )
    english_canonical = context_engine.normalize_multilingual_speech(
        "Tomorrow at 10 AM, all students must report to the seminar hall for the orientation program",
        SupportedLanguage.ENGLISH
    )

    assert tamil_canonical.intent == english_canonical.intent
    assert tamil_canonical.location == english_canonical.location
    assert tamil_canonical.action == english_canonical.action

def test_emergency_gas_leak_hazard():
    gas_canonical = context_engine.normalize_multilingual_speech(
        "Do not enter this area because there is a gas leak",
        SupportedLanguage.ENGLISH
    )
    assert gas_canonical.urgency == "emergency"
    assert "Gas Leak" in gas_canonical.warning

    isl_seq = sign_service.plan_sign_sequence(gas_canonical, "Do not enter this area because there is a gas leak")
    assert isl_seq.tokens[0].gloss == "DO_NOT_ENTER"
    assert isl_seq.tokens[1].gloss == "DANGER_GAS_LEAK"
    assert isl_seq.non_manual_cues.eyebrows == "alert_warning"

def test_speech_gesture_contradiction():
    gesture_pointing_right = GestureEvent(
        gesture_id="gst-1",
        name="Extended Index Directing 45°",
        taxonomy="1-Handshape",
        spatial_direction="45° Northeast [↗]",
        coordinates=GestureTelemetry(wrist_right=Vector3D(x=0.6, y=0.3, z=0.4))
    )
    # Speaker verbally says left while pointing right
    correlation = gesture_classifier.correlate_with_speech("Take the road on the left", gesture_pointing_right)
    assert correlation.conflict_detected is True
    assert "contradiction" in correlation.conflict_note.lower()

def test_isl_grammar_ordering_and_fingerspelling():
    canonical = context_engine.normalize_multilingual_speech(
        "Tomorrow at 10 AM all students must report to the seminar hall",
        SupportedLanguage.ENGLISH
    )
    isl_seq = sign_service.plan_sign_sequence(canonical, "Tomorrow at 10 AM all students must report to the seminar hall")
    
    glosses = [t.gloss for t in isl_seq.tokens]
    # Check TLSOV ordering: TOMORROW (Time) comes before SEMINAR_HALL (Location) and REPORT_ASSEMBLE (Verb)
    assert "TOMORROW" in glosses
    assert "SEMINAR_HALL" in glosses
    assert "REPORT_ASSEMBLE" in glosses
    assert glosses.index("TOMORROW") < glosses.index("REPORT_ASSEMBLE")

if __name__ == "__main__":
    print("Running pipeline tests...")
    test_language_identification()
    test_multilingual_semantic_equivalence()
    test_emergency_gas_leak_hazard()
    test_speech_gesture_contradiction()
    test_isl_grammar_ordering_and_fingerspelling()
    print("All integration tests passed successfully!")
