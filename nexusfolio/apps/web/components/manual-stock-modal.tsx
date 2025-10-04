"use client";
import { useState, useEffect } from "react";
import { Search, TrendingUp, Building2, ArrowRight, TrendingDown, DollarSign, BarChart3 } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Stock {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
  market: string;
  logoUrl?: string;
}

interface ManualStockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Company Logo Component with fallback
function CompanyLogo({ logoUrl, symbol, className }: { logoUrl?: string; symbol: string; className?: string }) {
  const [imageError, setImageError] = useState(false);

  console.log(`CompanyLogo for ${symbol}:`, logoUrl);

  if (!logoUrl || imageError) {
    console.log(`Showing fallback for ${symbol}`);
    return (
      <div className={`bg-blue-100 rounded-full flex items-center justify-center border border-blue-200 ${className}`}>
        <Building2 className="w-4 h-4 text-blue-600" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={logoUrl}
        alt={`${symbol} logo`}
        width={32}
        height={32}
        className="rounded-full object-cover border border-gray-200"
        onError={() => {
          console.log(`Logo failed to load for ${symbol}:`, logoUrl);
          setImageError(true);
        }}
        onLoad={() => {
          console.log(`Logo loaded successfully for ${symbol}`);
        }}
      />
    </div>
  );
}

export function ManualStockModal({ isOpen, onClose }: ManualStockModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [showStockDetail, setShowStockDetail] = useState(false);
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

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setStocks([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
        try {
          const response = await fetch(`/api/searchStock?q=${encodeURIComponent(searchQuery)}`);
          const data = await response.json();
          console.log("API Response:", data);
          setStocks(data.stocks || []);
        } catch (error) {
          console.error("Error searching stocks:", error);
          setStocks([]);
        } finally {
          setIsLoading(false);
        }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fetch real stock data when a stock is selected
  useEffect(() => {
    if (!selectedStock) return;

    const fetchStockData = async () => {
      try {
        setStockData(prev => ({ ...prev, loading: true }));
        
        // Using our stock quote API for real-time data
        const response = await fetch(`/api/stockQuote?symbol=${selectedStock.symbol}`);
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
  }, [selectedStock]);

  // Helper functions to format numbers (same as in stocks-portfolio)
  const formatMarketCap = (value: number): string => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  const formatVolume = (value: number): string => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return `${value.toFixed(0)}`;
  };

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    setShowStockDetail(true);
    console.log("Selected stock:", stock);
    console.log("Stock logo URL:", stock.logoUrl);
  };

  const handleAddToPortfolio = () => {
    if (selectedStock) {
      // Use global function if available
      if ((window as any).addStockToPortfolio) {
        (window as any).addStockToPortfolio(selectedStock);
      }
    }
    console.log("Adding to portfolio:", selectedStock);
    onClose();
  };

  const handleBackToSearch = () => {
    setShowStockDetail(false);
    setSelectedStock(null);
  };

  const handleClose = () => {
    setSearchQuery("");
    setStocks([]);
    setSelectedStock(null);
    setShowStockDetail(false);
    setStockData({
      price: 0,
      change: 0,
      changePercent: 0,
      marketCap: 'N/A',
      volume: 'N/A',
      loading: true
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Add Stock Manually
          </DialogTitle>
          <DialogDescription>
            Search for a stock by company name or ticker symbol to add it to your portfolio.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!showStockDetail ? (
            <>
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search for stocks (e.g., Apple, AAPL, Tesla)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </>
          ) : (
            <>
              {/* Back Button */}
              <button
                onClick={handleBackToSearch}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span className="text-sm">Back to search</span>
              </button>
            </>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-600">Searching...</span>
            </div>
          )}

          {/* Stock Detail Container */}
          {showStockDetail && selectedStock && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
              {/* Stock Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CompanyLogo 
                    logoUrl={selectedStock.logoUrl} 
                    symbol={selectedStock.symbol} 
                    className="w-12 h-12" 
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedStock.symbol}</h3>
                    <p className="text-sm text-gray-600">{selectedStock.name}</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>

              {/* Stock Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-gray-500">Current Price</span>
                  </div>
                  {stockData.loading ? (
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-16 mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
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

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-gray-500">Market Cap</span>
                  </div>
                  {stockData.loading ? (
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-16 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-8"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-lg font-semibold text-gray-900">{stockData.marketCap}</p>
                      <span className="text-xs text-gray-500">Vol: {stockData.volume}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Exchange</span>
                  <span className="text-sm font-medium text-gray-900">{selectedStock.exchange}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Type</span>
                  <span className="text-sm font-medium text-gray-900">{selectedStock.type}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Market</span>
                  <span className="text-sm font-medium text-gray-900">{selectedStock.market}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleAddToPortfolio}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Add to Portfolio
              </button>
            </div>
          )}

          {/* Search Results */}
          {!showStockDetail && !isLoading && stocks.length > 0 && (
            <div className="max-h-60 overflow-y-auto space-y-2">
              {stocks.map((stock) => {
                console.log("Rendering stock:", stock);
                return (
                <button
                  key={`${stock.symbol}-${stock.exchange}`}
                  onClick={() => handleStockSelect(stock)}
                  className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CompanyLogo 
                        logoUrl={stock.logoUrl} 
                        symbol={stock.symbol} 
                        className="w-8 h-8" 
                      />
                      <div>
                        <div className="font-medium text-gray-900">{stock.symbol}</div>
                        <div className="text-sm text-gray-600 truncate max-w-48">
                          {stock.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">{stock.exchange}</div>
                      <div className="text-xs text-gray-400">{stock.market}</div>
                    </div>
                  </div>
                </button>
                );
              })}
            </div>
          )}

          {/* No Results */}
          {!showStockDetail && !isLoading && searchQuery && stocks.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No stocks found for "{searchQuery}"</p>
              <p className="text-sm">Try searching with a different term</p>
            </div>
          )}

          {/* Empty State */}
          {!showStockDetail && !searchQuery && (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">Search for stocks</p>
              <p className="text-sm">Enter a company name or ticker symbol to get started</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
