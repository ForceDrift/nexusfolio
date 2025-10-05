"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteCollaborativeStockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stockSymbol: string;
  stockId: string;
  onStockDeleted: () => void;
  buttonRect?: DOMRect;
}

export function DeleteCollaborativeStockDialog({
  isOpen,
  onClose,
  stockSymbol,
  stockId,
  onStockDeleted,
  buttonRect
}: DeleteCollaborativeStockDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/collaborative-stocks?stockId=${stockId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        onStockDeleted();
        onClose();
      } else {
        alert('Failed to delete stock: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting collaborative stock:', error);
      alert('Error deleting stock. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md"
        style={{
          position: 'fixed',
          top: buttonRect ? `${buttonRect.bottom + window.scrollY + 10}px` : '50%',
          left: buttonRect ? `${buttonRect.left + window.scrollX}px` : '50%',
          transform: buttonRect ? 'none' : 'translate(-50%, -50%)',
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Remove Stock from Collaborative Portfolio
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to remove <strong>{stockSymbol}</strong> from the collaborative portfolio? 
            This action will remove it for all collaborators.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isDeleting ? 'Removing...' : 'Remove Stock'}
          </button>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
