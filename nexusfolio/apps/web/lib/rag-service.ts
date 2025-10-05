import { GoogleGenerativeAI } from '@google/generative-ai';
import { PortfolioService, SAMPLE_PORTFOLIO, type Stock } from './portfolio';
import { SemanticSearchService, type SemanticSearchResult } from './semantic-search';

export interface RAGResponse {
  response: string;
  sources: string[];
  relevantStocks: string[];
  analysisType: 'general' | 'stock-specific' | 'sector-analysis' | 'risk-assessment';
}

export class RAGService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private userId?: string;
  private portfolioService: PortfolioService;
  private semanticSearchService: SemanticSearchService;

  constructor(userId?: string) {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-lite",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });
    this.userId = userId;
    this.portfolioService = new PortfolioService(undefined, userId);
    this.semanticSearchService = new SemanticSearchService(userId);
  }

  async generateRAGResponse(userQuery: string): Promise<RAGResponse> {
    console.log('RAG Service: Starting vector-based RAG analysis for query:', userQuery);
    console.log('RAG Service: User ID:', this.userId || 'anonymous');
    
    try {
      // Step 1: Analyze user query and identify relevant stocks
      const relevantStocks = await this.identifyRelevantStocks(userQuery);
      console.log('RAG Service: Identified relevant stocks:', relevantStocks);

      // Step 2: Perform semantic search using vector database
      let searchResult;
      try {
        searchResult = await this.semanticSearchService.searchRelevantContext(userQuery, relevantStocks);
        console.log('RAG Service: Found', searchResult.relevantDocuments.length, 'relevant documents');
        console.log('RAG Service: Sources:', searchResult.sources);
      } catch (searchError) {
        console.warn('RAG Service: Semantic search failed, using fallback context:', searchError);
        // Create a fallback search result
        searchResult = {
          query: userQuery,
          relevantDocuments: [],
          context: `User query: ${userQuery}. Portfolio context: ${await this.getPortfolioContext()}`,
          sources: ['Portfolio Analysis'],
          symbols: relevantStocks,
          sectors: []
        };
      }

      // Step 3: Generate contextual response using semantic search results
      const response = await this.generateContextualResponse(userQuery, searchResult.context, relevantStocks);
      
      // Step 4: Extract sources and analysis type
      const sources = searchResult.sources;
      const analysisType = this.determineAnalysisType(userQuery, relevantStocks);

      console.log('RAG Service: Generated vector-based response successfully');

      return {
        response,
        sources,
        relevantStocks,
        analysisType
      };
    } catch (error) {
      console.error('RAG Service: Error generating vector-based response:', error);
      
      // Provide more specific error information
      if (error instanceof Error) {
        console.error('RAG Service: Error details:', error.message);
        console.error('RAG Service: Stack trace:', error.stack);
      }
      
      throw new Error(`Failed to generate RAG response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async identifyRelevantStocks(query: string): Promise<string[]> {
    try {
      const portfolio = await this.portfolioService.getPortfolio();
      console.log('RAG Service: Portfolio loaded with', portfolio.stocks.length, 'stocks');
      
      const relevantStocks = await this.portfolioService.getRelevantStocks(query);
      console.log('RAG Service: Found', relevantStocks.length, 'relevant stocks from query');
      
      // If no specific stocks mentioned, return top holdings
      if (relevantStocks.length === 0) {
        const topHoldings = await this.portfolioService.getTopHoldings(3);
        console.log('RAG Service: Using top holdings:', topHoldings.map(s => s.symbol));
        return topHoldings.map(stock => stock.symbol);
      }
      
      return relevantStocks.map(stock => stock.symbol);
    } catch (error) {
      console.error('RAG Service: Error identifying relevant stocks:', error);
      // Return empty array if there's an error
      return [];
    }
  }

  private async generateContextualResponse(
    userQuery: string, 
    semanticContext: string, 
    relevantStocks: string[]
  ): Promise<string> {
    const portfolio = await this.portfolioService.getPortfolio();
    const portfolioContext = await this.buildPortfolioContext(portfolio);
    
    const prompt = `You are InvestAI, an expert AI investment advisor with access to comprehensive market analysis and real-time financial data.

PORTFOLIO CONTEXT:
${portfolioContext}

RELEVANT STOCKS: ${relevantStocks.join(', ')}

USER QUERY: ${userQuery}

SEMANTIC SEARCH RESULTS - RELEVANT MARKET DATA:
${semanticContext}

INSTRUCTIONS:
1. Analyze the user's query in the context of their portfolio and the provided market data
2. Use the semantic search results to provide current, data-driven insights
3. Focus on the stocks mentioned or most relevant to their portfolio
4. Reference specific sources and data points from the search results
5. Provide specific, actionable recommendations based on the market analysis
6. Always emphasize that this is educational advice and they should consult professionals
7. Be data-driven and reference current market conditions from the search results
8. Consider risk factors and portfolio diversification
9. If the search results contain relevant information, incorporate it naturally into your response

Generate a comprehensive, personalized response that leverages the semantic search results and portfolio context to provide valuable investment insights.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('RAG Service: Error generating contextual response:', error);
      throw error;
    }
  }

  private async getPortfolioContext(): Promise<string> {
    const portfolio = await this.portfolioService.getPortfolio();
    return await this.buildPortfolioContext(portfolio);
  }

  private async buildPortfolioContext(portfolio: any): Promise<string> {
    const topHoldings = await this.portfolioService.getTopHoldings(5);
    const sectorAllocation = await this.portfolioService.getSectorAllocation();
    
    return `
Portfolio Holdings (Top 5):
${topHoldings.map(stock => `- ${stock.symbol} (${stock.name}): ${stock.weight}%`).join('\n')}

Sector Allocation:
${Object.entries(sectorAllocation).map(([sector, weight]) => `- ${sector}: ${weight}%`).join('\n')}
    `.trim();
  }

  private determineAnalysisType(query: string, relevantStocks: string[]): 'general' | 'stock-specific' | 'sector-analysis' | 'risk-assessment' {
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('risk') || queryLower.includes('volatility') || queryLower.includes('safe')) {
      return 'risk-assessment';
    }
    
    if (relevantStocks.length === 1) {
      return 'stock-specific';
    }
    
    if (queryLower.includes('sector') || queryLower.includes('industry')) {
      return 'sector-analysis';
    }
    
    return 'general';
  }
}

// Export singleton instance
export const ragService = new RAGService();
