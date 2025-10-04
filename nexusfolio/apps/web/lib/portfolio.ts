export interface Stock {
  symbol: string;
  name: string;
  shares: number;
  currentPrice?: number;
  sector: string;
  weight: number; // Portfolio weight percentage
}

export interface Portfolio {
  stocks: Stock[];
  totalValue: number;
  lastUpdated: Date;
}

// Hardcoded portfolio with 10 diverse stocks
export const SAMPLE_PORTFOLIO: Portfolio = {
  stocks: [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      shares: 50,
      sector: "Technology",
      weight: 15.0
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      shares: 30,
      sector: "Technology",
      weight: 12.0
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      shares: 20,
      sector: "Technology",
      weight: 10.0
    },
    {
      symbol: "JNJ",
      name: "Johnson & Johnson",
      shares: 40,
      sector: "Healthcare",
      weight: 8.0
    },
    {
      symbol: "JPM",
      name: "JPMorgan Chase & Co.",
      shares: 25,
      sector: "Financial Services",
      weight: 7.0
    },
    {
      symbol: "V",
      name: "Visa Inc.",
      shares: 15,
      sector: "Financial Services",
      weight: 6.0
    },
    {
      symbol: "PG",
      name: "Procter & Gamble Co.",
      shares: 35,
      sector: "Consumer Staples",
      weight: 5.0
    },
    {
      symbol: "UNH",
      name: "UnitedHealth Group Inc.",
      shares: 20,
      sector: "Healthcare",
      weight: 8.0
    },
    {
      symbol: "HD",
      name: "Home Depot Inc.",
      shares: 15,
      sector: "Consumer Discretionary",
      weight: 4.0
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      shares: 10,
      sector: "Technology",
      weight: 25.0
    }
  ],
  totalValue: 0, // Will be calculated with real prices
  lastUpdated: new Date()
};

export class PortfolioService {
  private portfolio: Portfolio;

  constructor(portfolio: Portfolio = SAMPLE_PORTFOLIO) {
    this.portfolio = portfolio;
  }

  getPortfolio(): Portfolio {
    return this.portfolio;
  }

  getStockSymbols(): string[] {
    return this.portfolio.stocks.map(stock => stock.symbol);
  }

  getStocksBySector(sector: string): Stock[] {
    return this.portfolio.stocks.filter(stock => stock.sector === sector);
  }

  getTopHoldings(limit: number = 5): Stock[] {
    return [...this.portfolio.stocks]
      .sort((a, b) => b.weight - a.weight)
      .slice(0, limit);
  }

  getSectorAllocation(): Record<string, number> {
    const allocation: Record<string, number> = {};
    this.portfolio.stocks.forEach(stock => {
      allocation[stock.sector] = (allocation[stock.sector] || 0) + stock.weight;
    });
    return allocation;
  }

  // Get stocks mentioned in user query
  getRelevantStocks(query: string): Stock[] {
    const queryLower = query.toLowerCase();
    return this.portfolio.stocks.filter(stock => 
      queryLower.includes(stock.symbol.toLowerCase()) ||
      queryLower.includes(stock.name.toLowerCase()) ||
      queryLower.includes(stock.sector.toLowerCase())
    );
  }
}

// Export singleton instance
export const portfolioService = new PortfolioService();
