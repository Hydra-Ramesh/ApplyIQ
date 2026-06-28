from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import hashlib
from fastapi.responses import StreamingResponse
from .orchestrator import rewrite_bullet, optimize_ats, tailor_resume, autocomplete_text, roast_resume, generate_cold_email, stream_roast, stream_cold_email, generate_resume, copilot_edit
from core.redis_client import redis_cache
from typing import Dict, Any, Optional, List
from .llm import get_llm
from .websocket import ws_router
from fastapi import Depends
from .auth import check_quota, require_pro
router = APIRouter(prefix="/resume", tags=["Resume Builder"])
router.include_router(ws_router)

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
async def api_rewrite_bullet(req: RewriteRequest, user: dict = Depends(require_pro)):
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
async def api_optimize_ats(req: AtsRequest, user: dict = Depends(require_pro)):
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
async def api_tailor_resume(req: TailorRequest, user: dict = Depends(require_pro)):
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
async def api_autocomplete(req: AutocompleteRequest, user: dict = Depends(require_pro)):
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
async def api_roast_resume(req: RoastRequest, user: dict = Depends(require_pro)):
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
async def api_cold_email(req: ColdEmailRequest, user: dict = Depends(require_pro)):
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
async def api_roast_stream(req: RoastRequest, user: dict = Depends(require_pro)):
    return StreamingResponse(stream_roast(req.tex_code), media_type="text/event-stream")

@router.post("/cold-email-stream")
async def api_cold_email_stream(req: ColdEmailRequest, user: dict = Depends(require_pro)):
    return StreamingResponse(stream_cold_email(req.tex_code, req.target_info), media_type="text/event-stream")

@router.post("/generate")
async def api_generate_resume(req: ResumeGenerateRequest, user: dict = Depends(check_quota("generate", 5))):
    try:
        # Generate hash of form data to cache identical requests
        import json
        form_str = json.dumps(req.form_data, sort_keys=True)
        cache_key = generate_cache_key("generate_v4", form_str)
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
    chat_history: Optional[List[Dict[str, Any]]] = None

@router.post("/copilot")
async def api_copilot_edit(req: CopilotRequest, user: dict = Depends(check_quota("copilot", 1000))):
    try:
        # Don't cache copilot responses as they are highly dynamic
        result = copilot_edit(req.tex_code, req.instruction, req.chat_history)
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

from typing import Dict, Any, Optional

class CompileRequest(BaseModel):
    tex_code: str
    images: Optional[Dict[str, str]] = {}

@router.post("/compile")
async def api_compile_latex(req: CompileRequest):
    try:
        import httpx
        from fastapi.responses import Response
        import asyncio
        
        async with httpx.AsyncClient(follow_redirects=True) as client:
            # 1. Prepare files payload as a list of tuples to support duplicate keys
            import re
            # Automatically strip out duplicate fontawesome package if it's there
            clean_tex_code = re.sub(r'\\(?:RequirePackage|usepackage)\{fontawesome\}', '', req.tex_code)
            
            # Automatically escape hashes in \href to prevent 'Illegal parameter number' errors
            clean_tex_code = re.sub(r'\\href\{#\}', r'\\href{\\#}', clean_tex_code)
            
            # Auto-fix missing \item when \resumeItemListStart immediately follows \resumeSubHeadingListStart
            clean_tex_code = re.sub(r'(\\resumeSubHeadingListStart\s*\\resumeItemListStart)', r'\\resumeSubHeadingListStart\n        \\item\n            \\resumeItemListStart', clean_tex_code)
            
            # Automatically strip out mistakenly added \\ at the end of \resumeItem
            clean_lines = [r'\nonstopmode']
            for line in clean_tex_code.split('\n'):
                if r'\resumeItem' in line:
                    line = re.sub(r'\\\\\s*$', '', line.rstrip())
                clean_lines.append(line)
            clean_tex_code = '\n'.join(clean_lines)
            
            files_payload = [
                ("filecontents[]", (None, clean_tex_code.encode('utf-8'))),
                ("filename[]", (None, "document.tex")),
                ("engine", (None, "pdflatex")),
                ("return", (None, "pdf"))
            ]
            
            # 2. Fetch all requested images concurrently
            if req.images:
                # Create tasks for downloading each image
                async def fetch_image(filename: str, url: str):
                    try:
                        img_response = await client.get(url, timeout=10.0)
                        if img_response.status_code == 200:
                            return filename, img_response.content
                        else:
                            print(f"Failed to fetch image {filename} from {url}: HTTP {img_response.status_code}")
                            return filename, None
                    except Exception as e:
                        print(f"Error fetching image {filename} from {url}: {e}")
                        return filename, None

                tasks = [fetch_image(fname, url) for fname, url in req.images.items()]
                results = await asyncio.gather(*tasks)
                
                # Append successfully fetched images to the payload
                for filename, content in results:
                    if content:
                        files_payload.append(("filecontents[]", (None, content)))
                        files_payload.append(("filename[]", (None, filename)))

            # 3. Send the payload to texlive.net
            response = await client.post(
                "https://texlive.net/cgi-bin/latexcgi",
                files=files_payload,
                timeout=30.0
            )
            
        if response.status_code == 200 and response.headers.get("content-type") == "application/pdf":
            return Response(content=response.content, media_type="application/pdf")
        else:
            log_text = response.text
            print("LATEX COMPILE ERROR LOG:", log_text)
            
            error_lines = [line[2:].strip() for line in log_text.split('\n') if line.startswith('! ')]
            unique_errors = []
            for err in error_lines:
                if err not in unique_errors and err not in ["Emergency stop.", "==> Fatal error occurred, no output PDF file produced!"]:
                    unique_errors.append(err)
                    
            error_msg = " | ".join(unique_errors) if unique_errors else "Compilation failed. Check LaTeX syntax."
            
            raise HTTPException(status_code=400, detail=error_msg)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
