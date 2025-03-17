import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET() {
  try {
    const url = 'https://www.indianspices.com/marketing/price/domestic/daily-price-small.html';
    const { data } = await axios.get(url);
    debugger;
    const $ = cheerio.load(data);

    const prices = $('table tr')
      .map((_, row) => {
        const cols = $(row).find('td').map((_, el) => $(el).text().trim()).get();
        if (cols.length === 5) {
          return {
            market: cols[0],
            grade: cols[1],
            priceMin: parseFloat(cols[2]),
            priceMax: parseFloat(cols[3]),
            avgPrice: parseFloat(cols[4]),
          };
        }
        return null;
      })
      .get()
      .filter(Boolean);

    const response = NextResponse.json({ prices });
    response.headers.set('Access-Control-Allow-Origin', '*'); // ✅ Allows any origin
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  } catch (error) {
    console.error('Error fetching cardamom prices:', error);
    return NextResponse.json({ error: 'Failed to retrieve data' }, { status: 500 });
  }
}
