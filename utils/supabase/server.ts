// utils/supabase/server.ts

import { createServerClient } from '@supabase/ssr';
import { headers } from 'next/headers'; 

// This function creates a Supabase client by reading the raw 'Cookie' header.
export function createServerSupabaseClient() {
  const cookieHeader = headers().get('cookie');
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // Find the specific auth cookie value from the header string
          const cookie = cookieHeader 
            ?.split('; ')
            .find((c) => c.startsWith(`${name}=`));
          
          return cookie ? cookie.split('=')[1] : null;
        },
        set() {},
        remove() {},
      },
    }
  );
}