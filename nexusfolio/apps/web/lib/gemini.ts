import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Use Gemini 2.0 Flash-Lite model for cost efficiency
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash-lite",
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  },
});

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export class GeminiService {
  private chatHistory: ChatMessage[] = [];

  constructor() {
    // Initialize with system prompt for investment advisor
    this.chatHistory = [
      {
        role: 'assistant',
        content: `You are InvestAI, an expert AI investment advisor. You provide personalized investment advice, market analysis, risk assessments, and portfolio optimization suggestions. 

Key capabilities:
- Analyze market trends and provide investment insights
- Assess portfolio risk and suggest diversification strategies  
- Recommend portfolio adjustments based on user goals
- Answer questions about stocks, sectors, and asset classes
- Provide educational content on investment strategies

Always be professional, data-driven, and emphasize that your advice is for educational purposes. Encourage users to consult with qualified financial advisors for major investment decisions.`,
        timestamp: new Date()
      }
    ];
  }

  async generateResponse(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    try {
      console.log('Gemini service: Starting response generation');
      
      // Build conversation context - keep it simple for now
      const recentHistory = conversationHistory.slice(-6); // Keep last 6 messages for context
      const geminiHistory = recentHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      console.log('Gemini service: Built conversation history with', geminiHistory.length, 'messages');

      // Create system prompt + user message
      const systemPrompt = `You are InvestAI, an expert AI investment advisor. You provide personalized investment advice, market analysis, risk assessments, and portfolio optimization suggestions. 

Key capabilities:
- Analyze market trends and provide investment insights
- Assess portfolio risk and suggest diversification strategies  
- Recommend portfolio adjustments based on user goals
- Answer questions about stocks, sectors, and asset classes
- Provide educational content on investment strategies

Always be professional, data-driven, and emphasize that your advice is for educational purposes. Encourage users to consult with qualified financial advisors for major investment decisions.

User message: ${userMessage}`;

      console.log('Gemini service: Starting chat with Gemini model');

      // Generate response using simple prompt approach
      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();

      console.log('Gemini service: Response generated successfully, length:', text.length);
      return text;
    } catch (error) {
      console.error('Gemini API error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined
      });
      throw new Error('Failed to generate AI response. Please try again.');
    }
  }

  // Reset conversation history
  resetHistory() {
    this.chatHistory = [
      {
        role: 'assistant',
        content: `You are InvestAI, an expert AI investment advisor. You provide personalized investment advice, market analysis, risk assessments, and portfolio optimization suggestions. 

Key capabilities:
- Analyze market trends and provide investment insights
- Assess portfolio risk and suggest diversification strategies  
- Recommend portfolio adjustments based on user goals
- Answer questions about stocks, sectors, and asset classes
- Provide educational content on investment strategies

Always be professional, data-driven, and emphasize that your advice is for educational purposes. Encourage users to consult with qualified financial advisors for major investment decisions.`,
        timestamp: new Date()
      }
    ];
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
