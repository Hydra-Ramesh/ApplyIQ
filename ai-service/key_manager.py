import os
import threading
import logging

class GroqKeyManager:
    def __init__(self):
        keys_str = os.getenv("GROQ_API_KEYS", "")
        if keys_str:
            self.keys = [k.strip() for k in keys_str.split(",") if k.strip()]
        else:
            # Fallback single key
            single_key = os.getenv("GROQ_API_KEY", "mock-groq-key")
            self.keys = [single_key]
        
        self.current_index = 0
        self.lock = threading.Lock()

    def get_current_key(self) -> str:
        with self.lock:
            if not self.keys:
                raise ValueError("No Groq API keys available")
            return self.keys[self.current_index]

    def rotate_key(self, failed_key: str):
        with self.lock:
            if not self.keys:
                return
            
            # Only rotate if the failed key is still the current key
            current_key = self.keys[self.current_index]
            if failed_key == current_key:
                self.current_index = (self.current_index + 1) % len(self.keys)
                logging.warning(f"Rotated Groq API key to index {self.current_index}")

key_manager = GroqKeyManager()
