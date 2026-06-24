from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv() # Load variables from .env BEFORE creating the app

from modules.resume_builder.router import router as builder_router
from modules.quality_checker.router import router as quality_router

app = FastAPI(title="ApplyIQ - AI Service")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(builder_router, prefix="/api/v1")
app.include_router(quality_router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    return {"status": "OK", "message": "AI Service is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
