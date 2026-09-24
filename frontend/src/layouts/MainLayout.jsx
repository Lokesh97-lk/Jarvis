import React from 'react';
import Header from '../components/Header';
import SystemStatusStrip from '../components/SystemStatusStrip';
import StatusBar from '../components/StatusBar';
import MobileControlDock from '../components/MobileControlDock';
import PresentationView from '../components/PresentationView';
import SettingsModal from '../components/SettingsModal';
import EventLogDrawer from '../components/EventLogDrawer';
import HelpModal from '../components/HelpModal';
import JsonViewerModal from '../components/JsonViewerModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';

import Home from '../pages/Home';
import LiveTranslationPage from '../pages/LiveTranslationPage';
import SessionsPage from '../pages/SessionsPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import SettingsPage from '../pages/SettingsPage';
import HelpPage from '../pages/HelpPage';
import DebugPage from '../pages/DebugPage';

import { useXRState } from '../hooks/useXRState';

export default function MainLayout() {
  const { activeTab } = useXRState();

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'live_translation':
        return <LiveTranslationPage />;
      case 'sessions':
        return <SessionsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'help':
        return <HelpPage />;
      case 'debug':
        return <DebugPage />;
      case 'dashboard':
      default:
        return <Home />;
    }
  };

  return (
    <div className="gov-dashboard-root">
      {/* Top Accessible Navbar */}
      <Header />

      {/* System Status Strip (immediately below navigation) */}
      <SystemStatusStrip />

      {/* Main Content Pane */}
      <main id="main-content" style={{ flex: 1, paddingBottom: '3.5rem' }}>
        {renderActiveScreen()}
      </main>

      {/* Sticky Bottom System Status Bar */}
      <StatusBar />

      {/* Mobile & Tablet Quick Action Dock */}
      <MobileControlDock />

      {/* Fullscreen Presentation Mode for Evaluators */}
      <PresentationView />

      {/* Overlays, Drawers & Accessible Modals */}
      <SettingsModal />
      <EventLogDrawer />
      <HelpModal />
      <JsonViewerModal />
      <ConfirmDialog />
      <Toast />
    </div>
  );
}
