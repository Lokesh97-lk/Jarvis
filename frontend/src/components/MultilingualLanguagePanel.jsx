import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  Repeat, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Info, 
  Lock,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useXRState } from '../hooks/useXRState';
import { INDIAN_LANGUAGES } from '../utils/constants';

/**
 * Dedicated Multilingual Language Panel
 * - Auto Detect as default
 * - Real-time detected language with confidence
 * - Searchable language selector covering 13 Indian languages + English
 * - Clearly distinguishes "Spoken Language" from "Output Language" (fixed as ISL)
 * - Manual override capability
 */
export default function MultilingualLanguagePanel() {
  const {
    activeScenario,
    selectedLanguage,
    setSelectedLanguage,
    showNormalized,
    setShowNormalized,
    addToast,
    addLog,
  } = useXRState();

  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filteredLanguages = INDIAN_LANGUAGES.filter((l) =>
    l.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.native.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentSelected = INDIAN_LANGUAGES.find((l) => l.code === selectedLanguage) || INDIAN_LANGUAGES[0];

  const handleSelect = (code) => {
    setSelectedLanguage(code);
    setDropdownOpen(false);
    const chosen = INDIAN_LANGUAGES.find((l) => l.code === code);
    addToast(
      'Language Selected',
      `Manual intake set to ${chosen ? chosen.label : code.toUpperCase()}`,
      'info'
    );
    addLog('LANGUAGE_CHANGE', `Manual source language set to ${code}`);
  };

  return (
    <div
      className="gov-card"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-beige)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
        padding: '1.15rem 1.4rem',
        marginBottom: '1rem',
      }}
      aria-label="Dedicated Multilingual Language Architecture Panel"
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--gold-soft)',
              color: 'var(--gold-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Globe size={16} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Multilingual Language Architecture
            </h3>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              Indic-LID FastText Engine • Scheduled Languages of the Union
            </span>
          </div>
        </div>

        {/* Translation Normalization Toggle */}
        <button
          onClick={() => {
            const next = !showNormalized;
            setShowNormalized(next);
            addToast(
              next ? 'Canonical Normalization Active' : 'Verbatim View Active',
              next ? 'Displaying SOV cross-lingual standard.' : 'Displaying raw verbatim transcript.',
              'info'
            );
          }}
          className="gov-btn"
          style={{
            background: showNormalized ? 'var(--crimson-soft)' : 'var(--bg-card-subtle)',
            color: showNormalized ? 'var(--crimson-dark)' : 'var(--text-secondary)',
            border: `1px solid ${showNormalized ? 'var(--crimson-border)' : 'var(--border-beige)'}`,
            padding: '0.3rem 0.75rem',
            fontSize: '0.76rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Repeat size={13} style={{ transform: showNormalized ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }} />
          <span>{showNormalized ? 'Canonical Semantic View' : 'Verbatim Spoken View'}</span>
        </button>
      </div>

      {/* Distinction Columns: Spoken Intake vs Output ISL */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          background: 'var(--bg-card-subtle)',
          border: '1px solid var(--border-beige)',
          borderRadius: 'var(--radius-sm)',
          padding: '1rem',
        }}
      >
        {/* Left Box: Spoken Language (Input Channel) */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              Spoken Input Language / वाणी भाषा
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: 'var(--success-text)',
                background: 'var(--success-bg)',
                padding: '0.1rem 0.45rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              DETECTED: {activeScenario.languageLabel} (99.4%)
            </span>
          </div>

          {/* Searchable Dropdown Anchor */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.55rem 0.85rem',
                background: 'var(--bg-card-elevated)',
                border: '1px solid var(--border-beige)',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {currentSelected.label}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  ({currentSelected.native})
                </span>
              </div>
              <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
            </button>

            {/* Dropdown Menu with Search */}
            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '4px',
                  background: 'var(--bg-card-elevated)',
                  border: '1px solid var(--border-beige)',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 200,
                  padding: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.5rem', borderBottom: '1px solid var(--border-beige)', marginBottom: '0.4rem' }}>
                  <Search size={13} style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Indian language or script..."
                    autoFocus
                    style={{
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      width: '100%',
                      fontSize: '0.78rem',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                  {filteredLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleSelect(lang.code)}
                      style={{
                        width: '100%',
                        padding: '0.4rem 0.65rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: 'none',
                        background: selectedLanguage === lang.code ? 'var(--crimson-soft)' : 'transparent',
                        color: selectedLanguage === lang.code ? 'var(--crimson-dark)' : 'var(--text-primary)',
                        borderRadius: 'var(--radius-xs)',
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                        fontWeight: selectedLanguage === lang.code ? 700 : 500,
                        textAlign: 'left',
                      }}
                    >
                      <span>{lang.label} ({lang.native})</span>
                      {selectedLanguage === lang.code && <CheckCircle2 size={13} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Box: Target Output Language (Fixed as ISL) */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              Target Output Language / निर्गम भाषा
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: 'var(--crimson-dark)',
                background: 'var(--crimson-soft)',
                padding: '0.1rem 0.45rem',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <Lock size={10} /> FIXED STANDARD
            </span>
          </div>

          <div
            style={{
              padding: '0.55rem 0.85rem',
              background: 'var(--bg-card-elevated)',
              border: '1px solid var(--border-beige)',
              borderRadius: 'var(--radius-xs)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={15} style={{ color: 'var(--crimson-primary)' }} />
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>
                  Indian Sign Language (ISL)
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  भारतीय सांकेतिक भाषा • National Standard TLSOV Syntax
                </span>
              </div>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              ISLRTC Compatible
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
