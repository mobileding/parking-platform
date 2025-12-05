// app/dashboard/page.tsx

import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function DashboardPage() {
  // CRITICAL SECURITY STEP: Check the user's session on the server
  // Note: We use the auth-helpers package here because it is necessary 
  // for server-side cookie management and session validation in Next.js.
  const supabase = createServerComponentClient({ cookies });

  const { data: { session } } = await supabase.auth.getSession();

  // If there is no session, redirect the user to the login page
  if (!session) {
    redirect('/login');
  }

  // --- LOGOUT BUTTON (Temporary for testing) ---
  // You would typically put this in a separate Client Component
  const LogoutButton = () => {
    'use client';
    const handleLogout = async () => {
      const client = createServerComponentClient({ cookies }); // Re-init client side for action
      await client.auth.signOut();
      window.location.href = '/'; // Redirect to homepage after logout
    };

    return (
      <button 
        onClick={handleLogout} 
        className="text-sm text-red-600 hover:text-red-800 underline mt-4"
      >
        Log Out
      </button>
    );
  };
  // ---------------------------------------------
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-green-700">
        Welcome to Your Seller Dashboard, {session.user.email}!
      </h1>
      <p className="mt-4 text-lg text-gray-700">
        This page is secure and protected by Row-Level Security (RLS).
      </p>
      
      {/* User's domains list will go here */}
      <div className="mt-8 p-6 border rounded-lg bg-white shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Your Hosted Domains (0)</h2>
        <p className="text-gray-500">
          Domain management features (upload, edit, delete) will appear here.
        </p>
      </div>

      <LogoutButton />
    </div>
  );
}