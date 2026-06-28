import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  MONGO_URI: z.string().url(),
  JWT_SECRET: z.string().min(10),
  RESEND_API_KEY: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  CHECKOUT_URL: z.string().url().default('https://apply-iq-vozm.vercel.app/dashboard'),
  FRONTEND_URL: z.string().url().default('https://apply-iq-vozm.vercel.app'),
  AI_SERVICE_URL: z.string().url().default('https://applyiq-ai-service.onrender.com'),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid Backend Environment Variables:');
  console.error(_env.error.format());
  process.exit(1); // Fail fast in SDE-3
}

export const env = _env.data;
