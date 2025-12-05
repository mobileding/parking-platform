// components/AddDomainForm.tsx (Complete and Restored Code)
'use client';

import { createClient } from '@supabase/supabase-js';
import { useState, useMemo } from 'react'; // <-- Ensure useMemo is imported

// Define the expected props
interface AddDomainFormProps {
  onDomainAdded: () => void;
}

export default function AddDomainForm({ onDomainAdded }: AddDomainFormProps) {
  const [name, setName] = useState('');
  const [listPrice, setListPrice] = useState<string>('');
  const [isForSale, setIsForSale] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Use useMemo for Supabase client stability
  const supabase = useMemo(() => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }, []); // Empty array ensures client is created only once

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
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user.id;

        if (!userId) {
            setMessage('Error: User must be logged in to add domains.');
            return;
        }

        const domainData = {
            owner_id: userId,
            name: name,
            // Convert listPrice string to a number (or null if blank)
            list_price: listPrice ? parseFloat(listPrice) : null,
            is_for_sale: isForSale,
            landing_page_type: 'default_inspiration', 
        };

        // Supabase INSERT command
        const { error } = await supabase
            .from('domains')
            .insert(domainData);

        if (error) {
            console.error('Domain Insertion Error:', error);
            setMessage(`Error adding domain: ${error.message}. Check browser console for details.`);
        } else {
            setMessage(`Success! Domain "${name}" added.`);
            onDomainAdded();
            setName('');
            setListPrice('');
            setIsForSale(true);
        }
    } catch (err) {
        console.error('An unexpected error occurred:', err);
        setMessage('An unexpected network error occurred. Check console.');
    } finally {
        // CRITICAL: Always turn off loading state
        setLoading(false); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-gray-50 rounded-lg border">
      <h3 className="text-xl font-semibold text-gray-800">Add New Domain</h3>
      
      {/* Domain Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Domain Name (e.g., example.com)</label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      {/* List Price Field */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">List Price (USD, leave blank if not for sale)</label>
        <input
          id="price"
          type="number"
          step="0.01"
          value={listPrice}
          onChange={(e) => setListPrice(e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      {/* For Sale Checkbox */}
      <div className="flex items-center">
        <input
          id="forSale"
          type="checkbox"
          checked={isForSale}
          onChange={(e) => setIsForSale(e.target.checked)}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="forSale" className="ml-2 block text-sm font-medium text-gray-900">
          Mark as "For Sale"
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || !name} // Disable if loading or domain name is empty
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