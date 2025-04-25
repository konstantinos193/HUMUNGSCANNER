export const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://tools.humanz.fun',
  'https://odinscan.fun'
];

export const API_CONFIG = {
  baseUrl: 'https://api.odin.fun/v1',
  headers: {
    'authority': 'api.odin.fun',
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'origin': 'https://tools.humanz.fun',
    'referer': 'https://tools.humanz.fun/',
    'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  }
}; 