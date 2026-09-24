import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Play, 
  Eye, 
  Clock, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  FileText,
  X,
  Calendar,
  Layers
} from 'lucide-react';
import { useXRState } from '../hooks/useXRState';
import { INDIAN_LANGUAGES } from '../utils/constants';

/**
 * Session History Page
 * Displays saved sessions in structured cards or table rows with search, language filters,
 * date filters, export, replay, delete, and deep-dive Session View modal.
 */
export default function SessionsPage() {
  const {
    savedSessions,
    deleteHistorySession,
    selectedSessionDetail,
    setSelectedSessionDetail,
    loadDemo,
    setActiveTab,
    addToast,
    saveCurrentSession,
    sessionId,
  } = useXRState();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLangFilter, setSelectedLangFilter] = useState('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  const filteredSessions = savedSessions.filter((s) => {
    const matchLang = selectedLangFilter === 'all' || s.sourceLanguage === selectedLangFilter;
    if (!matchLang) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchQuery =
        s.sessionId.toLowerCase().includes(q) ||
        (s.originalTranscript && s.originalTranscript.toLowerCase().includes(q)) ||
        (s.normalizedMeaning && s.normalizedMeaning.toLowerCase().includes(q)) ||
        (s.intent && s.intent.toLowerCase().includes(q));
      if (!matchQuery) return false;
    }

    return true;
  });

  const handleExportSession = (session) => {
    const content = `G-SIGN XR SESSION AUDIT EXPORT
Session ID: ${session.sessionId}
Timestamp: ${session.timestamp} (${session.dateFormatted})
Language: ${session.languageLabel}
Duration: ${session.durationFormatted}
Status: ${session.status}
Overall Confidence: ${session.confidence}%

ORIGINAL TRANSCRIPT:
${session.originalTranscript}

NORMALIZED MEANING:
${session.normalizedMeaning}

INTENT: ${session.intent}
ENTITIES: ${(session.entities || []).join(', ')}

ISL SIGN SEQUENCE:
${(session.signGlosses || []).map((g, i) => `${i + 1}. [${g}]`).join('\n')}
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.sessionId}-audit.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Session Exported', `Downloaded audit record for ${session.sessionId}.`, 'success');
  };

  const handleReplaySession = (session) => {
    addToast('Replaying Session', `Loading ${session.sessionId} into Live Workspace...`, 'info');
    setActiveTab('dashboard');
  };

  return (
    <div className="gov-container" style={{ paddingBottom: '3rem' }}>
      {/* Page Title & Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.85rem',
          marginBottom: '1.25rem',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Session Audit & History
          </h2>
          <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Verifiable logs of live multilingual spoken announcements, semantic interpretations, and ISL token sequences.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            onClick={saveCurrentSession}
            className="gov-btn"
            style={{
              background: 'var(--crimson-primary)',
              color: '#ffffff',
              border: 'none',
              padding: '0.45rem 0.95rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: 'var(--shadow-crimson)',
            }}
          >
            <Download size={14} /> Archive Current Active Session
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="gov-card"
        style={{
          padding: '0.85rem 1.15rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.85rem',
        }}
      >
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
          <Search size={15} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by session ID, transcript, intent, or keywords..."
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '0.85rem',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Language Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Filter size={13} style={{ color: 'var(--text-muted)' }} />
            <select
              value={selectedLangFilter}
              onChange={(e) => setSelectedLangFilter(e.target.value)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-beige)',
                borderRadius: 'var(--radius-xs)',
                padding: '0.3rem 0.6rem',
                fontSize: '0.78rem',
                color: 'var(--text-primary)',
                fontWeight: 600,
              }}
            >
              <option value="all">All Languages</option>
              {INDIAN_LANGUAGES.filter((l) => l.code !== 'auto').map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <select
            value={selectedDateFilter}
            onChange={(e) => setSelectedDateFilter(e.target.value)}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-beige)',
              borderRadius: 'var(--radius-xs)',
              padding: '0.3rem 0.6rem',
              fontSize: '0.78rem',
              color: 'var(--text-primary)',
              fontWeight: 600,
            }}
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="past_week">Past 7 Days</option>
          </select>

          {/* View Toggle */}
          <div style={{ display: 'flex', border: '1px solid var(--border-beige)', borderRadius: 'var(--radius-xs)', overflow: 'hidden' }}>
            <button
              onClick={() => setViewMode('cards')}
              style={{
                border: 'none',
                padding: '0.3rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                background: viewMode === 'cards' ? 'var(--crimson-soft)' : 'var(--bg-card)',
                color: viewMode === 'cards' ? 'var(--crimson-dark)' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                border: 'none',
                padding: '0.3rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                background: viewMode === 'table' ? 'var(--crimson-soft)' : 'var(--bg-card)',
                color: viewMode === 'table' ? 'var(--crimson-dark)' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ marginBottom: '0.85rem', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
        Showing <strong>{filteredSessions.length}</strong> archived session record(s)
      </div>

      {/* Cards View */}
      {viewMode === 'cards' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {filteredSessions.map((session) => (
            <div
              key={session.sessionId}
              className="gov-card"
              style={{
                padding: '1.15rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
              }}
            >
              <div>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--crimson-primary)' }}>
                    {session.sessionId}
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      padding: '0.15rem 0.45rem',
                      borderRadius: 'var(--radius-full)',
                      background: session.hasConflict ? 'var(--warning-bg)' : 'var(--success-bg)',
                      color: session.hasConflict ? 'var(--warning-text)' : 'var(--success-text)',
                      border: `1px solid ${session.hasConflict ? 'var(--warning-border)' : 'var(--success-border)'}`,
                    }}
                  >
                    {session.hasConflict ? 'CONFLICT RESOLVED' : 'VERIFIED'}
                  </span>
                </div>

                {/* Metadata Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={12} /> {session.dateFormatted}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} /> {session.durationFormatted}
                  </span>
                  <span>•</span>
                  <span style={{ color: 'var(--gold-accent)', fontWeight: 700 }}>
                    {session.languageLabel}
                  </span>
                </div>

                {/* Transcript Snippet */}
                <p
                  style={{
                    margin: '0 0 0.65rem 0',
                    fontSize: '0.84rem',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  “{session.originalTranscript}”
                </p>

                {/* Intent Tag */}
                <div style={{ marginBottom: '0.85rem' }}>
                  <span style={{ fontSize: '0.72rem', background: 'var(--bg-card-subtle)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-beige)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Intent: {session.intent}
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-beige)',
                  gap: '0.4rem',
                }}
              >
                <button
                  onClick={() => setSelectedSessionDetail(session)}
                  className="gov-btn"
                  style={{
                    fontSize: '0.74rem',
                    padding: '0.3rem 0.65rem',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-beige)',
                    borderRadius: 'var(--radius-xs)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <Eye size={12} /> Inspect
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <button
                    onClick={() => handleExportSession(session)}
                    title="Export session"
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border-beige)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '0.3rem 0.5rem',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    <Download size={13} />
                  </button>

                  <button
                    onClick={() => handleReplaySession(session)}
                    title="Replay in workspace"
                    style={{
                      background: 'var(--crimson-soft)',
                      border: '1px solid var(--crimson-border)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '0.3rem 0.5rem',
                      color: 'var(--crimson-dark)',
                      cursor: 'pointer',
                    }}
                  >
                    <Play size={13} />
                  </button>

                  <button
                    onClick={() => deleteHistorySession(session.sessionId)}
                    title="Delete record"
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border-beige)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '0.3rem 0.5rem',
                      color: 'var(--error-text)',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="gov-card" style={{ overflowX: 'auto', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-card-subtle)', borderBottom: '1px solid var(--border-beige)' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Session ID</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Date/Time</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Language</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Duration</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Transcript Preview</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Signs</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Confidence</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session) => (
                <tr key={session.sessionId} style={{ borderBottom: '1px solid var(--border-beige-subtle)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--crimson-primary)' }}>
                    {session.sessionId}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>
                    {session.dateFormatted}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>
                    {session.languageLabel}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)' }}>
                    {session.durationFormatted}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {session.originalTranscript}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>
                    {session.signsCount} signs
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--success-text)', fontWeight: 700 }}>
                    {session.confidence}%
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.3rem' }}>
                      <button
                        onClick={() => setSelectedSessionDetail(session)}
                        title="View details"
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)' }}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleExportSession(session)}
                        title="Export"
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)' }}
                      >
                        <Download size={14} />
                      </button>
                      <button
                        onClick={() => deleteHistorySession(session.sessionId)}
                        title="Delete"
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--error-text)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detailed Session Inspection Modal */}
      {selectedSessionDetail && (
        <div
          className="gov-modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(28, 25, 23, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedSessionDetail(null);
          }}
        >
          <div
            className="gov-modal-container"
            style={{
              background: 'var(--bg-card-elevated)',
              border: '1px solid var(--border-beige)',
              borderRadius: 'var(--radius-card)',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '88vh',
              overflowY: 'auto',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-beige)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Session Audit: {selectedSessionDetail.sessionId}
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Recorded on {selectedSessionDetail.dateFormatted} • {selectedSessionDetail.durationFormatted} duration
                </span>
              </div>
              <button
                onClick={() => setSelectedSessionDetail(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Spoken Utterance */}
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--crimson-primary)', textTransform: 'uppercase' }}>
                  Original Spoken Utterance ({selectedSessionDetail.languageLabel})
                </span>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', background: 'var(--bg-card-subtle)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-beige)' }}>
                  “{selectedSessionDetail.originalTranscript}”
                </p>
              </div>

              {/* JARVIS Normalized Meaning */}
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--gold-accent)', textTransform: 'uppercase' }}>
                  JARVIS Normalized Canonical Meaning
                </span>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-primary)', background: 'var(--bg-card-subtle)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-beige)' }}>
                  {selectedSessionDetail.normalizedMeaning}
                </p>
              </div>

              {/* Extracted Entities Matrix */}
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Extracted Context Entities
                </span>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                  {(selectedSessionDetail.entities || []).map((ent, idx) => (
                    <span key={idx} style={{ background: 'var(--bg-card-subtle)', border: '1px solid var(--border-beige)', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600 }}>
                      {ent}
                    </span>
                  ))}
                </div>
              </div>

              {/* ISL Sequence Flow */}
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Generated ISL Sign Tokens ({selectedSessionDetail.signsCount} glosses)
                </span>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                  {(selectedSessionDetail.signGlosses || []).map((g, idx) => (
                    <span key={idx} style={{ background: 'var(--crimson-soft)', color: 'var(--crimson-dark)', border: '1px solid var(--crimson-border)', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-xs)', fontSize: '0.76rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      #{idx + 1} {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-beige)' }}>
              <button
                onClick={() => handleExportSession(selectedSessionDetail)}
                className="gov-btn"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-beige)', padding: '0.4rem 0.85rem', fontSize: '0.8rem', fontWeight: 600, borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
              >
                <Download size={13} /> Export Record
              </button>
              <button
                onClick={() => {
                  handleReplaySession(selectedSessionDetail);
                  setSelectedSessionDetail(null);
                }}
                className="gov-btn"
                style={{ background: 'var(--crimson-primary)', color: '#ffffff', border: 'none', padding: '0.4rem 0.95rem', fontSize: '0.8rem', fontWeight: 700, borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
              >
                <Play size={13} /> Replay in Live Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
