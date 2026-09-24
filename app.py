"""
G-SIGN XR Root Entry Point.
Runs the FastAPI Backend server on port 8000.
"""

import uvicorn
from backend.app.config.settings import settings

if __name__ == "__main__":
    print(f"Starting {settings.PROJECT_NAME} on http://localhost:{settings.PORT}")
    uvicorn.run("backend.app.main:app", host=settings.HOST, port=settings.PORT, reload=False)
