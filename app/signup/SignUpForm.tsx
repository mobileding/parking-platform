// app/signup/SignUpForm.tsx
'use client';

// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  
  // Important: Use the Client Component Supabase helper
  // const supabase = createClientComponentClient();
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // --- 1. Email/Password Sign Up ---
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Signing up...');
    
    // Supabase sign-up method
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`, // Set redirect URL
      },
    });

    if (error) {
      setMessage(`Sign up failed: ${error.message}`);
    } else {
      setMessage('Success! Check your email to confirm your account.');
    }
  };

  // --- 2. Google OAuth Sign Up ---
  const handleGoogleSignIn = async () => {
    setMessage('Redirecting to Google...');
    
    // Supabase OAuth sign-in method
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`, // Set redirect URL
      },
    });

    if (error) {
      setMessage(`Google sign-in failed: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      {/* --- Email and Password Fields --- */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" text-gray-900"
        />
      </div>
      
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Sign Up with Email
      </button>

      {/* --- Divider --- */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">
            OR
          </span>
        </div>
      </div>

      {/* --- Google Sign Up Button --- */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path fill="#FFC107" d="M43.6 20.4H24v7.2h11.7c-.5 2.9-2.3 5.4-4.8 7.1l-6.2 4.8c3.8 3.5 8.7 5.5 13.9 5.5 8.4 0 15.6-5.6 15.6-15.6 0-1.1-.1-2.2-.3-3.2z"/><path fill="#FF3D00" d="M24 8c3.2 0 6.2 1.2 8.5 3.3l5.3-5.3c-4.6-4.3-10.7-6.7-17.8-6.7-8.7 0-16 4.3-20.4 11.2l6.2 4.8c2.4-1.5 5.2-2.3 8.2-2.3z"/><path fill="#4CAF50" d="M4.1 24c0-1.6.2-3.1.5-4.6l-6.2-4.8c-.8 3.1-1.2 6.5-1.2 10.4 0 7.2 2.6 13.7 6.8 18.5l6.2-4.8c-2.2-3.3-3.4-7.3-3.4-11.7z"/><path fill="#1976D2" d="M43.6 20.4H24v7.2h11.7c-.5 2.9-2.3 5.4-4.8 7.1l-6.2 4.8c3.8 3.5 8.7 5.5 13.9 5.5 8.4 0 15.6-5.6 15.6-15.6 0-1.1-.1-2.2-.3-3.2z"/></svg>
        Sign Up with Google
      </button>

      {/* --- Message Display --- */}
      {message && (
        <p className={`text-center text-sm ${message.includes('Success') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </form>
  );
}