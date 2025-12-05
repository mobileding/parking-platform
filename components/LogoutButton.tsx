// components/LogoutButton.tsx (Updated)

'use client'; 

import { SupabaseClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface LogoutButtonProps {
    // 💡 Add the supabase client prop
    supabase: SupabaseClient; 
}

// 💡 Update component function to accept the prop
export default function LogoutButton({ supabase }: LogoutButtonProps) { 
    const router = useRouter();

    const handleLogout = async () => {
        // Use the prop instead of a local instance
        const { error } = await supabase.auth.signOut(); 

        if (error) {
            console.error('Logout error:', error);
        } else {
            router.push('/login');
        }
    };

    return (
        <div className="mt-8 text-center">
            <button
                onClick={handleLogout}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
            >
                Log Out
            </button>
        </div>
    );
}