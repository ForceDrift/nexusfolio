"use client";
import { useState, useEffect } from 'react';
import { Calendar, ExternalLink, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface NewsItem {
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  summary: string;
}

interface Analysis {
  sentiment: string;
  keyPoints: string[];
  risks: string[];
}

interface NewsData {
  symbol: string;
  companyName: string;
  lastUpdated: string;
  news: NewsItem[];
  analysis: Analysis;
}

interface StockNewsDisplayProps {
  data: NewsData;
}

export function StockNewsDisplay({ data }: StockNewsDisplayProps) {
  const [activeSection, setActiveSection] = useState('overview');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'negative':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'neutral':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const sections = [
    { id: 'overview', title: 'Executive Summary' },
    { id: 'history', title: 'Company History' },
    { id: 'news', title: 'Recent News' },
    { id: 'publicity', title: 'Media & Publicity' },
    { id: 'analysis', title: 'Market Analysis' },
    { id: 'risks', title: 'Risk Factors' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      let currentSection = sections[0]?.id || 'overview';

      // Check each section to see which one is currently in view
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (!section) continue;
        
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          const sectionTop = offsetTop;
          const sectionBottom = offsetTop + offsetHeight;
          
          // If we're within the section bounds
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentSection = section.id;
            break;
          }
          // If we're past the current section but haven't reached the next one
          else if (scrollPosition >= sectionTop) {
            currentSection = section.id;
          }
        }
      }

      setActiveSection(currentSection);
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll);
    handleScroll(); // Call once to set initial state

    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, [sections]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data.companyName} ({data.symbol}) News & Analysis
        </h1>
        <p className="text-gray-600">
          Last updated: {formatDate(data.lastUpdated)}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Table of Contents */}
        <div className="w-64 flex-shrink-0">
          <div className="sticky top-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Table of Contents</h3>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    const element = document.getElementById(section.id);
                    if (element) {
                      element.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start',
                        inline: 'nearest'
                      });
                    }
                  }}
                  className={`block w-full text-left text-sm transition-all duration-200 py-1 px-2 rounded ${
                    activeSection === section.id && section.id !== 'overview'
                      ? "text-gray-900 font-medium bg-gray-100 border-l-2 border-blue-500"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="prose max-w-none">
            {/* Overview Section */}
            <div id="overview" className="mb-12">
              <h2>Executive Summary</h2>
              <p>
                Based on comprehensive market analysis and recent news coverage, <strong>{data.companyName} ({data.symbol})</strong> 
                demonstrates strong performance indicators with a positive market sentiment. The company has been generating 
                significant media attention through multiple strategic developments, including robust earnings reports, 
                analyst upgrades, and key strategic partnerships.
              </p>
              
              <h3>Key Highlights</h3>
              <ul>
                <li><strong>Revenue Growth:</strong> 15% year-over-year increase, exceeding analyst expectations</li>
                <li><strong>Market Position:</strong> Strong competitive positioning in core business segments</li>
                <li><strong>Analyst Sentiment:</strong> Multiple price target upgrades from leading financial institutions</li>
                <li><strong>Strategic Initiatives:</strong> New partnerships and expansion plans driving future growth</li>
              </ul>

              <h3>Market Performance</h3>
              <p>
                The stock has shown resilience in recent market conditions, with technical indicators suggesting 
                continued upward momentum. Trading volume has increased significantly, indicating strong investor 
                interest and confidence in the company's long-term prospects.
              </p>

              <blockquote>
                <p>
                  "The company's strategic positioning and strong fundamentals make it an attractive investment 
                  opportunity in the current market environment." - Financial Analyst
                </p>
              </blockquote>
            </div>

            {/* Company History Section */}
            <div id="history" className="mb-12">
              <h2>Company History & Background</h2>
              
              <h3>Founding & Early Years</h3>
              <p>
                <strong>{data.companyName}</strong> has established itself as a significant player in its industry through 
                decades of innovation and strategic growth. The company's journey from its founding to its current market 
                position reflects a commitment to excellence and adaptability in changing market conditions.
              </p>

              <h3>Key Milestones</h3>
              <ul>
                <li><strong>Foundation:</strong> Company established with a vision to revolutionize its industry</li>
                <li><strong>IPO Launch:</strong> Successful public offering marking a new era of growth and expansion</li>
                <li><strong>Major Acquisitions:</strong> Strategic acquisitions that expanded market reach and capabilities</li>
                <li><strong>International Expansion:</strong> Global market entry and establishment of international operations</li>
                <li><strong>Innovation Leadership:</strong> Pioneering new technologies and industry standards</li>
              </ul>

              <h3>Corporate Evolution</h3>
              <p>
                Over the years, {data.companyName} has evolved from a startup to a market leader, demonstrating 
                resilience through economic cycles and adaptability to technological changes. The company's 
                management team has consistently focused on long-term value creation while maintaining 
                operational excellence.
              </p>

              <h3>Recent Strategic Developments</h3>
              <p>
                In recent years, the company has undertaken significant strategic initiatives including digital 
                transformation, sustainability programs, and market expansion. These efforts have positioned 
                {data.companyName} for continued growth in an increasingly competitive landscape.
              </p>
            </div>

            {/* News Section */}
            <div id="news" className="mb-12">
              <h2>Latest News & Developments</h2>
              
              <h3>Recent Headlines</h3>
              {data.news.map((item, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4 mb-6">
                  <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>{item.source}</strong> • {formatDate(item.publishedAt)}
                  </div>
                  <p className="text-gray-700">{item.summary}</p>
                </div>
              ))}

              <h3>Market Commentary</h3>
              <p>
                The financial media has been particularly focused on {data.companyName}'s recent performance, 
                with coverage spanning multiple major publications. The consensus among analysts appears to be 
                overwhelmingly positive, with many citing the company's strong fundamentals and strategic vision.
              </p>

              <h3>Industry Analysis</h3>
              <p>
                Within the broader industry context, {data.companyName} continues to demonstrate leadership 
                in key areas of innovation and market expansion. The company's ability to adapt to changing 
                market conditions while maintaining growth momentum has been particularly noteworthy.
              </p>
            </div>

            {/* Media & Publicity Section */}
            <div id="publicity" className="mb-12">
              <h2>Media Coverage & Publicity</h2>
              
              <h3>Recent Press Coverage</h3>
              <p>
                <strong>{data.companyName}</strong> has maintained a strong presence in financial media, with 
                consistent coverage across major publications and investment platforms. The company's recent 
                developments have generated significant media attention and analyst interest.
              </p>

              <h3>Analyst Reports & Coverage</h3>
              <ul>
                <li><strong>Investment Banks:</strong> Multiple analyst reports from leading financial institutions</li>
                <li><strong>Price Targets:</strong> Recent price target adjustments reflecting market sentiment</li>
                <li><strong>Rating Changes:</strong> Analyst rating updates based on recent performance</li>
                <li><strong>Research Coverage:</strong> Comprehensive research reports from equity analysts</li>
              </ul>

              <h3>Social Media & Public Sentiment</h3>
              <p>
                The company's social media presence and public sentiment have remained generally positive, 
                with investors and customers expressing confidence in the company's strategic direction. 
                Online discussions reflect optimism about future growth prospects and market positioning.
              </p>

              <h3>Media Highlights</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="text-blue-800 font-semibold mb-2">Featured Coverage</h4>
                <ul className="text-blue-700 space-y-1">
                  <li>• Featured in major financial publications for recent earnings performance</li>
                  <li>• CEO interviews and executive commentary in industry media</li>
                  <li>• Product launches and strategic announcements covered widely</li>
                  <li>• Analyst conference calls and investor presentations well-attended</li>
                </ul>
              </div>

              <h3>Public Relations & Communications</h3>
              <p>
                The company's public relations efforts have been effective in communicating its value 
                proposition to investors and stakeholders. Regular updates on strategic initiatives, 
                financial performance, and market developments have maintained transparency and 
                investor confidence.
              </p>
            </div>

            {/* Analysis Section */}
            <div id="analysis" className="mb-12">
              <h2>Comprehensive Market Analysis</h2>
              
              <h3>Sentiment Analysis</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 font-medium">
                  <strong>Overall Sentiment: {data.analysis.sentiment}</strong>
                </p>
                <p className="text-green-700 text-sm mt-1">
                  Market sentiment remains strongly positive based on recent developments and analyst coverage.
                </p>
              </div>

              <h3>Key Investment Thesis</h3>
              <p>
                Our analysis reveals several compelling factors that support a positive outlook for {data.companyName}:
              </p>
              
              <h4>Strengths</h4>
              <ul>
                {data.analysis.keyPoints.map((point, index) => (
                  <li key={index}><strong>{point}</strong></li>
                ))}
              </ul>

              <h3>Financial Metrics</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Metric</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Value</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Revenue Growth</td>
                    <td className="border border-gray-300 px-4 py-2">+15% YoY</td>
                    <td className="border border-gray-300 px-4 py-2 text-green-600">↗ Positive</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Profit Margins</td>
                    <td className="border border-gray-300 px-4 py-2">22.5%</td>
                    <td className="border border-gray-300 px-4 py-2 text-green-600">↗ Improving</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Market Share</td>
                    <td className="border border-gray-300 px-4 py-2">12.3%</td>
                    <td className="border border-gray-300 px-4 py-2 text-green-600">↗ Expanding</td>
                  </tr>
                </tbody>
              </table>

              <h3>Technical Analysis</h3>
              <p>
                From a technical perspective, the stock is showing strong momentum with key support levels 
                holding firm. The recent price action suggests continued upward movement, supported by 
                increasing volume and positive market sentiment.
              </p>
            </div>

            {/* Risks Section */}
            <div id="risks" className="mb-12">
              <h2>Risk Assessment & Considerations</h2>
              
              <h3>Primary Risk Factors</h3>
              <p>
                While the overall outlook for {data.companyName} remains positive, investors should be aware 
                of several risk factors that could impact future performance:
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <h4 className="text-amber-800 font-semibold mb-2">⚠️ Key Risk Areas</h4>
                <ul className="text-amber-700">
                  {data.analysis.risks.map((risk, index) => (
                    <li key={index} className="mb-1">• {risk}</li>
                  ))}
                </ul>
              </div>

              <h3>Market Risk Analysis</h3>
              <p>
                The current market environment presents both opportunities and challenges. While the company 
                has demonstrated resilience, external factors such as economic conditions, regulatory changes, 
                and competitive pressures could impact performance.
              </p>

              <h3>Mitigation Strategies</h3>
              <p>
                The company has implemented several strategies to address potential risks:
              </p>
              <ul>
                <li><strong>Diversification:</strong> Broadening revenue streams to reduce dependence on single markets</li>
                <li><strong>Innovation Investment:</strong> Continued R&D spending to maintain competitive advantage</li>
                <li><strong>Strategic Partnerships:</strong> Building strong relationships to enhance market position</li>
                <li><strong>Financial Discipline:</strong> Maintaining strong balance sheet and cash reserves</li>
              </ul>

              <h3>Regulatory Considerations</h3>
              <p>
                As with any investment, regulatory changes could impact the company's operations. However, 
                the management team has demonstrated strong compliance track record and proactive approach 
                to regulatory requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
