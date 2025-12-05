
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js'; 
import DomainLandingPage from '@/components/DomainLandingPage'; 
import PlatformHomePage from '@/components/PlatformHomePage'; 
import { Domain } from '@/types/Domain'; 

// Ensures dynamic rendering for every request (required for Host header)
export const dynamic = 'force-dynamic'; 

// Define the shape of your Daily Content
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

export default async function DomainPage({ params }: DomainPageProps) {
  
  const hostWithPort = await getHostHeader();
  
  if (!hostWithPort) {
    return notFound();
  }
  
  // 1. STRIP PORT
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

  // --- Parallel Data Fetching ---
  const [domainResult, contentResult] = await Promise.all([
    // Query 1: Fetch Domain Data
    supabase
      .from('domains')
      .select('*')
      .eq('name', host) 
      .single(),
    
    // Query 2: Fetch All Active Daily Content
    supabase
      .from('daily_content')
      .select('*')
      .eq('is_active', true)
  ]);

  const domain = domainResult.data as Domain;
  const allContent = contentResult.data as DailyContent[];

  // Check if domain exists
  if (domainResult.error || !domain) {
    console.error(`Domain lookup failed for host ${host}:`, domainResult.error);
    return notFound();
  }

  // Select a random item from the content array
  let randomContent: DailyContent | null = null;
  if (allContent && allContent.length > 0) {
    const randomIndex = Math.floor(Math.random() * allContent.length);
    randomContent = allContent[randomIndex];
  }

  // 3. Render the Landing Page with BOTH pieces of data
  return (
    <DomainLandingPage 
      domain={domain} 
      dailyContent={randomContent} 
    />
  );
}