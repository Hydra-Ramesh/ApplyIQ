import { Request, Response, NextFunction } from 'express';
import { redisCache } from '../utils/cache/redis';

/**
 * Enterprise-grade Redis Cache Middleware.
 * Intercepts GET requests, checks Redis, and serves instantly.
 * If cache miss, hooks into res.send to cache the outgoing DB payload.
 */
export const cacheRoute = (ttlSeconds: number = 3600) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    try {
      const key = `cache:${req.originalUrl || req.url}`;
      const cachedResponse = await redisCache.get(key);

      if (cachedResponse) {
        return res.status(200).json(JSON.parse(cachedResponse));
      }

      // If cache miss, intercept the res.json/res.send to save the payload
      const originalJson = res.json.bind(res);
      res.json = ((body: any) => {
        redisCache.set(key, JSON.stringify(body), { EX: ttlSeconds }).catch(console.error);
        return originalJson(body);
      }) as any;

      next();
    } catch (error) {
      console.error('Redis Cache Error:', error);
      next(); // Fail open, let the DB handle it if Redis fails
    }
  };
};

/**
 * Utility to forcefully delete cache keys when a user mutates data (POST/PUT/DELETE)
 */
export const invalidateCachePattern = async (pattern: string) => {
  try {
    const keys = await redisCache.keys(`cache:${pattern}*`);
    if (keys.length > 0) {
      await redisCache.del(keys);
    }
  } catch (error) {
    console.error('Failed to invalidate cache:', error);
  }
};
