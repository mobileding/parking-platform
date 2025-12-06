'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  domains: { count: number }[]; // Relation for count
}

interface UserDomain {
    id: number;
    name: string;
    is_for_sale: boolean;
}

export default function AdminUserList() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  
  // State for the "Drill-Down" Modal
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userDomains, setUserDomains] = useState<UserDomain[]>([]);
  
  // 💡 FIX: Define the loading state locally for the modal domains list
  const [loadingDomains, setLoadingDomains] = useState(false);

  // 1. Stable Client
  const supabase = useMemo(() => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }, []);

  // 2. Initialize Session
  useEffect(() => {
    async function initSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    }
    initSession();
  }, [supabase]);

  // 3. Fetch Users with Domain Count
  const fetchUsers = async () => {
    if (!session) return; 

    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        domains (count)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      alert(`Error: ${error.message}`);
    } else {
      setUsers(data as any[]);
    }
    setLoading(false);
  };

  // 4. Trigger Fetch when Session is Ready
  useEffect(() => {
    if (session) {
      fetchUsers();
    }
  }, [session]);

  // 5. Fetch Domains for Selected User
  const fetchUserDomains = async (userId: string) => {
      // 💡 FIX: Use the locally defined setLoadingDomains
      setLoadingDomains(true); 
      const { data, error } = await supabase
        .from('domains')
        .select('id, name, is_for_sale') // Select only necessary fields
        .eq('owner_id', userId);
      
      if (error) {
          alert('Error fetching domains');
      } else {
          setUserDomains(data as UserDomain[]);
      }
      // 💡 FIX: Use the locally defined setLoadingDomains
      setLoadingDomains(false); 
  };

  // Handle "View Domains" Click
  const handleViewDomains = (user: UserProfile) => {
      setSelectedUser(user);
      fetchUserDomains(user.id);
  };

  // Handle Delete Domain (Admin Action)
  const deleteDomain = async (domainId: number) => {
      if(!confirm("Are you sure you want to delete this domain?")) return;
      
      // Optimistic Update: Filter from the modal's current list
      setUserDomains(prev => prev.filter(d => d.id !== domainId));

      await supabase.from('domains').delete().eq('id', domainId);
      
      // Refresh the main list count asynchronously
      fetchUsers();
  };
  
  // Existing User Actions
  const toggleUserStatus = async (userId: string, currentStatus: string) => {
     if (!userId) return;
     const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
     await supabase.from('profiles').update({ status: newStatus }).eq('id', userId);
     fetchUsers();
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Delete user and all data?')) return;
    await supabase.from('profiles').delete().eq('id', userId);
    fetchUsers();
  };

  // --- Rendering ---

  if (loading && !users.length) return <div className="p-6 text-gray-500">Loading Users...</div>;

  return (
    <div>
      {/* MAIN USER LIST (JSX remains the same) */}
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        {/* ... table content ... */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Domains</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.email}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                    {user.role || 'user'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.status || 'active'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-indigo-600 font-bold cursor-pointer hover:underline" onClick={() => handleViewDomains(user)}>
                   {user.domains && user.domains[0] ? user.domains[0].count : 0} Domains
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                  <button onClick={() => toggleUserStatus(user.id, user.status)} className="text-indigo-600 hover:text-indigo-900">
                    {user.status === 'active' ? 'Disable' : 'Enable'}
                  </button>
                  <button onClick={() => deleteUser(user.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* USER DOMAINS MODAL (JSX remains the same) */}
      {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="text-lg font-bold text-gray-800">Domains owned by {selectedUser.email}</h3>
                      <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                  </div>
                  
                  <div className="p-0 max-h-[60vh] overflow-y-auto">
                      {/* 💡 Rendering uses the local loadingDomains state */}
                      {loadingDomains ? (
                          <div className="p-8 text-center">Loading domains...</div>
                      ) : userDomains.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">This user has no domains.</div>
                      ) : (
                          <table className="min-w-full divide-y divide-gray-100">
                              <thead className="bg-gray-50">
                                  <tr>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Domain</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">For Sale</th>
                                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                  {userDomains.map(d => (
                                      <tr key={d.id}>
                                          <td className="px-6 py-3 text-sm text-gray-900">{d.name}</td>
                                          <td className="px-6 py-3 text-sm text-gray-500">{d.is_for_sale ? 'Yes' : 'No'}</td>
                                          <td className="px-6 py-3 text-right">
                                              <button 
                                                  onClick={() => deleteDomain(d.id)}
                                                  className="text-red-600 hover:text-red-800 text-xs font-bold border border-red-100 bg-red-50 px-2 py-1 rounded"
                                              >
                                                  Remove
                                              </button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      )}
                  </div>
                  <div className="p-4 bg-gray-50 border-t text-right">
                      <button onClick={() => setSelectedUser(null)} className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm font-medium hover:bg-gray-50">Close</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}