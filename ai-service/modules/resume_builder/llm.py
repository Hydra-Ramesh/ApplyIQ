import logging
from langchain_groq import ChatGroq
from key_manager import key_manager

def get_llm():
    current_key = key_manager.get_current_key()
    return ChatGroq(temperature=0.7, model_name="llama-3.3-70b-versatile", max_tokens=4000, groq_api_key=current_key)

def execute_with_rotation(func, *args, **kwargs):
    """Executes a LangChain LLM function, rotating keys if a 429 occurs."""
    max_retries = len(key_manager.keys)
    attempts = 0
    
    while attempts < max_retries:
        try:
            return func(*args, **kwargs)
        except Exception as e:
            error_msg = str(e).lower()
            if "413" in error_msg or "too large" in error_msg:
                # Payload too large, rotating keys won't help because it's a hard limit on the tier
                raise Exception("Your resume is too long for the AI to process in a single request. Please try reducing the chat history or using a shorter resume.")
            elif "429" in error_msg or "rate limit" in error_msg or "401" in error_msg or "invalid api key" in error_msg:
                logging.warning(f"Key error or rate limit hit. Rotating key. Error: {str(e)}")
                failed_key = key_manager.get_current_key()
                key_manager.rotate_key(failed_key)
                attempts += 1
            else:
                raise e
    
    raise Exception("All Groq API keys exhausted or rate limited.")
