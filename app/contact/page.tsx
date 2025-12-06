'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            // Call the newly created serverless API route
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, message }),
            });

            if (response.ok) {
                setStatus('success');
                setEmail('');
                setMessage('');
            } else {
                // Read specific error from the API response
                const errorData = await response.json();
                console.error("Contact API Error:", errorData);
                setStatus('error');
            }
        } catch (error) {
            console.error("Network Error:", error);
            setStatus('error');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl space-y-6">
                
                <h1 className="text-3xl font-bold text-indigo-700 text-center">Contact iolab Support</h1>
                
                {/* SUCCESS STATE */}
                {status === 'success' ? (
                    <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-xl text-green-700 font-semibold">Message Sent!</p>
                        <p className="text-gray-600 mt-2">Thank you for reaching out. We will respond soon.</p>
                        <Link href="/" className="mt-4 inline-block text-indigo-600 hover:underline">
                            Go Home
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <p className="text-gray-600 text-center">
                            Have a question about a domain or need support? Send us a message.
                        </p>
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email</label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                                disabled={status === 'loading'}
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message / Issue</label>
                            <textarea
                                id="message"
                                rows={4}
                                required
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                                disabled={status === 'loading'}
                            />
                        </div>
                        
                        {status === 'error' && (
                            <p className="text-sm text-red-600">Failed to send message. Please try again later.</p>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 disabled:opacity-50 transition"
                        >
                            {status === 'loading' ? 'Submitting...' : 'Submit Inquiry'}
                        </button>
                        
                        <p className="text-center text-xs text-gray-400">
                            We usually respond within 24 hours.
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}