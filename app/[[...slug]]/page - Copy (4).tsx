// app/[[...slug]]/page.tsx

import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js'; 
import DomainLandingPage from '@/components/DomainLandingPage'; 
import PlatformHomePage from '@/components/PlatformHomePage'; 
import { Domain } from '@/types/Domain'; 
import { Metadata } from 'next'; // 💡 Import Metadata type

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

// Helper to safely get host header
async function getHostHeader() {
  const requestHeaders = await headers();
  return requestHeaders.get('host');
}

// 💡 NEW: Generate Dynamic Metadata (Page Title)
export async function generateMetadata({ params }: DomainPageProps): Promise<Metadata> {
  const hostWithPort = await getHostHeader();
  
  if (!hostWithPort) return {};

  const host = hostWithPort.split(':')[0];

  // 1. Check for Main Platform
  if (host === 'localhost' || host === 'iolab.com' || host === 'www.iolab.com') {
      return {
          title: "iolab.com - The Premier Christian Domain Parking Service",
          description: "Turn your unused domains into a testimony."
      };
  }

  // 2. Set Parked Domain Title
  return {
      title: `${host} parking by iolab.com`,
      description: `This domain ${host} is securely parked and hosted by iolab.com.`
  };
}

export default async function DomainPage({ params }: DomainPageProps) {
  
  const hostWithPort = await getHostHeader();
  
  if (!hostWithPort) {
    return notFound();
  }
  
  const host = hostWithPort.split(':')[0]; 

  // 2. ROUTING LOGIC: Check for main platform
  if (host === 'localhost' || host === 'iolab.com' || host === 'www.iolab.com') {
      return <PlatformHomePage />;
  }

  // --- Supabase Initialization ---
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

 // 1. Fetch Domain AND Owner Profile
  const { data: domainData, error } = await supabase
    .from('domains')
    .select(`
      *,
      profiles (
        status
      )
    `)
    .eq('name', host)
    .single();

    
    // Query 2: Fetch All Active Daily Content
    supabase
      .from('daily_content')
      .select('*')
      .eq('is_active', true)
  ]);

  const domain = domainResult.data as Domain;
  const allContent = contentResult.data as DailyContent[];


// 2. Check if Domain Exists AND Owner is Active
  if (error || !domain) {
    return notFound();
  }

  // SAFETY CHECK: If owner is disabled, treat domain as 404 or Parked by Platform

  if (domain.profiles?.status !== 'active') {
     // Option A: Return 404 (Domain vanishes)
     return notFound();
     
     // Option B: Show a generic "This domain is suspended" page
     // return <SuspendedPage />;
  }

  // Check if domain exists
  if (domainResult.error || !domain) {
    console.error(`Domain lookup failed for host ${host}:`, domainResult.error);
    return notFound();
  }

  let randomContent: DailyContent | null = null;
  if (allContent && allContent.length > 0) {
    const randomIndex = Math.floor(Math.random() * allContent.length);
    randomContent = allContent[randomIndex];
  }

  return (
    <DomainLandingPage 
      domain={domain} 
      dailyContent={randomContent} 
    />
  );
}