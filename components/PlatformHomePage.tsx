'use client';

import Link from 'next/link';
import { useState } from 'react';
import SignInForm from '@/app/login/SignInForm'; 

// 💡 Manual list of domains to showcase
const FEATURED_DOMAINS = [
  { name: "ecoproduct.org", status: "For Sale" },
  { name: "testdomain.local", status: "For Sale" },
  { name: "dailyverse.net", status: "Parked" },
  { name: "scripture.io", status: "Sold" },
  { name: "kingdom.com", status: "For Sale" },
];

export default function PlatformHomePage() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Styles for the infinite scrolling animation */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      {/* --- Navigation --- */}
      <header className="w-full max-w-6xl mx-auto px-8 py-6 flex justify-between items-center relative z-50">
        <Link href="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-800 transition">
          iolab
        </Link>
        <nav className="flex items-center gap-6">
          
          {/* Expanding Login Button Container */}
          <div className="relative">
            <button 
              onClick={() => setShowLogin(!showLogin)}
              className={`font-medium transition flex items-center gap-1 ${showLogin ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
            >
              Log In
              <span className={`text-xs transform transition-transform duration-300 ${showLogin ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {/* The Expanding Login Panel */}
            <div 
              className={`absolute right-0 top-full mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out origin-top-right
              ${showLogin ? 'max-h-[500px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none'}`}
            >
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Welcome Back</h3>
                <SignInForm />
              </div>
            </div>
          </div>

          <Link href="/signup" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition">
            Sign Up
          </Link>
        </nav>
      </header>

      {/* --- Hero Section --- */}
      <section className="pt-20 pb-12 px-6 text-center bg-gradient-to-b from-white to-gray-50">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
          Parking with <span className="text-indigo-600">Purpose</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Most domain parking pages are cluttered with spam and ads. 
          We turn your unused digital real estate into a source of daily inspiration 
          while helping you find the right buyer securely.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link href="/signup" className="px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-full shadow-lg hover:bg-indigo-700 transition transform hover:-translate-y-1">
            Start Parking Today
          </Link>
          <a href="#features" className="px-8 py-4 bg-white border border-gray-200 text-gray-700 text-lg font-bold rounded-full hover:bg-gray-50 transition">
            Learn More
          </a>
        </div>
      </section>

      {/* --- 💡 NEW: Live Domain Showcase (Infinite Marquee) --- */}
      <section className="border-y border-gray-100 bg-gray-50/50 py-10 overflow-hidden">
        <div className="max-w-full">
            <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                Recently Parked Domains
            </p>
            
            {/* Marquee Container */}
            <div className="relative w-full overflow-hidden group">
                {/* Gradient Masks for smooth fade effect on sides */}
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

                {/* The Scrolling Track */}
                <div className="flex gap-6 animate-marquee w-max hover:[animation-play-state:paused]">
                    {/* We render the list twice to create the seamless loop effect */}
                    {[...FEATURED_DOMAINS, ...FEATURED_DOMAINS, ...FEATURED_DOMAINS].map((item, index) => (
                        <a 
                            key={`${item.name}-${index}`}
                            href={`http://${item.name}:3000`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-shrink-0 bg-white px-6 py-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 min-w-[220px]"
                        >
                            <div className="flex flex-col items-start">
                                <span className="font-bold text-gray-800 group-hover:text-indigo-600 transition">
                                    {item.name}
                                </span>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`w-2 h-2 rounded-full ${item.status === 'For Sale' ? 'bg-green-500' : item.status === 'Sold' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* --- Features / Benefits --- */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 scroll-mt-20">
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
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition">
              <span className="text-indigo-400 font-bold text-lg">Step 1</span>
              <h4 className="text-xl font-bold mt-2 mb-3">Create Account</h4>
              <p className="text-gray-400">Sign up in seconds and access your secure seller dashboard.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition">
              <span className="text-indigo-400 font-bold text-lg">Step 2</span>
              <h4 className="text-xl font-bold mt-2 mb-3">Add Domains</h4>
              <p className="text-gray-400">Upload your domains and point your nameservers to us.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition">
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