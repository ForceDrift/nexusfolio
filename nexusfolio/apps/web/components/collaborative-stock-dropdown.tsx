"use client";

import { useState } from "react";
import { ChevronDown, Plus, Building2 } from "lucide-react";
import { ManualStockModal } from "@/components/manual-stock-modal";

interface CollaborativeStockDropdownProps {
  portfolioId?: string;
}

export function CollaborativeStockDropdown({ portfolioId = 'default' }: CollaborativeStockDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddStock = (stockCode: string, notes?: string) => {
    // This will be handled by the ManualStockModal
    console.log('Adding collaborative stock:', stockCode, notes);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Stock
          <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <div className="py-1">
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setIsDropdownOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Building2 className="w-4 h-4" />
                Add Stock Manually
              </button>
            </div>
          </div>
        )}
      </div>

      <ManualStockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId="collaborative" // Special identifier for collaborative stocks
        portfolioId={portfolioId}
        onStockAdded={handleAddStock}
      />
    </>
  );
}
