from .llm import get_llm, execute_with_rotation
from .prompts import REWRITE_BULLET_PROMPT, OPTIMIZE_ATS_PROMPT, TAILOR_RESUME_PROMPT, AUTOCOMPLETE_PROMPT, ROAST_PROMPT, COLD_EMAIL_PROMPT, GENERATE_RESUME_PROMPT, COPILOT_PROMPT

def copilot_edit(tex_code: str, instruction: str, chat_history: list = None) -> dict:
    def _run():
        history_str = "No previous history."
        if chat_history:
            # Format the last 5 messages for context, ignoring the default greeting if it's the only one
            recent_history = chat_history[-6:] 
            formatted_msgs = []
            for msg in recent_history:
                role = "User" if msg.get("role") == "user" else "Assistant"
                formatted_msgs.append(f"{role}: {msg.get('content')}")
            if formatted_msgs:
                history_str = "\n\n".join(formatted_msgs)

        llm = get_llm()
        chain = COPILOT_PROMPT | llm
        response = chain.invoke({"tex_code": tex_code, "instruction": instruction, "history": history_str})
        
        result = response.content.strip()
        import re
        message_match = re.search(r'<message>(.*?)</message>', result, re.DOTALL)
        tex_match = re.search(r'<tex_code>(.*?)</tex_code>', result, re.DOTALL)
        
        message = message_match.group(1).strip() if message_match else "I updated your resume!"
        new_tex_code = tex_match.group(1).strip() if tex_match else result
        
        if new_tex_code.startswith("```latex"):
            new_tex_code = new_tex_code[8:]
        if new_tex_code.endswith("```"):
            new_tex_code = new_tex_code[:-3]
            
        return {"tex_code": new_tex_code.strip(), "message": message}
        
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
