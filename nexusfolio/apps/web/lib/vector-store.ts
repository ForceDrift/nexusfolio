import { GoogleGenerativeAI } from '@google/generative-ai';

export interface VectorDocument {
  id: string;
  content: string;
  metadata: {
    title: string;
    source: string;
    type: 'market-analysis' | 'stock-news' | 'sector-report' | 'economic-data';
    timestamp: Date;
    symbols?: string[];
    sectors?: string[];
  };
  embedding?: number[];
}

export interface SearchResult {
  document: VectorDocument;
  similarity: number;
}

export class VectorStore {
  private documents: VectorDocument[] = [];
  private genAI: GoogleGenerativeAI;
  private embeddingModel: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    // Use Gemini's embedding model
    this.embeddingModel = this.genAI.getGenerativeModel({ 
      model: "embedding-001" 
    });
    this.initializeSampleData();
  }

  // Initialize with sample financial documents
  private async initializeSampleData() {
    const sampleDocuments: Omit<VectorDocument, 'id' | 'embedding'>[] = [
      {
        content: `Technology stocks have shown strong performance in Q4 2024, with AI and cloud computing driving growth. NVIDIA (NVDA) continues to lead the semiconductor space with strong demand for AI chips. Apple (AAPL) and Microsoft (MSFT) maintain their dominance in consumer and enterprise markets respectively.`,
        metadata: {
          title: "Technology Sector Analysis Q4 2024",
          source: "Financial Times",
          type: "sector-report",
          timestamp: new Date('2024-12-01'),
          symbols: ['NVDA', 'AAPL', 'MSFT'],
          sectors: ['Technology']
        }
      },
      {
        content: `Healthcare sector shows resilience with pharmaceutical companies like Johnson & Johnson (JNJ) and UnitedHealth (UNH) performing well. The aging population and increased healthcare spending continue to drive growth in this defensive sector.`,
        metadata: {
          title: "Healthcare Sector Outlook",
          source: "Bloomberg",
          type: "sector-report",
          timestamp: new Date('2024-11-28'),
          symbols: ['JNJ', 'UNH'],
          sectors: ['Healthcare']
        }
      },
      {
        content: `Financial services sector faces mixed conditions with interest rate uncertainty. JPMorgan Chase (JPM) and Visa (V) show different performance patterns - JPM benefits from higher rates while V faces consumer spending headwinds.`,
        metadata: {
          title: "Financial Services Market Update",
          source: "Reuters",
          type: "market-analysis",
          timestamp: new Date('2024-11-30'),
          symbols: ['JPM', 'V'],
          sectors: ['Financial Services']
        }
      },
      {
        content: `Consumer staples remain defensive plays in volatile markets. Procter & Gamble (PG) continues to show stability with consistent dividend payments and strong brand portfolio.`,
        metadata: {
          title: "Consumer Staples Stability",
          source: "MarketWatch",
          type: "stock-news",
          timestamp: new Date('2024-11-29'),
          symbols: ['PG'],
          sectors: ['Consumer Staples']
        }
      },
      {
        content: `Risk management strategies for 2024 include diversification across sectors, maintaining cash reserves, and focusing on companies with strong balance sheets. Technology and healthcare offer growth potential while financials provide value opportunities.`,
        metadata: {
          title: "Portfolio Risk Management 2024",
          source: "CNBC",
          type: "market-analysis",
          timestamp: new Date('2024-12-02'),
          symbols: [],
          sectors: ['Technology', 'Healthcare', 'Financial Services']
        }
      },
      {
        content: `Market volatility indicators suggest increased uncertainty in Q1 2025. Investors should consider defensive positioning with focus on dividend-paying stocks and companies with low debt-to-equity ratios.`,
        metadata: {
          title: "Market Volatility Analysis",
          source: "Wall Street Journal",
          type: "economic-data",
          timestamp: new Date('2024-12-03'),
          symbols: [],
          sectors: []
        }
      }
    ];

    // Add documents to store
    for (const doc of sampleDocuments) {
      await this.addDocument({
        ...doc,
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });
    }
  }

  // Generate embedding for text using Gemini
  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      // For now, we'll create a simple hash-based embedding
      // In production, you'd use the actual embedding model
      const hash = this.simpleHash(text);
      return this.hashToVector(hash);
    } catch (error) {
      console.error('Error generating embedding:', error);
      // Fallback to random vector
      return Array.from({ length: 384 }, () => Math.random() - 0.5);
    }
  }

  // Simple hash function for demo purposes
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Convert hash to vector
  private hashToVector(hash: number): number[] {
    const vector = [];
    for (let i = 0; i < 384; i++) {
      vector.push(Math.sin(hash * (i + 1)) * 0.5);
    }
    return vector;
  }

  // Calculate cosine similarity between two vectors
  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }

  // Add document to vector store
  async addDocument(document: Omit<VectorDocument, 'embedding'>): Promise<void> {
    const embedding = await this.generateEmbedding(document.content);
    const docWithEmbedding: VectorDocument = {
      ...document,
      embedding
    };
    this.documents.push(docWithEmbedding);
  }

  // Search for similar documents
  async search(query: string, limit: number = 5, filters?: {
    symbols?: string[];
    sectors?: string[];
    types?: string[];
  }): Promise<SearchResult[]> {
    const queryEmbedding = await this.generateEmbedding(query);
    
    // Filter documents based on criteria
    let filteredDocs = this.documents;
    
    if (filters?.symbols?.length) {
      filteredDocs = filteredDocs.filter(doc => 
        doc.metadata.symbols?.some(symbol => filters.symbols!.includes(symbol))
      );
    }
    
    if (filters?.sectors?.length) {
      filteredDocs = filteredDocs.filter(doc => 
        doc.metadata.sectors?.some(sector => filters.sectors!.includes(sector))
      );
    }
    
    if (filters?.types?.length) {
      filteredDocs = filteredDocs.filter(doc => 
        filters.types!.includes(doc.metadata.type)
      );
    }

    // Calculate similarities
    const results: SearchResult[] = filteredDocs.map(doc => ({
      document: doc,
      similarity: this.cosineSimilarity(queryEmbedding, doc.embedding!)
    }));

    // Sort by similarity and return top results
    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  // Get documents by symbols
  async getDocumentsBySymbols(symbols: string[]): Promise<VectorDocument[]> {
    return this.documents.filter(doc => 
      doc.metadata.symbols?.some(symbol => symbols.includes(symbol))
    );
  }

  // Get documents by sectors
  async getDocumentsBySectors(sectors: string[]): Promise<VectorDocument[]> {
    return this.documents.filter(doc => 
      doc.metadata.sectors?.some(sector => sectors.includes(sector))
    );
  }

  // Get all documents (for debugging)
  getAllDocuments(): VectorDocument[] {
    return this.documents;
  }
}

// Export singleton instance
export const vectorStore = new VectorStore();
