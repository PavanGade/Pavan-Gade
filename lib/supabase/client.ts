import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

import { getClientEnv } from '@/lib/env';
import type { Database } from '@/types/database';

let client: SupabaseClient<Database> | null = null;

/**
 * SecureStore is preferred on native; AsyncStorage is the web/fallback adapter.
 * Only the anon key is used here — never the service role.
 */
export function getSupabase(): SupabaseClient<Database> | null {
  const env = getClientEnv();
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    return null;
  }

  if (client) {
    return client;
  }

  client = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: Platform.OS === 'web',
    },
  });

  return client;
}
