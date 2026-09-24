import React from 'react';
import { XRProvider } from './hooks/useXRState';
import MainLayout from './layouts/MainLayout';

import './styles/global.css';
import './styles/dashboard.css';

export default function App() {
  return (
    <XRProvider>
      <MainLayout />
    </XRProvider>
  );
}
