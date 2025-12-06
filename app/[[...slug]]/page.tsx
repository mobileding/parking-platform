// app/[[...slug]]/page.tsx

import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import DomainLandingPage from '@/components/DomainLandingPage'; 
import PlatformHomePage from '@/components/PlatformHomePage'; 
// 💡 FIX: Changed import to lowercase 'domain' to match file casing and resolve build error
import { Domain } from '@/types/domain'; 
import { publicSupabase } from '@/utils/supabase/publicClient';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic'; 

interface DailyContent {
  id: number;
  content_type: string;
  body: string;
  reference: string | null;
  target_url: string | null;
}

// 💡 FIX: 'params' must be a Promise in Next.js 15
interface DomainPageProps {
  params: Promise<{
    slug: string[] | undefined; 
  }>;
}

async function getHostHeader() {
  const requestHeaders = await headers();
  return requestHeaders.get('host');
}

// 💡 NEW: Generate Metadata (fixes types for build)
export async function generateMetadata({ params }: DomainPageProps): Promise<Metadata> {
  const resolvedParams = await params; // Await params to satisfy Next.js
  const hostWithPort = await getHostHeader();
  if (!hostWithPort) return {};
  
  const host = hostWithPort.split(':')[0].trim();
  
  if (host === 'localhost' || host === 'iolab.com') {
      return { title: "iolab.com - Domain Parking" };
  }
  return { title: `${host} - Parked` };
}

export default async function DomainPage({ params }: DomainPageProps) {
  // 💡 FIX: Await params before using (even if we rely on headers)
  const resolvedParams = await params;

  const hostWithPort = await getHostHeader();
  
  if (!hostWithPort) {
    return notFound();
  }
  
  const host = hostWithPort.split(':')[0].trim(); 

  // ROUTING LOGIC: Check for main platform
  if (host === 'localhost' || host === 'iolab.com' || host === 'www.iolab.com') {
      return <PlatformHomePage />;
  }

  // --- Parallel Data Fetching ---
  const [domainResult, contentResult] = await Promise.all([
    publicSupabase
      .from('domains')
      .select(`
        *,
        profiles (status)
      `)
      .eq('name', host) 
      .single(),
    
    publicSupabase
      .from('daily_content')
      .select('*')
      .eq('is_active', true)
  ]);

  // Error Handling
  if (domainResult.error || !domainResult.data) {
    console.error(`Domain lookup failed for host ${host}:`, domainResult.error);
    return notFound();
  }

  const domain = domainResult.data as any; 
  const allContent = contentResult.data as DailyContent[];

  // Safety Check
  if (domain.profiles?.status && domain.profiles.status !== 'active') {
     return notFound(); 
  }

  // Select Random Content
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