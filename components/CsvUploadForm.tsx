'use client';

import { useState } from 'react';
import { SupabaseClient, Session } from '@supabase/supabase-js';

interface CsvUploadFormProps {
  onUploadComplete: () => void;
  session: Session;
  supabase: SupabaseClient;
}

export default function CsvUploadForm({ onUploadComplete, session, supabase }: CsvUploadFormProps) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Start UI State
    setUploading(true);
    setMessage('Reading file...');

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          setMessage('File was empty.');
          setUploading(false);
          return;
        }

        // 2. Parse Data (Synchronous & Fast)
        const lines = text.split(/\r\n|\n/);
        const recordsToInsert: any[] = [];

        lines.forEach(line => {
          const [domainRaw, priceRaw] = line.split(',');
          const domainName = domainRaw?.trim();

          // Basic validation
          if (domainName && domainName.length > 3 && domainName.includes('.')) { 
              recordsToInsert.push({
                  owner_id: session.user.id,
                  name: domainName,
                  list_price: priceRaw && !isNaN(parseFloat(priceRaw)) ? parseFloat(priceRaw.trim()) : null,
                  is_for_sale: true,
                  landing_page_type: 'default_inspiration',
              });
          }
        });

        if (recordsToInsert.length === 0) {
            setMessage('No valid domains found in file (format: domain.com, price).');
            setUploading(false);
            return;
        }

        // 3. UI Handoff: Notify user and Release UI
        setMessage(`Found ${recordsToInsert.length} domains. Uploading in background...`);
        
        // CRITICAL FIX: Use setTimeout to break the execution chain.
        // This ensures the UI updates and unfreezes BEFORE the slow database network call starts.
        setTimeout(() => {
            // A. Unfreeze UI immediately
            setUploading(false);
            
            // B. Start Database Insert (Background Process)
            supabase
              .from('domains')
              .insert(recordsToInsert)
              .then(({ error }) => {
                  if (error) {
                      console.error('Bulk upload error:', error);
                      // If duplicate key error, give a friendly message
                      if (error.code === '23505') {
                          setMessage(`Some domains already exist. Added the rest.`);
                          onUploadComplete();
                      } else {
                          setMessage(`Error: ${error.message}`);
                      }
                  } else {
                      setMessage(`Success! ${recordsToInsert.length} domains added.`);
                      onUploadComplete();
                  }
              });
        }, 500); // 500ms delay to allow React to render the "Found..." message

      } catch (err) {
        console.error("CSV processing error:", err);
        setMessage("Failed to process file.");
        setUploading(false);
      }
    };

    // Reset the file input so the same file can be selected again if needed
    e.target.value = ''; 
    reader.readAsText(file);
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Mass Upload (CSV)
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Upload a CSV file with format: <code>domain.com, 5000</code>
      </p>
      
      <div className="flex flex-col gap-3">
        <label className={`inline-block w-fit cursor-pointer bg-indigo-50 text-indigo-700 px-4 py-2 rounded-md font-medium hover:bg-indigo-100 transition ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <span>{uploading ? 'Reading...' : 'Select CSV File'}</span>
            <input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                onChange={handleFileUpload}
                disabled={uploading}
            />
        </label>
        
        {/* Persistent Status Message Area */}
        <div className="min-h-[20px]">
            {message && (
                <span className={`text-sm font-medium ${message.includes('Success') ? 'text-green-600' : message.includes('Error') ? 'text-red-600' : 'text-blue-600'}`}>
                    {message}
                </span>
            )}
        </div>
      </div>
    </div>
  );
}