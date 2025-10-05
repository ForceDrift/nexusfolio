"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  X, 
  Share2, 
  Users, 
  Eye, 
  EyeOff,
  Mail,
  UserPlus
} from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteCollaborativeStockDialog } from "@/components/delete-collaborative-stock-dialog";
import { useRouter } from "next/navigation";

interface Stock {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
  market: string;
  logoUrl?: string;
}

interface CollaborativeStock {
  _id: string;
  portfolioId: string;
  addedBy: string;
  addedByName: string;
  stockCode: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface CollaborationData {
  portfolioId: string;
  ownerId: string;
  collaborators: Array<{
    userId: string;
    email: string;
    role: 'viewer' | 'editor' | 'admin';
    invitedAt: string;
    joinedAt?: string;
  }>;
  isPublic: boolean;
  sharedInsights: Array<{
    id: string;
    author: string;
    content: string;
    timestamp: string;
    type: 'note' | 'analysis' | 'recommendation';
  }>;
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
        className={`rounded-full object-cover border border-gray-200 ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
      />
    </div>
  );
}

// Individual Stock Card Component
function StockCard({ stock, onRemoveClick, stockId, addedByName, notes }: { 
  stock: Stock; 
  onRemoveClick: (symbol: string, buttonRect: DOMRect) => void;
  stockId: string;
  addedByName?: string;
  notes?: string;
}) {
  const router = useRouter();
  const [stockData, setStockData] = useState<{
    price: number;
    change: number;
    changePercent: number;
    marketCap: string;
    volume: string;
    loading: boolean;
  }>({
    price: 0,
    change: 0,
    changePercent: 0,
    marketCap: 'N/A',
    volume: 'N/A',
    loading: true
  });

  const handleStockClick = () => {
    router.push(`/dashboard/collaborative-portfolio/stocks/${encodeURIComponent(stock.symbol)}`);
  };

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setStockData(prev => ({ ...prev, loading: true }));
        
        const response = await fetch(`/api/stockQuote?symbol=${stock.symbol}`);
        const data = await response.json();
        
        if (data.stockData) {
          const stockInfo = data.stockData;
          
          setStockData({
            price: stockInfo.price,
            change: stockInfo.change,
            changePercent: stockInfo.changePercent,
            marketCap: stockInfo.marketCap,
            volume: stockInfo.volume,
            loading: false
          });
        } else {
          setStockData({
            price: 0,
            change: 0,
            changePercent: 0,
            marketCap: 'Error',
            volume: 'Error',
            loading: false
          });
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setStockData({
          price: 0,
          change: 0,
          changePercent: 0,
          marketCap: 'Error',
          volume: 'Error',
          loading: false
        });
      }
    };

    fetchStockData();
  }, [stock.symbol]);

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleStockClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CompanyLogo 
            logoUrl={stock.logoUrl} 
            symbol={stock.symbol} 
            className="w-10 h-10" 
          />
          <div>
            <h3 className="font-semibold text-gray-900">{stock.symbol}</h3>
            <p className="text-sm text-gray-600 truncate max-w-48">{stock.name}</p>
            <p className="text-xs text-gray-500">{stock.exchange}</p>
            {addedByName && (
              <p className="text-xs text-blue-600 mt-1">
                Added by {addedByName}
              </p>
            )}
            {notes && (
              <p className="text-xs text-gray-500 mt-1 italic">
                "{notes}"
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            {stockData.loading ? (
              <div className="space-y-1">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            ) : (
              <>
                <p className="text-lg font-semibold text-gray-900">${stockData.price.toFixed(2)}</p>
                <div className="flex items-center gap-1">
                  {stockData.change >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600" />
                  )}
                  <span className={`text-xs ${stockData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stockData.change >= 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%
                  </span>
                </div>
              </>
            )}
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600">Market Cap</p>
            {stockData.loading ? (
              <div className="space-y-1">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-3 w-8" />
              </div>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-900">{stockData.marketCap}</p>
                <p className="text-xs text-gray-500">Vol: {stockData.volume}</p>
              </>
            )}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              const buttonRect = e.currentTarget.getBoundingClientRect();
              onRemoveClick(stock.symbol, buttonRect);
            }}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Collaboration Panel Component
function CollaborationPanel({ 
  collaborationData, 
  onSharePortfolio, 
  onTogglePublic
}: {
  collaborationData: CollaborationData;
  onSharePortfolio: (email: string, role: string) => void;
  onTogglePublic: () => void;
}) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareRole, setShareRole] = useState<'viewer' | 'editor' | 'admin'>('viewer');

  const handleShare = async () => {
    if (!shareEmail.trim()) return;
    
    try {
      const response = await fetch('/api/collaboration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: shareEmail,
          role: shareRole,
          portfolioId: 'default'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Portfolio shared with ${shareEmail}! Share URL: ${result.shareUrl}`);
        setShareEmail('');
        setShowShareModal(false);
      } else {
        alert('Failed to share portfolio');
      }
    } catch (error) {
      console.error('Error sharing portfolio:', error);
      alert('Error sharing portfolio');
    }
  };


  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Collaboration
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePublic}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-colors ${
              collaborationData.isPublic 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {collaborationData.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {collaborationData.isPublic ? 'Public' : 'Private'}
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      {/* Collaborators */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Collaborators ({collaborationData.collaborators.length})</h4>
        <div className="space-y-2">
          {collaborationData.collaborators.map((collaborator, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {collaborator.email.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-gray-900">{collaborator.email}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                collaborator.role === 'admin' 
                  ? 'bg-red-100 text-red-800' 
                  : collaborator.role === 'editor'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {collaborator.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Shared Insights */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Shared Insights</h4>
        <div className="space-y-2 mb-3">
          {collaborationData.sharedInsights.map((insight) => (
            <div key={insight.id} className="p-2 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between mb-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${
                  insight.type === 'recommendation' 
                    ? 'bg-blue-100 text-blue-800' 
                    : insight.type === 'analysis'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {insight.type}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(insight.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-700">{insight.content}</p>
              <p className="text-xs text-gray-500 mt-1">by {insight.author}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Share Portfolio</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={shareRole}
                  onChange={(e) => setShareRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="viewer">Viewer (Read only)</option>
                  <option value="editor">Editor (Can edit)</option>
                  <option value="admin">Admin (Full access)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleShare}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Share
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
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

export function CollaborativePortfolio() {
  const [collaborativeStocks, setCollaborativeStocks] = useState<CollaborativeStock[]>([]);
  const [portfolio, setPortfolio] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collaborationData, setCollaborationData] = useState<CollaborationData | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    stockSymbol: string;
    stockId: string;
    buttonRect?: DOMRect;
  }>({
    isOpen: false,
    stockSymbol: '',
    stockId: '',
    buttonRect: undefined
  });

  // Fetch collaborative stocks and collaboration data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch collaborative stocks
        const stocksResponse = await fetch('/api/collaborative-stocks?portfolioId=default');
        const stocksData = await stocksResponse.json();
        
        if (stocksData.success) {
          setCollaborativeStocks(stocksData.data);
          
          const portfolioStocks: Stock[] = stocksData.data.map((collabStock: CollaborativeStock) => ({
            symbol: collabStock.stockCode,
            name: `${collabStock.stockCode}`, 
            exchange: 'NASDAQ',
            type: 'Common Stock',
            market: 'US',
            logoUrl: undefined
          }));
          
          setPortfolio(portfolioStocks);
          
          // Fetch stock details
          const stockDetailsPromises = stocksData.data.map(async (collabStock: CollaborativeStock) => {
            try {
              const searchResponse = await fetch(`/api/searchStock?q=${encodeURIComponent(collabStock.stockCode)}`);
              const searchData = await searchResponse.json();
              
              if (searchData.stocks && searchData.stocks.length > 0) {
                const stockMatch = searchData.stocks.find((s: any) => 
                  s.symbol === collabStock.stockCode
                ) || searchData.stocks[0];
                
                return {
                  symbol: stockMatch.symbol,
                  name: stockMatch.name,
                  exchange: stockMatch.exchange,
                  type: stockMatch.type,
                  market: stockMatch.market,
                  logoUrl: stockMatch.logoUrl
                };
              }
            } catch (searchError) {
              console.error(`Error fetching details for ${collabStock.stockCode}:`, searchError);
            }
            
            return {
              symbol: collabStock.stockCode,
              name: `${collabStock.stockCode}`, 
              exchange: 'NASDAQ',
              type: 'Common Stock',
              market: 'US',
              logoUrl: undefined
            };
          });
          
          const detailedStocks = await Promise.all(stockDetailsPromises);
          setPortfolio(detailedStocks);
        }

        // Fetch collaboration data
        const collabResponse = await fetch('/api/collaboration?portfolioId=default');
        const collabData = await collabResponse.json();
        
        if (collabData.success) {
          setCollaborationData(collabData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch portfolio data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRemoveClick = (symbol: string, buttonRect: DOMRect) => {
    const collaborativeStock = collaborativeStocks.find(stock => stock.stockCode === symbol);
    if (!collaborativeStock) return;

    setDeleteDialog({
      isOpen: true,
      stockSymbol: symbol,
      stockId: collaborativeStock._id,
      buttonRect: buttonRect
    });
  };

  const handleStockDeleted = () => {
    const symbol = deleteDialog.stockSymbol;
    setCollaborativeStocks(prev => prev.filter(stock => stock.stockCode !== symbol));
    setPortfolio(prev => prev.filter(stock => stock.symbol !== symbol));
    
    setDeleteDialog({
      isOpen: false,
      stockSymbol: '',
      stockId: '',
      buttonRect: undefined
    });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      stockSymbol: '',
      stockId: '',
      buttonRect: undefined
    });
  };

  const handleTogglePublic = async () => {
    if (!collaborationData) return;
    
    try {
      const response = await fetch('/api/collaboration', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portfolioId: 'default',
          isPublic: !collaborationData.isPublic
        }),
      });

      if (response.ok) {
        setCollaborationData(prev => prev ? { ...prev, isPublic: !prev.isPublic } : null);
      }
    } catch (error) {
      console.error('Error toggling public status:', error);
    }
  };


  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right space-y-1">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <div className="text-right space-y-1">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                  <Skeleton className="w-6 h-6 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="max-w-sm mx-auto text-center">
          <div className="p-4">
            <div className="mb-3">
              <TrendingUp className="w-8 h-8 text-red-500 mb-2 mx-auto" />
            </div>
            <h2 className="text-lg font-bold text-gray-700 mb-2">Error Loading Portfolio</h2>
            <p className="text-gray-500 mb-3 text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stock Cards */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Your Stocks</h3>
              <div className="text-sm text-gray-500">
                {portfolio.length} {portfolio.length === 1 ? 'stock' : 'stocks'} in portfolio
              </div>
            </div>
            {portfolio.length === 0 ? (
              <div className="flex items-center justify-center min-h-48">
                <div className="max-w-sm mx-auto text-left">
                  <div className="p-4">
                    <div className="mb-3">
                      <TrendingUp className="w-8 h-8 text-black mb-2" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-700 mb-2">No Stocks Yet</h2>
                    <p className="text-gray-500 mb-3 text-sm leading-relaxed">
                      Add stocks to your portfolio to start collaborating with others.
                    </p>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors">
                      Add Stock
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              portfolio.map((stock, index) => {
                const collaborativeStock = collaborativeStocks.find(cs => cs.stockCode === stock.symbol);
                return (
                  <StockCard
                    key={`${stock.symbol}-${stock.exchange}`}
                    stock={stock}
                    stockId={collaborativeStock?._id || ''}
                    addedByName={collaborativeStock?.addedByName}
                    notes={collaborativeStock?.notes}
                    onRemoveClick={handleRemoveClick}
                  />
                );
              })
            )}
          </div>

          {/* Collaboration Panel */}
          <div className="lg:col-span-1">
            {collaborationData && (
              <CollaborationPanel
                collaborationData={collaborationData}
                onSharePortfolio={() => {}}
                onTogglePublic={handleTogglePublic}
              />
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteCollaborativeStockDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleCloseDeleteDialog}
        stockSymbol={deleteDialog.stockSymbol}
        stockId={deleteDialog.stockId}
        onStockDeleted={handleStockDeleted}
        buttonRect={deleteDialog.buttonRect}
      />
    </>
  );
}
