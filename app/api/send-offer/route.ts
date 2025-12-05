import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { buyerEmail, domainName, offerAmount } = await req.json();

    // 💡 STEP 1: EMAIL LOGIC GOES HERE (REPLACE WITH RESEND/SENDGRID API CALL)
    
    console.log(`--- NEW OFFER RECEIVED ---`);
    console.log(`Domain: ${domainName}`);
    console.log(`Buyer: ${buyerEmail}`);
    console.log(`Offer: $${offerAmount || 'N/A'}`);
    console.log(`--------------------------`);

    // In a real app, you would send the transactional email here.
    
    return NextResponse.json({ message: 'Notification scheduled.' }, { status: 200 });

  } catch (error) {
    console.error('API Error sending offer:', error);
    return NextResponse.json({ error: 'Failed to process offer.' }, { status: 500 });
  }
}