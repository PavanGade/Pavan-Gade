import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal('')),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().or(z.literal('')),
  EXPO_PUBLIC_USE_MOCK_DATA: z
    .enum(['true', 'false'])
    .optional()
    .default('true'),
});

export type ClientEnv = {
  supabaseUrl: string | null;
  supabaseAnonKey: string | null;
  useMockData: boolean;
};

export function getClientEnv(): ClientEnv {
  const parsed = envSchema.safeParse({
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
    EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
    EXPO_PUBLIC_USE_MOCK_DATA: process.env.EXPO_PUBLIC_USE_MOCK_DATA ?? 'true',
  });

  if (!parsed.success) {
    throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
  }

  const url = parsed.data.EXPO_PUBLIC_SUPABASE_URL || null;
  const key = parsed.data.EXPO_PUBLIC_SUPABASE_ANON_KEY || null;
  const configured = Boolean(url && key);

  return {
    supabaseUrl: url,
    supabaseAnonKey: key,
    useMockData: parsed.data.EXPO_PUBLIC_USE_MOCK_DATA === 'true' || !configured,
  };
}
