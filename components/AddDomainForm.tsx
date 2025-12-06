// components/AddDomainForm.tsx (Final Stable Structure)
'use client';

// 💡 FIX 1: Remove unused import for createClient and useMemo
import { SupabaseClient, Session } from '@supabase/supabase-js'; 
import { useState } from 'react'; 
// import { useMemo } from 'react'; // REMOVE

interface AddDomainFormProps {
    onDomainAdded: () => void;
    session: Session; 
    supabase: SupabaseClient; // This client is received via props
}

export default function AddDomainForm({ onDomainAdded, session, supabase }: AddDomainFormProps) {
    const [name, setName] = useState('');
    const [listPrice, setListPrice] = useState<string>('');
    const [isForSale, setIsForSale] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // ❌ DELETE ALL internal client creation logic here (it's gone now)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (!name) {
            setMessage('Error: Domain name is required.');
            setLoading(false);
            return;
        }

        try {
            // FIX 2: Use the session prop directly (no getSession() call needed)
            const userId = session.user.id;

            if (!userId) {
                setMessage('Error: User must be logged in to add domains.');
                setLoading(false);
                return;
            }

            const domainData = {
                owner_id: userId,
                name: name.trim(),
                list_price: listPrice ? parseFloat(listPrice) : null,
                is_for_sale: isForSale,
                landing_page_type: 'default_inspiration', 
            };
            
            // --- Stage 1: Reset UI quickly (Guaranteed Reset) ---
            await new Promise(resolve => setTimeout(resolve, 100));
            setLoading(false); // UNFREEZE THE BUTTON IMMEDIATELY
            setMessage('Processing in background...');

            // Stage 2: Database Write uses the PASSED supabase client
            const { error: dbError } = await supabase
                .from('domains')
                .insert(domainData);

            if (dbError) {
                console.error('Domain Insertion Error:', dbError);
                setMessage(`DB Error: ${dbError.message}.`);
            } else {
                 // --- 2. CALL VERCEL API ---
                const vercelRes = await fetch('/api/add-domain', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ domain: name }),
                });
                
                if (!vercelRes.ok) {
                    setMessage('Saved to DB, but Vercel config failed. Contact support.');
                } else {
                    setMessage(`Success! "${name}" is now live.`);
                }
            
                // --- 3. UI Cleanup (Existing Code) ---
                if (onDomainAdded) {
                    onDomainAdded();
                }
                setName('');
                setListPrice('');
                setIsForSale(true);
            }

        } catch (e) {
            console.error('An unexpected error occurred:', e);
            setMessage('An unexpected error occurred.');
            setLoading(false);
        }
    };

    return (
        // ... JSX remains the same ...
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-gray-50 rounded-lg border">
            <h3 className="text-xl font-semibold text-gray-800">Add New Domain</h3>
            
            {/* Input fields */}
            {/* ... */}
            
            <button
                type="submit"
                disabled={loading || !name} 
                className="w-full justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
                {loading ? 'Adding...' : 'Add Domain to Inventory'}
            </button>

            {/* Message Display */}
            {message && (
                <p className={`text-center text-sm ${message.includes('Success') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                </p>
            )}
        </form>
    );
}