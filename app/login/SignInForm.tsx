// app/login/SignInForm.tsx
'use client';

// Note: Ensure you have installed @supabase/supabase-js
import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';
import { useMemo } from 'react'; // Make sure you import useMemo!
import { useRouter } from 'next/navigation';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  
  // Initialize the client using createClient
// REPLACE THE PREVIOUS CREATION WITH THIS:
const supabase = useMemo(() => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}, []); // 💡 CRITICAL: Empty dependency array ensures it runs only once.



  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Logging in...');
    
    // Supabase sign-in method: signInWithPassword
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // General error message for security
      setMessage(`Login failed: Invalid credentials or network error.`); 
    } else {
      // On success, redirect the user to the dashboard
      router.refresh(); // Refresh the page to update the session
      router.push('/dashboard'); // Redirect to the secure dashboard page
    }
  };

  // Note: We're skipping the Google button here for simplicity,
  // but you can add handleGoogleSignIn from the Sign Up form later!

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
        />
      </div>
      
      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
        />
      </div>
      
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Log In
      </button>

      {/* Message Display */}
      {message && (
        <p className={`text-center text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </form>
  );
}