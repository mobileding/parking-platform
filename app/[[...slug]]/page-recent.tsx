// app/[[...slug]]/page.tsx

import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js'; 
import DomainLandingPage from '@/components/DomainLandingPage'; 
import { Domain } from '@/types/Domain'; 

// Ensures the page is rendered dynamically on the server for every request.
export const dynamic = 'force-dynamic'; 

interface DomainPageProps {
  params: {
    slug: string[] | undefined; 
  };
}

export default async function DomainPage({ params }: DomainPageProps) {
  
  // 💡 FIX: Await the headers() call (Required for Next.js 15+)
  const requestHeaders = await headers();
  const hostWithPort = requestHeaders.get('host');
  
  if (!hostWithPort) {
    return notFound();
  }
  
  // 1. STRIP PORT: "testdomain.local:3000" -> "testdomain.local"
  const host = hostWithPort.split(':')[0]; 

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // 2. Fetch Domain Data based on the incoming host
  const { data, error } = await supabase
    .from('domains')
    .select('*')
    .eq('name', host) 
    .single();

  const domain = data as Domain;

  if (error || !domain) {
    console.error(`Domain lookup failed for host ${host}:`, error);
    return notFound();
  }

  // 3. Render the Landing Page using the dedicated component
  return (
    <DomainLandingPage domain={domain} />
  );
}