"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface AlpacaOAuthScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthorize: (accountType: 'live' | 'paper', accountId: string) => void;
}

export function AlpacaOAuthScreen({ isOpen, onClose, onAuthorize }: AlpacaOAuthScreenProps) {
  const [selectedLiveAccount, setSelectedLiveAccount] = useState<string>('');
  const [selectedPaperAccount, setSelectedPaperAccount] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAllow = () => {
    if (selectedLiveAccount) {
      onAuthorize('live', selectedLiveAccount);
    } else if (selectedPaperAccount) {
      onAuthorize('paper', selectedPaperAccount);
    }
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match the animation duration
  };

  const handleDeny = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match the animation duration
  };

  const canProceed = selectedLiveAccount || selectedPaperAccount;

  return (
    <div 
      className={`fixed inset-0 bg-white flex items-center justify-center z-50 p-4 transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div 
        className={`bg-white rounded-lg shadow-xl max-w-md w-full mx-4 border border-gray-200 transform transition-all duration-300 ease-out ${
          isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-3 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Authorize NexusFolio</h2>
          <button
            onClick={handleDeny}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Authorization Text */}
          <div className="space-y-2">
            <p className="text-sm text-gray-700 leading-relaxed">
              By allowing <span className="font-semibold">NexusFolio</span> to access your Alpaca account, 
              you are granting <span className="font-semibold">NexusFolio</span> access to your account 
              information and authorization to place transactions in your account at your direction.
            </p>
            
            <p className="text-sm text-gray-700 leading-relaxed">
              Alpaca does not warrant or guarantee that <span className="font-semibold underline">NexusFolio</span> will work as advertised or expected. 
              Before authorizing, learn more about <span className="font-semibold underline">NexusFolio</span>.
            </p>
          </div>

          {/* Live Account Section */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900">Select an Alpaca Account to authorize:</h3>
            <p className="text-xs text-gray-600">
              To authorize the use of <span className="font-semibold">NexusFolio</span>, you will need to authorize each account separately.
            </p>
            
            <div className="space-y-1">
              <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="liveAccount"
                  value="live-123456789"
                  checked={selectedLiveAccount === 'live-123456789'}
                  onChange={(e) => {
                    setSelectedLiveAccount(e.target.value);
                    setSelectedPaperAccount(''); // Clear paper selection
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Live Account (123456789)</span>
              </label>
            </div>
          </div>

          {/* Paper Account Section */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900">Select an Alpaca Paper Account to authorize:</h3>
            <p className="text-xs text-gray-600">
              To authorize the use of <span className="font-semibold">NexusFolio</span>, you will need to authorize each account separately.
            </p>
            
            <div className="space-y-1">
              <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="paperAccount"
                  value="paper-001"
                  checked={selectedPaperAccount === 'paper-001'}
                  onChange={(e) => {
                    setSelectedPaperAccount(e.target.value);
                    setSelectedLiveAccount(''); // Clear live selection
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Paper (PA001234567) Demo Account</span>
              </label>
              
              <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="paperAccount"
                  value="paper-002"
                  checked={selectedPaperAccount === 'paper-002'}
                  onChange={(e) => {
                    setSelectedPaperAccount(e.target.value);
                    setSelectedLiveAccount(''); // Clear live selection
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Paper (PA002345678) Test Portfolio</span>
              </label>
              
              <label className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="paperAccount"
                  value="paper-003"
                  checked={selectedPaperAccount === 'paper-003'}
                  onChange={(e) => {
                    setSelectedPaperAccount(e.target.value);
                    setSelectedLiveAccount(''); // Clear live selection
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Paper (PA003456789) Learning Account</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 p-4 pt-3 border-t border-gray-200">
          <button
            onClick={handleDeny}
            className="flex-1 py-2 px-3 bg-yellow-100 text-gray-800 rounded-lg font-medium hover:bg-yellow-200 transition-colors text-sm"
          >
            Deny
          </button>
          
          <button
            onClick={handleAllow}
            disabled={!canProceed}
            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors text-sm ${
              canProceed 
                ? 'bg-yellow-200 text-gray-800 hover:bg-yellow-300' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Allow
          </button>
        </div>
      </div>
    </div>
  );
}
