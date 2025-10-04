"use client";
import { useState, useEffect } from 'react';
import Image from "next/image";
import { Grid } from 'ldrs/react';

interface StockNewsGeneratorProps {
  symbol: string;
}

interface AnalysisData {
  success: boolean;
  symbol: string;
  companyName: string;
  analysisDate: string;
  markdownReport: string;
}

export function StockNewsGenerator({ symbol }: StockNewsGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<Array<{id: string, title: string, level: number}>>([]);

  // Extract sections from markdown content
  const extractSections = (markdown: string) => {
    const lines = markdown.split('\n');
    const extractedSections: Array<{id: string, title: string, level: number}> = [];
    
    lines.forEach((line, index) => {
      if (line.startsWith('## ')) {
        const title = line.replace('## ', '').trim();
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        extractedSections.push({ id, title, level: 2 });
      } else if (line.startsWith('### ')) {
        const title = line.replace('### ', '').trim();
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        extractedSections.push({ id, title, level: 3 });
      }
    });
    
    return extractedSections;
  };


  const handleGenerateNews = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First, check if analysis already exists
      const existingResponse = await fetch(`/api/user-analyses/${encodeURIComponent(symbol)}`);
      
      if (existingResponse.ok) {
        const existingResult = await existingResponse.json();
        if (existingResult.success) {
          // Load existing analysis
          setAnalysisData(existingResult.data);
          const extractedSections = extractSections(existingResult.data.markdownReport);
          setSections(extractedSections);
          setIsLoading(false);
          return;
        }
      }
      
      // If no existing analysis, generate new one
      const response = await fetch(`/api/stock-analysis?symbol=${encodeURIComponent(symbol)}`);
      const result = await response.json();
      
      if (result.success) {
        setAnalysisData(result);
        const extractedSections = extractSections(result.markdownReport);
        setSections(extractedSections);
      } else {
        setError(result.message || 'Failed to fetch analysis data');
      }
    } catch (err) {
      setError('An error occurred while fetching analysis data');
      console.error('Error fetching analysis:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // If analysis data is available, show the markdown content
  if (analysisData) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {analysisData.companyName} ({analysisData.symbol}) Analysis
          </h1>
          <p className="text-gray-600">
            Generated on {new Date(analysisData.analysisDate).toLocaleDateString()}
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
                    className={`block w-full text-left text-sm transition-all duration-200 py-2 px-3 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-50 ${section.level === 3 ? 'ml-4' : ''}`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="prose max-w-none">
          {analysisData.markdownReport.split('\n').map((line, index) => {
            // Handle headers
            if (line.startsWith('# ')) {
              return (
                <h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-6 border-b border-gray-200 pb-2">
                  {line.replace('# ', '')}
                </h1>
              );
            }
            if (line.startsWith('## ')) {
              const title = line.replace('## ', '');
              const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return (
                <h2 key={index} id={id} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                  {title}
                </h2>
              );
            }
            if (line.startsWith('### ')) {
              const title = line.replace('### ', '');
              const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return (
                <h3 key={index} id={id} className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  {title}
                </h3>
              );
            }
            if (line.startsWith('#### ')) {
              return (
                <h4 key={index} className="text-lg font-medium text-gray-900 mt-4 mb-2">
                  {line.replace('#### ', '')}
                </h4>
              );
            }
            
            // Handle bullet points
            if (line.startsWith('- ')) {
              return (
                <div key={index} className="flex items-start mb-2">
                  <span className="text-blue-600 mr-2 mt-1">•</span>
                  <span className="text-gray-700" dangerouslySetInnerHTML={{
                    __html: line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900">$1</strong>').replace(/\*(.*?)\*/g, '<em class="text-gray-600">$1</em>')
                  }} />
                </div>
              );
            }
            
            // Handle numbered lists
            if (/^\d+\. /.test(line)) {
              return (
                <div key={index} className="flex items-start mb-2">
                  <span className="text-blue-600 mr-2 mt-1 font-medium">{line.match(/^\d+\./)?.[0]}</span>
                  <span className="text-gray-700" dangerouslySetInnerHTML={{
                    __html: line.replace(/^\d+\. /, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900">$1</strong>').replace(/\*(.*?)\*/g, '<em class="text-gray-600">$1</em>')
                  }} />
                </div>
              );
            }
            
            // Handle tables
            if (line.includes('|') && line.trim().length > 0) {
              const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell.length > 0);
              if (cells.length > 1) {
                return (
                  <div key={index} className="overflow-x-auto my-4">
                    <table className="min-w-full border border-gray-200 rounded-lg">
                      <tbody>
                        <tr className="bg-gray-50">
                          {cells.map((cell, cellIndex) => (
                            <td key={cellIndex} className="px-4 py-2 border border-gray-200 font-medium text-gray-900">
                              {cell.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              }
            }
            
            // Handle blockquotes
            if (line.startsWith('> ')) {
              return (
                <blockquote key={index} className="border-l-4 border-blue-200 bg-blue-50 px-4 py-2 my-4 rounded-r-lg">
                  <p className="text-gray-700 italic" dangerouslySetInnerHTML={{
                    __html: line.replace('> ', '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900">$1</strong>').replace(/\*(.*?)\*/g, '<em class="text-gray-600">$1</em>')
                  }} />
                </blockquote>
              );
            }
            
            // Handle horizontal rules
            if (line.trim() === '---' || line.trim() === '***') {
              return <hr key={index} className="my-6 border-gray-200" />;
            }
            
            // Handle regular paragraphs
            if (line.trim().length > 0) {
              return (
                <p key={index} className="text-gray-700 mb-4 leading-relaxed" dangerouslySetInnerHTML={{
                  __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900">$1</strong>').replace(/\*(.*?)\*/g, '<em class="text-gray-600">$1</em>')
                }} />
              );
            }
            
            // Handle empty lines
            return <br key={index} />;
          })}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
              <button
                onClick={handleGenerateNews}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Image 
                  src="/Gemini_Logo.png" 
                  alt="Gemini" 
                  width={16} 
                  height={16}
                  className="w-4 h-4"
                />
                Regenerate Analysis
              </button>
              
              <button
                onClick={async () => {
                  // Force regenerate by calling the analysis API directly
                  setIsLoading(true);
                  setError(null);
                  
                  try {
                    const response = await fetch(`/api/stock-analysis?symbol=${encodeURIComponent(symbol)}`);
                    const result = await response.json();
                    
                    if (result.success) {
                      setAnalysisData(result);
                      const extractedSections = extractSections(result.markdownReport);
                      setSections(extractedSections);
                    } else {
                      setError(result.message || 'Failed to regenerate analysis');
                    }
                  } catch (err) {
                    setError('An error occurred while regenerating analysis');
                    console.error('Error regenerating analysis:', err);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                <Image 
                  src="/Gemini_Logo.png" 
                  alt="Gemini" 
                  width={16} 
                  height={16}
                  className="w-4 h-4"
                />
                Force Regenerate
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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
        
        {/* Gemini Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <Image 
            src="/Gemini_Logo.png" 
            alt="Gemini" 
            width={32} 
            height={32}
            className="w-8 h-8"
          />
        </div>

        {/* Loading Animation */}
        <div className="flex h-32 gap-4 p-5 md:gap-6">
          <div className="size-9 shrink-0 rounded-full bg-gray-100"></div>
          <div className="flex w-full max-w-3xl flex-col gap-4 rounded-lg pt-2">
            <div
              className="h-5 w-10/12 origin-left rounded-sm bg-gradient-to-r from-blue-50 from-30% via-blue-600/60 to-blue-50 animate-pulse"
              style={{
                backgroundSize: '200% 100%',
                animation: 'loading 1.5s ease-in-out infinite'
              }}
            ></div>
            <div
              className="h-5 w-full origin-left rounded-sm bg-gradient-to-r from-blue-500/60 via-slate-100 via-30% to-blue-500/60 to-60% animate-pulse"
              style={{
                backgroundSize: '200% 100%',
                animation: 'loading 1.5s ease-in-out infinite 0.2s'
              }}
            ></div>
            <div
              className="h-5 w-3/5 origin-left rounded-sm bg-gradient-to-r from-blue-50 from-40% via-blue-500/60 to-blue-50 to-70% animate-pulse"
              style={{
                backgroundSize: '200% 100%',
                animation: 'loading 1.5s ease-in-out infinite 0.4s'
              }}
            ></div>
          </div>
        </div>

        <style jsx>{`
          @keyframes loading {
            0% {
              background-position: 200% 0;
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              background-position: -200% 0;
              opacity: 0;
            }
          }
        `}</style>
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
