from .llm import get_llm, execute_with_rotation
from .prompts import REWRITE_BULLET_PROMPT, OPTIMIZE_ATS_PROMPT, TAILOR_RESUME_PROMPT, AUTOCOMPLETE_PROMPT, ROAST_PROMPT, COLD_EMAIL_PROMPT, GENERATE_RESUME_PROMPT, COPILOT_PROMPT

def copilot_edit(tex_code: str, instruction: str) -> str:
    def _run():
        llm = get_llm()
        chain = COPILOT_PROMPT | llm
        response = chain.invoke({"tex_code": tex_code, "instruction": instruction})
        
        result = response.content.strip()
        if result.startswith("```latex"):
            result = result[8:]
        if result.endswith("```"):
            result = result[:-3]
        return result.strip()
        
    return execute_with_rotation(_run)
def rewrite_bullet(raw_text: str) -> str:
    def _run():
        llm = get_llm()
        chain = REWRITE_BULLET_PROMPT | llm
        response = chain.invoke({"raw_text": raw_text})
        return response.content.strip()
        
    return execute_with_rotation(_run)

def optimize_ats(resume_text: str, job_description: str) -> str:
    def _run():
        llm = get_llm()
        chain = OPTIMIZE_ATS_PROMPT | llm
        response = chain.invoke({"job_description": job_description, "resume_text": resume_text})
        return response.content.strip()
        
    return execute_with_rotation(_run)

def tailor_resume(tex_code: str, job_description: str) -> str:
    def _run():
        llm = get_llm()
        chain = TAILOR_RESUME_PROMPT | llm
        response = chain.invoke({"job_description": job_description, "tex_code": tex_code})
        # Strip backticks in case the LLM disobeys the prompt
        result = response.content.strip()
        if result.startswith("```latex"):
            result = result[8:]
        if result.endswith("```"):
            result = result[:-3]
        return result.strip()
        
    return execute_with_rotation(_run)

def autocomplete_text(prefix: str, context: str) -> str:
    def _run():
        llm = get_llm()
        chain = AUTOCOMPLETE_PROMPT | llm
        response = chain.invoke({"prefix": prefix, "context": context})
        # Strict cleanup
        result = response.content.strip().replace('"', '').replace('\n', ' ')
        return result
        
    return execute_with_rotation(_run)

def roast_resume(tex_code: str) -> str:
    def _run():
        llm = get_llm()
        chain = ROAST_PROMPT | llm
        response = chain.invoke({"tex_code": tex_code})
        return response.content.strip()
        
    return execute_with_rotation(_run)

def generate_cold_email(tex_code: str, target_info: str) -> str:
    def _run():
        llm = get_llm()
        chain = COLD_EMAIL_PROMPT | llm
        response = chain.invoke({"tex_code": tex_code, "target_info": target_info})
        return response.content.strip()
        
    return execute_with_rotation(_run)

async def stream_roast(tex_code: str):
    llm = get_llm()
    chain = ROAST_PROMPT | llm
    async for chunk in chain.astream({"tex_code": tex_code}):
        if chunk.content:
            yield chunk.content

async def stream_cold_email(tex_code: str, target_info: str):
    llm = get_llm()
    chain = COLD_EMAIL_PROMPT | llm
    async for chunk in chain.astream({"tex_code": tex_code, "target_info": target_info}):
        if chunk.content:
            yield chunk.content

def generate_resume(form_data: dict) -> str:
    def _run():
        llm = get_llm()
        chain = GENERATE_RESUME_PROMPT | llm
        import json
        response = chain.invoke({"form_data": json.dumps(form_data, indent=2)})
        
        result = response.content.strip()
        if result.startswith("```latex"):
            result = result[8:]
        if result.endswith("```"):
            result = result[:-3]
        return result.strip()
        
    return execute_with_rotation(_run)
