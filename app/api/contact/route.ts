import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; // Import createClient

export async function POST(req: NextRequest) {
  try {
    const { email, message } = await req.json();

    if (!email || !message) {
      return NextResponse.json({ error: 'Email and message are required.' }, { status: 400 });
    }

    // 1. Initialize Supabase Client (Public client is fine for INSERT)
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 2. Insert into the new inquiries table
    const { error: dbError } = await supabase
        .from('inquiries')
        .insert({
            submitter_email: email,
            message: message,
            status: 'New' // Default status set by the database
        });

    if (dbError) {
        console.error('Database Inquiry Insert Error:', dbError);
        return NextResponse.json({ error: 'Database failed to save inquiry.' }, { status: 500 });
    }

    // 3. Logic for sending notification email to the admin (Placeholder)
    console.log(`--- NEW GENERAL INQUIRY SAVED ---`);
    console.log(`From: ${email}`);
    console.log(`Message: ${message.substring(0, 50)}...`);
    console.log(`-----------------------------------`);
    
    // In production, you would send an email alert to the admin here.

    return NextResponse.json({ message: 'Inquiry submitted successfully.' }, { status: 200 });

  } catch (error) {
    console.error('Internal API Error:', error);
    return NextResponse.json({ error: 'Failed to process inquiry.' }, { status: 500 });
  }
}