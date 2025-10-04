import { vectorStore, type VectorDocument, type SearchResult } from './vector-store';
import { portfolioService } from './portfolio';

export interface SemanticSearchResult {
  query: string;
  relevantDocuments: SearchResult[];
  context: string;
  sources: string[];
  symbols: string[];
  sectors: string[];
}

export class SemanticSearchService {
  
  async searchRelevantContext(userQuery: string, relevantStocks: string[]): Promise<SemanticSearchResult> {
    console.log('SemanticSearch: Starting search for query:', userQuery);
    console.log('SemanticSearch: Relevant stocks:', relevantStocks);

    try {
      // Get portfolio sectors for additional context
      const portfolio = portfolioService.getPortfolio();
      const portfolioSectors = [...new Set(portfolio.stocks.map(s => s.sector))];
      
      // Perform multiple search strategies
      const searchResults = await Promise.all([
        // 1. General semantic search
        this.performSemanticSearch(userQuery, 3),
        
        // 2. Stock-specific search
        relevantStocks.length > 0 ? this.searchBySymbols(relevantStocks, 2) : Promise.resolve([]),
        
        // 3. Sector-based search
        this.searchBySectors(portfolioSectors, 2),
        
        // 4. Query expansion search
        this.performExpandedSearch(userQuery, 2)
      ]);

      // Combine and deduplicate results
      const allResults = this.combineSearchResults(searchResults.flat());
      
      // Build context from top results
      const context = this.buildContextFromResults(allResults);
      
      // Extract metadata
      const sources = [...new Set(allResults.map(r => r.document.metadata.source))];
      const symbols = [...new Set(allResults.flatMap(r => r.document.metadata.symbols || []))];
      const sectors = [...new Set(allResults.flatMap(r => r.document.metadata.sectors || []))];

      console.log('SemanticSearch: Found', allResults.length, 'relevant documents');
      console.log('SemanticSearch: Sources:', sources);
      console.log('SemanticSearch: Symbols:', symbols);

      return {
        query: userQuery,
        relevantDocuments: allResults,
        context,
        sources,
        symbols,
        sectors
      };
    } catch (error) {
      console.error('SemanticSearch: Error during search:', error);
      throw new Error('Failed to perform semantic search');
    }
  }

  private async performSemanticSearch(query: string, limit: number): Promise<SearchResult[]> {
    return await vectorStore.search(query, limit);
  }

  private async searchBySymbols(symbols: string[], limit: number): Promise<SearchResult[]> {
    const documents = await vectorStore.getDocumentsBySymbols(symbols);
    return documents.slice(0, limit).map(doc => ({
      document: doc,
      similarity: 0.8 // High similarity for direct symbol matches
    }));
  }

  private async searchBySectors(sectors: string[], limit: number): Promise<SearchResult[]> {
    const documents = await vectorStore.getDocumentsBySectors(sectors);
    return documents.slice(0, limit).map(doc => ({
      document: doc,
      similarity: 0.7 // Good similarity for sector matches
    }));
  }

  private async performExpandedSearch(query: string, limit: number): Promise<SearchResult[]> {
    // Expand query with related terms
    const expandedQueries = this.expandQuery(query);
    const allResults: SearchResult[] = [];

    for (const expandedQuery of expandedQueries) {
      const results = await vectorStore.search(expandedQuery, 1);
      allResults.push(...results);
    }

    return allResults.slice(0, limit);
  }

  private expandQuery(query: string): string[] {
    const queryLower = query.toLowerCase();
    const expansions: string[] = [];

    // Add related financial terms
    if (queryLower.includes('stock') || queryLower.includes('investment')) {
      expansions.push(`${query} market analysis`);
      expansions.push(`${query} financial performance`);
    }

    if (queryLower.includes('risk') || queryLower.includes('volatility')) {
      expansions.push(`${query} risk management`);
      expansions.push(`${query} portfolio diversification`);
    }

    if (queryLower.includes('growth') || queryLower.includes('performance')) {
      expansions.push(`${query} earnings growth`);
      expansions.push(`${query} revenue analysis`);
    }

    return expansions.slice(0, 2); // Limit expansions
  }

  private combineSearchResults(results: SearchResult[]): SearchResult[] {
    // Remove duplicates based on document ID
    const seen = new Set<string>();
    const uniqueResults: SearchResult[] = [];

    for (const result of results) {
      if (!seen.has(result.document.id)) {
        seen.add(result.document.id);
        uniqueResults.push(result);
      }
    }

    // Sort by similarity and return top results
    return uniqueResults
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5); // Limit to top 5 results
  }

  private buildContextFromResults(results: SearchResult[]): string {
    if (results.length === 0) {
      return "No specific market data found for this query.";
    }

    const contextParts = results.map((result, index) => {
      const doc = result.document;
      return `[Source ${index + 1}: ${doc.metadata.source}] ${doc.metadata.title}
${doc.content}

Relevance: ${(result.similarity * 100).toFixed(1)}%
---`;
    });

    return `Recent Market Analysis and Insights:

${contextParts.join('\n\n')}

Note: This information is based on recent market data and analysis. Please consult with a qualified financial advisor for personalized investment advice.`;
  }

  // Get market insights for specific stocks
  async getStockInsights(symbols: string[]): Promise<SemanticSearchResult> {
    const query = `Analysis and insights for stocks: ${symbols.join(', ')}`;
    return this.searchRelevantContext(query, symbols);
  }

  // Get sector analysis
  async getSectorAnalysis(sectors: string[]): Promise<SemanticSearchResult> {
    const query = `Sector analysis and outlook for: ${sectors.join(', ')}`;
    return this.searchRelevantContext(query, []);
  }

  // Get risk assessment insights
  async getRiskInsights(): Promise<SemanticSearchResult> {
    const query = "Risk management strategies and portfolio diversification";
    return this.searchRelevantContext(query, []);
  }

  // Get general market outlook
  async getMarketOutlook(): Promise<SemanticSearchResult> {
    const query = "Market outlook and economic analysis for 2024";
    return this.searchRelevantContext(query, []);
  }
}

// Export singleton instance
export const semanticSearchService = new SemanticSearchService();
