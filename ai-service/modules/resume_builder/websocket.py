from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import json
import re
import logging
from .llm import get_llm
from .prompts import ROAST_PROMPT, OPTIMIZE_ATS_PROMPT
from .auth import verify_token

ws_router = APIRouter()
logger = logging.getLogger(__name__)

@ws_router.websocket("/ws/live-analysis")
async def live_analysis_websocket(websocket: WebSocket):
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=1008)
        return
        
    try:
        user_data = verify_token(token)
        if user_data.get("subscriptionTier", "free") != "pro":
            await websocket.close(code=1008)
            return
    except Exception:
        await websocket.close(code=1008)
        return

    await websocket.accept()
    
    # Store currently running tasks so we can cancel them if new code arrives
    current_tasks = []

    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            tex_code = payload.get("tex_code", "")
            job_description = payload.get("job_description", "")
            
            # Cancel any previous runs
            for t in current_tasks:
                if not t.done():
                    t.cancel()
            current_tasks.clear()

            if not tex_code.strip():
                continue

            async def run_roast():
                try:
                    llm = get_llm()
                    chain = ROAST_PROMPT | llm
                    await websocket.send_json({"type": "roast_start"})
                    async for chunk in chain.astream({"tex_code": tex_code}):
                        if chunk.content:
                            await websocket.send_json({"type": "roast_chunk", "content": chunk.content})
                    await websocket.send_json({"type": "roast_end"})
                except asyncio.CancelledError:
                    pass
                except Exception as e:
                    logger.error(f"Roast WS Error: {e}")

            async def run_ats():
                try:
                    if not job_description.strip():
                        return
                    llm = get_llm()
                    chain = OPTIMIZE_ATS_PROMPT | llm
                    await websocket.send_json({"type": "ats_start"})
                    full_content = ""
                    async for chunk in chain.astream({"job_description": job_description, "resume_text": tex_code}):
                        if chunk.content:
                            full_content += chunk.content
                            await websocket.send_json({"type": "ats_chunk", "content": chunk.content})
                    
                    # Parse score
                    score_match = re.search(r'<score>(\d{1,3})</score>', full_content, re.IGNORECASE)
                    extracted_score = 0
                    if score_match:
                        extracted_score = int(score_match.group(1))
                    else:
                        fallback_match = re.search(r'\b(\d{1,3})\s*(?:/|out of)\s*100\b', full_content)
                        if fallback_match:
                            extracted_score = int(fallback_match.group(1))
                            
                    await websocket.send_json({"type": "ats_end", "score": extracted_score})
                except asyncio.CancelledError:
                    pass
                except Exception as e:
                    logger.error(f"ATS WS Error: {e}")

            # Fire and forget tasks so we can keep listening for new messages
            task_r = asyncio.create_task(run_roast())
            current_tasks.append(task_r)
            
            if job_description.strip():
                task_a = asyncio.create_task(run_ats())
                current_tasks.append(task_a)

    except WebSocketDisconnect:
        logger.info("Live Analysis WebSocket disconnected")
        for t in current_tasks:
            t.cancel()
    except Exception as e:
        logger.error(f"WebSocket Error: {e}")
        for t in current_tasks:
            t.cancel()
