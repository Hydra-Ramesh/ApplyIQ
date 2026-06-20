from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import hashlib
from .engine import check_resume_quality
from ...core.redis_client import redis_cache

router = APIRouter(prefix="/quality", tags=["Quality Checker"])

def generate_cache_key(prefix: str, content: str) -> str:
    return f"{prefix}:{hashlib.md5(content.encode()).hexdigest()}"

class QualityRequest(BaseModel):
    resume_text: str

@router.post("/check")
async def api_check_quality(req: QualityRequest):
    try:
        cache_key = generate_cache_key("quality", req.resume_text)
        cached_result = redis_cache.get(cache_key)
        
        if cached_result:
            return {"quality_report": cached_result, "cached": True}

        result = check_resume_quality(req.resume_text)
        redis_cache.set(cache_key, result, ex=86400)
        
        return {"quality_report": result, "cached": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
