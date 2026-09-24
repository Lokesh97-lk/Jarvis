import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Download, 
  ListOrdered, 
  Clock, 
  Tag, 
  Filter 
} from 'lucide-react';
import { useXRState } from '../hooks/useXRState';

export default function EventLogDrawer() {
  const {
    isEventLogOpen,
    setIsEventLogOpen,
    eventLogs,
    clearLogs,
    exportLogs,
  } = useXRState();

  const [filterType, setFilterType] = useState('ALL');

  if (!isEventLogOpen) return null;

  const eventTypes = ['ALL', 'TRANSCRIPT_FINAL', 'GESTURE_DETECTED', 'JARVIS_RESULT', 'SIGN_SEQUENCE', 'CONFLICT_DETECTED', 'AVATAR_ACTION'];

  const filteredLogs = filterType === 'ALL'
    ? eventLogs
    : eventLogs.filter((l) => l.type === filterType || (l.type && l.type.includes(filterType)));

  const getEventBadgeClass = (type) => {
    if (type.includes('CONFLICT') || type.includes('ERROR')) return 'warning';
    if (type.includes('JARVIS') || type.includes('SIGN')) return 'complete';
    if (type.includes('MIC') || type.includes('SYSTEM')) return 'ready';
    return 'ready';
  };

  return (
    <div className="gov-modal-backdrop" onClick={() => setIsEventLogOpen(false)}>
      <aside 
        className="event-log-drawer" 
        onClick={(e) => e.stopPropagation()}
        role="complementary"
        aria-label="Event Processing Log Drawer"
      >
        {/* Header */}
        <div className="gov-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="gov-card-icon">
              <ListOrdered size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Event Processing Logs</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Audit trail of real-time speech, gesture, and sign actions
              </p>
            </div>
          </div>

          <button
            className="btn-icon"
            onClick={() => setIsEventLogOpen(false)}
            aria-label="Close logs"
          >
            <X size={16} />
          </button>
        </div>

        {/* Filter Bar */}
        <div style={{
          padding: '0.65rem 1rem',
          background: 'var(--bg-card-subtle)',
          borderBottom: '1px solid var(--border-beige)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
        }}>
          <Filter size={13} style={{ color: 'var(--gold-accent)' }} />
          <span style={{ fontSize: '0.74rem', fontWeight: 700 }}>Filter:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '0.2rem 0.5rem',
              fontSize: '0.74rem',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-beige)',
              background: 'var(--bg-card)',
            }}
          >
            {eventTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Total: <strong>{filteredLogs.length}</strong>
          </span>
        </div>

        {/* Logs List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-beige)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className={`node-status-pill ${getEventBadgeClass(log.type)}`}>
                    {log.type}
                  </span>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={11} /> {log.timestamp}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                  {log.details}
                </p>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              No log entries match the selected filter.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="gov-modal-footer">
          <button
            className="btn btn-secondary"
            onClick={clearLogs}
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
          >
            <Trash2 size={13} /> Clear Logs
          </button>
          <button
            className="btn btn-primary"
            onClick={exportLogs}
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
          >
            <Download size={13} /> Export Logs
          </button>
        </div>
      </aside>
    </div>
  );
}
