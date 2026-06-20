from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    GROQ_API_KEY: str
    PINECONE_API_KEY: str
    UPSTASH_REDIS_REST_URL: Optional[str] = None
    UPSTASH_REDIS_REST_TOKEN: Optional[str] = None
    
    model_config = SettingsConfigDict(env_file=".env", extra='ignore')

# This will immediately raise a ValidationError on startup if GROQ or PINECONE keys are missing
settings = Settings()
