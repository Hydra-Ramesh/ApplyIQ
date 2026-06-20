import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
  MONGO_URI: z.string().url(),
  JWT_SECRET: z.string().min(10),
  RESEND_API_KEY: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid Backend Environment Variables:');
  console.error(_env.error.format());
  process.exit(1); // Fail fast in SDE-3
}

export const env = _env.data;
