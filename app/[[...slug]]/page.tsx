// app/[[...slug]]/page.tsx

import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import DomainLandingPage from '@/components/DomainLandingPage'; 
import PlatformHomePage from '@/components/PlatformHomePage'; 
import { Domain } from '@/types/domain'; 
import { getPublicSupabaseClient } from '@/utils/supabase/publicClient'; // 💡 Using the new public client utility
import { Metadata } from 'next';

// Ensures the page is rendered dynamically on the server for every request.
export const dynamic = 'force-dynamic'; 

export interface DailyContent {
  id: number;
  content_type: string;
  body: string;
  reference: string | null;
  target_url: string | null;
}

interface DomainPageProps {
  params: {
    slug: string[] | undefined; 
  };
}

async function getHostHeader() {
  const requestHeaders = await headers();
  return requestHeaders.get('host');
}

// Generate Metadata (runs on the server)
export async function generateMetadata({ params }: DomainPageProps): Promise<Metadata> {
  const hostWithPort = await getHostHeader();
  if (!hostWithPort) return {};
  
  const host = hostWithPort.split(':')[0].trim();
  
  if (host === 'localhost' || host === 'iolab.com') {
      return { title: "iolab.com - Domain Parking" };
  }
  return { title: `${host} parking by iolab.com` };
}

export default async function DomainPage({ params }: DomainPageProps) {
  
  const hostWithPort = await getHostHeader();
  
  if (!hostWithPort) {
    return notFound();
  }
  
  const host = hostWithPort.split(':')[0].trim(); 

  // ROUTING LOGIC: Check for main platform
  if (host === 'localhost' || host === 'iolab.com' || host === 'www.iolab.com') {
      return <PlatformHomePage />;
  }

  // --- Supabase Initialization (FIXED) ---
  // Call the function to get the client, ensuring ENV vars are loaded.
  const supabase = getPublicSupabaseClient();

  // --- Parallel Data Fetching ---
  const [domainResult, contentResult] = await Promise.all([
    // Query 1: Fetch Domain Data (Public Read)
    supabase
      .from('domains')
      .select(`
        *,
        profiles (status)
      `)
      .eq('name', host) 
      .single(),
    
    // Query 2: Fetch All Active Daily Content (Public Read)
    supabase
      .from('daily_content')
      .select('*')
      .eq('is_active', true)
  ]);

  // --- Error Handling and Data Extraction ---
  
  // 1. Check if Domain Record was found (This is the section that was failing)
  if (domainResult.error || !domainResult.data) {
    console.error(`Domain lookup failed for host ${host}:`, domainResult.error);
    
    // TEMPORARY DIAGNOSTIC: Display the name it failed on instead of 404
    return (
        <div className="text-center p-20">
            <h1>DOMAIN NOT FOUND</h1>
            <p>The application failed to find a record named: <strong>{host}</strong> in the database.</p>
            <p className="mt-4">Please verify the name in the Supabase Table Editor matches this exactly.</p>
        </div>
    );
  }

  const domain = domainResult.data as any; 
  const allContent = contentResult.data as DailyContent[];

  // 2. SAFETY CHECK: If owner is disabled, hide the domain
  if (domain.profiles?.status && domain.profiles.status !== 'active') {
     return notFound(); 
  }

  // 3. Select Random Content
  let randomContent: DailyContent | null = null;
  if (allContent && allContent.length > 0) {
    const randomIndex = Math.floor(Math.random() * allContent.length);
    randomContent = allContent[randomIndex];
  }

  // 4. Render the Landing Page
  return (
    <DomainLandingPage 
      domain={domain} 
      dailyContent={randomContent} 
    />
  );
}