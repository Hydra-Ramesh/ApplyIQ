import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url().default('http://localhost:5000/api'),
  VITE_AI_URL: z.string().url().default('http://localhost:8000'),
});

const _env = envSchema.safeParse(import.meta.env);

if (!_env.success) {
  console.error('❌ Invalid Frontend Environment Variables:');
  console.error(_env.error.format());
  throw new Error('Invalid environment configuration');
}

export const env = _env.data;
