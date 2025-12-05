'use client';

import { useState, useEffect, useMemo } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';

// Define the required interface for the Domain (for prop typing)
interface Domain {
  id: number;
  name: string;
}

// Define the Offer data structure
interface Offer {
  id: number;
  buyer_email: string;
  offer_amount: number | null;
  message: string;
  created_at: string;
}

interface OffersListModalProps {
  domain: Domain;
  supabase: SupabaseClient;
  onClose: () => void;
}

export default function OffersListModal({ domain, supabase, onClose }: OffersListModalProps) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch offers for this specific domain
  const fetchOffers = async () => {
    setLoading(true);
    
    // RLS policy for offers ensures only the owner can see this data
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('domain_id', domain.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching offers:', error);
      alert('Failed to load offers. Check console.');
      setOffers([]);
    } else {
      setOffers(data as Offer[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOffers();
  }, [domain.id]); // Re-fetch if the domain changes

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="px-6 py-4 bg-indigo-50 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-indigo-800">Offers for: {domain.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="text-center p-8">Loading offers...</div>
          ) : offers.length === 0 ? (
            <div className="text-center p-8 text-gray-500">No offers have been submitted yet.</div>
          ) : (
            <div className="space-y-4">
              {offers.map((offer) => (
                <div key={offer.id} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-gray-800">
                      Offer: <span className="text-green-700">{offer.offer_amount ? `$${offer.offer_amount.toLocaleString()}` : 'N/A'}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(offer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm mt-1">
                    Buyer: <span className="font-medium text-indigo-600">{offer.buyer_email}</span>
                  </p>
                  {offer.message && (
                    <blockquote className="mt-2 text-sm italic border-l-2 pl-3 text-gray-700">
                        "{offer.message}"
                    </blockquote>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t text-right">
            <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm font-medium hover:bg-gray-50">Close</button>
        </div>
      </div>
    </div>
  );
}