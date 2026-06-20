from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import hashlib
from fastapi.responses import StreamingResponse
from .orchestrator import rewrite_bullet, optimize_ats, tailor_resume, autocomplete_text, roast_resume, generate_cold_email, stream_roast, stream_cold_email, generate_resume, copilot_edit
from ...core.redis_client import redis_cache
from typing import Dict, Any

router = APIRouter(prefix="/resume", tags=["Resume Builder"])

def generate_cache_key(prefix: str, content: str) -> str:
    return f"{prefix}:{hashlib.md5(content.encode()).hexdigest()}"

class RewriteRequest(BaseModel):
    raw_text: str

class AtsRequest(BaseModel):
    resume_text: str
    job_description: str

class TailorRequest(BaseModel):
    tex_code: str
    job_description: str

class AutocompleteRequest(BaseModel):
    prefix: str
    context: str

class RoastRequest(BaseModel):
    tex_code: str

class ColdEmailRequest(BaseModel):
    tex_code: str
    target_info: str

class ResumeGenerateRequest(BaseModel):
    form_data: Dict[str, Any]

@router.post("/rewrite-bullet")
async def api_rewrite_bullet(req: RewriteRequest):
    try:
        cache_key = generate_cache_key("rewrite", req.raw_text)
        cached_result = redis_cache.get(cache_key)
        
        if cached_result:
            return {"rewritten_bullet": cached_result, "cached": True}

        result = rewrite_bullet(req.raw_text)
        redis_cache.set(cache_key, result, ex=86400)
        
        return {"rewritten_bullet": result, "cached": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/optimize-ats")
async def api_optimize_ats(req: AtsRequest):
    try:
        cache_key = generate_cache_key("ats", req.resume_text + req.job_description)
        cached_result = redis_cache.get(cache_key)
        
        if cached_result:
            return {"analysis": cached_result, "cached": True}

        result = optimize_ats(req.resume_text, req.job_description)
        redis_cache.set(cache_key, result, ex=86400)
        
        return {"analysis": result, "cached": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/tailor")
async def api_tailor_resume(req: TailorRequest):
    try:
        cache_key = generate_cache_key("tailor", req.tex_code + req.job_description)
        cached_result = redis_cache.get(cache_key)
        
        if cached_result:
            return {"tailored_tex": cached_result, "cached": True}

        result = tailor_resume(req.tex_code, req.job_description)
        redis_cache.set(cache_key, result, ex=86400)
        
        return {"tailored_tex": result, "cached": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/autocomplete")
async def api_autocomplete(req: AutocompleteRequest):
    try:
        if len(req.prefix.strip()) < 5:
            return {"suggestion": ""}
            
        cache_key = generate_cache_key("autocomplete", req.prefix + req.context[:500])
        cached_result = redis_cache.get(cache_key)
        
        if cached_result:
            return {"suggestion": cached_result, "cached": True}

        result = autocomplete_text(req.prefix, req.context)
        redis_cache.set(cache_key, result, ex=3600) # cache for 1 hour
        
        return {"suggestion": result, "cached": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/roast")
async def api_roast_resume(req: RoastRequest):
    try:
        cache_key = generate_cache_key("roast", req.tex_code)
        cached_result = redis_cache.get(cache_key)
        
        if cached_result:
            return {"roast": cached_result, "cached": True}

        result = roast_resume(req.tex_code)
        redis_cache.set(cache_key, result, ex=86400)
        
        return {"roast": result, "cached": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/cold-email")
async def api_cold_email(req: ColdEmailRequest):
    try:
        cache_key = generate_cache_key("coldemail", req.tex_code + req.target_info)
        cached_result = redis_cache.get(cache_key)
        
        if cached_result:
            return {"email": cached_result, "cached": True}

        result = generate_cold_email(req.tex_code, req.target_info)
        redis_cache.set(cache_key, result, ex=86400)
        
        return {"email": result, "cached": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/roast-stream")
async def api_roast_stream(req: RoastRequest):
    return StreamingResponse(stream_roast(req.tex_code), media_type="text/event-stream")

@router.post("/cold-email-stream")
async def api_cold_email_stream(req: ColdEmailRequest):
    return StreamingResponse(stream_cold_email(req.tex_code, req.target_info), media_type="text/event-stream")

@router.post("/generate")
async def api_generate_resume(req: ResumeGenerateRequest):
    try:
        # Generate hash of form data to cache identical requests
        import json
        form_str = json.dumps(req.form_data, sort_keys=True)
        cache_key = generate_cache_key("generate", form_str)
        cached_result = redis_cache.get(cache_key)
        
        if cached_result:
            return {"tex_code": cached_result, "cached": True}

        result = generate_resume(req.form_data)
        redis_cache.set(cache_key, result, ex=86400)
        
        return {"tex_code": result, "cached": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class CopilotRequest(BaseModel):
    tex_code: str
    instruction: str

@router.post("/copilot")
async def api_copilot_edit(req: CopilotRequest):
    try:
        # Don't cache copilot responses as they are highly dynamic
        result = copilot_edit(req.tex_code, req.instruction)
        return {"tex_code": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
