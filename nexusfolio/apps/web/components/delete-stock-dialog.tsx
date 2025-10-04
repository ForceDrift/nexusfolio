"use client";
import { useState } from "react";
import { AlertTriangle, X, Trash2 } from "lucide-react";
import { deleteUserStock } from "@/actions/stocks";

interface DeleteStockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stockSymbol: string;
  stockId: string;
  onStockDeleted: () => void;
  buttonRect?: DOMRect;
}

export function DeleteStockDialog({ 
  isOpen, 
  onClose, 
  stockSymbol, 
  stockId,
  onStockDeleted,
  buttonRect
}: DeleteStockDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!stockId) return;
    
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const result = await deleteUserStock(stockId);
      
      if (result.success) {
        onStockDeleted();
        onClose();
      } else {
        setDeleteError(result.message || 'Failed to delete stock');
      }
    } catch (error) {
      setDeleteError('An unexpected error occurred');
      console.error('Delete stock error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setDeleteError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  // Calculate position relative to button
  const getPositionStyle = () => {
    if (!buttonRect) {
      return {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    // Position above the button with some offset
    const top = buttonRect.top - 10;
    const left = buttonRect.right - 320; // Position to the left of button
    
    return {
      position: 'fixed' as const,
      top: `${top}px`,
      left: `${Math.max(10, left)}px`, // Ensure it doesn't go off screen
      transform: 'none',
    };
  };

  return (
    <div className="fixed inset-0 z-50" onClick={handleClose}>
      <div 
        className="bg-white rounded-lg shadow-xl border border-gray-200 w-80"
        style={getPositionStyle()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Remove Stock</h3>
              <p className="text-sm text-gray-500">This action cannot be undone</p>
            </div>
          </div>
          
          {!isDeleting && (
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="px-6 pb-4">
          <p className="text-gray-700 mb-4">
            Are you sure you want to remove <span className="font-semibold text-gray-900">{stockSymbol}</span> from your portfolio?
          </p>
          
          {deleteError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-700">{deleteError}</p>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-md p-3 mb-6">
            <p className="text-xs text-gray-600">
              This will permanently remove <span className="font-medium">{stockSymbol}</span> from your watchlist. 
              You can always add it back later if needed.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 py-3 bg-gray-50 rounded-b-lg flex gap-2">
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-1.5 text-xs text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1"
          >
            {isDeleting ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Removing...
              </>
            ) : (
              <>
                <Trash2 className="w-3 h-3" />
                Remove
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
