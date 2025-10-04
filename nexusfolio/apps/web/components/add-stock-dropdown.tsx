"use client";
import { BarChart3, ChevronDown, Plus, ExternalLink } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ManualStockModal } from "./manual-stock-modal";
import { AlpacaOAuthScreen } from "./alpaca-oauth-screen";

interface AddStockDropdownProps {
  userId?: string; // Add userId prop
}

export function AddStockDropdown({ userId }: AddStockDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOAuthOpen, setIsOAuthOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleManualAdd = () => {
    setIsDropdownOpen(false);
    setIsModalOpen(true);
  };

  const handleAlpacaConnect = () => {
    setIsDropdownOpen(false);
    setIsOAuthOpen(true);
  };

  const handleOAuthAuthorize = (accountType: 'live' | 'paper', accountId: string) => {
    console.log(`Authorizing ${accountType} account: ${accountId}`);
    // TODO: Implement actual OAuth flow
    setIsOAuthOpen(false);
    // You can add success notification here
  };

  const handleOAuthClose = () => {
    setIsOAuthOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
      >
        <BarChart3 className="w-4 h-4" />
        <span className="text-sm font-medium">Add Stock</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      
      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          <button
            onClick={handleManualAdd}
            className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center space-x-3 transition-colors"
          >
            <Plus className="w-5 h-5 text-blue-600" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">Add Manually</span>
              <span className="text-xs text-gray-500">Search and add stocks</span>
            </div>
          </button>
          
          <div className="border-t border-gray-100 my-1"></div>
          
          <button
            onClick={handleAlpacaConnect}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <img 
                src="/Alpaca_Logo.png" 
                alt="Alpaca" 
                className="w-5 h-5 object-contain"
              />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-sm font-medium text-gray-900">Connect Alpaca</span>
              <span className="text-xs text-gray-500">Import from broker</span>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      )}
      
      {/* Manual Stock Modal */}
      <ManualStockModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        userId={userId}
      />

      {/* Alpaca OAuth Screen */}
      <AlpacaOAuthScreen 
        isOpen={isOAuthOpen} 
        onClose={handleOAuthClose}
        onAuthorize={handleOAuthAuthorize}
      />
    </div>
  );
}
