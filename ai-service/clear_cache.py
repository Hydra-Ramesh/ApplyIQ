import os
from dotenv import load_dotenv
load_dotenv()
from core.redis_client import redis_cache

keys = redis_cache.keys("cache:*")
for k in keys:
    redis_cache.delete(k)
print(f"Cleared {len(keys)} cached resumes!")
