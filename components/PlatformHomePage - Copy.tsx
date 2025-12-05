'use client';

import Link from 'next/link';

export default function PlatformHomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900">
      
      {/* Navigation / Header */}
      <header className="w-full max-w-5xl px-8 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-600">iolab</div>
        <nav className="space-x-6">
          <Link href="/login" className="text-gray-600 hover:text-indigo-600 font-medium">
            Log In
          </Link>
          <Link href="/signup" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition">
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mt-20 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
          The Premier Parking Service <br /> 
          <span className="text-indigo-600">for Christian Domains</span>
        </h1>
        
        <p className="mt-6 text-xl text-gray-500 max-w-2xl">
          Turn your unused domains into a testimony. Show daily bible verses, 
          inspirational quotes, and offer your domains for sale securely.
        </p>

        <div className="mt-10 flex gap-4">
          <Link href="/signup" className="px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-full shadow-lg hover:bg-indigo-700 transition transform hover:-translate-y-1">
            Start Parking Today
          </Link>
          <Link href="/about" className="px-8 py-4 bg-gray-100 text-gray-700 text-lg font-bold rounded-full hover:bg-gray-200 transition">
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl px-8 pb-20">
        <div className="p-6 border border-gray-100 rounded-xl shadow-sm">
          <h3 className="text-xl font-bold mb-2">📖 Daily Inspiration</h3>
          <p className="text-gray-600">Automatically display rotating Bible verses and faith-based content on your domains.</p>
        </div>
        <div className="p-6 border border-gray-100 rounded-xl shadow-sm">
          <h3 className="text-xl font-bold mb-2">🏷️ Instant Sales</h3>
          <p className="text-gray-600">Set a "Buy It Now" price and let interested buyers contact you immediately.</p>
        </div>
        <div className="p-6 border border-gray-100 rounded-xl shadow-sm">
          <h3 className="text-xl font-bold mb-2">🛡️ Secure Platform</h3>
          <p className="text-gray-600">Manage your entire portfolio from one secure dashboard protected by Supabase.</p>
        </div>
      </section>

    </main>
  );
}