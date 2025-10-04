"use client";
import { useState } from 'react';
import Image from "next/image";
import { StockNewsDisplay } from './stock-news-display';
import { Grid } from 'ldrs/react';

interface StockNewsGeneratorProps {
  symbol: string;
}

interface NewsData {
  symbol: string;
  companyName: string;
  lastUpdated: string;
  news: Array<{
    title: string;
    source: string;
    publishedAt: string;
    url: string;
    summary: string;
  }>;
  analysis: {
    sentiment: string;
    keyPoints: string[];
    risks: string[];
  };
}

export function StockNewsGenerator({ symbol }: StockNewsGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateNews = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/stock-news?symbol=${encodeURIComponent(symbol)}`);
      const result = await response.json();
      
      if (result.success) {
        setNewsData(result.data);
      } else {
        setError(result.message || 'Failed to fetch news data');
      }
    } catch (err) {
      setError('An error occurred while fetching news data');
      console.error('Error fetching news:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // If news data is available, show the news display
  if (newsData) {
    return <StockNewsDisplay data={newsData} />;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Generating News & Research
          </h2>
          <p className="text-gray-600 mb-6">
            Gemini is analyzing the latest information about {symbol}...
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Image 
            src="/Gemini_Logo.png" 
            alt="Gemini" 
            width={32} 
            height={32}
            className="w-8 h-8"
          />
          <Grid size="40" speed="1.5" color="#3B82F6" />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Error Loading News
          </h2>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <button
            onClick={handleGenerateNews}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Image 
              src="/Gemini_Logo.png" 
              alt="Gemini" 
              width={16} 
              height={16}
              className="w-4 h-4"
            />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show initial state with generate button
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Generate News & Research
        </h2>
        <p className="text-gray-600">
          Click the button below to get the latest news and analysis for {symbol}
        </p>
      </div>
      
      <button
        onClick={handleGenerateNews}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        <Image 
          src="/Gemini_Logo.png" 
          alt="Gemini" 
          width={16} 
          height={16}
          className="w-4 h-4"
        />
        Generate News and Research
      </button>
    </div>
  );
}
