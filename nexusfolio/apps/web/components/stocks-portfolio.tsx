"use client";
import { useState, useEffect } from "react";
import { Building2, TrendingUp, TrendingDown, X } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteStockDialog } from "@/components/delete-stock-dialog";

interface Stock {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
  market: string;
  logoUrl?: string;
}

interface UserStock {
  _id: string;
  userId: string;
  stockCode: string;
  createdAt: string;
  updatedAt: string;
}

// Company Logo Component with fallback
function CompanyLogo({ logoUrl, symbol, className }: { logoUrl?: string; symbol: string; className?: string }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(!!logoUrl);

  // Reset error state when logoUrl changes
  useEffect(() => {
    setImageError(false);
    setImageLoading(!!logoUrl);
  }, [logoUrl]);

  if (!logoUrl || imageError) {
    // Color-coded fallback icons based on first letter
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
function StockCard({ stock, onRemoveClick: onRemoveClick, stockId }: { 
  stock: Stock; 
  onRemoveClick: (symbol: string, buttonRect: DOMRect) => void;
  stockId: string;
}) {
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

  // Fetch real stock data
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setStockData(prev => ({ ...prev, loading: true }));
        
        // Using our new stock quote API for real-time data
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
          // If API fails, show error state instead of random data
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
        // Show error state instead of random data
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

  // Helper functions to format numbers
  const formatMarketCap = (value: number): string => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    return `${value.toFixed(0)}`;
  };

  const formatVolume = (value: number): string => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return `${value.toFixed(0)}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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

// Loading skeleton for stock cards
function StockCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
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
  );
}

export function StocksPortfolio() {
  const [userStocks, setUserStocks] = useState<UserStock[]>([]);
  const [portfolio, setPortfolio] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  // Fetch user stocks from API
  useEffect(() => {
    const fetchUserStocks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/user-stocks');
        const data = await response.json();
        
        if (data.success) {
          setUserStocks(data.data);
          
          // Fetch stock details including logos for each stock
          const portfolioStocks: Stock[] = [];
          
          for (const userStock of data.data) {
            try {
              // Fetch stock details using the search API
              const searchResponse = await fetch(`/api/searchStock?q=${encodeURIComponent(userStock.stockCode)}`);
              const searchData = await searchResponse.json();
              
              if (searchData.stocks && searchData.stocks.length > 0) {
                // Find exact match or first match
                const stockMatch = searchData.stocks.find((s: any) => 
                  s.symbol === userStock.stockCode
                ) || searchData.stocks[0];
                
                portfolioStocks.push({
                  symbol: stockMatch.symbol,
                  name: stockMatch.name,
                  exchange: stockMatch.exchange,
                  type: stockMatch.type,
                  market: stockMatch.market,
                  logoUrl: stockMatch.logoUrl
                });
              } else {
                // Fallback if search fails
                portfolioStocks.push({
                  symbol: userStock.stockCode,
                  name: `${userStock.stockCode}`, 
                  exchange: 'NASDAQ',
                  type: 'Common Stock',
                  market: 'US',
                  logoUrl: undefined // Use fallback icon instead of likely broken URL
                });
              }
            } catch (searchError) {
              console.error(`Error fetching details for ${userStock.stockCode}:`, searchError);
              // Fallback if search fails
              portfolioStocks.push({
                symbol: userStock.stockCode,
                name: `${userStock.stockCode}`, 
                exchange: 'NASDAQ',
                type: 'Common Stock',
                market: 'US',
                logoUrl: undefined // Use fallback icon instead of likely broken URL
              });
            }
          }
          
          setPortfolio(portfolioStocks);
        } else {
          setError(data.message || 'Failed to fetch stocks');
        }
      } catch (error) {
        console.error('Error fetching user stocks:', error);
        setError('Failed to fetch stocks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStocks();
  }, []);

  // Handle stock removal click (show confirmation dialog)
  const handleRemoveClick = (symbol: string, buttonRect: DOMRect) => {
    // Find the user stock to get its ID
    const userStock = userStocks.find(stock => stock.stockCode === symbol);
    if (!userStock) return;

    setDeleteDialog({
      isOpen: true,
      stockSymbol: symbol,
      stockId: userStock._id,
      buttonRect: buttonRect
    });
  };

  // Handle confirmed deletion
  const handleStockDeleted = () => {
    // Remove from local state
    const symbol = deleteDialog.stockSymbol;
    setUserStocks(prev => prev.filter(stock => stock.stockCode !== symbol));
    setPortfolio(prev => prev.filter(stock => stock.symbol !== symbol));
    
    // Close dialog
    setDeleteDialog({
      isOpen: false,
      stockSymbol: '',
      stockId: '',
      buttonRect: undefined
    });
  };

  // Close delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      stockSymbol: '',
      stockId: '',
      buttonRect: undefined
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          {[1, 2, 3].map((i) => (
            <StockCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="max-w-sm mx-auto text-center">
          <div className="p-4">
            <div className="mb-3">
              <TrendingUp className="w-8 h-8 text-red-500 mb-2 mx-auto" />
            </div>
            <h2 className="text-lg font-bold text-gray-700 mb-2">Error Loading Stocks</h2>
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

  // Show empty state
  if (portfolio.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="max-w-sm mx-auto text-left">
          <div className="p-4">
            {/* Icon */}
            <div className="mb-3">
              <TrendingUp className="w-8 h-8 text-black mb-2" />
            </div>

            {/* Title */}
            <h2 className="text-lg font-bold text-gray-700 mb-2">Stock Watchlist</h2>
            
            {/* Description */}
            <p className="text-gray-500 mb-3 text-sm leading-relaxed">
              Add stocks to your watchlist to track their performance and get real-time updates.
            </p>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors">
                Add Stock
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-600 px-3 py-1.5 rounded text-sm font-medium transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Stock Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Your Stocks</h3>
            <div className="text-sm text-gray-500">
              {portfolio.length} {portfolio.length === 1 ? 'stock' : 'stocks'} in portfolio
            </div>
          </div>
          {portfolio.map((stock, index) => {
            const userStock = userStocks.find(us => us.stockCode === stock.symbol);
            return (
              <StockCard
                key={`${stock.symbol}-${stock.exchange}`}
                stock={stock}
                stockId={userStock?._id || ''}
                onRemoveClick={handleRemoveClick}
              />
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteStockDialog
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
