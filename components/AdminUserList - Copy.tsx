'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

export default function AdminUserList() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize Supabase Client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data as UserProfile[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
    
    const { error } = await supabase
      .from('profiles')
      .update({ status: newStatus })
      .eq('id', userId);

    if (error) {
      alert(`Error updating user: ${error.message}`);
    } else {
      fetchUsers(); // Refresh list
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure? This will delete the user and ALL their domains.')) return;

    // 1. Delete from profiles (Cascade should handle domains if set up, but let's be safe)
    // Note: Deleting from auth.users requires Service Role key server-side.
    // For now, we are deleting the PROFILE, which effectively hides their data.
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

  if (loading) return <div>Loading Users...</div>;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Role</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{user.role}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium space-x-3">
                <button 
                  onClick={() => toggleUserStatus(user.id, user.status)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  {user.status === 'active' ? 'Disable' : 'Enable'}
                </button>
                <button 
                  onClick={() => deleteUser(user.id)}
                  className="text-red-600 hover:text-red-900"
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