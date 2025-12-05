// components/DomainLandingPage.tsx

'use client'; 

// 💡 NEW: Import the Domain interface from your centralized types file
import { Domain } from '@/types/Domain'; 

// REMOVE/DELETE:
/*
interface Domain {
    id: number;
    name: string;
    list_price: number | null;
    is_for_sale: boolean;
    landing_page_type: string;
}
*/

interface DomainLandingPageProps {
    domain: Domain; // This now uses the imported Domain type
}

export default function DomainLandingPage({ domain }: DomainLandingPageProps) {

    // Determine the page status and primary message
    const statusMessage = domain.is_for_sale 
        ? "This premium domain is available for immediate purchase." 
        : "This domain is currently parked and not actively listed for sale.";

    const statusColor = domain.is_for_sale ? "text-green-700" : "text-yellow-700";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
            <div className="bg-white p-12 rounded-2xl shadow-2xl text-center max-w-2xl w-full">
                
                <h1 className="text-6xl font-extrabold text-gray-900 leading-tight">
                    {domain.name}
                </h1>
                
                <p className={`mt-6 text-xl font-semibold ${statusColor}`}>
                    {statusMessage}
                </p>

                {/* --- For Sale Template --- */}
                {domain.is_for_sale && (
                    <div className="mt-8 p-6 bg-green-50 border-t-4 border-green-500 rounded-lg">
                        {domain.list_price && (
                            <>
                                <p className="text-xl text-green-800">Asking Price:</p>
                                <p className="text-5xl font-black text-green-600 mt-1">
                                    ${domain.list_price.toFixed(2)}
                                </p>
                            </>
                        )}
                        <p className="mt-4 text-gray-600">
                            To inquire about purchasing this domain, please contact us.
                        </p>
                        <button className="mt-4 px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150">
                            Inquire About Purchase
                        </button>
                    </div>
                )}
                
                {/* --- Parked/Holding Template --- */}
                {!domain.is_for_sale && (
                    <div className="mt-8 p-6 bg-yellow-50 border-t-4 border-yellow-500 rounded-lg">
                        <p className="text-lg text-gray-600">
                            This domain is reserved by our portfolio. Please check back later.
                        </p>
                    </div>
                )}

                <footer className="mt-12 text-sm text-gray-400 border-t pt-4">
                    Powered by Your Domain Parking Service | Template: {domain.landing_page_type}
                </footer>
            </div>
        </div>
    );
}