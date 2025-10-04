import { NextRequest, NextResponse } from "next/server";
import { semanticSearchService } from "@/lib/semantic-search";
import { vectorStore } from "@/lib/vector-store";

export async function POST(request: NextRequest) {
  try {
    const { query, symbols } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    console.log("Testing vector search for query:", query);
    
    // Test semantic search
    const searchResult = await semanticSearchService.searchRelevantContext(
      query, 
      symbols || []
    );
    
    console.log("Vector search results:", {
      documentsFound: searchResult.relevantDocuments.length,
      sources: searchResult.sources,
      symbols: searchResult.symbols
    });

    return NextResponse.json({
      success: true,
      query,
      results: {
        documentsFound: searchResult.relevantDocuments.length,
        sources: searchResult.sources,
        symbols: searchResult.symbols,
        sectors: searchResult.sectors,
        context: searchResult.context.substring(0, 500) + "...", // Truncate for response
        topDocuments: searchResult.relevantDocuments.slice(0, 3).map(doc => ({
          title: doc.document.metadata.title,
          source: doc.document.metadata.source,
          similarity: doc.similarity,
          type: doc.document.metadata.type
        }))
      }
    });
  } catch (error) {
    console.error("Vector search test error:", error);
    
    return NextResponse.json({ 
      error: "Vector search test failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Return information about the vector store
    const allDocuments = vectorStore.getAllDocuments();
    
    return NextResponse.json({
      success: true,
      vectorStore: {
        totalDocuments: allDocuments.length,
        documentTypes: [...new Set(allDocuments.map(doc => doc.metadata.type))],
        sources: [...new Set(allDocuments.map(doc => doc.metadata.source))],
        symbols: [...new Set(allDocuments.flatMap(doc => doc.metadata.symbols || []))],
        sectors: [...new Set(allDocuments.flatMap(doc => doc.metadata.sectors || []))]
      }
    });
  } catch (error) {
    console.error("Vector store info error:", error);
    
    return NextResponse.json({ 
      error: "Failed to get vector store info",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
