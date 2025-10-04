import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return NextResponse.json(
        { success: false, message: 'Stock symbol is required' },
        { status: 400 }
      );
    }

    // Simulate web scraping for news (in a real implementation, you'd use a service like NewsAPI, web scraping, etc.)
    const mockNewsData = {
      symbol: symbol,
      companyName: getCompanyName(symbol),
      lastUpdated: new Date().toISOString(),
      news: [
        {
          title: `${getCompanyName(symbol)} Reports Strong Q4 Earnings, Beats Expectations`,
          source: 'Financial Times',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          url: '#',
          summary: `The company reported revenue of $12.5 billion, up 15% year-over-year, exceeding analyst expectations of $11.8 billion.`
        },
        {
          title: `Analysts Upgrade ${getCompanyName(symbol)} Stock Following Recent Performance`,
          source: 'Bloomberg',
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          url: '#',
          summary: `Multiple analysts have raised their price targets for ${symbol}, citing strong fundamentals and growth prospects.`
        },
        {
          title: `${getCompanyName(symbol)} Announces New Strategic Partnership`,
          source: 'Reuters',
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          url: '#',
          summary: `The company has entered into a strategic partnership that could expand its market reach and drive future growth.`
        },
        {
          title: `Market Analysis: ${getCompanyName(symbol)} Positioned for Long-term Growth`,
          source: 'Wall Street Journal',
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
          url: '#',
          summary: `Industry experts believe the company is well-positioned to capitalize on emerging market trends and technological advances.`
        },
        {
          title: `${getCompanyName(symbol)} Stock Price Analysis: Technical Indicators Point to Bullish Trend`,
          source: 'MarketWatch',
          publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
          url: '#',
          summary: `Technical analysis suggests the stock may continue its upward trajectory based on current market conditions and trading patterns.`
        }
      ],
      analysis: {
        sentiment: 'Positive',
        keyPoints: [
          'Strong quarterly earnings performance',
          'Positive analyst sentiment and upgrades',
          'Strategic partnerships driving growth',
          'Favorable technical indicators',
          'Strong market positioning'
        ],
        risks: [
          'Market volatility concerns',
          'Competitive landscape changes',
          'Regulatory environment shifts',
          'Economic uncertainty factors'
        ]
      }
    };

    return NextResponse.json({
      success: true,
      data: mockNewsData
    });

  } catch (error: any) {
    console.error('Error fetching stock news:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch stock news',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

function getCompanyName(symbol: string): string {
  const companyNames: { [key: string]: string } = {
    'AAPL': 'Apple Inc.',
    'NASA.JK': 'NASA Indonesia',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com Inc.',
    'TSLA': 'Tesla Inc.',
    'META': 'Meta Platforms Inc.',
    'NVDA': 'NVIDIA Corporation'
  };
  
  return companyNames[symbol] || `${symbol} Corporation`;
}
