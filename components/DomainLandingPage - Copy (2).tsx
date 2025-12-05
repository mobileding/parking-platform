// components/DomainLandingPage.tsx

'use client'; 

import { Domain } from '@/types/Domain'; 
import { useState, useEffect } from 'react';

// We define the interface locally here or import it if you prefer
interface DailyContent {
  id: number;
  content_type: string;
  body: string;
  reference: string | null;
  target_url: string | null;
}

interface DomainLandingPageProps {
    domain: Domain;
    dailyContent: DailyContent | null; // <--- Receiving the content
}

const BACKGROUNDS = [
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1495616811223-4d98c6e9d869?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504893524553-bde922908176?q=80&w=2071&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519681393798-38e43269d877?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501183007906-29a18b95b269?q=80&w=2070&auto=format&fit=crop",
];

export default function DomainLandingPage({ domain, dailyContent }: DomainLandingPageProps) {
    const [bgImage, setBgImage] = useState("");

useEffect(() => {
        if (!domain?.name) return; // Guard clause
        const charCodeSum = domain.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const index = charCodeSum % BACKGROUNDS.length;
        setBgImage(BACKGROUNDS[index]);
    }, [domain.name]);

    return (
       <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden bg-gray-900">
            
            {/* 2. Background Image Layer */}
            {bgImage && (
                <div 
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `url(${bgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                />
            )}
            {/* Dark Overlay */}
<div className="absolute inset-0 z-10 bg-black/50" />

            {/* Content Container */}
            <div className="relative z-20 max-w-4xl w-full text-center flex flex-col items-center gap-12">
                
                {/* --- 📖 Dynamic Inspiration Section --- */}
                {dailyContent ? (
                    <div className="text-white animate-fade-in-up max-w-3xl">
                        {dailyContent.content_type === 'Banner Ad' && dailyContent.target_url ? (
                            // Render as Clickable Banner
                            <a 
                                href={dailyContent.target_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-6 bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition transform hover:scale-105"
                            >
                                <h2 className="text-2xl font-bold mb-2">{dailyContent.body}</h2>
                                <p className="text-sm text-blue-200 underline decoration-blue-200">Learn More</p>
                            </a>
                        ) : (
                            // Render as Verse/Quote
                            <>
                                <blockquote className="text-2xl md:text-5xl font-serif leading-tight italic drop-shadow-2xl text-shadow-lg">
                                    "{dailyContent.body}"
                                </blockquote>
                                {dailyContent.reference && (
                                    <p className="mt-6 text-xl font-medium text-blue-200 tracking-wide">
                                        — {dailyContent.reference}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    // Fallback if database is empty
                    <div className="text-white">
                        <p className="text-xl italic">"Faith is the substance of things hoped for..."</p>
                    </div>
                )}

                {/* --- 🌐 Domain Status Card --- */}
                <div className="bg-white/95 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl mx-auto w-full max-w-lg border border-white/40">
                    <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2 break-all">
                        {domain.name}
                    </h1>
                    
                    <div className="mt-4 inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-gray-100 text-gray-600 uppercase tracking-wider">
                        {domain.is_for_sale ? 'Available for Purchase' : 'Parked Domain'}
                    </div>

                    {domain.is_for_sale && domain.list_price && (
                        <div className="mt-8">
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Buy It Now Price</p>
                            <p className="text-5xl font-black text-green-700 mt-2">
                                ${domain.list_price.toFixed(2)}
                            </p>
                            
                            <button className="mt-8 w-full px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg font-bold rounded-xl shadow-lg transition transform hover:-translate-y-1 active:scale-95">
                                Make an Offer
                            </button>
                        </div>
                    )}
                    
                    {!domain.is_for_sale && (
                         <p className="mt-8 text-gray-600 italic">
                             This domain is securely hosted by iolab.
                         </p>
                    )}
                </div>

                <footer className="mt-auto text-white/60 text-sm font-light">
                    <p>Powered by iolab • The Christian Domain Network</p>
                </footer>
            </div>
        </div>
    );
}