import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { tokenId: string } }
) {
  try {
    const API_URL = "http://deape.ddns.net:3001"
    const response = await fetch(`${API_URL}/api/token/${params.tokenId}/trades`)
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch trades data: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch trades data' },
      { status: 500 }
    )
  }
} 