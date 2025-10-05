"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Building2,
  ArrowLeft,
  ShoppingCart,
  CreditCard,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  MessageSquare,
  Brain,
  Activity
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { StockChartHardcoded } from "@/components/stock-chart-hardcoded";

// Hardcoded realistic AAPL stock data
const AAPL_STOCK_DATA = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
  price: 185.50,
  change: 2.35,
  changePercent: 1.28,
  marketCap: '$2.89T',
  volume: '45.2M',
  logoUrl: 'https://logo.clearbit.com/apple.com',
  exchange: 'NASDAQ',
  type: 'Common Stock',
  market: 'US'
};

// Hardcoded realistic AAPL AI analysis
const AAPL_AI_ANALYSIS = {
  symbol: 'AAPL',
  sentiment: 'bullish',
  volatility: 'moderate',
  marketCapCategory: 'mega-cap',
  volumeAnalysis: 'above average',
  technicalSignals: ['RSI: 65 (neutral)', 'MACD: bullish crossover', 'Support: $180', 'Resistance: $190'],
  recommendation: 'BUY',
  recommendationReason: 'Strong fundamentals and positive technical indicators',
  riskLevel: 'low',
  priceTargets: {
    shortTerm: 192.50,
    mediumTerm: 205.00,
    longTerm: 225.00
  },
  analysis: 'Apple Inc. continues to demonstrate strong fundamentals with robust iPhone sales, growing services revenue, and expanding into new markets like AR/VR. The company\'s strong balance sheet and consistent cash flow generation make it an attractive long-term investment. Recent product launches and ecosystem expansion provide multiple growth catalysts.',
  timestamp: new Date().toISOString()
};

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  volume: string;
  logoUrl?: string;
  exchange: string;
  type: string;
  market: string;
}

interface PennyStockInfo {
  isPennyStock: boolean;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Very High';
  volatility: number;
  liquidity: 'Low' | 'Medium' | 'High';
  marketCap: 'Micro' | 'Small' | 'Mid' | 'Large';
  recommendation: 'Buy' | 'Hold' | 'Sell' | 'Avoid';
  analysis: string;
}

interface PurchaseOrder {
  id: string;
  symbol: string;
  quantity: number;
  orderType: 'market' | 'limit' | 'stop';
  limitPrice?: number;
  stopPrice?: number;
  status: 'pending' | 'filled' | 'cancelled' | 'rejected';
  createdAt: string;
  filledAt?: string;
  filledPrice?: number;
  totalAmount?: number;
  portfolioId?: string;
}

interface AIAnalysis {
  symbol: string;
  sentiment: string;
  volatility: string;
  marketCapCategory: string;
  volumeAnalysis: string;
  technicalSignals: string[];
  recommendation: string;
  recommendationReason: string;
  riskLevel: string;
  priceTargets: {
    shortTerm: number;
    mediumTerm: number;
    longTerm: number;
  };
  analysis: string;
  timestamp: string;
}

interface CollaborativeStockDetailClientProps {
  symbol: string;
}

// Company Logo Component with fallback
function CompanyLogo({ logoUrl, symbol, className }: { logoUrl?: string; symbol: string; className?: string }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(!!logoUrl);

  useEffect(() => {
    setImageError(false);
    setImageLoading(!!logoUrl);
  }, [logoUrl]);

  if (!logoUrl || imageError) {
    const getFallbackColor = (symbol: string) => {
      const colors = [
        'bg-blue-100 border-blue-200 text-blue-600',
        'bg-green-100 border-green-200 text-green-600',
        'bg-purple-100 border-purple-200 text-purple-600',
        'bg-orange-100 border-orange-200 text-orange-600',
        'bg-red-100 border-red-200 text-red-600',
        'bg-cyan-100 border-cyan-200 text-cyan-600'
      ];
      return colors[symbol.charCodeAt(0) % colors.length];
    };

    return (
      <div className={`rounded-full flex items-center justify-center border ${getFallbackColor(symbol)} ${className}`}>
        <span className="text-xs font-semibold">{symbol.substring(0, 2)}</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-100 rounded-full animate-pulse" />
      )}
      <Image
        src={logoUrl}
        alt={`${symbol} logo`}
        width={40}
        height={40}
        className={`rounded-full object-cover border border-gray-200 ${
          imageLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-200`}
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
      />
    </div>
  );
}

export default function CollaborativeStockDetailClient({ symbol }: CollaborativeStockDetailClientProps) {
  const router = useRouter();
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [pennyStockInfo, setPennyStockInfo] = useState<PennyStockInfo | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderForm, setOrderForm] = useState({
    quantity: 100,
    orderType: 'market' as 'market' | 'limit' | 'stop',
    limitPrice: 0,
    stopPrice: 0
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderResult, setOrderResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Use hardcoded data for AAPL
        if (symbol === 'AAPL') {
          setStockData(AAPL_STOCK_DATA);
          
          // Generate penny stock analysis
          const pennyAnalysis = generatePennyStockAnalysis(AAPL_STOCK_DATA);
          setPennyStockInfo(pennyAnalysis);

          // Fetch AI analysis
          await fetchAIAnalysis(AAPL_STOCK_DATA);

          // Fetch orders for this symbol
          await fetchOrders();
        } else {
          // Fetch stock quote data for other symbols
          const quoteResponse = await fetch(`/api/stockQuote?symbol=${symbol}`);
          const quoteData = await quoteResponse.json();

          if (quoteData.stockData) {
            const stock = quoteData.stockData;
            setStockData({
              symbol: stock.symbol,
              name: stock.name,
              price: stock.price,
              change: stock.change,
              changePercent: stock.changePercent,
              marketCap: stock.marketCap,
              volume: stock.volume,
              logoUrl: stock.logoUrl,
              exchange: stock.exchange || 'NASDAQ',
              type: stock.type || 'Common Stock',
              market: stock.market || 'US'
            });

            // Generate penny stock analysis
            const pennyAnalysis = generatePennyStockAnalysis(stock);
            setPennyStockInfo(pennyAnalysis);

            // Fetch AI analysis
            await fetchAIAnalysis(stock);

            // Fetch orders for this symbol
            await fetchOrders();
          } else {
            setError('Stock not found');
          }
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setError('Failed to fetch stock data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockData();
  }, [symbol]);

  const fetchAIAnalysis = async (stock: any) => {
    try {
      setIsLoadingAnalysis(true);
      
      // Use hardcoded AI analysis for AAPL
      if (stock.symbol === 'AAPL') {
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        setAiAnalysis(AAPL_AI_ANALYSIS);
      } else {
        // Fetch AI analysis for other symbols
        const response = await fetch('/api/ai-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            symbol: stock.symbol,
            price: stock.price,
            change: stock.change,
            changePercent: stock.changePercent,
            marketCap: stock.marketCap,
            volume: stock.volume,
          }),
        });

        const result = await response.json();
        if (result.success) {
          setAiAnalysis(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching AI analysis:', error);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const fetchOrders = async () => {
    try {
      // Use hardcoded orders for AAPL
      if (symbol === 'AAPL') {
        const hardcodedOrders: PurchaseOrder[] = [
          {
            id: 'order_1',
            symbol: 'AAPL',
            quantity: 50,
            orderType: 'market' as const,
            status: 'filled' as const,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            filledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            filledPrice: 183.15,
            totalAmount: 9157.50,
            portfolioId: 'default'
          },
          {
            id: 'order_2',
            symbol: 'AAPL',
            quantity: 25,
            orderType: 'limit' as const,
            limitPrice: 180.00,
            status: 'filled' as const,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            filledAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            filledPrice: 180.00,
            totalAmount: 4500.00,
            portfolioId: 'default'
          },
          {
            id: 'order_3',
            symbol: 'AAPL',
            quantity: 100,
            orderType: 'market' as const,
            status: 'pending' as const,
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
            portfolioId: 'default'
          }
        ];
        setOrders(hardcodedOrders);
      } else {
        // Fetch orders for other symbols
        const response = await fetch(`/api/orders?symbol=${symbol}&portfolioId=default`);
        const result = await response.json();
        if (result.success) {
          setOrders(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const generatePennyStockAnalysis = (stock: any): PennyStockInfo => {
    const price = stock.price;
    const marketCap = parseFloat(stock.marketCap.replace(/[^\d.]/g, '')) || 0;
    
    // Determine if it's a penny stock (typically under $5)
    const isPennyStock = price < 5;
    
    // Calculate risk level based on price and market cap
    let riskLevel: 'Low' | 'Medium' | 'High' | 'Very High' = 'Low';
    if (price < 1) riskLevel = 'Very High';
    else if (price < 2) riskLevel = 'High';
    else if (price < 5) riskLevel = 'Medium';
    
    // Calculate volatility (simplified)
    const volatility = Math.min(100, Math.max(10, (5 - price) * 20 + Math.random() * 30));
    
    // Determine liquidity based on volume
    const volume = parseFloat(stock.volume.replace(/[^\d.]/g, '')) || 0;
    let liquidity: 'Low' | 'Medium' | 'High' = 'Low';
    if (volume > 1000000) liquidity = 'High';
    else if (volume > 100000) liquidity = 'Medium';
    
    // Determine market cap category
    let marketCapCategory: 'Micro' | 'Small' | 'Mid' | 'Large' = 'Micro';
    if (marketCap > 10000000000) marketCapCategory = 'Large';
    else if (marketCap > 2000000000) marketCapCategory = 'Mid';
    else if (marketCap > 300000000) marketCapCategory = 'Small';
    
    // Generate recommendation
    let recommendation: 'Buy' | 'Hold' | 'Sell' | 'Avoid' = 'Hold';
    if (isPennyStock && riskLevel === 'Very High') recommendation = 'Avoid';
    else if (isPennyStock && riskLevel === 'High') recommendation = 'Sell';
    else if (stock.changePercent > 5) recommendation = 'Buy';
    else if (stock.changePercent < -5) recommendation = 'Sell';
    
    // Generate analysis
    let analysis = '';
    if (isPennyStock) {
      analysis = `This is a penny stock trading at $${price.toFixed(2)}. Penny stocks are highly speculative investments with significant risk. `;
      if (riskLevel === 'Very High') {
        analysis += 'This stock presents very high risk due to its low price and may be subject to high volatility and low liquidity.';
      } else if (riskLevel === 'High') {
        analysis += 'This stock carries high risk but may offer growth potential for risk-tolerant investors.';
      }
    } else {
      analysis = `This stock is trading at $${price.toFixed(2)} and appears to be a more established security with ${riskLevel.toLowerCase()} risk.`;
    }

    return {
      isPennyStock,
      riskLevel,
      volatility: Math.round(volatility),
      liquidity,
      marketCap: marketCapCategory,
      recommendation,
      analysis
    };
  };

  const handlePlaceOrder = async () => {
    if (!stockData) return;

    setIsPlacingOrder(true);
    setOrderResult(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: stockData.symbol,
          quantity: orderForm.quantity,
          orderType: orderForm.orderType,
          limitPrice: orderForm.orderType === 'limit' ? orderForm.limitPrice : undefined,
          stopPrice: orderForm.orderType === 'stop' ? orderForm.stopPrice : undefined,
          portfolioId: 'default',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setOrderResult({
          success: true,
          message: `Order placed successfully! Order ID: ${result.data._id}`,
        });
        
        // Refresh orders list
        await fetchOrders();
        
        // Reset form
        setOrderForm({
          quantity: 100,
          orderType: 'market',
          limitPrice: 0,
          stopPrice: 0,
        });
        
        // Close modal after 2 seconds
        setTimeout(() => {
          setShowOrderModal(false);
          setOrderResult(null);
        }, 2000);
      } else {
        setOrderResult({
          success: false,
          message: result.error || 'Failed to place order',
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setOrderResult({
        success: false,
        message: 'Failed to place order. Please try again.',
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Very High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'Buy': return 'text-green-600 bg-green-100';
      case 'Hold': return 'text-blue-600 bg-blue-100';
      case 'Sell': return 'text-orange-600 bg-orange-100';
      case 'Avoid': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !stockData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Stock</h2>
          <p className="text-gray-600 mb-4">{error || 'Stock not found'}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <CompanyLogo
                logoUrl={stockData.logoUrl}
                symbol={stockData.symbol}
                className="w-10 h-10"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{stockData.symbol}</h1>
                <p className="text-sm text-gray-600">{stockData.name}</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowOrderModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Place Order
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stock Chart */}
          <StockChartHardcoded 
            symbol={stockData.symbol}
            price={stockData.price}
            change={stockData.change}
            changePercent={stockData.changePercent}
          />

          {/* AI Analysis */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">AI Analysis</h2>
              {isLoadingAnalysis && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              )}
            </div>
            
            {aiAnalysis ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Sentiment</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      aiAnalysis.sentiment.includes('bullish') ? 'bg-green-100 text-green-800' :
                      aiAnalysis.sentiment.includes('bearish') ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {aiAnalysis.sentiment}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Volatility</p>
                    <p className="text-lg font-semibold text-gray-900">{aiAnalysis.volatility}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Risk Level</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      aiAnalysis.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                      aiAnalysis.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {aiAnalysis.riskLevel}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Recommendation</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      aiAnalysis.recommendation === 'BUY' ? 'bg-green-100 text-green-800' :
                      aiAnalysis.recommendation === 'SELL' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {aiAnalysis.recommendation}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">Analysis</h3>
                  <p className="text-purple-800 text-sm">{aiAnalysis.analysis}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Short Term Target</p>
                    <p className="text-lg font-semibold text-gray-900">${aiAnalysis.priceTargets.shortTerm.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Medium Term Target</p>
                    <p className="text-lg font-semibold text-gray-900">${aiAnalysis.priceTargets.mediumTerm.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Long Term Target</p>
                    <p className="text-lg font-semibold text-gray-900">${aiAnalysis.priceTargets.longTerm.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Loading AI analysis...</p>
              </div>
            )}
          </div>

          {/* Current Price Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Current Price</h2>
              <div className="flex items-center gap-2">
                {stockData.change >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
                <span className={`text-sm font-medium ${stockData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercent(stockData.changePercent)}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Price</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stockData.price)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Change</p>
                <p className={`text-lg font-semibold ${stockData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(stockData.change)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Market Cap</p>
                <p className="text-lg font-semibold text-gray-900">{stockData.marketCap}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Volume</p>
                <p className="text-lg font-semibold text-gray-900">{stockData.volume}</p>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            </div>
            
            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        order.status === 'filled' ? 'bg-green-500' :
                        order.status === 'pending' ? 'bg-yellow-500' :
                        order.status === 'cancelled' ? 'bg-gray-500' :
                        'bg-red-500'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.orderType.toUpperCase()} {order.quantity} shares @ {order.symbol}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.orderType === 'limit' && order.limitPrice && `Limit: $${order.limitPrice}`}
                          {order.orderType === 'stop' && order.stopPrice && `Stop: $${order.stopPrice}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        order.status === 'filled' ? 'text-green-600' :
                        order.status === 'pending' ? 'text-yellow-600' :
                        'text-gray-600'
                      }`}>
                        {order.status.toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No recent orders for this stock</p>
                <p className="text-sm text-gray-500">Place your first order to see it here</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Place Order</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  value={orderForm.quantity}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Type</label>
                <select
                  value={orderForm.orderType}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, orderType: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="market">Market Order</option>
                  <option value="limit">Limit Order</option>
                  <option value="stop">Stop Order</option>
                </select>
              </div>
              
              {orderForm.orderType === 'limit' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Limit Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={orderForm.limitPrice}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, limitPrice: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
              
              {orderForm.orderType === 'stop' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stop Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={orderForm.stopPrice}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, stopPrice: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Order Summary</p>
                <p className="font-semibold">
                  {orderForm.quantity} shares of {stockData.symbol} at {formatCurrency(stockData.price)}
                </p>
                <p className="text-lg font-bold">
                  Total: {formatCurrency(orderForm.quantity * stockData.price)}
                </p>
              </div>
            </div>
            
            {orderResult && (
              <div className={`p-3 rounded-lg mb-4 ${orderResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <div className="flex items-center gap-2">
                  {orderResult.success ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <span className="text-sm">{orderResult.message}</span>
                </div>
              </div>
            )}
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
              </button>
              <button
                onClick={() => setShowOrderModal(false)}
                disabled={isPlacingOrder}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
