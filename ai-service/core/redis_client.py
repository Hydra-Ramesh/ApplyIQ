import os
import json
import logging
from upstash_redis import Redis

class RedisCache:
    def __init__(self):
        url = os.getenv("UPSTASH_REDIS_REST_URL")
        token = os.getenv("UPSTASH_REDIS_REST_TOKEN")
        self.memory_cache = {}
        
        if url and token:
            try:
                self.client = Redis(url=url, token=token)
                logging.info("✅ Upstash Redis connected in AI Service.")
            except Exception as e:
                logging.warning(f"Failed to connect to Upstash Redis: {e}")
                self.client = None
        else:
            self.client = None
            logging.warning("⚠️ Upstash credentials missing in Python. Using local memory cache.")

    def get(self, key: str):
        if self.client:
            data = self.client.get(key)
            return json.loads(data) if data else None
        else:
            return self.memory_cache.get(key)

    def set(self, key: str, value: any, ex: int = 3600):
        if self.client:
            self.client.set(key, json.dumps(value), ex=ex)
        else:
            self.memory_cache[key] = value

    def incr(self, key: str):
        if self.client:
            return self.client.incr(key)
        else:
            current = self.memory_cache.get(key, 0)
            if current is None:
                current = 0
            current = int(current) + 1
            self.memory_cache[key] = current
            return current

redis_cache = RedisCache()
