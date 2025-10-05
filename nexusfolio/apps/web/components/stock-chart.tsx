"use client";

import { useEffect, useRef, useState } from 'react';

interface StockChartProps {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  className?: string;
}

interface HistoricalData {
  timestamp: number;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function StockChart({ symbol, price, change, changePercent, className = '' }: StockChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('1M');

  useEffect(() => {
    fetchHistoricalData();
  }, [symbol, selectedPeriod]);

  const fetchHistoricalData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/stock-history?symbol=${symbol}&period=${selectedPeriod}`);
      const result = await response.json();
      
      if (result.success) {
        setHistoricalData(result.data.historicalData);
      } else {
        setError(result.error || 'Failed to fetch historical data');
      }
    } catch (err) {
      console.error('Error fetching historical data:', err);
      setError('Failed to fetch historical data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (historicalData.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Find min and max prices for scaling
    const prices = historicalData.map(d => d.close);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const padding = priceRange * 0.1;

    // Draw chart
    const chartWidth = rect.width - 60;
    const chartHeight = rect.height - 60;
    const startX = 30;
    const startY = 30;

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = startY + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(startX + chartWidth, y);
      ctx.stroke();
    }

    // Draw vertical grid lines for dates
    const dataPoints = historicalData.length;
    for (let i = 0; i <= 4; i++) {
      const x = startX + (chartWidth / 4) * i;
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, startY + chartHeight);
      ctx.stroke();
    }

    // Draw price line
    ctx.strokeStyle = change >= 0 ? '#10b981' : '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();

    historicalData.forEach((data, index) => {
      const x = startX + (chartWidth / (dataPoints - 1)) * index;
      const y = startY + chartHeight - ((data.close - minPrice + padding) / (priceRange + padding * 2)) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw current price point
    const currentX = startX + chartWidth;
    const currentY = startY + chartHeight - ((price - minPrice + padding) / (priceRange + padding * 2)) * chartHeight;
    
    ctx.fillStyle = change >= 0 ? '#10b981' : '#ef4444';
    ctx.beginPath();
    ctx.arc(currentX, currentY, 4, 0, 2 * Math.PI);
    ctx.fill();

    // Draw price labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'right';
    
    // Current price
    ctx.fillText(`$${price.toFixed(2)}`, startX + chartWidth - 5, currentY - 5);
    
    // Min price
    ctx.fillText(`$${minPrice.toFixed(2)}`, startX - 5, startY + chartHeight + 15);
    
    // Max price
    ctx.fillText(`$${maxPrice.toFixed(2)}`, startX - 5, startY + 5);

    // Draw change indicator
    ctx.fillStyle = change >= 0 ? '#10b981' : '#ef4444';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${change >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`, startX + 5, startY + 20);

    // Draw date labels
    ctx.fillStyle = '#9ca3af';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    
    const dateLabels = historicalData.filter((_, index) => index % Math.ceil(dataPoints / 5) === 0);
    dateLabels.forEach((data, index) => {
      const x = startX + (chartWidth / (dataPoints - 1)) * historicalData.indexOf(data);
      const date = new Date(data.timestamp * 1000);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      ctx.fillText(dateStr, x, startY + chartHeight + 30);
    });

  }, [historicalData, price, change, changePercent]);

  const periods = [
    { value: '1D', label: '1D' },
    { value: '1W', label: '1W' },
    { value: '1M', label: '1M' },
    { value: '3M', label: '3M' },
    { value: '6M', label: '6M' },
    { value: '1Y', label: '1Y' },
  ];

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{symbol} Price Chart</h3>
        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  selectedPeriod === period.value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-red-600">
            <div className="text-center">
              <p className="text-sm">{error}</p>
              <button 
                onClick={fetchHistoricalData}
                className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className="w-full h-64"
            style={{ width: '100%', height: '256px' }}
          />
        )}
      </div>
    </div>
  );
}
