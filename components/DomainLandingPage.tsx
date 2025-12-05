// components/DomainLandingPage.tsx

'use client'; 

import { Domain } from '@/types/Domain'; 
import { useState, useEffect } from 'react';
import OfferModal from '@/components/OfferModal'; // 💡 Import the modal

// Define the DailyContent interface locally (used for props)
interface DailyContent {
  id: number;
  content_type: string;
  body: string;
  reference: string | null;
  target_url: string | null;
}

const BACKGROUNDS = [
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=2000&q=80", 
  "https://images.unsplash.com/photo-1495616811223-4d98c6e9d869?auto=format&fit=crop&w=2000&q=80", 
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=2000&q=80", 
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80", 
  "https://images.unsplash.com/photo-1501183007906-29a18b95b269?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2000&q=80"
];

interface DomainLandingPageProps {
    domain: Domain;
    dailyContent?: DailyContent | null;
}

export default function DomainLandingPage({ domain, dailyContent }: DomainLandingPageProps) {
    // 💡 State Management
    const [bgImage, setBgImage] = useState(BACKGROUNDS[0]);
    const [showPrice, setShowPrice] = useState(false); // State to toggle price visibility
    const [showOfferModal, setShowOfferModal] = useState(false); // State for modal

    // Deterministic/Random Background Logic
    useEffect(() => {
        const charCodeSum = domain.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const index = charCodeSum % BACKGROUNDS.length;
        setBgImage(BACKGROUNDS[index]);
    }, [domain.name]);

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden bg-gray-900 font-sans">
            
            {/* Background Image Layer */}
            <img 
                src={bgImage}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 transition-opacity duration-1000"
            />
            {/* Dark Overlay (Subtle Blur/Transparency) */}
            <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[2px]" />

            {/* Content Container */}
            <div className="relative z-20 max-w-4xl w-full text-center flex flex-col items-center gap-16">
                
                {/* --- 📖 Dynamic Inspiration Section --- */}
                {dailyContent ? (
                    <div className="text-white animate-fade-in-up max-w-3xl drop-shadow-xl">
                         {/* Banner Ad Rendering */}
                        {dailyContent.content_type === 'Banner Ad' && dailyContent.target_url ? (
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
                            // Verse/Quote Rendering
                            <>
                                <blockquote className="text-2xl md:text-5xl font-serif leading-tight italic drop-shadow-2xl text-shadow-lg">
                                    "{dailyContent.body}"
                                </blockquote>
                                {dailyContent.reference && (
                                    <p className="mt-8 text-xl md:text-2xl font-medium text-white/80 tracking-wider uppercase">
                                        — {dailyContent.reference}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                     <div className="text-white/70"><p className="text-xl italic">"Faith is the substance of things hoped for..."</p></div>
                )}

                {/* --- 🌐 Minimal Domain Card --- */}
                <div className="mt-auto flex flex-col items-center gap-4">
                    <h1 className="text-2xl md:text-4xl font-bold text-white tracking-widest uppercase opacity-90 drop-shadow-md">
                        {domain.name}
                    </h1>
                    
                    {/* 💡 The New "Subtle" Price Button */}
                    {domain.is_for_sale && (
                        <div className="flex flex-col items-center">
                            {/* Toggle Button */}
                            <button 
                                onClick={() => setShowPrice(!showPrice)}
                                className="group flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white transition-all duration-300"
                            >
                                <span className="text-sm font-semibold uppercase tracking-wider">
                                    {showPrice ? "Hide Price Details" : "Available for Purchase"}
                                </span>
                                <span className={`transform transition-transform duration-300 ${showPrice ? 'rotate-180' : ''}`}>
                                    ↓
                                </span>
                            </button>

                            {/* 💡 Expandable Price/Offer Section */}
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showPrice ? 'max-h-48 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                                <div className="flex flex-col items-center p-6 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10">
                                    {domain.list_price && (
                                        <>
                                            <p className="text-xl font-light text-white mb-2">
                                                Asking Price:
                                            </p>
                                            <p className="text-5xl font-black text-green-400 mt-1">
                                                ${domain.list_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </p>
                                        </>
                                    )}
                                    <button 
                                        onClick={() => setShowOfferModal(true)}
                                        className="mt-6 px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition shadow-lg active:scale-95"
                                    >
                                        Make an Offer
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Parked/Holding Message */}
                    {!domain.is_for_sale && (
                         <p className="mt-8 text-white/70 italic text-lg">
                             This domain is securely hosted by iolab.
                         </p>
                    )}
                </div>
            </div>
            
            {/* Modal Renderer */}
            {showOfferModal && (
                <OfferModal 
                    domain={domain} 
                    onClose={() => setShowOfferModal(false)} 
                />
            )}
<footer className="absolute bottom-0 w-full z-40"> {/* Ensure it's above the overlay (z-20) */}
    <div className="bg-gray-900/80 backdrop-blur-md py-3 text-center">
        <p className="text-white text-sm font-medium tracking-wide">
            Powered by iolab.com • The Christian Domain Network
        </p>
    </div>
</footer>
        </div>
    );
}