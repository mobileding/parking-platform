// app/dashboard/DashboardContent.tsx

'use client'; 

import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react'; 
import LogoutButton from '@/components/LogoutButton'; 
import AddDomainForm from '@/components/AddDomainForm'; 
import CsvUploadForm from '@/components/CsvUploadForm'; 
import EditDomainDialog from '@/components/EditDomainDialog'; 
import OffersListModal from '@/components/OffersListModal'; 
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'; 

interface Domain {
    id: number;
    name: string;
    list_price: number | null;
    is_for_sale: boolean;
    landing_page_type: string;
    offers?: { count: number }[]; 
}

export default function DashboardContent() {
    
    // --- STATE DEFINITIONS ---
    const [currentSession, setCurrentSession] = useState<Session | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [hasFetchedDomains, setHasFetchedDomains] = useState(false);
    const [domains, setDomains] = useState<Domain[]>([]);
    const [loadingDomains, setLoadingDomains] = useState(true);
    const [formKey, setFormKey] = useState(0); 

    const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
    const [viewingOffersDomain, setViewingOffersDomain] = useState<Domain | null>(null);
    const [domainToDelete, setDomainToDelete] = useState<Domain | null>(null); 

    const router = useRouter(); 

    const supabase = useMemo(() => {
        return createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );
    }, []); 

    // --- AUTHENTICATION & SESSION LOGIC ---
    useEffect(() => {
        let authListener: { subscription: { unsubscribe: () => void } } | undefined;

        async function initializeSession() {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session) {
                setCurrentSession(session);
                
                const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
                    if (!newSession) {
                        router.push('/login');
                    } else {
                        setCurrentSession(newSession);
                    }
                });
                authListener = data;
                setLoadingAuth(false);
            } else {
                router.push('/login');
                setLoadingAuth(false);
            }
        }
        
        initializeSession();

        return () => {
            if (authListener && authListener.subscription) {
                authListener.subscription.unsubscribe();
            }
        };
        
    }, [router, supabase]);

    // --- DATA FETCHING LOGIC ---
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
                .select(`
                    *,
                    offers(count)
                `)
                .eq('owner_id', currentSession.user.id) 
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


    // 4. Initial Domain Data Fetch (Synchronized on Auth Load)
    useEffect(() => {
        if (!loadingAuth && currentSession && !hasFetchedDomains) { 
            fetchDomains(); 
            setHasFetchedDomains(true);
        }
    }, [fetchDomains, currentSession, loadingAuth, hasFetchedDomains]); 


    // 5. Form Key Reset (Forces Add Domain Form Remount)
    useEffect(() => {
        if (loadingDomains === false) {
            setFormKey(prevKey => prevKey + 1);
        }
    }, [loadingDomains]);

    
    // --- HANDLERS (EDIT/DELETE/VIEW) ---

    const handleEdit = (domain: Domain) => {
        setEditingDomain(domain); // Opens Edit Modal
    };

    const handleViewOffers = (domain: Domain) => {
        setViewingOffersDomain(domain); // Opens Offers Modal
    };

    const confirmDeletion = async () => {
        if (!domainToDelete) return; 

        const domainId = domainToDelete.id;
        // Close the modal immediately for better UX
        setDomainToDelete(null); 
        
        // Optimistic update
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
            fetchDomains(); 
        }
    };

    const handleDelete = (domainId: number, domainName: string) => {
        const domain = domains.find(d => d.id === domainId);
        if (domain) {
            setDomainToDelete(domain); // Opens Confirmation Modal
        }
    };


    // --- RENDERING LOGIC ---

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
                    // CORRECTED JSX STRUCTURE
                    <div className="overflow-x-auto"> 
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Domain</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Offers</th>
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
                                        
                                        {/* Cell 4: Offers (Actionable Link) */}
                                        <td 
                                            className="px-6 py-4 whitespace-nowrap text-left text-sm font-bold cursor-pointer text-indigo-600 hover:text-indigo-800" 
                                            onClick={() => handleViewOffers(domain)}
                                        >
                                            {domain.offers?.[0]?.count || 0} Offers
                                        </td>

                                        {/* Cell 5: Actions (Edit & Delete) */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => handleEdit(domain)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4 font-bold transition-colors"
                                            >
                                                Edit
                                            </button>
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

                {/* --- CSV Bulk Upload Form --- */}
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
            
            {/* MODALS RENDERED HERE: (They will overlay the entire screen) */}
            
            {editingDomain && (
                <EditDomainDialog
                    domain={editingDomain}
                    supabase={supabase as SupabaseClient}
                    onClose={() => setEditingDomain(null)} 
                    onSuccess={fetchDomains}               
                />
            )}
            
            {viewingOffersDomain && (
                <OffersListModal
                    domain={viewingOffersDomain}
                    supabase={supabase as SupabaseClient}
                    onClose={() => setViewingOffersDomain(null)}
                />
            )}
            
            {domainToDelete && (
                <ConfirmDeleteModal
                    domainName={domainToDelete.name}
                    onClose={() => setDomainToDelete(null)}
                    onConfirm={confirmDeletion}
                />
            )}
        </div>
    );
}