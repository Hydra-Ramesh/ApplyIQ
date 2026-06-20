import logging
from langchain_groq import ChatGroq
from ..key_manager import key_manager

def get_llm():
    current_key = key_manager.get_current_key()
    return ChatGroq(temperature=0.7, model_name="llama3-8b-8192", groq_api_key=current_key)

def execute_with_rotation(func, *args, **kwargs):
    """Executes a LangChain LLM function, rotating keys if a 429 occurs."""
    max_retries = len(key_manager.keys)
    attempts = 0
    
    while attempts < max_retries:
        try:
            return func(*args, **kwargs)
        except Exception as e:
            error_msg = str(e).lower()
            if "429" in error_msg or "rate limit" in error_msg:
                logging.warning(f"Rate limit hit. Rotating key. Error: {str(e)}")
                failed_key = key_manager.get_current_key()
                key_manager.rotate_key(failed_key)
                attempts += 1
            else:
                raise e
    
    raise Exception("All Groq API keys exhausted or rate limited.")
