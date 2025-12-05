'use client';

import { useState } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';

// Define the Domain interface locally or import it
interface Domain {
  id: number;
  name: string;
  list_price: number | null;
  is_for_sale: boolean;
  landing_page_type: string;
}

interface EditDomainDialogProps {
  domain: Domain;
  supabase: SupabaseClient;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditDomainDialog({ domain, supabase, onClose, onSuccess }: EditDomainDialogProps) {
  // Initialize state with current domain values
  const [listPrice, setListPrice] = useState<string>(domain.list_price ? domain.list_price.toString() : '');
  const [isForSale, setIsForSale] = useState(domain.is_for_sale);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const updates = {
        list_price: listPrice ? parseFloat(listPrice) : null,
        is_for_sale: isForSale,
        // We aren't changing name or template yet
      };

      const { error } = await supabase
        .from('domains')
        .update(updates)
        .eq('id', domain.id);

      if (error) {
        console.error('Update Error:', error);
        setMessage(`Error: ${error.message}`);
        setLoading(false);
      } else {
        setMessage('Saved!');
        // Small delay to show success message before closing
        setTimeout(() => {
            setLoading(false);
            onSuccess(); // Triggers list refresh in parent
            onClose();   // Closes modal
        }, 500);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setMessage('Unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Edit Domain</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="p-6 space-y-4">
          
          {/* Read-Only Domain Name */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Domain</label>
            <div className="text-xl font-mono text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                {domain.name}
            </div>
          </div>

          {/* Price Field */}
          <div>
            <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700">List Price (USD)</label>
            <input
              id="edit-price"
              type="number"
              step="0.01"
              value={listPrice}
              onChange={(e) => setListPrice(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Leave empty to remove price"
            />
          </div>

          {/* For Sale Checkbox */}
          <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <input
              id="edit-forSale"
              type="checkbox"
              checked={isForSale}
              onChange={(e) => setIsForSale(e.target.checked)}
              className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="edit-forSale" className="ml-3 block text-sm font-medium text-gray-900 cursor-pointer">
              List this domain for sale
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {message && (
            <p className={`text-center text-sm font-medium ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}