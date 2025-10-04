"use client";
import { useState, useEffect } from "react";
import { Building2, TrendingUp, TrendingDown, X } from "lucide-react";
import Image from "next/image";

interface Stock {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
  market: string;
  logoUrl?: string;
}

// Company Logo Component with fallback
function CompanyLogo({ logoUrl, symbol, className }: { logoUrl?: string; symbol: string; className?: string }) {
  const [imageError, setImageError] = useState(false);

  if (!logoUrl || imageError) {
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
        onError={() => setImageError(true)}
      />
    </div>
  );
}

// Individual Stock Card Component
function StockCard({ stock, onRemove }: { stock: Stock; onRemove: (symbol: string) => void }) {
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
          
          <div className="text-right">
            <p className="text-sm text-gray-600">Market Cap</p>
            {stockData.loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-12 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-8"></div>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-900">{stockData.marketCap}</p>
                <p className="text-xs text-gray-500">Vol: {stockData.volume}</p>
              </>
            )}
          </div>
          
          <button
            onClick={() => onRemove(stock.symbol)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function StocksPortfolio() {
  const [portfolio, setPortfolio] = useState<Stock[]>([]);

  // Load portfolio from localStorage on mount
  useEffect(() => {
    const savedPortfolio = localStorage.getItem('stocks-portfolio');
    if (savedPortfolio) {
      try {
        setPortfolio(JSON.parse(savedPortfolio));
      } catch (error) {
        console.error('Error loading portfolio:', error);
      }
    }
  }, []);

  // Save portfolio to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('stocks-portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  // Add stock to portfolio
  const addStockToPortfolio = (stock: Stock) => {
    // Check if stock already exists
    const exists = portfolio.some(s => s.symbol === stock.symbol);
    if (!exists) {
      setPortfolio(prev => [...prev, stock]);
    }
  };

  // Remove stock from portfolio
  const removeStockFromPortfolio = (symbol: string) => {
    setPortfolio(prev => prev.filter(stock => stock.symbol !== symbol));
  };

  // Expose addStockToPortfolio globally for the modal to use
  useEffect(() => {
    (window as any).addStockToPortfolio = addStockToPortfolio;
    return () => {
      delete (window as any).addStockToPortfolio;
    };
  }, []);


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
    <div className="space-y-6">
      {/* Stock Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Current Stocks</h3>
          <div className="text-sm text-gray-500">
            {portfolio.length} {portfolio.length === 1 ? 'stock' : 'stocks'} in watchlist
          </div>
        </div>
        {portfolio.map((stock) => (
          <StockCard
            key={`${stock.symbol}-${stock.exchange}`}
            stock={stock}
            onRemove={removeStockFromPortfolio}
          />
        ))}
      </div>
    </div>
  );
}
