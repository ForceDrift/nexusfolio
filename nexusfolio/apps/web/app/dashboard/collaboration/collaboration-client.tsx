"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ExternalLink, Users, TrendingUp, Shield, Zap, Globe } from 'lucide-react';

interface PaperTradingCompany {
  name: string;
  logo: string;
  description: string;
  features: string[];
  url: string;
  category: 'broker' | 'platform' | 'social' | 'education';
}

const paperTradingCompanies: PaperTradingCompany[] = [
  {
    name: 'Webull',
    logo: 'https://static.webull.com/us/_nuxt/img/webull-logo.8b0b4b8.png',
    description: 'Commission-free trading platform with advanced charting tools and real-time market data.',
    features: ['Paper Trading', 'Real-time Data', 'Advanced Charts', 'Mobile App'],
    url: 'https://www.webull.com',
    category: 'broker'
  },
  {
    name: 'TD Ameritrade',
    logo: 'https://www.tdameritrade.com/content/dam/tdameritrade/images/logos/td-ameritrade-logo.svg',
    description: 'Professional-grade trading platform with comprehensive research tools and educational resources.',
    features: ['Thinkorswim', 'Paper Trading', 'Research Tools', 'Education'],
    url: 'https://www.tdameritrade.com',
    category: 'broker'
  },
  {
    name: 'Interactive Brokers',
    logo: 'https://www.interactivebrokers.com/images/web/logos/ib-logo.svg',
    description: 'Global trading platform with access to markets worldwide and professional trading tools.',
    features: ['Global Markets', 'Professional Tools', 'Paper Trading', 'API Access'],
    url: 'https://www.interactivebrokers.com',
    category: 'broker'
  },
  {
    name: 'E*TRADE',
    logo: 'https://us.etrade.com/content/dam/etrade/etradecom/global/etrade-logo.svg',
    description: 'User-friendly platform with comprehensive investment tools and educational content.',
    features: ['Easy Trading', 'Research', 'Paper Trading', 'Mobile App'],
    url: 'https://us.etrade.com',
    category: 'broker'
  },
  {
    name: 'Robinhood',
    logo: 'https://robinhood.com/us/en/support/wp-content/uploads/2020/07/robinhood-logo.png',
    description: 'Commission-free trading with a simple, intuitive interface for beginners.',
    features: ['Commission-free', 'Simple UI', 'Mobile First', 'Crypto Trading'],
    url: 'https://robinhood.com',
    category: 'broker'
  },
  {
    name: 'Fidelity',
    logo: 'https://www.fidelity.com/bin-public/060_www_fidelity_com/images/Fidelity-logo.svg',
    description: 'Full-service investment platform with extensive research and educational resources.',
    features: ['Research Tools', 'Education', 'Paper Trading', 'Advisory Services'],
    url: 'https://www.fidelity.com',
    category: 'broker'
  },
  {
    name: 'TradingView',
    logo: 'https://s3.tradingview.com/tv.js/static/media/tradingview_logo.svg',
    description: 'Advanced charting platform with social features and paper trading capabilities.',
    features: ['Advanced Charts', 'Social Trading', 'Paper Trading', 'Screeners'],
    url: 'https://www.tradingview.com',
    category: 'platform'
  },
  {
    name: 'Investopedia',
    logo: 'https://www.investopedia.com/thumbs/Investopedia_logo.png',
    description: 'Educational platform with simulator for learning trading strategies and market concepts.',
    features: ['Simulator', 'Education', 'Articles', 'Quizzes'],
    url: 'https://www.investopedia.com',
    category: 'education'
  },
  {
    name: 'MarketWatch',
    logo: 'https://s.marketwatch.com/public/v5/img/logo-1200x630.png',
    description: 'Financial news and market data platform with virtual trading capabilities.',
    features: ['News', 'Market Data', 'Virtual Trading', 'Portfolio Tracking'],
    url: 'https://www.marketwatch.com',
    category: 'platform'
  },
  {
    name: 'Yahoo Finance',
    logo: 'https://s.yimg.com/cv/apiv2/default/yahoo_finance_logo.png',
    description: 'Comprehensive financial platform with portfolio tracking and market analysis tools.',
    features: ['Portfolio Tracking', 'Market Data', 'News', 'Analysis'],
    url: 'https://finance.yahoo.com',
    category: 'platform'
  },
  {
    name: 'Seeking Alpha',
    logo: 'https://seekingalpha.com/assets/images/logo_sa.png',
    description: 'Investment research platform with community-driven analysis and portfolio tracking.',
    features: ['Research', 'Community', 'Portfolio Tracking', 'Alerts'],
    url: 'https://seekingalpha.com',
    category: 'social'
  },
  {
    name: 'StockTwits',
    logo: 'https://stocktwits.com/assets/logo.png',
    description: 'Social network for traders and investors to share ideas and market insights.',
    features: ['Social Trading', 'Real-time Chat', 'Portfolio Sharing', 'Market Sentiment'],
    url: 'https://stocktwits.com',
    category: 'social'
  }
];

const categoryIcons = {
  broker: Shield,
  platform: TrendingUp,
  social: Users,
  education: Globe
};

const categoryColors = {
  broker: 'bg-blue-50 border-blue-200 text-blue-800',
  platform: 'bg-green-50 border-green-200 text-green-800',
  social: 'bg-purple-50 border-purple-200 text-purple-800',
  education: 'bg-orange-50 border-orange-200 text-orange-800'
};

export function CollaborationClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', ...Array.from(new Set(paperTradingCompanies.map(company => company.category)))];

  const filteredCompanies = paperTradingCompanies.filter(company => {
    const matchesCategory = selectedCategory === 'all' || company.category === selectedCategory;
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleConnect = (company: PaperTradingCompany) => {
    // Open the company's website in a new tab
    window.open(company.url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Connect to Paper Trading Platforms</h2>
            <p className="text-gray-600">Integrate with leading trading platforms to enhance your investment strategy</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Risk-Free Learning</span>
            </div>
            <p className="text-sm text-gray-600">Practice trading strategies without real money</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-900">Real Market Data</span>
            </div>
            <p className="text-sm text-gray-600">Access live market data and professional tools</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-900">Community Learning</span>
            </div>
            <p className="text-sm text-gray-600">Learn from experienced traders and share insights</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search trading platforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((category) => {
              const IconComponent = category === 'all' ? Globe : categoryIcons[category as keyof typeof categoryIcons];
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="capitalize">{category}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => {
          const IconComponent = categoryIcons[company.category];
          return (
            <div key={company.name} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={company.logo}
                    alt={`${company.name} logo`}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 font-semibold text-sm">
                          ${company.name.substring(0, 2).toUpperCase()}
                        </div>
                      `;
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{company.name}</h3>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${categoryColors[company.category]}`}>
                    <IconComponent className="w-3 h-3" />
                    <span className="capitalize">{company.category}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{company.description}</p>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features:</h4>
                <div className="flex flex-wrap gap-1">
                  {company.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => handleConnect(company)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Connect to {company.name}
              </button>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No platforms found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Start Trading?</h3>
          <p className="text-gray-600 mb-4">
            Connect with these platforms to access paper trading, real-time data, and professional tools. 
            All platforms offer free accounts and paper trading capabilities.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
            <span>• Free to join</span>
            <span>• Paper trading available</span>
            <span>• Real-time market data</span>
            <span>• Educational resources</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export { CollaborationClient };
