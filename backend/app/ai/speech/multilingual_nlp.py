"""
Multilingual Natural Language Processing & Semantic Interlingua Engine for G-SIGN XR.
Transforms natural language utterances (English, Tamil, Hindi, Telugu, Malayalam, etc.)
into a language-independent Semantic Frame and maintains rolling conversational memory
for anaphora resolution and connected speech coherence.
"""

import re
from typing import Dict, List, Optional, Any, Tuple
from pydantic import BaseModel, Field

class ExtractedEntity(BaseModel):
    category: str  # TIME, LOCATION, SUBJECT, OBJECT, ACTION, NEGATION, NUMBER, QUESTION, URGENCY
    raw_text: str
    normalized_value: str
    confidence: float = 0.95

class SemanticFrame(BaseModel):
    original_transcript: str
    detected_language: str = "en"
    intent: str = "General Communication"
    urgency: str = "normal"  # normal, medium, urgent, emergency
    
    # Grammatical semantic constituents
    time_tokens: List[str] = Field(default_factory=list)
    location_tokens: List[str] = Field(default_factory=list)
    subject_tokens: List[str] = Field(default_factory=list)
    object_tokens: List[str] = Field(default_factory=list)
    action_tokens: List[str] = Field(default_factory=list)
    negation_tokens: List[str] = Field(default_factory=list)
    
    # Numbers and Quantities
    numbers: List[str] = Field(default_factory=list)
    
    # Question attributes
    is_question: bool = False
    question_type: Optional[str] = None  # "WH" or "POLAR"
    wh_word: Optional[str] = None       # WHERE, WHEN, WHAT, WHY, HOW, WHO
    
    # Non-manual cue cues derived from semantics
    facial_expression: str = "NORMAL"   # NORMAL, QUESTION, URGENT, WARNING, EMPHASIS
    head_movement: str = "slight_nod"   # slight_nod, nod, shake, tilt, forward
    
    # Entities and confidences
    entities: List[ExtractedEntity] = Field(default_factory=list)
    confidence_sem: float = 0.95
    resolved_anaphora: Dict[str, str] = Field(default_factory=dict)

# Comprehensive multilingual lexical mappings
MULTILINGUAL_LEXICON = {
    # Time markers
    "TIME": {
        "tomorrow": "TOMORROW", "नाளை": "TOMORROW", "நாளைய தினம்": "TOMORROW", "कल": "TOMORROW", "नाळे": "TOMORROW", "రేపు": "TOMORROW",
        "today": "TODAY", "இன்று": "TODAY", "இன்றைய தினம்": "TODAY", "आज": "TODAY", "ഇന്ന്": "TODAY", "ఈరోజు": "TODAY",
        "yesterday": "YESTERDAY", "நேற்று": "YESTERDAY", "कल बीता": "YESTERDAY", "ഇന്നലെ": "YESTERDAY",
        "morning": "MORNING", "காலை": "MORNING", "सुबह": "MORNING", "രാവിലെ": "MORNING", "ఉదయం": "MORNING",
        "now": "NOW", "இப்போது": "NOW", "अब": "NOW", "ഇപ്പോൾ": "NOW", "ఇప్పుడు": "NOW",
        "minute": "MINUTE", "நிமிடம்": "MINUTE", "मिनट": "MINUTE", "മിനിറ്റ്": "MINUTE",
        "hour": "HOUR", "மணி": "HOUR", "घंटा": "HOUR", "മണിക്കൂർ": "HOUR",
    },
    
    # Location markers
    "LOCATION": {
        "platform": "PLATFORM", "பிளாட்பாரம்": "PLATFORM", "प्लेटफॉर्म": "PLATFORM", "പ്ലാറ്റ്‌ഫോം": "PLATFORM",
        "station": "STATION", "நிலைய": "STATION", "स्टेशन": "STATION", "സ്റ്റേഷൻ": "STATION",
        "hospital": "HOSPITAL", "மருத்துவமனை": "HOSPITAL", "अस्पताल": "HOSPITAL", "ആശുപത്രി": "HOSPITAL",
        "hall": "SEMINAR_HALL", "seminar": "SEMINAR_HALL", "கருத்தரங்கு": "SEMINAR_HALL", "हॉल": "SEMINAR_HALL",
        "gate": "EXIT_GATE", "exit": "EXIT_GATE", "வெளிவாயில்": "EXIT_GATE", "द्वार": "EXIT_GATE", "गेट": "EXIT_GATE",
        "room": "ROOM", "அறை": "ROOM", "कमरा": "ROOM", "റൂം": "ROOM",
        "airport": "AIRPORT", "விமான நிலையம்": "AIRPORT", "हवाई अड्डा": "AIRPORT",
    },
    
    # Subjects & Actors
    "SUBJECT": {
        "train": "TRAIN", "ரயில்": "TRAIN", "வண்டி": "TRAIN", "ट्रेन": "TRAIN", "തീവണ്ടി": "TRAIN", "రైలు": "TRAIN",
        "students": "STUDENTS", "student": "STUDENTS", "மாணவர்கள்": "STUDENTS", "மாணவர்": "STUDENTS", "छात्र": "STUDENTS", "विद्यार्थी": "STUDENTS", "విద్యార్థులు": "STUDENTS",
        "doctor": "DOCTOR", "மருத்துவர்": "DOCTOR", "டாக்டர்": "DOCTOR", "डॉक्टर": "DOCTOR", "வைద్యుడు": "DOCTOR",
        "patient": "PATIENT", "நோயாளி": "PATIENT", "मरीज": "PATIENT", "രോഗി": "PATIENT",
        "passengers": "PASSENGERS", "பயணிகள்": "PASSENGERS", "यात्री": "PASSENGERS", "യാത്രക്കാർ": "PASSENGERS",
        "police": "POLICE", "காவல்துறை": "POLICE", "போலீஸ்": "POLICE", "पुलिस": "POLICE",
        "everyone": "ALL_PEOPLE", "அனைவரும்": "ALL_PEOPLE", "सभी": "ALL_PEOPLE", "എല്ലാവരും": "ALL_PEOPLE",
    },
    
    # Objects
    "OBJECT": {
        "assignment": "ASSIGNMENT", "பணி": "ASSIGNMENT", "असाइनमेंट": "ASSIGNMENT",
        "ticket": "TICKET", "டிக்கெட்": "TICKET", "टिकट": "TICKET",
        "medicine": "MEDICINE", "மருந்து": "MEDICINE", "दवा": "MEDICINE", "മരുന്ന്": "MEDICINE",
        "gas": "GAS_LEAK", "gas leak": "GAS_LEAK", "எரிவாயு": "GAS_LEAK", "गैस": "GAS_LEAK",
        "wire": "WIRE_HAZARD", "கம்பி": "WIRE_HAZARD", "तार": "WIRE_HAZARD",
        "water": "WATER", "தண்ணீர்": "WATER", "पानी": "WATER", "വെള്ളം": "WATER",
        "pain": "PAIN", "வலி": "PAIN", "दर्द": "PAIN", "വേദന": "PAIN",
        "prescription": "PRESCRIPTION", "மருந்துச் சீட்டு": "PRESCRIPTION", "पर्चा": "PRESCRIPTION",
    },
    
    # Actions & Verbs
    "ACTION": {
        "submit": "SUBMIT", "சமர்ப்பிக்க": "SUBMIT", "जमा": "SUBMIT",
        "arrive": "ARRIVE", "வர": "ARRIVE", "வரும்": "ARRIVE", "आना": "ARRIVE", "आएगी": "ARRIVE",
        "report": "REPORT_ASSEMBLE", "assemble": "REPORT_ASSEMBLE", "வரவேண்டும்": "REPORT_ASSEMBLE", "उपस्थित": "REPORT_ASSEMBLE",
        "evacuate": "EVACUATE_NOW", "வெளியேற": "EVACUATE_NOW", "खाली": "EVACUATE_NOW",
        "follow": "FOLLOW_PATH", "பின்பற்ற": "FOLLOW_PATH", "வழி": "FOLLOW_PATH", "जाएं": "FOLLOW_PATH",
        "delay": "DELAY", "delayed": "DELAY", "தாமதம்": "DELAY", "देरी": "DELAY", "വൈകി": "DELAY",
        "enter": "ENTER", "நுழைய": "ENTER", "प्रवेश": "ENTER",
        "touch": "TOUCH", "தொட": "TOUCH", "छूना": "TOUCH",
        "help": "HELP", "உதவி": "HELP", "मदद": "HELP", "സഹായം": "HELP",
        "wait": "WAIT", "காத்திருக்க": "WAIT", "रुकें": "WAIT", "प्रतीक्षा": "WAIT",
        "see": "DOCTOR_SEE", "காண": "DOCTOR_SEE", "मिलें": "DOCTOR_SEE", "दिखाएं": "DOCTOR_SEE",
        "thank": "THANK_YOU", "thanks": "THANK_YOU", "நன்றி": "THANK_YOU", "धन्यवाद": "THANK_YOU", "शुक्रिया": "THANK_YOU", "നന്ദി": "THANK_YOU",
    },
    
    # Negations
    "NEGATION": {
        "not": "NOT", "do not": "DO_NOT", "don't": "DO_NOT", "வேண்டாம்": "DO_NOT", "இல்லை": "NOT",
        "न करें": "DO_NOT", "नहीं": "NOT", "मत": "DO_NOT", "അരുത്": "DO_NOT", "వద్దు": "DO_NOT",
        "prohibited": "DO_NOT_ENTER", "avoid": "DO_NOT", "தவிர்க்க": "DO_NOT",
    },
    
    # Question words
    "QUESTION": {
        "where": ("WH", "WHERE"), "எங்கே": ("WH", "WHERE"), "कहाँ": ("WH", "WHERE"), "എവിടെ": ("WH", "WHERE"), "ఎక్కడ": ("WH", "WHERE"),
        "when": ("WH", "WHEN"), "எப்போது": ("WH", "WHEN"), "कब": ("WH", "WHEN"), "എപ്പോൾ": ("WH", "WHEN"), "ఎప్పుడు": ("WH", "WHEN"),
        "what": ("WH", "WHAT"), "என்ன": ("WH", "WHAT"), "क्या": ("WH", "WHAT"), "എന്ത്": ("WH", "WHAT"), "ఏమిటి": ("WH", "WHAT"),
        "why": ("WH", "WHY"), "ஏன்": ("WH", "WHY"), "क्यों": ("WH", "WHY"), "എന്തുകൊണ്ട്": ("WH", "WHY"),
        "how": ("WH", "HOW"), "எப்படி": ("WH", "HOW"), "कैसे": ("WH", "HOW"), "എങ്ങനെ": ("WH", "HOW"),
        "who": ("WH", "WHO"), "யார்": ("WH", "WHO"), "कौन": ("WH", "WHO"), "ആര്": ("WH", "WHO"),
    }
}

class ConversationalMemoryManager:
    """
    Maintains rolling context across consecutive conversational turns.
    Resolves anaphoric pronouns ('it', 'they', 'there', 'this') and handles connected discourse.
    """
    def __init__(self, max_history: int = 8):
        self.max_history = max_history
        self.history: List[SemanticFrame] = []
        self.active_entities: Dict[str, str] = {}

    def update(self, frame: SemanticFrame):
        """Add newly parsed frame and update active discourse entities."""
        self.history.append(frame)
        if len(self.history) > self.max_history:
            self.history.pop(0)

        # Update discourse memory
        if frame.subject_tokens:
            self.active_entities["subject"] = frame.subject_tokens[-1]
        if frame.location_tokens:
            self.active_entities["location"] = frame.location_tokens[-1]
        if frame.object_tokens:
            self.active_entities["object"] = frame.object_tokens[-1]
        if frame.time_tokens:
            self.active_entities["time"] = frame.time_tokens[-1]
        if frame.numbers:
            self.active_entities["last_number"] = frame.numbers[-1]

    def resolve_anaphora(self, text: str) -> Tuple[Dict[str, str], List[str]]:
        """
        Detects pronouns or spatial deictic references and maps them to active entities in memory.
        """
        resolved = {}
        injected_tokens = []
        lower = text.lower()

        # Pronoun "it" / "this" / "இதனை" / "यह"
        if any(w in lower.split() for w in ["it", "this", "that", "यह", "वह", "இது", "அது"]):
            if "subject" in self.active_entities:
                resolved["it/this"] = self.active_entities["subject"]
                injected_tokens.append(self.active_entities["subject"])
            elif "object" in self.active_entities:
                resolved["it/this"] = self.active_entities["object"]
                injected_tokens.append(self.active_entities["object"])

        # Spatial "there" / "here" / "அங்கே" / "यहाँ" / "वहाँ"
        if any(w in lower.split() for w in ["there", "here", "அங்கே", "இங்கே", "वहाँ", "यहाँ"]):
            if "location" in self.active_entities:
                resolved["there/here"] = self.active_entities["location"]
                injected_tokens.append(self.active_entities["location"])

        # Group "they" / "them" / "அவர்கள்" / "वे"
        if any(w in lower.split() for w in ["they", "them", "அவர்கள்", "वे", "వారు"]):
            if "subject" in self.active_entities:
                resolved["they"] = self.active_entities["subject"]
                injected_tokens.append(self.active_entities["subject"])

        return resolved, injected_tokens

    def get_summary(self) -> Dict[str, Any]:
        return {
            "turns_stored": len(self.history),
            "active_entities": self.active_entities,
            "recent_transcripts": [f.original_transcript for f in self.history[-3:]],
        }

class MultilingualSemanticEngine:
    """
    Parses arbitrary natural language text or transcript into a normalized SemanticFrame
    utilizing linguistic constituent extraction, question classification, number parsing,
    and conversational context resolution.
    """
    def __init__(self):
        self.memory = ConversationalMemoryManager()

    def parse_utterance(self, text: str, language: str = "en") -> SemanticFrame:
        clean = text.strip()
        lower = clean.lower()

        # 1. Resolve Anaphora from Conversational Memory
        resolved_anaphora, context_injected = self.memory.resolve_anaphora(clean)

        frame = SemanticFrame(
            original_transcript=clean,
            detected_language=language,
            resolved_anaphora=resolved_anaphora
        )

        # 2. Extract Numbers (e.g. "12625", "4", "10", "30")
        raw_numbers = re.findall(r'\b\d+\b', clean)
        frame.numbers = raw_numbers
        for num in raw_numbers:
            frame.entities.append(ExtractedEntity(
                category="NUMBER",
                raw_text=num,
                normalized_value=f"NUM_{num}"
            ))

        # Check for spelled out digits/numbers in Indian languages & English
        number_words = {
            "one": "1", "two": "2", "three": "3", "four": "4", "five": "5",
            "six": "6", "seven": "7", "eight": "8", "nine": "9", "ten": "10",
            "ஒன்று": "1", "இரண்டு": "2", "மூன்று": "3", "நான்கு": "4", "ஐந்து": "5",
            "एक": "1", "दो": "2", "तीन": "3", "चार": "4", "पाँच": "5",
        }
        for word, val in number_words.items():
            if word in lower.split() and val not in frame.numbers:
                frame.numbers.append(val)
                frame.entities.append(ExtractedEntity(
                    category="NUMBER",
                    raw_text=word,
                    normalized_value=f"NUM_{val}"
                ))

        # 3. Detect Question Attributes (Wh-question vs Polar Yes/No question)
        is_q = "?" in clean
        for q_word, (q_type, q_val) in MULTILINGUAL_LEXICON["QUESTION"].items():
            if q_word in lower:
                is_q = True
                frame.is_question = True
                frame.question_type = q_type
                frame.wh_word = q_val
                frame.entities.append(ExtractedEntity(
                    category="QUESTION",
                    raw_text=q_word,
                    normalized_value=q_val
                ))
                break

        if not frame.is_question and is_q:
            # Polar Yes/No Question
            frame.is_question = True
            frame.question_type = "POLAR"
            frame.wh_word = "QUESTION_MARK"

        # 4. Extract Negation
        for neg_key, neg_val in MULTILINGUAL_LEXICON["NEGATION"].items():
            if neg_key in lower:
                if neg_val not in frame.negation_tokens:
                    frame.negation_tokens.append(neg_val)
                    frame.entities.append(ExtractedEntity(
                        category="NEGATION",
                        raw_text=neg_key,
                        normalized_value=neg_val
                    ))

        # 5. Extract Time Markers
        for time_key, time_val in MULTILINGUAL_LEXICON["TIME"].items():
            if time_key in lower:
                if time_val not in frame.time_tokens:
                    frame.time_tokens.append(time_val)
                    frame.entities.append(ExtractedEntity(
                        category="TIME",
                        raw_text=time_key,
                        normalized_value=time_val
                    ))

        # 6. Extract Location Markers
        for loc_key, loc_val in MULTILINGUAL_LEXICON["LOCATION"].items():
            if loc_key in lower:
                if loc_val not in frame.location_tokens:
                    frame.location_tokens.append(loc_val)
                    frame.entities.append(ExtractedEntity(
                        category="LOCATION",
                        raw_text=loc_key,
                        normalized_value=loc_val
                    ))

        # 7. Extract Subjects & Actors
        for sub_key, sub_val in MULTILINGUAL_LEXICON["SUBJECT"].items():
            if sub_key in lower:
                if sub_val not in frame.subject_tokens:
                    frame.subject_tokens.append(sub_val)
                    frame.entities.append(ExtractedEntity(
                        category="SUBJECT",
                        raw_text=sub_key,
                        normalized_value=sub_val
                    ))

        # 8. Extract Objects
        for obj_key, obj_val in MULTILINGUAL_LEXICON["OBJECT"].items():
            if obj_key in lower:
                if obj_val not in frame.object_tokens:
                    frame.object_tokens.append(obj_val)
                    frame.entities.append(ExtractedEntity(
                        category="OBJECT",
                        raw_text=obj_key,
                        normalized_value=obj_val
                    ))

        # 9. Extract Actions & Verbs
        for act_key, act_val in MULTILINGUAL_LEXICON["ACTION"].items():
            if act_key in lower:
                if act_val not in frame.action_tokens:
                    frame.action_tokens.append(act_val)
                    frame.entities.append(ExtractedEntity(
                        category="ACTION",
                        raw_text=act_key,
                        normalized_value=act_val
                    ))

        # 10. Inject Resolved Context Tokens if constituents were missing
        if not frame.subject_tokens:
            for tok in context_injected:
                if tok in MULTILINGUAL_LEXICON["SUBJECT"].values():
                    frame.subject_tokens.append(tok)
        if not frame.location_tokens:
            for tok in context_injected:
                if tok in MULTILINGUAL_LEXICON["LOCATION"].values():
                    frame.location_tokens.append(tok)

        # 11. Determine Urgency & Non-Manual Marker Cues
        is_emergency = any(w in lower for w in [
            "emergency", "danger", "hazard", "leak", "fire", "evacuate", "immediate", "acute",
            "ஆபத்து", "எரிவாயு", "அவசரம்", "खतरा", "गैस", "आपातकाल", "തുടരരുത്"
        ])
        is_warning = any(w in lower for w in [
            "warning", "caution", "careful", "prohibited", "do not enter", "do not touch",
            "எச்சரிக்கை", "கவனம்", "செல்ல வேண்டாம்", "चेतावनी", "सावधान"
        ])
        is_delay = "delay" in lower or "தாமதம்" in lower or "देरी" in lower

        if is_emergency:
            frame.urgency = "emergency"
            frame.intent = "Emergency Evacuation / Acute Hazard Alert"
            frame.facial_expression = "URGENT"
            frame.head_movement = "shake" if frame.negation_tokens else "alert_nod"
        elif is_warning:
            frame.urgency = "urgent"
            frame.intent = "Public Safety Warning & Restriction"
            frame.facial_expression = "WARNING"
            frame.head_movement = "shake" if frame.negation_tokens else "forward"
        elif frame.is_question:
            frame.urgency = "normal"
            frame.intent = f"Information Request ({frame.wh_word or 'Inquiry'})"
            frame.facial_expression = "QUESTION"
            frame.head_movement = "tilt"
        elif is_delay:
            frame.urgency = "medium"
            frame.intent = "Transit Schedule Delay Announcement"
            frame.facial_expression = "NORMAL"
            frame.head_movement = "slight_nod"
        elif any(w in lower for w in ["thank", "நன்றி", "धन्यवाद"]):
            frame.urgency = "normal"
            frame.intent = "Courteous Appreciation & Closing"
            frame.facial_expression = "NORMAL"
            frame.head_movement = "slight_nod"
        else:
            frame.urgency = "normal"
            frame.intent = "General Public Service Announcement"
            frame.facial_expression = "NORMAL"
            frame.head_movement = "slight_nod"

        # Update conversational memory
        self.memory.update(frame)

        return frame

semantic_engine = MultilingualSemanticEngine()
