import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_HEADERS = {
  'authority': 'api.odin.fun',
  'accept': '*/*',
  'accept-language': 'en-US,en;q=0.9',
  'origin': 'https://odin.fun',
  'referer': 'https://odin.fun/',
  'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-site',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
};

export async function GET(
  request: NextRequest,
  { params }: { params: { tokenId: string } }
) {
  try {
    const tokenId = params.tokenId;
    console.log(`Fetching token data for: ${tokenId}`);

    const response = await fetch(`https://api.odin.fun/v1/token/${tokenId}`, {
      headers: {
        ...API_HEADERS,
        'Accept': 'application/json',
        'Origin': 'https://odinscan.fun',
        'Referer': 'https://odinscan.fun/'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}):`, errorText);
      return NextResponse.json(
        { error: `API request failed: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Token fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 