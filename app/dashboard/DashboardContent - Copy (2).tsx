// app/dashboard/DashboardContent.tsx (FINAL STABLE CLIENT VERSION)

'use client'; 

import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import LogoutButton from '@/components/LogoutButton'; 
import AddDomainForm from '@/components/AddDomainForm'; 

interface Domain {
    id: number;
    name: string;
    list_price: number | null;
    is_for_sale: boolean;
    landing_page_type: string;
}

export default function DashboardContent() {
    
    // State to manage the session fetched on the client (needed for stability)
    const [currentSession, setCurrentSession] = useState<Session | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [hasFetchedDomains, setHasFetchedDomains] = useState(false);
    const [domains, setDomains] = useState<Domain[]>([]);
    const [loadingDomains, setLoadingDomains] = useState(true);
    const [formKey, setFormKey] = useState(0); 
    const router = useRouter(); 

// app/dashboard/DashboardContent.tsx (Section 1 - Supabase client)

// 1. Supabase client remains stable (USE SINGLETON PATTERN)
const [supabase, setSupabase] = useState<SupabaseClient | null>(null);



// 2. CRITICAL: INITIAL AUTH CHECK AND LISTENER (Combined)
useEffect(() => {
    // 💡 Must wait for the supabase client to be initialized
    if (!supabase) return; // This is correct, but the rest of the logic is missing!

    let authListener: { subscription: { unsubscribe: () => void } } | undefined;

    // 💡 RESTORE THIS FUNCTION BLOCK
    async function initializeSession() {
        const { data: { session } } = await supabase!.auth.getSession(); // Use ! since we checked for null above
        
        if (session) {
            setCurrentSession(session);
            // Immediately start listening for changes
            authListener = supabase!.auth.onAuthStateChange((_event, newSession) => {
                if (!newSession) {
                    router.push('/login');
                } else {
                    setCurrentSession(newSession);
                }
            });
            setLoadingAuth(false);
        } else {
            router.push('/login');
        }
    }
    
    // 💡 RESTORE THE CALL TO THE FUNCTION
    initializeSession();

    // 💡 RESTORE THE RETURN/CLEANUP FUNCTION
    return () => {
        // Safely check for the subscription before unsubscribing
        if (authListener && authListener.subscription) {
            authListener.subscription.unsubscribe();
        }
    };
    
}, [router, supabase]); // This dependency array is correct.


    // 3. fetchDomains useCallback
    const fetchDomains = useCallback(async () => {
        if (!currentSession || !currentSession.user?.id) {
            setDomains([]);
            setLoadingDomains(false);
            return;
        }
        
        setLoadingDomains(true);
        
        try {
            const { data, error } = await supabase
                .from('domains')
                .select('*')
                // .eq('user_id', currentSession.user.id) // Use this if RLS is enabled
                .order('name', { ascending: true });

            if (error) {
                console.error('Error fetching domains:', error);
                setDomains([]);
            } else {
                setDomains(data as Domain[]);
            }
        } catch (e) {
            console.error("Critical error during domain fetch:", e);
        } finally {
            setLoadingDomains(false); 
        }
    }, [supabase, currentSession?.user?.id || null]); 


// 4. Initial Domain Data Fetch (FIXED Synchronization)
useEffect(() => {
    // 💡 Must wait for the supabase client to be initialized
    if (!loadingAuth && currentSession && !hasFetchedDomains && supabase) { 
        fetchDomains(); 
        setHasFetchedDomains(true); 
    }
}, [fetchDomains, currentSession, loadingAuth, hasFetchedDomains, setHasFetchedDomains, supabase]); // 💡 Add supabase to dependencies


// Added setHasFetchedDomains to dependencies

    // 5. Form Key Reset remains the same
    useEffect(() => {
        if (loadingDomains === false) {
            setFormKey(prevKey => prevKey + 1);
        }
    }, [loadingDomains]);


// 6. New useEffect block

useEffect(() => {
    // This code only runs on the client.
    
    // 1. Check if the client already exists on the window object (Singleton Pattern)
    if ((window as any).supabaseClient) {
        setSupabase((window as any).supabaseClient as SupabaseClient);
        return;
    }

    // 2. If it doesn't exist, create it.
    const newClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    
    // 3. Store and set the new client.
    (window as any).supabaseClient = newClient;
    setSupabase(newClient);

}, []); // Dependency array is empty, so it runs only once on mount.





    // --- Rendering Logic ---

// 💡 CRITICAL: Now check for both auth load AND client availability
if (loadingAuth || !currentSession || !supabase) {
    return <div className="text-center p-20">Loading Authentication...</div>;
}

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold text-green-700">
                Welcome to Your Seller Dashboard, {currentSession.user.email}!
            </h1>
            
            {/* --- Domain List Component --- */}
            {/* You will need to re-add your table JSX here */}
            <div className="mt-8 p-6 border rounded-lg bg-white shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">
                    Your Hosted Domains ({domains.length})
                </h2>
                
                {loadingDomains ? (
                    <p>Loading your domains...</p>
                ) : domains.length === 0 ? (
                    <p className="text-gray-500">
                        You currently have no domains listed. Let's add your first one!
                    </p>
                ) : (
                    // 💡 Your previously working Domain Table/List JSX goes here
                   <div className="overflow-x-auto"> 
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {domains.map((domain) => (
                    <tr key={domain.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{domain.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {/* Robust Price Rendering Check */}
                            {typeof domain.list_price === 'number' ? `$${domain.list_price.toFixed(2)}` : 'Not For Sale'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${domain.is_for_sale ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {domain.is_for_sale ? 'For Sale' : 'Parked'}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
                )}
            </div>


            {/* --- ADD DOMAIN FORM --- */}
            <div className="mt-8">
                <AddDomainForm 
                    key={formKey}
                    session={currentSession} // Pass the stable session
                    onDomainAdded={fetchDomains}
                    supabase={supabase as Supabase} // Pass the stable client (Assumes AddDomainForm is fixed)
                />
            </div>
            <LogoutButton supabase={supabase} />
        </div>
    );
}