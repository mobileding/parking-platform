'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  // New field for the count
  domains: { count: number }[]; 
}

export default function AdminUserList() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

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

  // 3. Fetch Users (Only when session is ready)
  const fetchUsers = async () => {
    if (!session) return; // Guard clause

    setLoading(true);
const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        domains (count)
      `)
      .order('created_at', { ascending: false });


    if (error) {
      console.error('Error fetching users:', error.message, error.details); // Improved logging
      alert(`Error: ${error.message}`);
    } else {
      setUsers(data as UserProfile[]);
    }
    setLoading(false);
  };

  // 4. Trigger Fetch when Session is Ready
  useEffect(() => {
    if (session) {
      fetchUsers();
    }
  }, [session]); // Runs whenever session is set

  // --- Actions ---

// components/AdminUserList.tsx

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    // 🛑 GUARD: Stop immediately if ID is missing
    if (!userId) {
        console.error("Critical Error: Attempted to toggle status without a User ID");
        return;
    }

    const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
    console.log(`Toggling User ${userId} to ${newStatus}...`); // Debug Log

    try {
        const { error } = await supabase
          .from('profiles')
          .update({ status: newStatus })
          .eq('id', userId); // <--- This filter is life-or-death!

        if (error) {
          alert(`Error updating user: ${error.message}`);
        } else {
          console.log("User status updated successfully.");
          fetchUsers(); // Refresh list
        }
    } catch (err) {
        console.error("Unexpected error updating user:", err);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure? This will delete the user profile.')) return;

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      alert(`Error deleting user: ${error.message}`);
    } else {
      fetchUsers();
    }
  };

  // --- Rendering ---

  if (loading && !users.length) return <div className="p-6 text-gray-500">Loading Users...</div>;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                  {user.role || 'user'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.status || 'active'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button 
                  onClick={() => toggleUserStatus(user.id, user.status)}
                  className="text-indigo-600 hover:text-indigo-900 font-semibold"
                >
                  {user.status === 'active' ? 'Disable' : 'Enable'}
                </button>
                <button 
                  onClick={() => deleteUser(user.id)}
                  className="text-red-600 hover:text-red-900 font-semibold"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && !loading && (
        <div className="p-6 text-center text-gray-500">No users found.</div>
      )}
    </div>
  );
}