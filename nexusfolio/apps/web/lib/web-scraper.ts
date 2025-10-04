import { portfolioService, type Stock } from './portfolio';

export interface ScrapedData {
  symbol: string;
  title: string;
  content: string;
  url: string;
  timestamp: Date;
  source: string;
}

export interface SearchResult {
  query: string;
  stocks: string[];
  data: ScrapedData[];
  timestamp: Date;
}

export class WebScraperService {
  private readonly USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

  async searchAndScrape(query: string, stocks: string[]): Promise<SearchResult> {
    console.log(`WebScraper: Starting search for query: "${query}" with stocks: ${stocks.join(', ')}`);
    
    const searchQueries = this.buildSearchQueries(query, stocks);
    const allData: ScrapedData[] = [];

    // Search for each stock-related query
    for (const searchQuery of searchQueries) {
      try {
        console.log(`WebScraper: Searching for: "${searchQuery}"`);
        const searchData = await this.performSearch(searchQuery);
        allData.push(...searchData);
        
        // Add delay to avoid rate limiting
        await this.delay(1000);
      } catch (error) {
        console.error(`WebScraper: Error searching for "${searchQuery}":`, error);
      }
    }

    console.log(`WebScraper: Collected ${allData.length} data points`);
    
    return {
      query,
      stocks,
      data: allData,
      timestamp: new Date()
    };
  }

  private buildSearchQueries(userQuery: string, stocks: string[]): string[] {
    const queries: string[] = [];
    
    // General market query
    queries.push(`${userQuery} market analysis 2024`);
    
    // Stock-specific queries
    stocks.forEach(symbol => {
      queries.push(`${symbol} stock analysis ${userQuery}`);
      queries.push(`${symbol} financial news ${userQuery}`);
    });

    // Sector-based queries
    const portfolio = portfolioService.getPortfolio();
    const sectors = [...new Set(portfolio.stocks.map(s => s.sector))];
    sectors.forEach(sector => {
      queries.push(`${sector} sector ${userQuery} 2024`);
    });

    return queries.slice(0, 5); // Limit to 5 queries to avoid rate limiting
  }

  private async performSearch(query: string): Promise<ScrapedData[]> {
    try {
      // Simulate web scraping with mock data for now
      // In production, you'd use actual web scraping libraries like Puppeteer or Playwright
      const mockData = this.generateMockData(query);
      return mockData;
    } catch (error) {
      console.error('WebScraper: Search failed:', error);
      return [];
    }
  }

  private generateMockData(query: string): ScrapedData[] {
    // Mock data that simulates real financial news and analysis
    const mockSources = [
      'Financial Times',
      'Bloomberg',
      'Reuters',
      'Yahoo Finance',
      'MarketWatch',
      'CNBC',
      'Wall Street Journal'
    ];

    const mockTitles = [
      `${query} Analysis: Market Outlook for 2024`,
      `Expert Insights on ${query} Investment Strategy`,
      `${query} Financial Performance Review`,
      `Market Trends: ${query} Sector Analysis`,
      `${query} Risk Assessment and Recommendations`
    ];

    const mockContent = [
      `Recent analysis suggests that ${query} shows strong fundamentals with positive growth indicators. Market experts recommend monitoring key performance metrics and considering long-term investment strategies.`,
      `The ${query} sector has demonstrated resilience in current market conditions. Investors should focus on companies with strong balance sheets and sustainable competitive advantages.`,
      `Financial data indicates that ${query} presents both opportunities and risks. Diversification and careful risk management are essential for optimal portfolio performance.`,
      `Market volatility in the ${query} space requires careful analysis of technical indicators and fundamental factors. Professional advice is recommended for investment decisions.`,
      `Recent developments in ${query} suggest potential for growth, but investors should remain cautious and consider their risk tolerance and investment objectives.`
    ];

    const results: ScrapedData[] = [];
    const numResults = Math.floor(Math.random() * 3) + 2; // 2-4 results per query

    for (let i = 0; i < numResults; i++) {
      results.push({
        symbol: this.extractSymbolFromQuery(query),
        title: mockTitles[Math.floor(Math.random() * mockTitles.length)],
        content: mockContent[Math.floor(Math.random() * mockContent.length)],
        url: `https://example-finance.com/article/${Date.now()}-${i}`,
        timestamp: new Date(),
        source: mockSources[Math.floor(Math.random() * mockSources.length)]
      });
    }

    return results;
  }

  private extractSymbolFromQuery(query: string): string {
    // Extract stock symbols from query
    const portfolio = portfolioService.getPortfolio();
    const symbols = portfolio.stocks.map(s => s.symbol);
    
    for (const symbol of symbols) {
      if (query.toUpperCase().includes(symbol)) {
        return symbol;
      }
    }
    
    return 'GENERAL';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Process scraped data for RAG
  processForRAG(data: ScrapedData[]): string {
    const processedData = data.map(item => 
      `[${item.source}] ${item.title}\n${item.content}\n`
    ).join('\n---\n\n');

    return `Recent Market Data:\n\n${processedData}`;
  }
}

// Export singleton instance
export const webScraperService = new WebScraperService();
