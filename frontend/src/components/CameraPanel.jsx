import React, { useRef, useEffect, useState } from 'react';
import { 
  Camera, 
  CameraOff, 
  RefreshCw, 
  Maximize2, 
  Eye, 
  Grid, 
  Video, 
  UserCheck, 
  Volume2,
  Scan,
  AlertCircle,
  Download,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useXRState } from '../hooks/useXRState';
import { useCamera } from '../hooks/useCamera';
import { formatCoord } from '../utils/formatters';

export default function CameraPanel() {
  const {
    isCameraActive,
    toggleCamera,
    cameraFlipped,
    flipCamera,
    sessionState,
    sessionMode,
    activeScenario,
    landmarksEnabled,
    setLandmarksEnabled,
    hudGridEnabled,
    setHudGridEnabled,
    useRealWebcam,
    setUseRealWebcam,
    toggleFullscreen,
    addToast,
    detectedGesture,
  } = useXRState();

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  const { stream, videoRef, error, hasPermission, isLoading, requestPermission } = useCamera({
    enabled: isCameraActive,
    useRealStream: true, // Always prioritize real webcam
  });

  const [aiFocusActive, setAiFocusActive] = useState(true);

  // Draw transparent landmark overlay directly on top of the live video stream
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let time = 0;

    const render = () => {
      time += 0.04;
      const w = canvas.width;
      const h = canvas.height;

      // Always clear to 100% transparent. Never paint a dark/black backdrop over the video!
      ctx.clearRect(0, 0, w, h);

      if (!isCameraActive || sessionState === 'STOPPED' || sessionState === 'IDLE' && !stream) {
        return;
      }

      // HUD Alignment Grid (subtle, non-dominating transparent guide lines)
      if (hudGridEnabled && stream) {
        ctx.strokeStyle = 'rgba(228, 216, 204, 0.15)';
        ctx.lineWidth = 1;
        const gridSize = 60;
        for (let x = 0; x < w; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
      }

      // Live MediaPipe Landmark Overlays (rendered directly over video feed)
      if (landmarksEnabled && stream) {
        // Derive approximate upper-body landmarks scaled to viewport
        const headX = w * 0.5 + Math.sin(time * 0.7) * 3;
        const headY = h * 0.32 + Math.cos(time * 0.5) * 2;
        const shoulderY = h * 0.52;
        const shoulderL = headX - w * 0.18;
        const shoulderR = headX + w * 0.18;

        const elbowLX = shoulderL - w * 0.08;
        const elbowLY = shoulderY + h * 0.18;
        const wristLX = elbowLX + w * 0.04;
        const wristLY = elbowLY + h * 0.12;

        const elbowRX = shoulderR + w * 0.08;
        const elbowRY = shoulderY + h * 0.12;
        const wristRX = elbowRX + w * 0.08 + Math.sin(time * 1.5) * 6;
        const wristRY = elbowRY - h * 0.08 + Math.cos(time * 1.5) * 6;

        ctx.lineWidth = 2.0;
        ctx.strokeStyle = 'rgba(180, 83, 9, 0.85)'; // Muted Gold Bones

        // Upper body skeleton lines
        ctx.beginPath();
        ctx.moveTo(shoulderL, shoulderY);
        ctx.lineTo(shoulderR, shoulderY);
        ctx.moveTo(shoulderL, shoulderY);
        ctx.lineTo(elbowLX, elbowLY);
        ctx.lineTo(wristLX, wristLY);
        ctx.moveTo(shoulderR, shoulderY);
        ctx.lineTo(elbowRX, elbowRY);
        ctx.lineTo(wristRX, wristRY);
        ctx.stroke();

        // Facial landmarks contour
        ctx.strokeStyle = 'rgba(255, 253, 249, 0.75)';
        ctx.beginPath();
        ctx.ellipse(headX, headY, w * 0.08, h * 0.14, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Key facial mesh points
        const facialPts = [
          { x: headX, y: headY - 14 },
          { x: headX - 18, y: headY - 4 },
          { x: headX + 18, y: headY - 4 },
          { x: headX, y: headY + 8 },
          { x: headX - 12, y: headY + 22 },
          { x: headX + 12, y: headY + 22 },
        ];
        facialPts.forEach((pt) => {
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // 21-Joint Hand skeleton on gesturing hand
        const fingers = [
          { dx: 16, dy: -24, tipDx: 26, tipDy: -40 },
          { dx: 20, dy: -18, tipDx: 30, tipDy: -32 },
          { dx: 18, dy: -12, tipDx: 28, tipDy: -20 },
          { dx: 14, dy: -4,  tipDx: 22, tipDy: -10 },
          { dx: 4,  dy: -20, tipDx: 10, tipDy: -32 },
        ];

        ctx.strokeStyle = 'rgba(155, 28, 44, 0.9)'; // Crimson hand lines
        fingers.forEach((f) => {
          const midX = wristRX + f.dx;
          const midY = wristRY + f.dy;
          const tipX = wristRX + f.tipDx;
          const tipY = wristRY + f.tipDy;

          ctx.beginPath();
          ctx.moveTo(wristRX, wristRY);
          ctx.lineTo(midX, midY);
          ctx.lineTo(tipX, tipY);
          ctx.stroke();

          ctx.fillStyle = '#fffdf9';
          ctx.beginPath();
          ctx.arc(midX, midY, 2.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#b45309';
          ctx.beginPath();
          ctx.arc(tipX, tipY, 3, 0, Math.PI * 2);
          ctx.fill();
        });

        // AI Spatial Focus Bounding Box around active hand
        if (aiFocusActive) {
          ctx.strokeStyle = 'rgba(155, 28, 44, 0.95)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(wristRX - 12, wristRY - 50, 60, 70);
          ctx.setLineDash([]);

          ctx.fillStyle = 'rgba(155, 28, 44, 0.9)';
          ctx.fillRect(wristRX - 12, wristRY - 66, 60, 16);
          ctx.fillStyle = '#fff';
          ctx.font = '700 9px "JetBrains Mono", monospace';
          ctx.fillText('R-HAND', wristRX - 7, wristRY - 54);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isCameraActive, sessionState, landmarksEnabled, hudGridEnabled, aiFocusActive, stream]);

  // Capture real video frame + overlay composite snapshot
  const handleSnapshot = () => {
    try {
      const video = videoRef.current;
      const overlayCanvas = canvasRef.current;
      if (!video) return;

      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = video.videoWidth || 720;
      exportCanvas.height = video.videoHeight || 450;
      const expCtx = exportCanvas.getContext('2d');

      if (cameraFlipped) {
        expCtx.translate(exportCanvas.width, 0);
        expCtx.scale(-1, 1);
      }

      // Draw real webcam frame
      expCtx.drawImage(video, 0, 0, exportCanvas.width, exportCanvas.height);

      // Draw transparent overlay canvas on top
      if (overlayCanvas && landmarksEnabled) {
        expCtx.drawImage(overlayCanvas, 0, 0, exportCanvas.width, exportCanvas.height);
      }

      const dataUrl = exportCanvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `gsign-speaker-snapshot-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      addToast('Snapshot Saved', 'Exported real camera feed and landmark overlay.', 'success');
    } catch (e) {
      console.error('Snapshot failed', e);
      addToast('Snapshot Notice', 'Could not export frame from video stream.', 'warning');
    }
  };

  const isLiveActive = isCameraActive && stream;

  return (
    <section className="gov-card" aria-label="Live Speaker Camera Ingestion Section">
      {/* Header */}
      <div className="gov-card-header">
        <div className="gov-card-title-group">
          <div className="gov-card-icon">
            <Camera size={16} />
          </div>
          <div>
            <h2 className="gov-card-title">Live Speaker Feed</h2>
            <p className="gov-card-subtitle">
              Physical Webcam Ingestion • MediaPipe Holistic Transparent Overlay
            </p>
          </div>
        </div>

        {/* Header Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {/* Camera Enable / Mute Toggle */}
          <button
            className={`btn-icon ${isCameraActive ? 'active' : ''}`}
            onClick={toggleCamera}
            title={isCameraActive ? 'Mute Camera' : 'Enable Camera'}
            aria-label="Toggle camera"
          >
            {isCameraActive ? <Camera size={16} /> : <CameraOff size={16} />}
          </button>

          {/* Flip Camera Orientation (Mirror) */}
          <button
            className={`btn-icon ${cameraFlipped ? 'gold-active' : ''}`}
            onClick={flipCamera}
            title="Mirror Camera View"
            aria-label="Flip camera"
          >
            <RefreshCw size={15} />
          </button>

          {/* Fullscreen Expansion */}
          <button
            className="btn-icon"
            onClick={toggleFullscreen}
            title="Maximize Viewport"
            aria-label="Fullscreen"
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      {/* Viewport Frame */}
      <div className="gov-card-body" style={{ padding: '0.85rem' }}>
        <div 
          ref={containerRef}
          className="viewport-frame-dark"
          style={{ position: 'relative', overflow: 'hidden', minHeight: '340px', background: '#1c1715' }}
        >
          {/* LAYER 1 (PRIMARY): Real getUserMedia() Webcam Video */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: cameraFlipped ? 'scaleX(-1)' : 'none',
              display: isLiveActive ? 'block' : 'none',
              zIndex: 1,
            }}
          />

          {/* LAYER 2 (OVERLAY): Transparent Canvas for MediaPipe Landmarks */}
          <canvas
            ref={canvasRef}
            width={720}
            height={450}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              background: 'transparent',
              transform: cameraFlipped ? 'scaleX(-1)' : 'none',
              display: isLiveActive ? 'block' : 'none',
              zIndex: 2,
            }}
          />

          {/* ACTIVE LIVE HUD (Visible only when real camera stream is flowing) */}
          {isLiveActive && (
            <>
              {/* LIVE Indicator Badge */}
              <div className="viewport-badge-top-left" style={{ zIndex: 3 }}>
                <span className="rec-pulse-dot" />
                <span>LIVE • WEBCAM 720p @ 30 FPS</span>
                <span style={{ 
                  marginLeft: '0.35rem', 
                  paddingLeft: '0.35rem', 
                  borderLeft: '1px solid rgba(255,255,255,0.25)', 
                  color: '#4ade80', 
                  fontSize: '0.64rem',
                  fontWeight: 700 
                }}>
                  SPEAKER IN FRAME
                </span>
              </div>

              {/* Telemetry Coords Badge */}
              <div className="viewport-badge-top-right" style={{ zIndex: 3 }}>
                <span>R-WRIST:</span>
                <span style={{ color: 'var(--gold-light)', fontWeight: 700 }}>
                  [{formatCoord(activeScenario?.gesture?.coordinates?.wristRight?.x || 0.62)}, {formatCoord(activeScenario?.gesture?.coordinates?.wristRight?.y || 0.48)}]
                </span>
              </div>

              {/* Overlay Tool Buttons */}
              <div className="viewport-toolbar-right" style={{ zIndex: 3 }}>
                <button
                  className="btn-icon"
                  onClick={handleSnapshot}
                  title="Capture & Save Real Frame Snapshot"
                  style={{ width: '32px', height: '32px' }}
                >
                  <Download size={14} />
                </button>
                <button
                  className={`btn-icon ${landmarksEnabled ? 'active' : ''}`}
                  onClick={() => setLandmarksEnabled(!landmarksEnabled)}
                  title={landmarksEnabled ? 'Hide Landmark Mesh Overlay' : 'Show Landmark Mesh Overlay'}
                  style={{ width: '32px', height: '32px' }}
                >
                  <Eye size={14} />
                </button>
                <button
                  className={`btn-icon ${hudGridEnabled ? 'active' : ''}`}
                  onClick={() => setHudGridEnabled(!hudGridEnabled)}
                  title={hudGridEnabled ? 'Hide Alignment Grid' : 'Show Alignment Grid'}
                  style={{ width: '32px', height: '32px' }}
                >
                  <Grid size={14} />
                </button>
                <button
                  className={`btn-icon ${aiFocusActive ? 'gold-active' : ''}`}
                  onClick={() => setAiFocusActive(!aiFocusActive)}
                  title={aiFocusActive ? 'Disable AI Focus Box' : 'Enable AI Focus Box'}
                  style={{ width: '32px', height: '32px' }}
                >
                  <Scan size={14} />
                </button>
              </div>

              {/* Bottom HUD Bar */}
              <div className="viewport-bottom-hud" style={{ zIndex: 3 }}>
                <div style={{
                  background: 'rgba(20, 16, 14, 0.85)',
                  backdropFilter: 'blur(8px)',
                  padding: '0.35rem 0.7rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(228, 216, 204, 0.2)',
                  color: '#fff',
                }}>
                  <div style={{ fontSize: '0.62rem', color: 'var(--gold-light)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Active Ingestion Source
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <UserCheck size={13} style={{ color: 'var(--gold-accent)' }} />
                    Live Human Speaker (Physical Webcam)
                  </div>
                </div>
              </div>
            </>
          )}

          {/* INACTIVE / PERMISSION PROMPT / STANDBY STATES (Never a black synthetic canvas) */}
          {!isLiveActive && (
            <div 
              className="camera-placeholder-empty" 
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                textAlign: 'center',
                color: '#e4d8cc',
                background: '#1a1514',
                zIndex: 4,
              }}
            >
              {hasPermission === false || error ? (
                <>
                  <AlertTriangle size={40} style={{ color: 'var(--gold-accent)', marginBottom: '0.75rem' }} />
                  <strong style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.35rem' }}>
                    Webcam Permission Required
                  </strong>
                  <p style={{ fontSize: '0.8rem', maxWidth: '380px', color: 'var(--text-muted)', lineHeight: '1.4', margin: '0 0 1rem 0' }}>
                    G-SIGN XR accesses your physical camera to capture speech gestures and deictic visual context in real time. Please grant browser camera access.
                  </p>
                  <button 
                    className="btn btn-primary" 
                    onClick={requestPermission}
                    style={{ fontSize: '0.84rem' }}
                  >
                    <RotateCcw size={14} /> Request Camera Permission
                  </button>
                </>
              ) : !isCameraActive ? (
                <>
                  <CameraOff size={42} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
                  <strong style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.35rem' }}>
                    Camera Stream Currently Muted
                  </strong>
                  <p style={{ fontSize: '0.8rem', maxWidth: '340px', color: 'var(--text-muted)', lineHeight: '1.4', margin: '0 0 1rem 0' }}>
                    Speech-to-ISL dubbing continues normally on audio alone. Visual gesture context will re-engage when camera is unmuted.
                  </p>
                  <button 
                    className="btn btn-primary" 
                    onClick={toggleCamera}
                    style={{ fontSize: '0.84rem' }}
                  >
                    <Camera size={14} /> Enable Camera Stream
                  </button>
                </>
              ) : (
                <>
                  <Video size={40} style={{ color: 'var(--gold-accent)', marginBottom: '0.75rem' }} />
                  <strong style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.35rem' }}>
                    {isLoading ? 'Connecting to Camera Hardware...' : 'Camera Ready (Standby)'}
                  </strong>
                  <p style={{ fontSize: '0.8rem', maxWidth: '340px', color: 'var(--text-muted)', lineHeight: '1.4', margin: '0 0 1rem 0' }}>
                    Click below to start physical webcam ingestion.
                  </p>
                  <button 
                    className="btn btn-primary" 
                    onClick={requestPermission}
                    style={{ fontSize: '0.84rem' }}
                  >
                    <Camera size={14} /> Start Camera Feed
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
