'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans">
      
      {/* --- Navigation --- */}
      <header className="w-full max-w-6xl mx-auto px-8 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-800 transition">
          iolab
        </Link>
        <nav className="space-x-6">
          <Link href="/login" className="text-gray-600 hover:text-indigo-600 font-medium">
            Log In
          </Link>
          <Link href="/signup" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition">
            Sign Up
          </Link>
        </nav>
      </header>

      {/* --- Hero Section --- */}
      <section className="py-20 px-6 text-center bg-gradient-to-b from-white to-gray-50">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
          Parking with <span className="text-indigo-600">Purpose</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Most domain parking pages are cluttered with spam and ads. 
          We turn your unused digital real estate into a source of daily inspiration 
          while helping you find the right buyer securely.
        </p>
      </section>

      {/* --- Features / Benefits --- */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Feature 1 */}
        <div className="space-y-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 text-2xl">
            📖
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Daily Inspiration</h3>
          <p className="text-gray-600">
            Instead of generic ads, visitors to your domains are greeted with 
            rotating Bible verses and uplifting quotes, adding value to their day.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="space-y-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-2xl">
            🏷️
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Secure Sales</h3>
          <p className="text-gray-600">
            List your domains with a "Buy It Now" price. Buyers can submit offers 
            directly through a secure form, protecting your personal email from spam.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="space-y-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 text-2xl">
            ⚡
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Easy Management</h3>
          <p className="text-gray-600">
            Manage your entire portfolio from one dashboard. Bulk upload hundreds 
            of domains via CSV and update prices instantly.
          </p>
        </div>
      </section>

      {/* --- How It Works --- */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <span className="text-indigo-400 font-bold text-lg">Step 1</span>
              <h4 className="text-xl font-bold mt-2 mb-3">Create Account</h4>
              <p className="text-gray-400">Sign up in seconds and access your secure seller dashboard.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <span className="text-indigo-400 font-bold text-lg">Step 2</span>
              <h4 className="text-xl font-bold mt-2 mb-3">Add Domains</h4>
              <p className="text-gray-400">Upload your domains and point your nameservers to us.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <span className="text-indigo-400 font-bold text-lg">Step 3</span>
              <h4 className="text-xl font-bold mt-2 mb-3">Go Live</h4>
              <p className="text-gray-400">Your domains instantly show beautiful landing pages.</p>
            </div>
          </div>

          <div className="mt-16">
            <Link href="/signup" className="inline-block px-8 py-4 bg-white text-gray-900 text-lg font-bold rounded-full hover:bg-gray-100 transition transform hover:-translate-y-1">
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-100">
        <p>© {new Date().getFullYear()} iolab.com. All rights reserved.</p>
      </footer>

    </main>
  );
}