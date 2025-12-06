import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { domain } = await request.json();

    console.log(`[API] Received request to add domain: ${domain}`);

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    // Construct URL carefully
    const apiUrl = `https://api.vercel.com/v10/projects/${process.env.PROJECT_ID_VERCEL}/domains?teamId=${process.env.TEAM_ID_VERCEL}`;
    
    console.log(`[API] Sending request to Vercel...`);

    const response = await fetch(
      apiUrl,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: domain }),
      }
    );

    const data = await response.json();

    // 💡 FIX: Check !response.ok instead of response.error
    if (!response.ok) {
      console.error('Vercel API Error:', data);
      // Safe access to error message
      const errorMessage = data.error?.message || 'Unknown Vercel API error';
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    // 2. Return Success
    return NextResponse.json(data);

  } catch (error) {
    console.error('Internal API Error:', error);
    return NextResponse.json({ error: 'Failed to add domain to Vercel' }, { status: 500 });
  }
}