"""
G-SIGN XR Main FastAPI Application.
Real-time Multilingual Speech-to-Indian-Sign-Language Dubbing Platform.
"""

from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging

from .config.settings import settings
from .api.routes import health, speech, jarvis, avatar
from .api.websocket.events import handle_websocket_session

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("g_sign_xr")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Real-time Multilingual Speech-to-Indian-Sign-Language Dubbing Engine"
)

# Enable CORS for frontend Vite dev server and production builds
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount REST Routes
app.include_router(health.router, prefix="/api")
app.include_router(speech.router, prefix="/api")
app.include_router(jarvis.router, prefix="/api")
app.include_router(avatar.router, prefix="/api")

# Mount WebSocket Telemetry Stream
@app.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    await handle_websocket_session(websocket)

@app.get("/")
async def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "websocket_endpoint": "/ws/telemetry",
        "health_check": "/api/health"
    }

if __name__ == "__main__":
    uvicorn.run("backend.app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
