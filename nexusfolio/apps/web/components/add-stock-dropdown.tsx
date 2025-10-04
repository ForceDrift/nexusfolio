"use client";
import { BarChart3, ChevronDown, Plus, ExternalLink } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ManualStockModal } from "./manual-stock-modal";

interface AddStockDropdownProps {
  userId?: string; // Add userId prop
}

export function AddStockDropdown({ userId }: AddStockDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleManualAdd = () => {
    setIsDropdownOpen(false);
    setIsModalOpen(true);
  };

  const handleAlpacaConnect = () => {
    setIsDropdownOpen(false);
    // TODO: Open Alpaca connection flow
    console.log("Connect to Alpaca");
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
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full flex items-center space-x-1 transition-colors"
      >
        <BarChart3 className="w-3 h-3" />
        <span className="text-sm">Add Stock</span>
        <ChevronDown className="w-3 h-3" />
      </button>
      
      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <button
            onClick={handleManualAdd}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
          >
            <Plus className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">Add Manually</span>
          </button>
          
          <button
            onClick={handleAlpacaConnect}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <img 
                src="/Alpaca_Logo.png" 
                alt="Alpaca" 
                className="w-4 h-4 object-contain"
              />
            </div>
            <span className="text-sm text-gray-700">Connect Alpaca</span>
            <ExternalLink className="w-3 h-3 text-gray-400 ml-auto" />
          </button>
        </div>
      )}
      
      {/* Manual Stock Modal */}
      <ManualStockModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        userId={userId}
      />
    </div>
  );
}
