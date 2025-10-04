"use client";
import { useState, useEffect } from "react";
import { Search, TrendingUp, Building2 } from "lucide-react";
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

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    // TODO: Add stock to user's portfolio
    console.log("Selected stock:", stock);
    console.log("Stock logo URL:", stock.logoUrl);
    onClose();
  };

  const handleClose = () => {
    setSearchQuery("");
    setStocks([]);
    setSelectedStock(null);
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

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-600">Searching...</span>
            </div>
          )}

          {/* Search Results */}
          {!isLoading && stocks.length > 0 && (
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
          {!isLoading && searchQuery && stocks.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No stocks found for "{searchQuery}"</p>
              <p className="text-sm">Try searching with a different term</p>
            </div>
          )}

          {/* Empty State */}
          {!searchQuery && (
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
