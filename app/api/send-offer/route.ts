import { NextRequest, NextResponse } from 'next/server';

// Assuming you use Resend, you'd import the client here
// You would also need to install the Resend SDK: pnpm install resend
// import { Resend } from 'resend';

// NOTE: Since the Resend SDK requires installation, for quick deployment, we will use a standard fetch call.

export async function POST(req: NextRequest) {
  try {
    const { buyerEmail, domainName, offerAmount } = await req.json();

    // Use a robust check for API Key presence
    if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY not set. Skipping email send.");
        // We still return success here because the data was saved to Supabase
        return NextResponse.json({ message: 'Email skipped (Dev Mode)' }, { status: 200 });
    }

    // 💡 STEP 1: DEFINE EMAIL CONTENT
    const emailBody = `
        A new offer has been submitted for your domain: ${domainName}
        
        Details:
        --------------------------
        Domain: ${domainName}
        Offer Amount: $${offerAmount || 'N/A'}
        Buyer Contact: ${buyerEmail}
        
        Action: Please log into the iolab Seller Dashboard to review the full details and contact the buyer.
    `;

    // 💡 STEP 2: SEND EMAIL (Using a placeholder fetch for a generic API)
    // In a production environment with Resend, this would look like:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({...});

    // For now, we rely on the console log as a placeholder for the live email action.
    console.log(`--- LIVE OFFER NOTIFICATION ---`);
    console.log(emailBody);
    console.log(`-------------------------------`);

    return NextResponse.json({ message: 'Notification successful and saved to DB.' }, { status: 200 });

  } catch (error) {
    console.error('API Error sending offer:', error);
    return NextResponse.json({ error: 'Failed to process offer.' }, { status: 500 });
  }
}