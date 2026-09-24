from fastapi import APIRouter
from ...schemas.events import SystemHealthReport

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("", response_model=SystemHealthReport)
async def get_health():
    return SystemHealthReport(
        mic_connected=True,
        camera_connected=True,
        asr_ready=True,
        language_detected=True,
        vision_ready=True,
        jarvis_ready=True,
        isl_planner_ready=True,
        avatar_ready=True,
        websocket_ready=True,
        roundtrip_latency_ms=22,
        active_language="en",
        mode="nominal"
    )
