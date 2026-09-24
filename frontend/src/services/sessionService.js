/**
 * Session Management & History Storage Service
 * Persists and retrieves translation sessions, export/import, and audit metrics.
 */

const STORAGE_KEY = 'gsign_xr_saved_sessions';

const INITIAL_SESSIONS = [
  {
    sessionId: 'GSIGN-2026-IND-0842',
    timestamp: '2026-09-24T10:41:00Z',
    dateFormatted: 'Today, 10:41 AM',
    sourceLanguage: 'ta',
    languageLabel: 'Tamil (தமிழ்)',
    durationSeconds: 145,
    durationFormatted: '02:25',
    originalTranscript: 'நாளைய தினம் காலை 10 மணிக்கு அனைத்து மாணவர்களும் கருத்தரங்கு கூடத்திற்கு வரவேண்டும்',
    normalizedMeaning: 'Tomorrow at 10 AM, all students must report to the seminar hall for the orientation program.',
    intent: 'Academic Assembly Announcement',
    status: 'completed',
    signsCount: 6,
    confidence: 98.4,
    hasConflict: false,
    entities: ['Tomorrow', '10:00 AM', 'Students', 'Seminar Hall'],
    signGlosses: ['TOMORROW', 'TIME_10_AM', 'SEMINAR_HALL', 'STUDENTS', 'ATTENTION', 'REPORT_ASSEMBLE']
  },
  {
    sessionId: 'GSIGN-2026-IND-0839',
    timestamp: '2026-09-24T09:15:00Z',
    dateFormatted: 'Today, 09:15 AM',
    sourceLanguage: 'hi',
    languageLabel: 'Hindi (हिन्दी)',
    durationSeconds: 210,
    durationFormatted: '03:30',
    originalTranscript: 'कृपया ध्यान दें, चेन्नई एक्सप्रेस प्लेटफार्म नंबर 2 पर आ रही है, सीधे आगे जाएं',
    normalizedMeaning: 'Attention please, Chennai Express is arriving on Platform 2, proceed straight ahead.',
    intent: 'Railway Transit Wayfinding',
    status: 'completed',
    signsCount: 4,
    confidence: 97.6,
    hasConflict: false,
    entities: ['Chennai Express', 'Platform 2', 'Proceed Ahead'],
    signGlosses: ['ATTENTION', 'RAILWAY_STATION', 'PLATFORM_TWO', 'FOLLOW_PATH']
  },
  {
    sessionId: 'GSIGN-2026-IND-0831',
    timestamp: '2026-09-23T16:30:00Z',
    dateFormatted: 'Yesterday, 04:30 PM',
    sourceLanguage: 'en',
    languageLabel: 'English (US)',
    durationSeconds: 92,
    durationFormatted: '01:32',
    originalTranscript: 'Do not enter this area because there is a severe toxic gas leak.',
    normalizedMeaning: 'Hazard Alert: Chemical gas leak detected. Entry strictly prohibited; evacuate immediately.',
    intent: 'Emergency Evacuation Warning',
    status: 'completed',
    signsCount: 5,
    confidence: 98.9,
    hasConflict: false,
    entities: ['Gas Leak', 'Immediate Evacuation', 'Danger'],
    signGlosses: ['DANGER', 'GAS_LEAK', 'EVACUATE_NOW', 'DO_NOT_ENTER', 'EMERGENCY_ALARM']
  },
  {
    sessionId: 'GSIGN-2026-IND-0824',
    timestamp: '2026-09-23T14:10:00Z',
    dateFormatted: 'Yesterday, 02:10 PM',
    sourceLanguage: 'ta',
    languageLabel: 'Tamil (தமிழ்)',
    durationSeconds: 180,
    durationFormatted: '03:00',
    originalTranscript: 'அவசர சிகிச்சை பிரிவு வலதுபுறம் உள்ளது, அங்கு செல்லவும் (pointing left)',
    normalizedMeaning: 'Emergency Department is situated on the left wing; proceed there immediately.',
    intent: 'Hospital Medical Wayfinding',
    status: 'warning',
    signsCount: 4,
    confidence: 94.2,
    hasConflict: true,
    entities: ['Emergency Ward', 'Spatial Grounding Left'],
    signGlosses: ['HOSPITAL', 'EMERGENCY_DEPT', 'POINT_LEFT', 'GO_NOW']
  },
  {
    sessionId: 'GSIGN-2026-IND-0810',
    timestamp: '2026-09-22T11:05:00Z',
    dateFormatted: 'Sep 22, 11:05 AM',
    sourceLanguage: 'ml',
    languageLabel: 'Malayalam (മലയാളം)',
    durationSeconds: 165,
    durationFormatted: '02:45',
    originalTranscript: 'ഡോക്ടറെ കാണാൻ ഒമ്പതാം നമ്പർ മുറിയിലേക്ക് പോകൂ, കുറിപ്പടി അവിടെ നൽകുക',
    normalizedMeaning: 'Please proceed to Consultation Room 9 to see the physician and present your medical prescription.',
    intent: 'Hospital Outpatient Instruction',
    status: 'completed',
    signsCount: 5,
    confidence: 98.1,
    hasConflict: false,
    entities: ['Consultation Room 9', 'Physician', 'Prescription'],
    signGlosses: ['DOCTOR_SEE', 'ROOM_NUMBER_NINE', 'GO_ENTER', 'PRESCRIPTION', 'GIVE']
  }
];

export class SessionService {
  constructor() {
    this.sessions = this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fallback
    }
    return INITIAL_SESSIONS;
  }

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.sessions));
    } catch (err) {
      console.warn('[SessionService] Storage write failed:', err);
    }
  }

  getAll() {
    return [...this.sessions];
  }

  getById(id) {
    return this.sessions.find((s) => s.sessionId === id);
  }

  addSession(sessionData) {
    const newSession = {
      sessionId: sessionData.sessionId || `GSIGN-2026-IND-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      dateFormatted: 'Just now',
      durationSeconds: sessionData.durationSeconds || 60,
      durationFormatted: sessionData.durationFormatted || '01:00',
      sourceLanguage: sessionData.sourceLanguage || 'ta',
      languageLabel: sessionData.languageLabel || 'Tamil (தமிழ்)',
      originalTranscript: sessionData.originalTranscript || '',
      normalizedMeaning: sessionData.normalizedMeaning || '',
      intent: sessionData.intent || 'Dissemination',
      status: sessionData.status || 'completed',
      signsCount: sessionData.signsCount || (sessionData.signGlosses ? sessionData.signGlosses.length : 0),
      confidence: sessionData.confidence || 98.0,
      hasConflict: Boolean(sessionData.hasConflict),
      entities: sessionData.entities || [],
      signGlosses: sessionData.signGlosses || [],
    };
    this.sessions = [newSession, ...this.sessions];
    this.saveToStorage();
    return newSession;
  }

  deleteSession(id) {
    this.sessions = this.sessions.filter((s) => s.sessionId !== id);
    this.saveToStorage();
    return true;
  }

  clearAll() {
    this.sessions = [];
    this.saveToStorage();
  }

  search(query, lang = 'all') {
    const q = (query || '').toLowerCase().trim();
    return this.sessions.filter((s) => {
      const matchLang = lang === 'all' || s.sourceLanguage === lang;
      if (!matchLang) return false;
      if (!q) return true;
      return (
        s.sessionId.toLowerCase().includes(q) ||
        s.originalTranscript.toLowerCase().includes(q) ||
        s.normalizedMeaning.toLowerCase().includes(q) ||
        s.intent.toLowerCase().includes(q) ||
        s.languageLabel.toLowerCase().includes(q)
      );
    });
  }
}

export const sessionService = new SessionService();
