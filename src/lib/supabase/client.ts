import { createBrowserClient } from "@supabase/ssr";
import { clientEnv, isDemoMode } from "@/lib/env";
import type { Database } from "@/types/supabase";

/** Browser Supabase client — anon key only. Returns null in demo mode. */
export function createSupabaseBrowserClient() {
  if (isDemoMode() || !clientEnv.NEXT_PUBLIC_SUPABASE_URL || !clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  return createBrowserClient<Database>(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
