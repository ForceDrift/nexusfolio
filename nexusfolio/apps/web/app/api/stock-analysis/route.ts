import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Stock symbol is required. Use: /api/stock-analysis?symbol=AAPL' 
        },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        message: 'Gemini API key not configured. Please set GEMINI_API_KEY in environment variables.' 
      }, { status: 500 });
    }

    console.log(`Generating markdown analysis for stock: ${symbol.toUpperCase()}`);

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-lite",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });

      const prompt = `Analyze ${symbol.toUpperCase()} stock with focus on the MOST RECENT news and developments. Use today's date: ${new Date().toISOString().split('T')[0]}.

      Return ONLY a JSON object with this exact format:
      {
        "success": true,
        "symbol": "${symbol.toUpperCase()}",
        "companyName": "Company Name",
        "analysisDate": "${new Date().toISOString()}",
        "markdownReport": "# ${symbol.toUpperCase()} Stock Analysis - ${new Date().toLocaleDateString()}\\n\\n## Latest News & Developments\\n\\n### Recent Headlines\\n- **Today's News:** Most recent development\\n- **This Week:** Recent company updates\\n- **Market Impact:** How recent news affects stock\\n\\n## Current Market Analysis\\n\\n### Recent Stock Performance\\n- **Current Price:** Latest trading data\\n- **Recent Movement:** Price changes this week\\n- **Volume:** Recent trading activity\\n\\n### Latest Financial Updates\\n- **Recent Earnings:** Most recent quarterly results\\n- **Analyst Updates:** Latest price targets and ratings\\n- **Market Sentiment:** Current investor sentiment\\n\\n## Company-Specific Recent Events\\n\\n### Product Launches/Updates\\n- Recent product announcements\\n- Software updates or releases\\n- Service expansions\\n\\n### Strategic Developments\\n- Recent partnerships or acquisitions\\n- Management changes\\n- Regulatory developments\\n\\n### Industry Impact\\n- How recent industry trends affect the company\\n- Competitive landscape changes\\n- Market positioning updates\\n\\n## Investment Outlook (Based on Recent News)\\n\\n### Short-term Outlook (Next 30 days)\\n- Immediate catalysts from recent news\\n- Expected price movements\\n- Key events to watch\\n\\n### Long-term Outlook\\n- Strategic implications of recent developments\\n- Growth prospects based on current trends\\n- Risk factors from recent events\\n\\n### Recommendation\\n- **Current Rating:** Buy/Hold/Sell based on recent news\\n- **Price Target:** Based on latest analysis\\n- **Key Risks:** Recent risk factors\\n\\n## Recent Risk Factors\\n- New regulatory challenges\\n- Recent competitive threats\\n- Market volatility factors\\n- Company-specific recent risks"
      }

      Focus on the most recent, specific news about ${symbol.toUpperCase()}. Include actual recent developments, not generic information.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('Gemini response received, parsing...');

      // Try to parse the JSON response
      let analysisData;
      try {
        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysisData = JSON.parse(jsonMatch[0]);
          console.log('Successfully parsed Gemini response');
        } else {
          throw new Error('No JSON found in Gemini response');
        }
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', parseError);
        
        // Fallback response with markdown
        analysisData = {
          success: true,
          symbol: symbol.toUpperCase(),
          companyName: getCompanyName(symbol),
          analysisDate: new Date().toISOString(),
          markdownReport: `# ${symbol.toUpperCase()} Stock Analysis Report

## Company Overview

**Company Name:** ${getCompanyName(symbol)}  
**Symbol:** ${symbol.toUpperCase()}  
**Analysis Date:** ${new Date().toLocaleDateString()}

### Business Model
${symbol.toUpperCase()} operates in the technology sector with a focus on innovative products and services. The company has established a strong market position through strategic initiatives and customer-focused solutions.

### Industry Position
- **Sector:** Technology/Financial Services
- **Market Position:** Leading player in core business segments
- **Key Products:** Core Product 1, Core Product 2, Core Product 3

## Financial Performance

### Recent Earnings
Recent earnings performance shows consistent growth with strong fundamentals supporting the company's market position.

### Key Financial Metrics
| Metric | Value | Trend |
|--------|-------|-------|
| Market Cap | $XXX billion | ↗️ Positive |
| P/E Ratio | XX.X | ↗️ Improving |
| Debt Level | Low | ✅ Stable |

### Profitability Analysis
The company maintains strong profitability margins driven by operational efficiency and strategic pricing.

## Business Strategy

### Growth Plans
- Strategic growth initiatives and market expansion
- Focus on innovation and R&D investments
- International market development

### Competitive Advantages
- **Advantage 1:** Strong brand recognition
- **Advantage 2:** Technological innovation
- **Advantage 3:** Market leadership position

## Market Analysis

### Stock Performance
Recent stock performance indicates positive momentum with strong investor confidence and market sentiment.

### Analyst Coverage
- **Rating:** Buy/Hold/Sell
- **Price Target:** $XXX
- **Coverage:** Multiple analyst reports

## Risk Assessment

### Business Risks
- Risk factor 1
- Risk factor 2
- Risk factor 3

### Market Risks
- Market volatility
- Economic conditions
- Regulatory changes

## Investment Outlook

### Short-term Outlook
Positive short-term prospects with key catalysts driving growth and market expansion.

### Long-term Outlook
Strong long-term fundamentals support continued growth and market leadership position.

### Recommendation
**Overall Recommendation:** Buy/Hold/Sell based on current market conditions and company fundamentals.

---

> **Note:** This is a fallback response due to parsing error. Please check Gemini API configuration.
`
        };
      }

      return NextResponse.json(analysisData, { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });

    } catch (geminiError) {
      console.error('Error calling Gemini API:', geminiError);
      
      return NextResponse.json({
        success: false,
        symbol: symbol.toUpperCase(),
        message: 'Failed to generate analysis with Gemini AI',
        error: geminiError instanceof Error ? geminiError.message : 'Unknown error',
        suggestion: 'Please check your GEMINI_API_KEY configuration'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error in stock analysis API:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper function to get company name
function getCompanyName(symbol: string): string {
  const companyNames: { [key: string]: string } = {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com Inc.',
    'TSLA': 'Tesla Inc.',
    'META': 'Meta Platforms Inc.',
    'NVDA': 'NVIDIA Corporation',
    'NFLX': 'Netflix Inc.',
    'DIS': 'The Walt Disney Company',
    'NKE': 'Nike Inc.',
    'NASA.JK': 'NASA Indonesia'
  };
  
  return companyNames[symbol.toUpperCase()] || `${symbol.toUpperCase()} Corporation`;
}
