import dbConnect from '@/utils/dbConnect';
import Stock from '@/models/Stock';

export interface Stock {
  symbol: string;
  name: string;
  shares: number;
  currentPrice?: number;
  sector: string;
  weight: number; // Portfolio weight percentage
  purchasePrice?: number;
  totalValue?: number;
  gainLoss?: number;
  gainLossPercent?: number;
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
  private userId?: string;

  constructor(portfolio?: Portfolio, userId?: string) {
    this.userId = userId;
    this.portfolio = portfolio || SAMPLE_PORTFOLIO;
  }

  async getPortfolio(): Promise<Portfolio> {
    if (this.userId) {
      try {
        const userStocks = await this.fetchUserStocksFromDB();
        if (userStocks.stocks.length > 0) {
          this.portfolio = userStocks;
        }
      } catch (error) {
        console.error('Error fetching user stocks from database:', error);
        // Fall back to sample portfolio if database fetch fails
      }
    }
    return this.portfolio;
  }

  private async fetchUserStocksFromDB(): Promise<Portfolio> {
    if (!this.userId) {
      throw new Error('User ID is required to fetch stocks from database');
    }

    try {
      // Connect to database
      await dbConnect();
      
      console.log('Fetching user stocks from database for user:', this.userId);
      
      // Fetch user's stocks directly from the database
      const userStocks = await Stock.find({ userId: this.userId }).sort({ createdAt: -1 });
      
      console.log('Found', userStocks.length, 'stocks for user');
      
      if (userStocks.length === 0) {
        // Return empty portfolio if no stocks found
        return {
          stocks: [],
          totalValue: 0,
          lastUpdated: new Date()
        };
      }

      // Transform the data to match our Portfolio interface
      const stocks: Stock[] = userStocks.map((userStock: any) => ({
        symbol: userStock.stockCode,
        name: userStock.stockCode, // Use stockCode as name if stockName not available
        shares: 1, // Default to 1 share since we don't store shares in the current model
        sector: 'Unknown', // Default sector since we don't store it in the current model
        weight: 0, // Will be calculated based on equal distribution
        purchasePrice: 0,
        currentPrice: 0,
        totalValue: 0,
        gainLoss: 0,
        gainLossPercent: 0
      }));

      // Calculate equal weights for all stocks
      const equalWeight = 100 / stocks.length;
      stocks.forEach(stock => {
        stock.weight = equalWeight;
      });

      console.log('Transformed stocks:', stocks.map(s => s.symbol));

      return {
        stocks,
        totalValue: 0, // Will be calculated with real prices
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error fetching user stocks from database:', error);
      throw error;
    }
  }

  async getStockSymbols(): Promise<string[]> {
    const portfolio = await this.getPortfolio();
    return portfolio.stocks.map(stock => stock.symbol);
  }

  async getStocksBySector(sector: string): Promise<Stock[]> {
    const portfolio = await this.getPortfolio();
    return portfolio.stocks.filter(stock => stock.sector === sector);
  }

  async getTopHoldings(limit: number = 5): Promise<Stock[]> {
    const portfolio = await this.getPortfolio();
    return [...portfolio.stocks]
      .sort((a, b) => b.weight - a.weight)
      .slice(0, limit);
  }

  async getSectorAllocation(): Promise<Record<string, number>> {
    const portfolio = await this.getPortfolio();
    const allocation: Record<string, number> = {};
    portfolio.stocks.forEach(stock => {
      allocation[stock.sector] = (allocation[stock.sector] || 0) + stock.weight;
    });
    return allocation;
  }

  // Get stocks mentioned in user query
  async getRelevantStocks(query: string): Promise<Stock[]> {
    const portfolio = await this.getPortfolio();
    const queryLower = query.toLowerCase();
    return portfolio.stocks.filter(stock => 
      queryLower.includes(stock.symbol.toLowerCase()) ||
      queryLower.includes(stock.name.toLowerCase()) ||
      queryLower.includes(stock.sector.toLowerCase())
    );
  }
}

// Export singleton instance
export const portfolioService = new PortfolioService();
