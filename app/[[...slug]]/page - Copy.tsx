// app/[[...slug]]/page.tsx

import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js'; 
import DomainLandingPage from '@/components/DomainLandingPage'; 
import { Domain } from '@/types/Domain'; // Using the centralized type

interface DomainPageProps {
  // The 'slug' parameter will be an array: [] for root, or ['path'] for nested paths
  params: {
    slug: string[] | undefined; 
  };
}

export default async function DomainPage({ params }: DomainPageProps) {
  
  const hostWithPort = headers().get('host'); 
  
  if (!hostWithPort) {
    // If no host header is present, we can't look up a domain
    return notFound();
  }
  
  // 1. STRIP PORT: Ensure we query the database only with the domain name
  const host = hostWithPort.split(':')[0]; 

  // Check if we are on the primary domain. If so, you might redirect to dashboard or a marketing site.
  // We'll skip this check for now to allow local testing of 'localhost' as a parked domain.
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // 2. Fetch Domain Data based on the incoming host
  const { data, error } = await supabase
    .from('domains')
    .select('*')
    // CRITICAL: Queries the table with 'testdomain.local' or 'localhost'
    .eq('name', host) 
    .single();

  const domain = data as Domain;

  if (error || !domain) {
    // If the domain is not found in the database, show the standard 404/Not Found page
    console.error(`Domain lookup failed for host ${host}:`, error);
    return notFound();
  }

  // 3. Render the Landing Page using the dedicated component
  return (
    <DomainLandingPage domain={domain} />
  );
}