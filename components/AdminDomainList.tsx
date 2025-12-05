'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// Define interface including the joined profile data
interface DomainWithOwner {
  id: number;
  name: string;
  list_price: number | null;
  is_for_sale: boolean;
  created_at: string;
  profiles: {
    email: string;
  } | null;
}

export default function AdminDomainList() {
  const [domains, setDomains] = useState<DomainWithOwner[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Stable Client
  const supabase = useMemo(() => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }, []);

  // 2. Fetch All Domains (with Owner Email)
  const fetchDomains = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('domains')
      .select(`
        *,
        profiles (
          email
        )
      `)
      .order('created_at', { ascending: false }); // Newest first

    if (error) {
      console.error('Error fetching all domains:', error);
      alert(`Error: ${error.message}`);
    } else {
      setDomains(data as any[]); // Cast to handle the join type
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDomains();
  }, [supabase]);

  // 3. Admin Delete Action
  const deleteDomain = async (domainId: number, domainName: string) => {
    if (!confirm(`MODERATION ACTION:\nAre you sure you want to delete "${domainName}"?\nThis will remove it from the user's account.`)) return;

    const { error } = await supabase
      .from('domains')
      .delete()
      .eq('id', domainId);

    if (error) {
      alert(`Error deleting domain: ${error.message}`);
    } else {
      fetchDomains(); // Refresh list
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading Global Inventory...</div>;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
         <h3 className="font-bold text-gray-700">Total Domains: {domains.length}</h3>
         <button onClick={fetchDomains} className="text-sm text-indigo-600 hover:underline">Refresh</button>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Domain</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Owner Email</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Admin Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {domains.map((d) => (
            <tr key={d.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <a href={`http://${d.name}:3000`} target="_blank" className="hover:text-blue-600 hover:underline">
                    {d.name} ↗
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {d.profiles?.email || 'Unknown'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {d.list_price ? `$${d.list_price.toFixed(2)}` : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${d.is_for_sale ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {d.is_for_sale ? 'Sale' : 'Parked'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  onClick={() => deleteDomain(d.id, d.name)}
                  className="text-red-600 hover:text-red-900 font-bold border border-red-200 px-3 py-1 rounded hover:bg-red-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}