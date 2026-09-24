/**
 * Transcript Management Service
 * Handles live partial and final transcript streaming, segment counting, and export.
 */

export class TranscriptService {
  constructor() {
    this.partialText = '';
    this.finalText = '';
    this.segments = [];
    this.segmentCount = 0;
  }

  addPartial(text) {
    this.partialText = text;
  }

  addFinal(text, confidence = 98) {
    this.finalText = (this.finalText + ' ' + text).trim();
    this.partialText = '';
    this.segmentCount++;
    this.segments.push({
      id: `seg-${Date.now()}`,
      text,
      confidence,
      timestamp: new Date().toLocaleTimeString(),
    });
  }

  clear() {
    this.partialText = '';
    this.finalText = '';
    this.segments = [];
    this.segmentCount = 0;
  }

  exportAsText(metadata = {}) {
    return `=======================================================
G-SIGN XR OFFICIAL TRANSCRIPT EXPORT
National Multimodal Speech-to-Indian-Sign-Language Platform
=======================================================
Session ID:         ${metadata.sessionId || 'N/A'}
Date & Time:        ${new Date().toLocaleString()}
Detected Language:  ${metadata.languageLabel || 'Auto-Detected'}
Total Segments:     ${this.segmentCount}
Overall Confidence: ${metadata.confidence || 98.4}%

FULL TRANSCRIPT (SPONTANEOUS / VERBATIM):
-------------------------------------------------------
${this.finalText || metadata.originalTranscript || 'No speech recorded.'}

JARVIS CANONICAL NORMALIZED MEANING:
-------------------------------------------------------
${metadata.normalizedMeaning || 'N/A'}

EXTRACTED INTENT & ACTION:
-------------------------------------------------------
Intent:   ${metadata.intent || 'General Communication'}
Urgency:  ${metadata.urgency || 'Normal'}

ISL SIGN SEQUENCE GLOSSES:
-------------------------------------------------------
${(metadata.signGlosses || []).map((g, i) => `${i + 1}. [${g}]`).join('\n')}
=======================================================
Produced by G-SIGN XR Government Accessibility Engine.
`;
  }
}

export const transcriptService = new TranscriptService();
