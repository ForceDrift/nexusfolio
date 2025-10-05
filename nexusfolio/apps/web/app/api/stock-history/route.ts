import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const period = searchParams.get('period') || '1M'; // 1D, 1W, 1M, 3M, 6M, 1Y

    if (!symbol) {
      return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    // Use Finnhub API for historical data
    const finnhubToken = process.env.FINNHUB_API_KEY;
    if (!finnhubToken) {
      console.error('Finnhub API key not configured');
      return NextResponse.json({ 
        success: false,
        error: 'Historical data service not available' 
      }, { status: 503 });
    }

    // Calculate time range based on period
    const now = Math.floor(Date.now() / 1000);
    let from: number;
    
    switch (period) {
      case '1D':
        from = now - (24 * 60 * 60); // 1 day
        break;
      case '1W':
        from = now - (7 * 24 * 60 * 60); // 1 week
        break;
      case '1M':
        from = now - (30 * 24 * 60 * 60); // 1 month
        break;
      case '3M':
        from = now - (90 * 24 * 60 * 60); // 3 months
        break;
      case '6M':
        from = now - (180 * 24 * 60 * 60); // 6 months
        break;
      case '1Y':
        from = now - (365 * 24 * 60 * 60); // 1 year
        break;
      default:
        from = now - (30 * 24 * 60 * 60); // default to 1 month
    }

    const finnhubUrl = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${now}&token=${finnhubToken}`;
    
    console.log(`Fetching historical data for ${symbol} from Finnhub: ${finnhubUrl}`);
    
    try {
      const response = await fetch(finnhubUrl);
      const data = await response.json();

      if (data.s === 'no_data') {
        return NextResponse.json({ 
          success: false, 
          error: 'No historical data available for this symbol' 
        }, { status: 404 });
      }

      if (data.s !== 'ok') {
        console.error('Finnhub API error:', data);
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to fetch historical data' 
        }, { status: 500 });
      }

      // Transform Finnhub data to our format
      const { c: close, h: high, l: low, o: open, t: timestamps, v: volume } = data;
      
      const historicalData = timestamps.map((timestamp: number, index: number) => ({
        timestamp,
        date: new Date(timestamp * 1000).toISOString(),
        open: open[index],
        high: high[index],
        low: low[index],
        close: close[index],
        volume: volume[index],
      }));

      return NextResponse.json({
        success: true,
        data: {
          symbol,
          period,
          historicalData,
          currentPrice: close[close.length - 1],
          priceChange: close[close.length - 1] - close[0],
          priceChangePercent: ((close[close.length - 1] - close[0]) / close[0]) * 100,
        },
      });
    } catch (fetchError) {
      console.error('Error fetching from Finnhub:', fetchError);
      return NextResponse.json({ 
        success: false,
        error: 'Failed to fetch historical data from external service' 
      }, { status: 502 });
    }

  } catch (error) {
    console.error('Error in stock history API:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
