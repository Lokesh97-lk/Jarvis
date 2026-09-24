import { useState, useEffect } from 'react';
import { XRWebSocketClient } from '../services/websocket';

export function useWebSocket({ onTelemetryMessage } = {}) {
  const [status, setStatus] = useState('shell_mode');

  useEffect(() => {
    const client = new XRWebSocketClient({
      onMessage: (msg) => {
        if (onTelemetryMessage) onTelemetryMessage(msg);
      },
      onStatusChange: (s) => {
        setStatus(s.status);
      },
    });

    client.connect();

    return () => {
      client.disconnect();
    };
  }, [onTelemetryMessage]);

  return { status };
}
