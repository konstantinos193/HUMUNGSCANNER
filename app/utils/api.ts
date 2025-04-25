import { API_ENDPOINTS } from "@/lib/config/api";

// API endpoints
export { API_ENDPOINTS };
export const API_BASE_URL = 'http://deape.ddns.net:3001';

export interface Token {
  id: string;
  name: string;
  ticker: string;
  price: number;
  marketcap?: number;
  volume?: number;
  holder_count: number;
  created_time: string;
  creator: string;
  total_supply: string;
  creator_balance?: string;
}

export interface APIResponse {
  tokenIds: string[];
  data: any[]; // Raw API data
  pagination: {
    [key: string]: any;
  };
}

function parseNumber(value: any): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

export const fetchAllTokens = async (): Promise<Token[]> => {
  try {
    console.log('Attempting to fetch tokens from:', `${API_BASE_URL}/api/all-tokens`);
    
    const response = await fetch(`${API_BASE_URL}/api/all-tokens`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'accept-language': 'en-US,en;q=0.9',
        'connection': 'keep-alive',
        'host': 'deape.ddns.net:3001',
        'origin': 'http://localhost:3000',
        'referer': 'http://localhost:3000/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 OPR/117.0.0.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tokens: ${response.status}`);
    }

    const data: APIResponse = await response.json();
    
    if (!data || !data.data || !Array.isArray(data.data)) {
      console.log('No tokens found in response');
      return [];
    }

    // Process and validate each token's data
    const processedTokens = data.data.map(rawToken => {
      // Ensure numeric values are properly parsed
      const price = parseNumber(rawToken.price);
      const marketcap = parseNumber(rawToken.marketcap);
      const volume = parseNumber(rawToken.volume);
      const holder_count = parseNumber(rawToken.holder_count);
      
      // Log a sample of processed values for debugging
      if (rawToken.id === data.data[0].id) {
        console.log('Sample token processing:', {
          raw: rawToken,
          processed: { price, marketcap, volume, holder_count }
        });
      }

      return {
        id: rawToken.id || '',
        name: rawToken.name || `Token ${rawToken.id}`,
        ticker: rawToken.ticker || `TKN${rawToken.id}`,
        price,
        marketcap,
        volume,
        holder_count,
        created_time: rawToken.created_time || new Date().toISOString(),
        creator: rawToken.creator || 'Unknown',
        total_supply: rawToken.total_supply || '0',
        creator_balance: rawToken.creator_balance || '0'
      };
    });

    console.log(`Processed ${processedTokens.length} tokens`);
    
    // Log the first token as a sample
    if (processedTokens.length > 0) {
      console.log('Sample processed token:', processedTokens[0]);
    }

    return processedTokens;
  } catch (error: any) {
    console.error('Detailed error fetching tokens:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
    throw error;
  }
};

// Mock data generator for fallback
export const generateMockTokens = (count: number): Token[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `mock${i + 1}`,
    name: `Mock Token ${i + 1}`,
    ticker: `MTK${i + 1}`,
    price: Math.random() * 100,
    holder_count: Math.floor(Math.random() * 1000),
    created_time: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    creator: `0x${Math.random().toString(16).slice(2, 42)}`,
    total_supply: (1000000 * (i + 1)).toString(),
  }));
};

export interface Holder {
  user: string;
  user_username?: string;
  balance: string;
  percentage?: number;
}

interface HoldersResponse {
  [tokenId: string]: {
    holders: Holder[];
    totalHolders: number;
    activeHolders: number;
  };
}

export const fetchTokenHolders = async (tokenId: string, creatorId: string): Promise<HoldersResponse> => {
  try {
    // Convert tokenId to array and encode for URL
    const tokenIds = encodeURIComponent(JSON.stringify([tokenId]));
    
    console.log('Fetching holders for token:', tokenId);
    
    const response = await fetch(`/api/proxy?path=/api/batch-holders?tokenIds=${tokenIds}`, {
      headers: {
        'Accept': 'application/json',
        'Origin': 'https://odinscan.fun',
        'Referer': 'https://odinscan.fun/'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch holders: ${response.status}`);
    }

    const data = await response.json();
    
    // If we got an error response from the proxy
    if (data.error) {
      throw new Error(data.error);
    }

    // Log the number of holders received
    if (data[tokenId]) {
      console.log(`Received ${data[tokenId].holders.length} holders for token ${tokenId}`);
      console.log(`Total holders: ${data[tokenId].totalHolders}, Active holders: ${data[tokenId].activeHolders}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching holders:', error);
    // Return empty holders array with proper typing
    return {
      [tokenId]: {
        holders: [],
        totalHolders: 0,
        activeHolders: 0
      }
    };
  }
}; 