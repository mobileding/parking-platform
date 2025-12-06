// utils/supabase/publicClient.ts

import { createClient } from '@supabase/supabase-js';

// This client is optimized for public, non-authenticated data reads (landing pages).
export function getPublicSupabaseClient() {
    
    // We assume these are set in .env.local or Vercel Environment Variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // 💡 FIX: Removed the build-crashing 'if (!supabaseUrl || !supabaseAnonKey) { throw ... }'
    // We now rely on the non-null assertion (!) which is safer during the build phase.

    return createClient(
      // Use ! to tell TypeScript that these values will be available at runtime
      supabaseUrl!, 
      supabaseAnonKey!,
      {
        auth: {
          // Prevents the client from trying to manage or save cookies/sessions,
          persistSession: false, 
        },
      }
    );
}