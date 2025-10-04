import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    // Using Yahoo Finance API for stock search
    const response = await fetch(
      `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Yahoo Finance');
    }

    const data = await response.json();
    
    // Company domain mappings for specific cases only
    const companyDomains: { [key: string]: string } = {
      'AAPL': 'apple.com',
      'GOOGL': 'google.com',
      'GOOG': 'google.com',
      'MSFT': 'microsoft.com',
      'AMZN': 'amazon.com',
      'TSLA': 'tesla.com',
      'META': 'meta.com',
      'NVDA': 'nvidia.com',
      'NFLX': 'netflix.com',
      'ADBE': 'adobe.com',
      'CRM': 'salesforce.com',
      'ORCL': 'oracle.com',
      'INTC': 'intel.com',
      'IBM': 'ibm.com',
      'CSCO': 'cisco.com',
      'V': 'visa.com',
      'MA': 'mastercard.com',
      'JPM': 'jpmorganchase.com',
      'BAC': 'bankofamerica.com',
      'WMT': 'walmart.com',
      'PG': 'pg.com',
      'KO': 'coca-cola.com',
      'PEP': 'pepsico.com',
      'DIS': 'thewaltdisneycompany.com',
      'NKE': 'nike.com',
      'AERG': 'appliedenergetics.com'
    };

    // Transform the data to a cleaner format
    const stocks = data.quotes?.map((quote: any) => {
      // Use Clearbit as default, specific mappings for known companies
      const domain = companyDomains[quote.symbol] || `${quote.symbol.toLowerCase()}.com`;
      const logoUrl = `https://logo.clearbit.com/${domain}`;
      
      console.log(`Stock: ${quote.symbol} -> Domain: ${domain} -> Logo URL: ${logoUrl}`);
      
      return {
        symbol: quote.symbol,
        name: quote.longname || quote.shortname,
        exchange: quote.exchange,
        type: quote.typeDisp,
        market: quote.exchangeDisp,
        logoUrl: logoUrl
      };
    }) || [];

    return NextResponse.json({ stocks });
  } catch (error) {
    console.error('Stock search error:', error);
    return NextResponse.json(
      { error: 'Failed to search stocks' },
      { status: 500 }
    );
  }
}
