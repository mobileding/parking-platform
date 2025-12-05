// lib/contentService.ts

import { supabase } from '@/lib/supabase'; // Adjust the path if necessary for your setup

interface DailyContent {
  id: number;
  content_type: string;
  body: string;
  reference: string | null;
  target_url: string | null;
  is_active: boolean;
}

/**
 * Fetches all active content and returns one entry at random.
 * This function should be called from a Next.js Server Component.
 */
export async function getRandomContent(): Promise<DailyContent | null> {
  const { data, error } = await supabase
    .from('daily_content')
    .select('*')
    .eq('is_active', true); // Only pull content marked as active

  if (error) {
    console.error('Error fetching daily content:', error);
    return null;
  }

  if (!data || data.length === 0) {
    return null; // Handle case where no active content is found
  }

  // Pick a random entry from the fetched array
  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex] as DailyContent;
}