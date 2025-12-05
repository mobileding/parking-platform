// app/dashboard/DashboardContent.tsx
'use client'; 

import LogoutButton from '@/components/LogoutButton'; 
import { Session } from '@supabase/supabase-js';

// This is where your actual dashboard UI will live
export default function DashboardContent({ session }: { session: Session }) {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-green-700">
        Welcome to Your Seller Dashboard, {session.user.email}!
      </h1>
      <p className="mt-4 text-lg text-gray-700">
        You are successfully logged in! (Client-side authenticated)
      </p>
      
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