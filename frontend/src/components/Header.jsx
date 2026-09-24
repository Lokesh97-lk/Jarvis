import React, { useState } from 'react';
import { 
  Sparkles, 
  Settings, 
  Maximize2, 
  HelpCircle, 
  ListOrdered, 
  Radio, 
  Globe, 
  ShieldCheck, 
  UserCheck,
  Bell,
  Wifi,
  ChevronDown,
  LayoutDashboard,
  Tv,
  History,
  BarChart3,
  Terminal,
  User,
  LogOut,
  ExternalLink,
  Presentation
} from 'lucide-react';
import { useXRState, SESSION_STATES } from '../hooks/useXRState';

export default function Header() {
  const {
    activeTab,
    setActiveTab,
    sessionState,
    sessionId,
    formattedSessionTime,
    activeScenario,
    toggleFullscreen,
    togglePresentationMode,
    setIsSettingsOpen,
    setIsEventLogOpen,
    setIsHelpOpen,
    toasts,
    eventLogs,
  } = useXRState();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notificationsRef = React.useRef(null);
  const profileRef = React.useRef(null);

  // Close dropdown menus when clicking outside
  React.useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live_translation', label: 'Live Translation', icon: Tv },
    { id: 'sessions', label: 'Sessions', icon: History },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help', icon: HelpCircle },
    { id: 'debug', label: 'Debug', icon: Terminal },
  ];

  const getStatusDotClass = () => {
    switch (sessionState) {
      case SESSION_STATES.ACTIVE: return 'active';
      case SESSION_STATES.PAUSED: return 'paused';
      case SESSION_STATES.STARTING: return 'paused';
      case SESSION_STATES.STOPPING:
      case SESSION_STATES.ENDED:
      case SESSION_STATES.IDLE:
      default: return '';
    }
  };

  const getStatusText = () => {
    switch (sessionState) {
      case SESSION_STATES.ACTIVE: return 'LIVE SESSION ACTIVE';
      case SESSION_STATES.PAUSED: return 'SESSION PAUSED';
      case SESSION_STATES.STARTING: return 'INITIALIZING HARDWARE';
      case SESSION_STATES.STOPPING: return 'STOPPING SESSION';
      case SESSION_STATES.ENDED: return 'SESSION CONCLUDED';
      case SESSION_STATES.IDLE:
      default: return 'SYSTEM STANDBY';
    }
  };

  return (
    <>
      {/* Top Accessible Tricolor National Ribbon */}
      <div className="gov-tricolor-bar" />

      <header className="gov-navbar" role="banner">
        <div className="gov-navbar-inner">
          {/* Brand & Compact Description */}
          <div className="gov-brand" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
            <div className="gov-emblem-badge" title="National Multimodal Accessibility Platform">
              <Sparkles size={22} />
              <div className="gov-emblem-star" />
            </div>
            <div className="gov-title-group">
              <h1 className="gov-title">
                G-SIGN XR
                <span className="gov-portal-pill">Gov-Access Portal</span>
              </h1>
              <span className="gov-subtitle">
                Real-Time Multilingual Speech to Indian Sign Language
              </span>
            </div>
          </div>

          {/* Navigation Links / Tabs */}
          <nav className="gov-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }} aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: isActive ? 'var(--crimson-primary)' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: isActive ? 700 : 600,
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-main)',
                    cursor: 'pointer',
                    boxShadow: isActive ? 'var(--shadow-crimson)' : 'none',
                    transition: 'all var(--transition-fast)',
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={14} style={{ opacity: isActive ? 1 : 0.75 }} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Global Indicators & Quick Actions */}
          <div className="gov-nav-status-cluster">
            {/* Global Connection Indicator */}
            <div className="gov-status-pill" title="Telemetry WebSocket Stream">
              <Wifi size={13} style={{ color: '#16a34a' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#166534' }}>
                ONLINE (3ms)
              </span>
            </div>

            <div className="gov-divider-v" />

            {/* Source Language Indicator */}
            <div className="gov-status-pill" title="Currently Detected Spoken Language">
              <Globe size={13} style={{ color: 'var(--gold-accent)' }} />
              <span style={{ fontWeight: 700, color: 'var(--crimson-dark)', fontSize: '0.74rem' }}>
                {activeScenario.languageLabel}
              </span>
            </div>

            <div className="gov-divider-v" />

            {/* Session Timer */}
            <div className="gov-status-pill" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem' }}>
              ⏱ <strong>{formattedSessionTime()}</strong>
            </div>

            {/* Presentation Mode Button */}
            <button
              onClick={togglePresentationMode}
              className="gov-btn"
              title="Enter Fullscreen Presentation Mode for Evaluators/Judges"
              style={{
                background: 'var(--gold-light)',
                color: '#92400e',
                border: '1px solid var(--gold-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.35rem 0.65rem',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <Presentation size={13} />
              <span>Presentation</span>
            </button>

            {/* Notification Bell with Badge */}
            <div ref={notificationsRef} style={{ position: 'relative' }}>
              <button
                className="btn-icon"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                title="Notifications"
                aria-label="View notifications"
                style={{ position: 'relative' }}
              >
                <Bell size={15} />
                {toasts.length > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--crimson-primary)',
                      border: '1.5px solid var(--bg-card)',
                    }}
                  />
                )}
              </button>

              {/* Notifications Dropdown Popover */}
              {notificationsOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    width: '300px',
                    background: 'var(--bg-card-elevated)',
                    border: '1px solid var(--border-beige)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '0.85rem',
                    zIndex: 200,
                    animation: 'fadeIn 0.2s ease-out',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-beige)', paddingBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      Live Notifications ({toasts.length})
                    </span>
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.72rem', color: 'var(--text-muted)' }}
                    >
                      Close
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '220px', overflowY: 'auto' }}>
                    {toasts.length > 0 ? (
                      toasts.map((t) => (
                        <div key={t.id} style={{ background: 'var(--bg-card-subtle)', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-beige)' }}>
                          <strong style={{ fontSize: '0.76rem', color: 'var(--crimson-dark)', display: 'block' }}>{t.title}</strong>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{t.message}</span>
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.5rem 0', textAlign: 'center' }}>
                        No active notifications
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile / Session Menu */}
            <div ref={profileRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-beige)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.2rem 0.6rem 0.2rem 0.35rem',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: 'var(--crimson-soft)',
                    color: 'var(--crimson-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <User size={12} />
                </div>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Operator
                </span>
                <ChevronDown size={12} style={{ color: 'var(--text-muted)' }} />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '115%',
                    right: 0,
                    width: '220px',
                    background: 'var(--bg-card-elevated)',
                    border: '1px solid var(--border-beige)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '0.75rem',
                    zIndex: 200,
                  }}
                >
                  <div style={{ marginBottom: '0.5rem', borderBottom: '1px solid var(--border-beige)', paddingBottom: '0.4rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-primary)' }}>Gov-Access Operator</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{sessionId}</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setProfileOpen(false);
                      }}
                      style={{ border: 'none', background: 'transparent', padding: '0.35rem', textAlign: 'left', fontSize: '0.76rem', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: 'var(--radius-xs)' }}
                    >
                      Preferences
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('debug');
                        setProfileOpen(false);
                      }}
                      style={{ border: 'none', background: 'transparent', padding: '0.35rem', textAlign: 'left', fontSize: '0.76rem', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: 'var(--radius-xs)' }}
                    >
                      Engineering Console
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('help');
                        setProfileOpen(false);
                      }}
                      style={{ border: 'none', background: 'transparent', padding: '0.35rem', textAlign: 'left', fontSize: '0.76rem', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: 'var(--radius-xs)' }}
                    >
                      Manual & Shortcuts
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Icons */}
            <button
              className="btn-icon"
              onClick={() => setIsEventLogOpen(true)}
              title="Open Processing Audit Logs"
              aria-label="View event logs"
            >
              <ListOrdered size={15} />
            </button>

            <button
              className="btn-icon"
              onClick={toggleFullscreen}
              title="Toggle Fullscreen"
              aria-label="Toggle fullscreen"
            >
              <Maximize2 size={15} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
