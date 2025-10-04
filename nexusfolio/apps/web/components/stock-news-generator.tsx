"use client";
import { useState, useEffect } from 'react';
import Image from "next/image";
import { Grid } from 'ldrs/react';
import { MultiStepLoader as Loader } from "@workspace/ui/components/ui/multi-step-loader";

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

const loadingStates = [
  {
    text: "Connecting to Gemini AI...",
  },
  {
    text: "Analyzing company fundamentals...",
  },
  {
    text: "Gathering recent news and developments...",
  },
  {
    text: "Evaluating market sentiment...",
  },
  {
    text: "Assessing financial performance...",
  },
  {
    text: "Generating comprehensive report...",
  },
  {
    text: "Formatting markdown content...",
  },
  {
    text: "Saving analysis to database...",
  },
];

export function StockNewsGenerator({ symbol }: StockNewsGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingReport, setIsCheckingReport] = useState(true);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<Array<{id: string, title: string, level: number}>>([]);
  const [hasExistingReport, setHasExistingReport] = useState(false);
  const [relatedCompanies, setRelatedCompanies] = useState<Array<{name: string, relationship: string, impact: 'positive' | 'negative' | 'neutral', description: string, sector: string}>>([]);
  const [nodePositions, setNodePositions] = useState<Array<{name: string, x: number, y: number}>>([]);
  const [isLoadingNetwork, setIsLoadingNetwork] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Check for existing report on component mount
  useEffect(() => {
    const checkExistingReport = async () => {
      try {
        const response = await fetch(`/api/user-analyses/${encodeURIComponent(symbol)}`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            // Load existing analysis
            setAnalysisData(result.data);
            const extractedSections = extractSections(result.data.markdownReport);
            setSections(extractedSections);
            // Fetch company network from API
            fetchCompanyNetwork(symbol);
            setHasExistingReport(true);
          } else {
            setHasExistingReport(false);
          }
        } else {
          setHasExistingReport(false);
        }
      } catch (err) {
        console.error('Error checking for existing report:', err);
        setHasExistingReport(false);
      } finally {
        setIsCheckingReport(false);
      }
    };

    checkExistingReport();
  }, [symbol]);

  // Pan and zoom handlers
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(3, zoom * delta));
    setZoom(newZoom);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsDragging(true);
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanX(e.clientX - dragStart.x);
      setPanY(e.clientY - dragStart.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setSelectedNode(null);
  };

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

  // Calculate and store node positions once
  const calculateNodePositions = (companies: Array<{name: string, relationship: string, impact: 'positive' | 'negative' | 'neutral', description: string, sector: string}>) => {
    const centerX = 500;
    const centerY = 250;
    
    return companies.map((company, index) => {
      // Create more organic positioning with fixed seed for consistency
      const angle = (index * 2 * Math.PI) / companies.length + (Math.sin(index) * 0.5);
      const distance = 120 + Math.cos(index * 1.5) * 40;
      const x = centerX + distance * Math.cos(angle);
      const y = centerY + distance * Math.sin(angle);
      return { name: company.name, x, y };
    });
  };

  // Fetch company network data from API
  const fetchCompanyNetwork = async (symbol: string) => {
    setIsLoadingNetwork(true);
    try {
      const response = await fetch(`/api/company-network?symbol=${encodeURIComponent(symbol)}`);
      const result = await response.json();
      
      if (result.success && result.network) {
        setRelatedCompanies(result.network);
        setNodePositions(calculateNodePositions(result.network));
      } else {
        console.error('Failed to fetch company network:', result.message);
        // Fallback to empty network
        setRelatedCompanies([]);
        setNodePositions([]);
      }
    } catch (error) {
      console.error('Error fetching company network:', error);
      // Fallback to empty network
      setRelatedCompanies([]);
      setNodePositions([]);
    } finally {
      setIsLoadingNetwork(false);
    }
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
        // Fetch company network from API
        fetchCompanyNetwork(symbol);
        setHasExistingReport(true); // Update state after generating
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

        {/* Dynamic Network Graph - Obsidian Style */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Company Network Graph</h2>
            {isLoadingNetwork && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                <span>Loading network...</span>
              </div>
            )}
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div 
              className="relative h-[500px] w-full overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 cursor-grab active:cursor-grabbing"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Background grid */}
              <div className="absolute inset-0 opacity-30">
                <svg className="w-full h-full">
                  <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              
              {/* Graph container with transform */}
              <div 
                className="absolute inset-0"
                style={{
                  transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                }}
              >
                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                  {relatedCompanies.map((company, index) => {
                    const position = nodePositions.find(pos => pos.name === company.name);
                    if (!position) return null;
                    
                    const centerX = 500;
                    const centerY = 250;
                    const nodeX = position.x;
                    const nodeY = position.y;
                    
                    return (
                      <g key={`connection-${index}`}>
                        <line
                          x1={`${(centerX / 1000) * 100}%`}
                          y1={`${(centerY / 500) * 100}%`}
                          x2={`${(nodeX / 1000) * 100}%`}
                          y2={`${(nodeY / 500) * 100}%`}
                          stroke={
                            company.impact === 'positive'
                              ? '#10b981'
                              : company.impact === 'negative'
                              ? '#ef4444'
                              : '#6b7280'
                          }
                          strokeWidth="1.5"
                          opacity="0.4"
                          className="transition-all duration-300"
                        />
                        <line
                          x1={`${(centerX / 1000) * 100}%`}
                          y1={`${(centerY / 500) * 100}%`}
                          x2={`${(nodeX / 1000) * 100}%`}
                          y2={`${(nodeY / 500) * 100}%`}
                          stroke={
                            company.impact === 'positive'
                              ? '#10b981'
                              : company.impact === 'negative'
                              ? '#ef4444'
                              : '#6b7280'
                          }
                          strokeWidth="2"
                          opacity="0.1"
                          className="animate-pulse"
                        />
                      </g>
                    );
                  })}
                </svg>
                
                {/* Central company node */}
                <div 
                  className="absolute w-16 h-16 rounded-full bg-blue-600 border-4 border-white shadow-xl flex items-center justify-center cursor-pointer"
                  style={{
                    left: 'calc(50% - 32px)',
                    top: 'calc(50% - 32px)',
                    zIndex: 3
                  }}
                >
                  <span className="text-white text-sm font-bold">{analysisData.symbol}</span>
                </div>
                
                {/* Company nodes with Next.js Image */}
                {relatedCompanies.map((company, index) => {
                  const position = nodePositions.find(pos => pos.name === company.name);
                  if (!position) return null;
                  
                  const isSelected = selectedNode === company.name;
                  
                  return (
                    <div
                      key={`node-${index}`}
                      className={`absolute w-9 h-9 rounded-full border-2 border-white shadow-lg cursor-pointer flex items-center justify-center overflow-hidden ${
                        isSelected ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
                      }`}
                      style={{
                        left: `${(position.x / 1000) * 100}%`,
                        top: `${(position.y / 500) * 100}%`,
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: company.impact === 'positive' ? '#10b981' : 
                                       company.impact === 'negative' ? '#ef4444' : '#6b7280',
                        zIndex: 2
                      }}
                      onClick={() => setSelectedNode(selectedNode === company.name ? null : company.name)}
                    >
                      <Image
                        src={`https://logo.clearbit.com/${company.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}.com`}
                        alt={company.name}
                        width={28}
                        height={28}
                        className="rounded-full"
                        onError={(e) => {
                          // Fallback to text if image fails
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<span class="text-white text-xs font-bold">${company.name.substring(0, 3).toUpperCase()}</span>`;
                          }
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              
              {/* Interactive controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setZoom(Math.min(3, zoom * 1.2))}
                    className="px-3 py-1 text-xs bg-white rounded-md shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    Zoom In
                  </button>
                  <button
                    onClick={() => setZoom(Math.max(0.1, zoom * 0.8))}
                    className="px-3 py-1 text-xs bg-white rounded-md shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    Zoom Out
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="px-3 py-1 text-xs bg-white rounded-md shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    Clear Selection
                  </button>
                  <button
                    onClick={resetView}
                    className="px-3 py-1 text-xs bg-white rounded-md shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    Reset View
                  </button>
                </div>
                <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm border border-gray-200">
                  Zoom: {Math.round(zoom * 100)}%
                </div>
              </div>
            </div>
            
            {/* Enhanced legend and info panel */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-4 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">Positive Impact</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className="text-gray-600">Negative Impact</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                  <span className="text-gray-600">Neutral Impact</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span className="text-gray-600">Target Company</span>
                </div>
              </div>
              
              {/* Selected node details */}
              {selectedNode && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Selected: {selectedNode}</h3>
                  {(() => {
                    const company = relatedCompanies.find(c => c.name === selectedNode);
                    return company ? (
                      <div className="space-y-2">
                        <p className="text-sm text-blue-700">
                          <span className="font-medium">Relationship:</span> {company.relationship}
                        </p>
                        <p className="text-sm text-blue-700">
                          <span className="font-medium">Sector:</span> {company.sector}
                        </p>
                        <p className="text-sm text-blue-700">
                          <span className="font-medium">Impact:</span> 
                          <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                            company.impact === 'positive'
                              ? 'bg-green-100 text-green-800'
                              : company.impact === 'negative'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {company.impact.charAt(0).toUpperCase() + company.impact.slice(1)}
                          </span>
                        </p>
                        <p className="text-sm text-blue-600 mt-2">
                          {company.description}
                        </p>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
              
              {/* Instructions */}
              <div className="text-xs text-gray-500 mb-4">
                💡 Click to select nodes • Drag to pan • Scroll to zoom • Use controls to reset view
              </div>
            </div>
          </div>
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
                onClick={async () => {
                  // Delete existing analysis and regenerate
                  setIsLoading(true);
                  setError(null);
                  
                  try {
                    // First, delete existing analysis and reports
                    const deleteAnalysisResponse = await fetch(`/api/user-analyses?stockCode=${encodeURIComponent(symbol)}`, {
                      method: 'DELETE',
                    });
                    
                    const deleteAnalysisResult = await deleteAnalysisResponse.json();
                    console.log('Delete analysis response:', deleteAnalysisResult);
                    
                    const deleteReportsResponse = await fetch(`/api/reports?stockCode=${encodeURIComponent(symbol)}`, {
                      method: 'DELETE',
                    });
                    
                    const deleteReportsResult = await deleteReportsResponse.json();
                    console.log('Delete reports response:', deleteReportsResult);
                    
                    // Clear existing data regardless of delete results
                    setAnalysisData(null);
                    setSections([]);
                    setRelatedCompanies([]);
                    setNodePositions([]);
                    setSelectedNode(null);
                    
                    // Generate new analysis
                    const response = await fetch(`/api/stock-analysis?symbol=${encodeURIComponent(symbol)}`);
                    const result = await response.json();
                    
                    if (result.success) {
                      setAnalysisData(result);
                      const extractedSections = extractSections(result.markdownReport);
                      setSections(extractedSections);
                      
                      // Fetch company network
                      await fetchCompanyNetwork(symbol);
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
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <Loader loadingStates={loadingStates} loading={isLoading} duration={1500} />
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

  // Show loading state while checking for existing reports
  if (isCheckingReport) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Checking for existing reports...
          </h2>
          <p className="text-gray-600">
            Looking for previous analysis of {symbol}
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mb-8">
          <Image 
            src="/Gemini_Logo.png" 
            alt="Gemini" 
            width={32} 
            height={32}
            className="w-8 h-8"
          />
        </div>

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

  // Show initial state with generate button only if no existing report
  if (!hasExistingReport) {
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

  // If we reach here, there should be existing data, but show a fallback
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          No Report Found
        </h2>
        <p className="text-gray-600">
          No existing analysis found for {symbol}. Click below to generate one.
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
