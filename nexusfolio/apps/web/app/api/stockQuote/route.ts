import { NextRequest, NextResponse } from 'next/server';

// Helper function to get approximate shares outstanding for major stocks
function getApproximateSharesOutstanding(symbol: string, price: number): number {
  // Approximate shares outstanding for major stocks (in billions)
  const approximateShares: { [key: string]: number } = {
    'AAPL': 15.3, // Apple
    'MSFT': 7.4,  // Microsoft
    'GOOGL': 12.6, // Google
    'GOOG': 12.6,  // Google (Class C)
    'AMZN': 10.6,  // Amazon
    'TSLA': 3.2,   // Tesla
    'META': 2.7,   // Meta
    'NVDA': 2.5,   // NVIDIA
    'BRK.A': 1.5,  // Berkshire Hathaway
    'BRK.B': 1.5,  // Berkshire Hathaway B
    'UNH': 0.9,    // UnitedHealth
    'JNJ': 2.6,    // Johnson & Johnson
    'V': 2.1,      // Visa
    'PG': 2.4,     // Procter & Gamble
    'JPM': 2.9,    // JPMorgan Chase
    'HD': 1.0,     // Home Depot
    'MA': 0.9,     // Mastercard
    'CVX': 1.9,    // Chevron
    'ABBV': 1.8,   // AbbVie
    'BAC': 8.0,    // Bank of America
    'PFE': 5.6,    // Pfizer
    'KO': 4.3,     // Coca-Cola
    'AVGO': 0.4,   // Broadcom
    'PEP': 1.4,    // PepsiCo
    'TMO': 0.4,    // Thermo Fisher
    'COST': 0.4,   // Costco
    'DHR': 0.3,    // Danaher
    'VZ': 4.2,     // Verizon
    'ADBE': 0.5,   // Adobe
    'NFLX': 0.4,   // Netflix
    'CRM': 1.0,    // Salesforce
    'ACN': 0.6,    // Accenture
    'TXN': 1.1,    // Texas Instruments
    'QCOM': 1.1,   // Qualcomm
    'AMD': 1.6,    // Advanced Micro Devices
    'INTC': 4.1,   // Intel
    'CSCO': 4.1,   // Cisco
    'ORCL': 2.7,   // Oracle
    'IBM': 0.9,    // IBM
  };

  const sharesInBillions = approximateShares[symbol.toUpperCase()];
  if (sharesInBillions) {
    return sharesInBillions * 1e9; // Convert to actual shares
  }
  
  return 0; // Return 0 if we don't have data for this stock
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol parameter is required' }, { status: 400 });
  }

  try {
    // Use Alpha Vantage as primary data source
    let data: any = null;
    let endpointUsed = '';
    let marketCapData: any = null;

    // Alpha Vantage API endpoints with your API key
    const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=MYMOEN280QP6B0YL`;
    const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=MYMOEN280QP6B0YL`;

    // Try Alpha Vantage Global Quote first (real-time price data)
    try {
      console.log(`Trying Alpha Vantage Global Quote: ${quoteUrl}`);
      const quoteResponse = await fetch(quoteUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (quoteResponse.ok) {
        const quoteData = await quoteResponse.json();
        if (quoteData['Global Quote'] && quoteData['Global Quote']['01. symbol']) {
          data = quoteData;
          endpointUsed = 'Alpha Vantage Global Quote';
          console.log(`Successfully fetched price data from Alpha Vantage`);
        }
      }
    } catch (error) {
      console.log(`Alpha Vantage Global Quote failed: ${error}`);
    }

    // Try Alpha Vantage Overview for market cap and additional data
    try {
      console.log(`Trying Alpha Vantage Overview: ${overviewUrl}`);
      const overviewResponse = await fetch(overviewUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (overviewResponse.ok) {
        const overviewData = await overviewResponse.json();
        if (overviewData['Symbol']) {
          marketCapData = overviewData;
          console.log(`Successfully fetched market cap data from Alpha Vantage Overview`);
        }
      }
    } catch (error) {
      console.log(`Alpha Vantage Overview failed: ${error}`);
    }

    // Fallback to Yahoo Finance if Alpha Vantage fails
    if (!data) {
      console.log(`Alpha Vantage failed, trying Yahoo Finance as fallback`);
      
      // Try Yahoo Finance chart endpoint as fallback
      try {
        const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
        console.log(`Trying Yahoo Finance chart endpoint: ${chartUrl}`);
        const response = await fetch(chartUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });

        if (response.ok) {
          data = await response.json();
          endpointUsed = chartUrl;
          console.log(`Successfully fetched fallback data from Yahoo Finance`);
        }
      } catch (error) {
        console.log(`Yahoo Finance fallback failed: ${error}`);
      }
    }

    if (!data) {
      throw new Error('All data sources failed');
    }

    // Parse data based on endpoint used
    let result: any = null;
    let price: any = null;
    let summaryDetail: any = null;
    let defaultKeyStatistics: any = null;

    if (endpointUsed.includes('Alpha Vantage')) {
      // Parse Alpha Vantage Global Quote data
      if (data['Global Quote']) {
        const quote = data['Global Quote'];
        price = {
          regularMarketPrice: parseFloat(quote['05. price']),
          previousClose: parseFloat(quote['08. previous close']),
          regularMarketVolume: parseInt(quote['06. volume']),
          regularMarketDayHigh: parseFloat(quote['03. high']),
          regularMarketDayLow: parseFloat(quote['04. low']),
          regularMarketOpen: parseFloat(quote['02. open']),
          exchangeName: 'N/A',
          currency: 'USD',
          symbol: quote['01. symbol'],
          longName: quote['01. symbol'],
          shortName: quote['01. symbol']
        };
        
        // Parse Alpha Vantage Overview data for market cap
        if (marketCapData) {
          defaultKeyStatistics = {
            marketCap: parseFloat(marketCapData['MarketCapitalization']),
            sharesOutstanding: parseFloat(marketCapData['SharesOutstanding'])
          };
          console.log(`Using Alpha Vantage market cap data:`, defaultKeyStatistics);
        }
      }
    } else if (endpointUsed.includes('quoteSummary')) {
      if (!data.quoteSummary || !data.quoteSummary.result || data.quoteSummary.result.length === 0) {
        throw new Error('Stock not found in quoteSummary');
      }
      result = data.quoteSummary.result[0];
      price = result.price;
      summaryDetail = result.summaryDetail;
      defaultKeyStatistics = result.defaultKeyStatistics;
    } else if (endpointUsed.includes('chart')) {
      if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
        throw new Error('Stock not found in chart');
      }
      result = data.chart.result[0];
      price = result.meta;
      summaryDetail = null;
      defaultKeyStatistics = null;
      
      // If we have separate market cap data, use it
      if (marketCapData && marketCapData.quoteSummary && marketCapData.quoteSummary.result && marketCapData.quoteSummary.result.length > 0) {
        const marketCapResult = marketCapData.quoteSummary.result[0];
        defaultKeyStatistics = marketCapResult.defaultKeyStatistics;
        console.log(`Using separate market cap data:`, defaultKeyStatistics);
      }
    }
    
    // Get current price
    const currentPrice = price?.regularMarketPrice?.raw || price?.regularMarketPrice || 0;
    const previousClose = price?.regularMarketPreviousClose?.raw || price?.regularMarketPreviousClose || 0;
    
    // Get market cap - prioritize Alpha Vantage data
    let marketCap = 0;
    
    // First try: Use Alpha Vantage market cap data (most reliable)
    if (defaultKeyStatistics?.marketCap && defaultKeyStatistics.marketCap > 0) {
      marketCap = defaultKeyStatistics.marketCap;
      console.log(`Using Alpha Vantage market cap: ${marketCap}`);
    }
    // Second try: Calculate from Alpha Vantage shares outstanding and price
    else if (defaultKeyStatistics?.sharesOutstanding && currentPrice) {
      marketCap = defaultKeyStatistics.sharesOutstanding * currentPrice;
      console.log(`Calculated market cap from Alpha Vantage shares: ${marketCap}`);
    }
    // Third try: Use marketCap from summaryDetail (Yahoo Finance)
    else if (summaryDetail?.marketCap?.raw) {
      marketCap = summaryDetail.marketCap.raw;
    }
    // Fourth try: Use marketCap from defaultKeyStatistics (Yahoo Finance)
    else if (defaultKeyStatistics?.marketCap?.raw) {
      marketCap = defaultKeyStatistics.marketCap.raw;
    }
    // Fifth try: Calculate from shares outstanding and price (Yahoo Finance)
    else if (defaultKeyStatistics?.sharesOutstanding?.raw && currentPrice) {
      marketCap = defaultKeyStatistics.sharesOutstanding.raw * currentPrice;
    }
    // Sixth try: Use floatSharesOutstanding if available
    else if (defaultKeyStatistics?.floatShares?.raw && currentPrice) {
      marketCap = defaultKeyStatistics.floatShares.raw * currentPrice;
    }
    // Seventh try: Use marketCap from chart meta
    else if (price?.marketCap) {
      marketCap = price.marketCap;
    }
    // Eighth try: Calculate from sharesOutstanding in chart meta
    else if (price?.sharesOutstanding && currentPrice) {
      marketCap = price.sharesOutstanding * currentPrice;
    }
    // Ninth try: Use approximate market cap for major stocks if we have price
    else if (currentPrice > 0) {
      // Approximate market cap calculation for major stocks (this is a fallback)
      const approximateShares = getApproximateSharesOutstanding(symbol, currentPrice);
      if (approximateShares > 0) {
        marketCap = approximateShares * currentPrice;
        console.log(`Using approximate market cap calculation for ${symbol}`);
      }
    }
    
    // Get volume
    const volume = summaryDetail?.volume?.raw || summaryDetail?.volume || price?.regularMarketVolume || 0;
    
    // Format volume
    const formatVolume = (value: number): string => {
      if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
      if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
      if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
      return `${value.toFixed(0)}`;
    };

    // Format market cap
    const formatMarketCap = (value: number): string => {
      if (value <= 0) return 'N/A';
      if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
      if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
      if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
      if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
      return `$${value.toFixed(0)}`;
    };

    const stockData = {
      symbol: symbol.toUpperCase(),
      name: price?.longName || price?.shortName || symbol,
      price: currentPrice,
      previousClose: previousClose,
      change: currentPrice - previousClose,
      changePercent: previousClose ? ((currentPrice - previousClose) / previousClose) * 100 : 0,
      marketCap: formatMarketCap(marketCap),
      volume: formatVolume(volume),
      high: price?.regularMarketDayHigh?.raw || price?.regularMarketDayHigh || 0,
      low: price?.regularMarketDayLow?.raw || price?.regularMarketDayLow || 0,
      open: price?.regularMarketOpen?.raw || price?.regularMarketOpen || 0,
      exchange: price?.exchangeName || 'N/A',
      currency: price?.currency || 'USD',
      timestamp: price?.regularMarketTime || Date.now(),
      // Debug info for market cap
      debug: {
        marketCapRaw: marketCap,
        sharesOutstanding: defaultKeyStatistics?.sharesOutstanding?.raw || defaultKeyStatistics?.sharesOutstanding || price?.sharesOutstanding,
        floatShares: defaultKeyStatistics?.floatShares?.raw,
        marketCapFromSummary: summaryDetail?.marketCap?.raw,
        marketCapFromStats: defaultKeyStatistics?.marketCap?.raw || defaultKeyStatistics?.marketCap,
        marketCapFromChart: price?.marketCap,
        price: currentPrice,
        endpointUsed: endpointUsed,
        hasSummaryDetail: !!summaryDetail,
        hasDefaultKeyStats: !!defaultKeyStatistics,
        hasSeparateMarketCapData: !!marketCapData,
        marketCapCalculationMethod: marketCap > 0 ? 'success' : 'failed',
        alphaVantageMarketCap: defaultKeyStatistics?.marketCap,
        alphaVantageSharesOutstanding: defaultKeyStatistics?.sharesOutstanding
      }
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
