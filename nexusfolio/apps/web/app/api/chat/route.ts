import { NextRequest, NextResponse } from "next/server";
import { ragService } from "@/lib/rag-service";

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    // Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured");
      return NextResponse.json(
        { error: "AI service is not configured" },
        { status: 500 }
      );
    }

    console.log("Starting RAG analysis for message:", message.substring(0, 50) + "...");
    
    // Generate response using RAG system
    const ragResponse = await ragService.generateRAGResponse(message);
    
    console.log("RAG response generated successfully:", {
      analysisType: ragResponse.analysisType,
      relevantStocks: ragResponse.relevantStocks,
      sources: ragResponse.sources.length
    });

    return NextResponse.json({ 
      response: ragResponse.response,
      metadata: {
        analysisType: ragResponse.analysisType,
        relevantStocks: ragResponse.relevantStocks,
        sources: ragResponse.sources,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Chat API error:", error);
    
    // Return a fallback response if RAG fails
    const fallbackResponse = "I apologize, but I'm experiencing technical difficulties while analyzing market data. Please try again in a moment.";
    
    return NextResponse.json({ 
      response: fallbackResponse,
      error: "RAG service temporarily unavailable"
    });
  }
}
