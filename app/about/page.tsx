// app/about/page.tsx (FIXED to Prevent Prerender Error)

import PlatformHomePage from '@/components/PlatformHomePage';

// 💡 CRITICAL FIX: Force dynamic rendering. 
// This tells Next.js to skip static generation and render this page on demand,
// preventing the conflict with the client-side code in SignInForm.tsx.
export const dynamic = 'force-dynamic'; 

export default function AboutPage() {
  return <PlatformHomePage />;
}