'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Domain } from '@/types/Domain';

interface OfferModalProps {
  domain: Domain;
  onClose: () => void;
}

export default function OfferModal({ domain, onClose }: OfferModalProps) {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Save to Database (Lead Tracking)
    const { error: dbError } = await supabase
      .from('offers')
      .insert({
        domain_id: domain.id,
        buyer_email: email,
        offer_amount: amount ? parseFloat(amount) : null,
        message: message
      });
    
    // 2. Send Email Notification via API Route
    const response = await fetch('/api/send-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            buyerEmail: email,
            domainName: domain.name,
            offerAmount: amount,
        })
    });

    if (dbError || !response.ok) {
      console.error(dbError || await response.json());
      setStatus('error');
    } else {
      setStatus('success');
    }
    setLoading(false);
  };

  if (status === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-fade-in-up">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Offer Sent!</h3>
          <p className="text-gray-600 mb-6">The owner has been notified. They will contact you directly at {email}.</p>
          <button onClick={onClose} className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">Make an offer for {domain.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
            <input 
              type="email" 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Offer Amount (USD)</label>
            <input 
              type="number" 
              required 
              placeholder={domain.list_price ? `Asking: $${domain.list_price}` : "Enter amount"}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
            <textarea 
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition transform active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Offer'}
          </button>
        </form>
      </div>
    </div>
  );
}