import { NextRequest, NextResponse } from "next/server";
import { RAGService } from "@/lib/rag-service";
import { auth0 } from "@/lib/auth0";

export async function GET(request: NextRequest) {
  try {
    // Get the user session
    const session = await auth0.getSession();
    const userId = session?.user?.sub;

    console.log("Testing RAG service with user ID:", userId || 'anonymous');
    
    // Create RAG service instance with user ID
    const ragService = new RAGService(userId);
    
    // Test with a simple query
    const testQuery = "What stocks do I have in my portfolio?";
    console.log("Testing with query:", testQuery);
    
    // Generate response using RAG system
    const ragResponse = await ragService.generateRAGResponse(testQuery);
    
    console.log("RAG test response generated successfully:", {
      analysisType: ragResponse.analysisType,
      relevantStocks: ragResponse.relevantStocks,
      sources: ragResponse.sources.length,
      responseLength: ragResponse.response.length
    });

    return NextResponse.json({ 
      success: true,
      testQuery,
      userId: userId || 'anonymous',
      response: ragResponse.response,
      metadata: {
        analysisType: ragResponse.analysisType,
        relevantStocks: ragResponse.relevantStocks,
        sources: ragResponse.sources,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("RAG test error:", error);
    
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
