import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
dotenv.config();

class RedisCache {
  private client: Redis | null = null;
  private memoryCache = new Map<string, { value: any, expiresAt: number }>();

  constructor() {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (url && token) {
      this.client = new Redis({ url, token });
      console.log('✅ Upstash Redis connected.');
    } else {
      console.warn('⚠️ Upstash credentials missing. Using local memory cache.');
    }
  }

  async set(key: string, value: any, ttlSeconds: number): Promise<void> {
    if (this.client) {
      await this.client.set(key, value, { ex: ttlSeconds });
    } else {
      this.memoryCache.set(key, { 
        value, 
        expiresAt: Date.now() + (ttlSeconds * 1000) 
      });
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (this.client) {
      const data = await this.client.get(key);
      return data as T;
    } else {
      const item = this.memoryCache.get(key);
      if (!item) return null;
      if (Date.now() > item.expiresAt) {
        this.memoryCache.delete(key);
        return null;
      }
      return item.value as T;
    }
  }

  async delete(key: string): Promise<void> {
    if (this.client) {
      await this.client.del(key);
    } else {
      this.memoryCache.delete(key);
    }
  }
}

export const redisCache = new RedisCache();
