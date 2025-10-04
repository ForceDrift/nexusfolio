import { GoogleGenerativeAI } from '@google/generative-ai';
import { portfolioService, type Stock } from './portfolio';
import { semanticSearchService, type SemanticSearchResult } from './semantic-search';

export interface RAGResponse {
  response: string;
  sources: string[];
  relevantStocks: string[];
  analysisType: 'general' | 'stock-specific' | 'sector-analysis' | 'risk-assessment';
}

export class RAGService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
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
  }

  async generateRAGResponse(userQuery: string): Promise<RAGResponse> {
    console.log('RAG Service: Starting vector-based RAG analysis for query:', userQuery);
    
    try {
      // Step 1: Analyze user query and identify relevant stocks
      const relevantStocks = this.identifyRelevantStocks(userQuery);
      console.log('RAG Service: Identified relevant stocks:', relevantStocks);

      // Step 2: Perform semantic search using vector database
      const searchResult = await semanticSearchService.searchRelevantContext(userQuery, relevantStocks);
      console.log('RAG Service: Found', searchResult.relevantDocuments.length, 'relevant documents');
      console.log('RAG Service: Sources:', searchResult.sources);

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
      throw new Error('Failed to generate RAG response. Please try again.');
    }
  }

  private identifyRelevantStocks(query: string): string[] {
    const portfolio = portfolioService.getPortfolio();
    const relevantStocks = portfolioService.getRelevantStocks(query);
    
    // If no specific stocks mentioned, return top holdings
    if (relevantStocks.length === 0) {
      return portfolioService.getTopHoldings(3).map(stock => stock.symbol);
    }
    
    return relevantStocks.map(stock => stock.symbol);
  }

  private async generateContextualResponse(
    userQuery: string, 
    semanticContext: string, 
    relevantStocks: string[]
  ): Promise<string> {
    const portfolio = portfolioService.getPortfolio();
    const portfolioContext = this.buildPortfolioContext(portfolio);
    
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

  private buildPortfolioContext(portfolio: any): string {
    const topHoldings = portfolioService.getTopHoldings(5);
    const sectorAllocation = portfolioService.getSectorAllocation();
    
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
