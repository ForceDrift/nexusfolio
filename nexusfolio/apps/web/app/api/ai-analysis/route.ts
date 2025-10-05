import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { symbol, price, change, changePercent, marketCap, volume } = await request.json();

    if (!symbol) {
      return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    // Generate AI analysis based on stock data
    const analysis = generateAIAnalysis({
      symbol,
      price: price || 0,
      change: change || 0,
      changePercent: changePercent || 0,
      marketCap: marketCap || 'N/A',
      volume: volume || 'N/A',
    });

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateAIAnalysis(stockData: {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  volume: string;
}) {
  const { symbol, price, change, changePercent, marketCap, volume } = stockData;
  
  // Determine market sentiment
  let sentiment = 'neutral';
  if (changePercent > 5) sentiment = 'very bullish';
  else if (changePercent > 2) sentiment = 'bullish';
  else if (changePercent < -5) sentiment = 'very bearish';
  else if (changePercent < -2) sentiment = 'bearish';

  // Determine volatility level
  let volatility = 'low';
  if (Math.abs(changePercent) > 10) volatility = 'very high';
  else if (Math.abs(changePercent) > 5) volatility = 'high';
  else if (Math.abs(changePercent) > 2) volatility = 'medium';

  // Determine market cap category
  const marketCapValue = parseFloat(marketCap.replace(/[^\d.]/g, '')) || 0;
  let marketCapCategory = 'micro';
  if (marketCapValue > 10000000000) marketCapCategory = 'large';
  else if (marketCapValue > 2000000000) marketCapCategory = 'mid';
  else if (marketCapValue > 300000000) marketCapCategory = 'small';

  // Determine volume analysis
  const volumeValue = parseFloat(volume.replace(/[^\d.]/g, '')) || 0;
  let volumeAnalysis = 'low';
  if (volumeValue > 10000000) volumeAnalysis = 'very high';
  else if (volumeValue > 1000000) volumeAnalysis = 'high';
  else if (volumeValue > 100000) volumeAnalysis = 'medium';

  // Generate technical analysis
  const technicalSignals = [];
  if (changePercent > 0) technicalSignals.push('Positive momentum');
  if (changePercent < 0) technicalSignals.push('Negative momentum');
  if (volumeAnalysis === 'high' || volumeAnalysis === 'very high') technicalSignals.push('High volume activity');
  if (volatility === 'high' || volatility === 'very high') technicalSignals.push('High volatility');

  // Generate recommendation
  let recommendation = 'HOLD';
  let recommendationReason = '';
  
  if (sentiment === 'very bullish' && volumeAnalysis === 'high') {
    recommendation = 'BUY';
    recommendationReason = 'Strong positive momentum with high volume support';
  } else if (sentiment === 'very bearish' && volumeAnalysis === 'high') {
    recommendation = 'SELL';
    recommendationReason = 'Strong negative momentum with high volume';
  } else if (sentiment === 'bullish' && marketCapCategory === 'large') {
    recommendation = 'BUY';
    recommendationReason = 'Positive trend in large-cap stock';
  } else if (sentiment === 'bearish' && volatility === 'high') {
    recommendation = 'SELL';
    recommendationReason = 'Negative trend with high volatility';
  } else {
    recommendationReason = 'Mixed signals, maintain current position';
  }

  // Generate risk assessment
  let riskLevel = 'medium';
  if (volatility === 'very high' || marketCapCategory === 'micro') {
    riskLevel = 'high';
  } else if (volatility === 'low' && marketCapCategory === 'large') {
    riskLevel = 'low';
  }

  // Generate price targets (simplified)
  const priceTargets = {
    shortTerm: price * (1 + (changePercent / 100) * 0.5),
    mediumTerm: price * (1 + (changePercent / 100) * 1.2),
    longTerm: price * (1 + (changePercent / 100) * 2),
  };

  return {
    symbol,
    sentiment,
    volatility,
    marketCapCategory,
    volumeAnalysis,
    technicalSignals,
    recommendation,
    recommendationReason,
    riskLevel,
    priceTargets,
    analysis: `Based on current market data, ${symbol} shows ${sentiment} sentiment with ${volatility} volatility. The stock is trading at $${price.toFixed(2)} with a ${changePercent > 0 ? 'positive' : 'negative'} change of ${changePercent.toFixed(2)}%. Volume analysis indicates ${volumeAnalysis} trading activity. Our recommendation is to ${recommendation} based on ${recommendationReason.toLowerCase()}.`,
    timestamp: new Date().toISOString(),
  };
}
