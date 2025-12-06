import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { domain } = await request.json();

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    // 1. Call Vercel API to add the domain to the project
    const response = await fetch(
      `https://api.vercel.com/v10/projects/${process.env.PROJECT_ID_VERCEL}/domains?teamId=${process.env.TEAM_ID_VERCEL}`,
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

    if (response.error) {
      console.error('Vercel API Error:', data);
      return NextResponse.json({ error: data.error.message }, { status: 400 });
    }

    // 2. Return Success
    return NextResponse.json(data);

  } catch (error) {
    console.error('Internal API Error:', error);
    return NextResponse.json({ error: 'Failed to add domain to Vercel' }, { status: 500 });
  }
}