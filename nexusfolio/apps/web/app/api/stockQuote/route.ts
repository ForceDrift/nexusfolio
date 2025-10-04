import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol parameter is required' }, { status: 400 });
  }

  try {
    // Using Yahoo Finance API for real stock data
    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
    
    const response = await fetch(yahooUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
      return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
    }

    const result = data.chart.result[0];
    const meta = result.meta;
    const quote = result.indicators?.quote?.[0];
    
    // Calculate market cap (approximate)
    const sharesOutstanding = meta.sharesOutstanding || 0;
    const marketCap = sharesOutstanding * meta.regularMarketPrice;
    
    // Format volume
    const volume = meta.regularMarketVolume || 0;
    const formatVolume = (value: number): string => {
      if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
      if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
      if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
      return `${value.toFixed(0)}`;
    };

    // Format market cap
    const formatMarketCap = (value: number): string => {
      if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
      if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
      if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
      return `${value.toFixed(0)}`;
    };

    const stockData = {
      symbol: meta.symbol,
      name: meta.longName || meta.shortName || symbol,
      price: meta.regularMarketPrice || 0,
      previousClose: meta.previousClose || 0,
      change: (meta.regularMarketPrice || 0) - (meta.previousClose || 0),
      changePercent: meta.previousClose ? 
        (((meta.regularMarketPrice || 0) - meta.previousClose) / meta.previousClose) * 100 : 0,
      marketCap: formatMarketCap(marketCap),
      volume: formatVolume(volume),
      high: meta.regularMarketDayHigh || 0,
      low: meta.regularMarketDayLow || 0,
      open: meta.regularMarketOpen || 0,
      exchange: meta.exchangeName || 'N/A',
      currency: meta.currency || 'USD',
      timestamp: meta.regularMarketTime || Date.now()
    };

    return NextResponse.json({ stockData });

  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' }, 
      { status: 500 }
    );
  }
}
