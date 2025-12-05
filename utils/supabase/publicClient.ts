// utils/supabase/publicClient.ts

import { createClient } from '@supabase/supabase-js';

// This client is optimized for public, non-authenticated data reads (landing pages).
export const publicSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      // Prevents the client from trying to manage or save cookies/sessions,
      // which is ideal for stateless Server Components and public reads.
      persistSession: false, 
    },
  }
);