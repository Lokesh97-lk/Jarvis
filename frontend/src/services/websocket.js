/**
 * WebSocket Telemetry Service for G-SIGN XR
 * Dispatches real-time multimodal events (speech, pose landmarks, jarvis reasoning, avatar frames).
 */

const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/telemetry';

export class XRWebSocketClient {
  constructor(options = {}) {
    this.url = options.url || WS_BASE_URL;
    this.onMessage = options.onMessage || (() => {});
    this.onStatusChange = options.onStatusChange || (() => {});
    this.socket = null;
    this.isConnected = false;
    this.reconnectTimer = null;
  }

  connect() {
    try {
      console.log(`[XR WebSocket] Connecting to ${this.url} (Shell fallback enabled)...`);
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log('[XR WebSocket] Connected to backend telemetry stream');
        this.isConnected = true;
        this.onStatusChange({ connected: true, status: 'connected' });
      };

      this.socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          this.onMessage(payload);
        } catch (e) {
          console.warn('[XR WebSocket] Failed to parse message', e);
        }
      };

      this.socket.onerror = (err) => {
        console.log('[XR WebSocket] Connection notice: Backend not running yet. Running in UI Shell Mode.');
        this.isConnected = false;
        this.onStatusChange({ connected: false, status: 'shell_mode' });
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        this.onStatusChange({ connected: false, status: 'disconnected' });
      };
    } catch {
      this.isConnected = false;
      this.onStatusChange({ connected: false, status: 'shell_mode' });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
  }

  send(data) {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.log('[XR WebSocket Shell] Message queued (Mock Mode):', data);
    }
  }
}
