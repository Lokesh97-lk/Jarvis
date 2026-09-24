import React from 'react';
import { 
  Globe, 
  Repeat, 
  CheckCircle2, 
  Sparkles, 
  Languages, 
  ArrowRightLeft,
  Volume2
} from 'lucide-react';
import { useXRState } from '../hooks/useXRState';
import { INDIAN_LANGUAGES } from '../utils/constants';
import { Badge, Button } from './common';

/**
 * Indian Language Control Area
 * - Select Auto Detect or 13 official Indian languages
 * - Shows currently detected language with native script
 * - Normalization / Translation toggle without mutating original transcript
 * - Language confidence rating and linguistic family indicators
 */
export default function LanguagePanel({ compact = false }) {
  const {
    activeScenario,
    selectedLanguage,
    setSelectedLanguage,
    showNormalized,
    setShowNormalized,
    addToast,
    addLog,
  } = useXRState();

  const currentLangObj = INDIAN_LANGUAGES.find((l) => l.code === selectedLanguage) || INDIAN_LANGUAGES[0];
  const detectedLangObj = INDIAN_LANGUAGES.find((l) => l.code === (activeScenario?.sourceLanguage || 'ta')) || INDIAN_LANGUAGES[1];

  const handleLanguageChange = (code) => {
    setSelectedLanguage(code);
    const chosen = INDIAN_LANGUAGES.find((l) => l.code === code);
    addToast(
      'Language Selected',
      `Active intake language set to ${chosen ? chosen.label : code.toUpperCase()}`,
      'info'
    );
    addLog('LANGUAGE_CHANGE', `Intake language switched to ${code}`);
  };

  const handleToggleNormalization = () => {
    const nextVal = !showNormalized;
    setShowNormalized(nextVal);
    addToast(
      nextVal ? 'Semantic Normalization Active' : 'Verbatim Speech Active',
      nextVal 
        ? 'Displaying cross-lingual Canonical Semantic Form (SOV grammar).' 
        : 'Displaying original spoken verbatim transcript.',
      'info'
    );
    addLog('TRANSLATION_TOGGLE', `Semantic normalization toggled: ${nextVal ? 'ON' : 'OFF'}`);
  };

  return (
    <div
      className={`gov-language-panel ${compact ? 'compact' : ''}`}
      style={{
        background: 'var(--bg-card-subtle)',
        border: '1px solid var(--border-beige)',
        borderRadius: 'var(--radius-sm)',
        padding: compact ? '0.65rem 0.85rem' : '0.9rem 1.15rem',
        marginBottom: '0.85rem',
      }}
      aria-label="Indian Language Control Area"
    >
      {/* Top Row: Language Selector & Detection Indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        {/* Left: Target Intake Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-xs)',
              background: 'var(--gold-soft)',
              color: 'var(--gold-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Languages size={15} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.73rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Intake Language / भाषा
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.15rem' }}>
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-beige)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                }}
                aria-label="Select source language"
              >
                {INDIAN_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label} ({lang.native})
                  </option>
                ))}
              </select>

              {/* Detected Language Pill */}
              <Badge variant="gold" size="sm" dot>
                DETECTED: {detectedLangObj.label.toUpperCase()} ({detectedLangObj.native}) • 99.4% LID
              </Badge>
            </div>
          </div>
        </div>

        {/* Right: Translation / Normalization Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            onClick={handleToggleNormalization}
            className={`gov-btn ${showNormalized ? 'active' : ''}`}
            title="Toggle between Original Spoken Transcript and Semantic Normalized Canonical Meaning"
            aria-pressed={showNormalized}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.75rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              background: showNormalized ? 'var(--crimson-soft)' : 'var(--bg-card)',
              color: showNormalized ? 'var(--crimson-dark)' : 'var(--text-secondary)',
              border: `1px solid ${showNormalized ? 'var(--crimson-border)' : 'var(--border-beige)'}`,
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            <Repeat size={13} style={{ transform: showNormalized ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }} />
            <span>{showNormalized ? 'Canonical Semantic View' : 'Verbatim Spoken View'}</span>
          </button>
        </div>
      </div>

      {/* Language Quick Switcher Chips */}
      {!compact && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            marginTop: '0.75rem',
            paddingTop: '0.6rem',
            borderTop: '1px solid var(--border-beige-subtle)',
            overflowX: 'auto',
            paddingBottom: '0.2rem',
          }}
        >
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: '0.2rem', flexShrink: 0 }}>
            Quick Switch:
          </span>
          {INDIAN_LANGUAGES.slice(0, 7).map((lang) => {
            const isSelected = selectedLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                style={{
                  border: `1px solid ${isSelected ? 'var(--crimson-primary)' : 'var(--border-beige)'}`,
                  background: isSelected ? 'var(--crimson-primary)' : 'var(--bg-card)',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.15rem 0.55rem',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flexShrink: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <span>{lang.native}</span>
                <span style={{ opacity: isSelected ? 0.9 : 0.65, fontSize: '0.68rem' }}>{lang.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
