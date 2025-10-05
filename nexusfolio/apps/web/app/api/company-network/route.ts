import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth0 } from '../../../lib/auth0';
import dbConnect from '../../../utils/dbConnect';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return NextResponse.json({ success: false, message: 'Stock symbol is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ success: false, message: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    await dbConnect();

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.0-pro',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });

    const prompt = `You are a financial analyst expert. Generate a comprehensive network of companies related to ${symbol.toUpperCase()}.

Please provide a JSON response with the following structure:
{
  "success": true,
  "symbol": "${symbol.toUpperCase()}",
  "companyName": "Company Name",
  "network": [
    {
      "name": "Company Name",
      "relationship": "Type of relationship",
      "impact": "positive|negative|neutral",
      "description": "Brief description of the relationship",
      "sector": "Industry sector"
    }
  ]
}

For ${symbol.toUpperCase()}, identify and include:
1. Direct competitors (negative impact)
2. Key suppliers and partners (positive impact)
3. Customers and clients (positive impact)
4. Subsidiaries and related companies (neutral/positive impact)
5. Regulatory bodies and government entities (neutral impact)
6. Industry leaders and market influencers (neutral impact)
7. Technology partners and collaborators (positive impact)
8. Financial institutions and investors (neutral impact)

Include 8-12 companies total. Be specific about the relationship type and provide accurate company names.
Focus on current, publicly traded companies when possible.
Make the relationships realistic and based on actual business connections.

Return ONLY the JSON response, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const networkData = JSON.parse(jsonMatch[0]);
      
      if (!networkData.success || !networkData.network || !Array.isArray(networkData.network)) {
        throw new Error('Invalid response structure');
      }

      return NextResponse.json({
        success: true,
        symbol: networkData.symbol,
        companyName: networkData.companyName,
        network: networkData.network
      });

    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      
      // Fallback to mock data if parsing fails
      const fallbackNetwork = generateFallbackNetwork(symbol.toUpperCase());
      
      return NextResponse.json({
        success: true,
        symbol: symbol.toUpperCase(),
        companyName: `${symbol.toUpperCase()} Company`,
        network: fallbackNetwork
      });
    }

  } catch (error) {
    console.error('Error generating company network:', error);
    
    // Fallback to mock data on error
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'UNKNOWN';
    
    return NextResponse.json({
      success: true,
      symbol: symbol.toUpperCase(),
      companyName: `${symbol.toUpperCase()} Company`,
      network: generateFallbackNetwork(symbol.toUpperCase())
    });
  }
}

function generateFallbackNetwork(symbol: string) {
  const fallbackMappings: { [key: string]: Array<{name: string, relationship: string, impact: 'positive' | 'negative' | 'neutral', description: string, sector: string}> } = {
    'AAPL': [
      { name: 'TSMC', relationship: 'Chip Supplier', impact: 'positive', description: 'Primary supplier of A-series and M-series chips', sector: 'Semiconductors' },
      { name: 'Foxconn', relationship: 'Manufacturing Partner', impact: 'positive', description: 'Main iPhone assembly partner', sector: 'Electronics Manufacturing' },
      { name: 'Samsung', relationship: 'Competitor', impact: 'negative', description: 'Direct competitor in smartphones and tablets', sector: 'Consumer Electronics' },
      { name: 'Google', relationship: 'Competitor', impact: 'negative', description: 'Competes in mobile OS and services', sector: 'Technology' },
      { name: 'Microsoft', relationship: 'Competitor', impact: 'negative', description: 'Competes in software and cloud services', sector: 'Technology' },
      { name: 'Qualcomm', relationship: 'Supplier', impact: 'positive', description: 'Modem and wireless technology supplier', sector: 'Semiconductors' },
      { name: 'Broadcom', relationship: 'Supplier', impact: 'positive', description: 'Wireless and connectivity chip supplier', sector: 'Semiconductors' },
      { name: 'Intel', relationship: 'Competitor', impact: 'negative', description: 'Competes in computer processors', sector: 'Semiconductors' }
    ],
    'MSFT': [
      { name: 'OpenAI', relationship: 'Strategic Partner', impact: 'positive', description: 'Major AI partnership and investment', sector: 'Artificial Intelligence' },
      { name: 'NVIDIA', relationship: 'AI Partner', impact: 'positive', description: 'GPU partnership for AI workloads', sector: 'Semiconductors' },
      { name: 'Google', relationship: 'Competitor', impact: 'negative', description: 'Competes in cloud and productivity software', sector: 'Technology' },
      { name: 'Amazon', relationship: 'Competitor', impact: 'negative', description: 'Competes in cloud computing', sector: 'Technology' },
      { name: 'Apple', relationship: 'Competitor', impact: 'negative', description: 'Competes in software and services', sector: 'Technology' },
      { name: 'Salesforce', relationship: 'Competitor', impact: 'negative', description: 'Competes in CRM and enterprise software', sector: 'Software' },
      { name: 'Oracle', relationship: 'Competitor', impact: 'negative', description: 'Competes in enterprise software and cloud', sector: 'Software' },
      { name: 'IBM', relationship: 'Partner', impact: 'positive', description: 'Enterprise partnership and collaboration', sector: 'Technology' }
    ],
    'GOOGL': [
      { name: 'OpenAI', relationship: 'Competitor', impact: 'negative', description: 'Competes in AI and language models', sector: 'Artificial Intelligence' },
      { name: 'Microsoft', relationship: 'Competitor', impact: 'negative', description: 'Competes in search and cloud services', sector: 'Technology' },
      { name: 'Apple', relationship: 'Partner/Competitor', impact: 'neutral', description: 'Search partnership but competes in mobile', sector: 'Technology' },
      { name: 'Meta', relationship: 'Competitor', impact: 'negative', description: 'Competes in advertising and social platforms', sector: 'Social Media' },
      { name: 'Amazon', relationship: 'Competitor', impact: 'negative', description: 'Competes in cloud and e-commerce', sector: 'Technology' },
      { name: 'NVIDIA', relationship: 'AI Partner', impact: 'positive', description: 'GPU partnership for AI research', sector: 'Semiconductors' },
      { name: 'Tesla', relationship: 'AI Partner', impact: 'positive', description: 'Autonomous driving AI collaboration', sector: 'Automotive' },
      { name: 'YouTube', relationship: 'Subsidiary', impact: 'positive', description: 'Video platform subsidiary', sector: 'Media' }
    ],
    'TSLA': [
      { name: 'Panasonic', relationship: 'Battery Supplier', impact: 'positive', description: 'Long-term battery cell supplier', sector: 'Batteries' },
      { name: 'CATL', relationship: 'Battery Supplier', impact: 'positive', description: 'Chinese battery supplier partnership', sector: 'Batteries' },
      { name: 'Ford', relationship: 'Competitor', impact: 'negative', description: 'Traditional automaker competitor', sector: 'Automotive' },
      { name: 'GM', relationship: 'Competitor', impact: 'negative', description: 'Traditional automaker competitor', sector: 'Automotive' },
      { name: 'Toyota', relationship: 'Competitor', impact: 'negative', description: 'Global automotive competitor', sector: 'Automotive' },
      { name: 'BYD', relationship: 'Competitor', impact: 'negative', description: 'Chinese EV manufacturer competitor', sector: 'Automotive' },
      { name: 'Rivian', relationship: 'Competitor', impact: 'negative', description: 'Electric truck competitor', sector: 'Automotive' },
      { name: 'SpaceX', relationship: 'Related Company', impact: 'neutral', description: 'Elon Musk\'s other major company', sector: 'Aerospace' }
    ]
  };

  return fallbackMappings[symbol] || [
    { name: 'Market Competitors', relationship: 'Competition', impact: 'negative', description: 'Direct industry competitors', sector: 'Various' },
    { name: 'Key Suppliers', relationship: 'Supply Chain', impact: 'positive', description: 'Critical suppliers and partners', sector: 'Various' },
    { name: 'Strategic Partners', relationship: 'Partnership', impact: 'positive', description: 'Strategic business partnerships', sector: 'Various' },
    { name: 'Industry Leaders', relationship: 'Market Position', impact: 'neutral', description: 'Influential industry players', sector: 'Various' },
    { name: 'Regulatory Bodies', relationship: 'Compliance', impact: 'neutral', description: 'Government and regulatory entities', sector: 'Government' },
    { name: 'Financial Institutions', relationship: 'Banking', impact: 'neutral', description: 'Banks and financial partners', sector: 'Finance' }
  ];
}
