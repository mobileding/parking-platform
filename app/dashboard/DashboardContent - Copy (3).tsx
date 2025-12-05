// app/dashboard/DashboardContent.tsx

'use client'; 

import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react'; 
import LogoutButton from '@/components/LogoutButton'; 
import AddDomainForm from '@/components/AddDomainForm'; 
import CsvUploadForm from '@/components/CsvUploadForm'; // 💡 NEW IMPORT

interface Domain {
    id: number;
    name: string;
    list_price: number | null;
    is_for_sale: boolean;
    landing_page_type: string;
}

export default function DashboardContent() {
    
    const [currentSession, setCurrentSession] = useState<Session | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    const [domains, setDomains] = useState<Domain[]>([]);
    const [loadingDomains, setLoadingDomains] = useState(true);
    const [formKey, setFormKey] = useState(0); 
    const router = useRouter(); 

    // 1. Supabase client remains stable
    const supabase = useMemo(() => {
        return createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );
    }, []); 

    // 2. CRITICAL: INITIAL AUTH CHECK AND LISTENER
    useEffect(() => {
        let authListener: { subscription: { unsubscribe: () => void } } | undefined;

        async function initializeSession() {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session) {
                setCurrentSession(session);
                authListener = supabase.auth.onAuthStateChange((_event, newSession) => {
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
        
        initializeSession();

        return () => {
            if (authListener && authListener.subscription) {
                authListener.subscription.unsubscribe();
            }
        };
        
    }, [router, supabase]); 


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
    }, [supabase, currentSession]); 


    // 4. Initial Domain Data Fetch
    useEffect(() => {
        if (!loadingAuth && currentSession) { 
            fetchDomains(); 
        }
    }, [fetchDomains, currentSession, loadingAuth]); 


    // 5. Form Key Reset
    useEffect(() => {
        if (loadingDomains === false) {
            setFormKey(prevKey => prevKey + 1);
        }
    }, [loadingDomains]);

    
    // 💡 NEW: Handle Delete Logic
    const handleDelete = async (domainId: number, domainName: string) => {
        if (!confirm(`Are you sure you want to delete ${domainName}? This cannot be undone.`)) {
            return;
        }

        // Optimistic update: Remove from UI immediately
        setDomains(prev => prev.filter(d => d.id !== domainId));

        try {
            const { error } = await supabase
                .from('domains')
                .delete()
                .eq('id', domainId);

            if (error) {
                alert(`Error deleting: ${error.message}`);
                fetchDomains(); // Revert UI on error
            }
        } catch (err) {
            console.error('Delete error:', err);
            fetchDomains(); // Revert UI on error
        }
    };


    // --- Rendering Logic ---

    if (loadingAuth || !currentSession) {
        return <div className="text-center p-20">Loading Authentication...</div>;
    }

    return (
        <div className="container mx-auto p-8 max-w-6xl">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-green-700 mb-2">
                    Seller Dashboard
                </h1>
                <p className="text-gray-600">
                    Logged in as: <span className="font-medium text-gray-900">{currentSession.user.email}</span>
                </p>
            </header>
            
            {/* --- Domain List Component --- */}
            <div className="mb-10 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        Your Domains <span className="text-gray-500 text-sm ml-2">({domains.length})</span>
                    </h2>
                    <button onClick={fetchDomains} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                        Refresh List
                    </button>
                </div>
                
                {loadingDomains ? (
                    <div className="p-8 text-center text-gray-500 animate-pulse">Loading your portfolio...</div>
                ) : domains.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        You currently have no domains listed. Add one below!
                    </div>
                ) : (
                    <div className="overflow-x-auto"> 
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Domain</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                               </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {domains.map((domain) => (
                                    <tr key={domain.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{domain.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {typeof domain.list_price === 'number' ? `$${domain.list_price.toFixed(2)}` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${domain.is_for_sale ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {domain.is_for_sale ? 'For Sale' : 'Parked'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {/* 💡 Delete Button Implementation */}
                                            <button 
                                                onClick={() => handleDelete(domain.id, domain.name)}
                                                className="text-red-600 hover:text-red-900 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* --- Manual Add Form --- */}
                <section>
                    <AddDomainForm 
                        key={formKey}
                        session={currentSession}
                        onDomainAdded={fetchDomains}
                        supabase={supabase as SupabaseClient} 
                    />
                </section>

                {/* --- 💡 CSV Bulk Upload Form --- */}
                <section>
                    <CsvUploadForm 
                        session={currentSession}
                        onUploadComplete={fetchDomains}
                        supabase={supabase as SupabaseClient}
                    />
                    
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800">
                        <h4 className="font-bold mb-1">CSV Format Guide</h4>
                        <p>Create a text file with one domain per line:</p>
                        <pre className="mt-2 bg-white p-2 rounded border border-blue-200 text-xs">
                            example.com, 5000{'\n'}
                            another-domain.net, 250{'\n'}
                            just-parked.org,
                        </pre>
                    </div>
                </section>
            </div>

            <div className="mt-16 pt-8 border-t text-center">
                 <LogoutButton supabase={supabase as SupabaseClient} />
            </div>
        </div>
    );
}