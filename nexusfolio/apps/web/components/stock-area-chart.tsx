"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StockAreaChartProps {
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

const chartConfig = {
  price: {
    label: "Price",
    color: "var(--chart-1)",
  },
  volume: {
    label: "Volume",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function StockAreaChart({ symbol, price, change, changePercent, className = '' }: StockAreaChartProps) {
  const [timeRange, setTimeRange] = React.useState("30d")
  const [historicalData, setHistoricalData] = React.useState<HistoricalData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchHistoricalData();
  }, [symbol, timeRange]);

  const fetchHistoricalData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/stock-history?symbol=${symbol}&period=${timeRange}`);
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

  // Transform historical data for the chart
  const chartData = React.useMemo(() => {
    return historicalData.map((data) => ({
      date: new Date(data.timestamp * 1000).toISOString().split('T')[0],
      price: data.close,
      volume: data.volume,
      open: data.open,
      high: data.high,
      low: data.low,
    }));
  }, [historicalData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  if (isLoading) {
    return (
      <Card className={`${className}`}>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>{symbol} Price Chart</CardTitle>
            <CardDescription>
              Loading historical price data...
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="flex items-center justify-center h-[250px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`${className}`}>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>{symbol} Price Chart</CardTitle>
            <CardDescription>
              Error loading chart data
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="flex items-center justify-center h-[250px] text-red-600">
            <div className="text-center">
              <p className="text-sm mb-2">{error}</p>
              <button 
                onClick={fetchHistoricalData}
                className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
              >
                Retry
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="flex items-center gap-2">
            {symbol} Price Chart
            <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercent(changePercent)}
            </span>
          </CardTitle>
          <CardDescription>
            Current price: {formatCurrency(price)} • Showing price data for {symbol}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="1D" className="rounded-lg">
              Last 24 hours
            </SelectItem>
            <SelectItem value="1W" className="rounded-lg">
              Last week
            </SelectItem>
            <SelectItem value="1M" className="rounded-lg">
              Last month
            </SelectItem>
            <SelectItem value="3M" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="6M" className="rounded-lg">
              Last 6 months
            </SelectItem>
            <SelectItem value="1Y" className="rounded-lg">
              Last year
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={change >= 0 ? "#10b981" : "#ef4444"}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={change >= 0 ? "#10b981" : "#ef4444"}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                  indicator="dot"
                  formatter={(value, name) => {
                    if (name === 'price') {
                      return [formatCurrency(value as number), 'Price']
                    }
                    if (name === 'volume') {
                      return [formatVolume(value as number), 'Volume']
                    }
                    return [value, name]
                  }}
                />
              }
            />
            <Area
              dataKey="price"
              type="natural"
              fill="url(#fillPrice)"
              stroke={change >= 0 ? "#10b981" : "#ef4444"}
              strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
