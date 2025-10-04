'use client'

import { useState } from 'react'

export default function TestStocksPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [stocks, setStocks] = useState<any[]>([])
  const [userId, setUserId] = useState('user-123')
  const [stockCode, setStockCode] = useState('')

  const handleAddStock = async () => {
    if (!stockCode.trim()) {
      setResult({
        success: false,
        message: 'Please enter a stock code'
      })
      return
    }

    setIsLoading(true)
    setResult(null)
    
    try {
      console.log('🚀 Adding stock...')
      
      const response = await fetch('/api/stocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          stockCode: stockCode.trim()
        })
      })
      
      const data = await response.json()
      setResult(data)
      
      if (data.success) {
        console.log('✅ Success:', data.message)
        setStockCode('') // Clear input
        handleGetStocks() // Refresh the list
      } else {
        console.error('❌ Error:', data.message)
      }
      
    } catch (error) {
      console.error('💥 Unexpected error:', error)
      setResult({
        success: false,
        message: 'Unexpected error occurred',
        error: error
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetStocks = async () => {
    setIsLoading(true)
    
    try {
      console.log('📖 Fetching stocks...')
      
      const response = await fetch(`/api/stocks?userId=${encodeURIComponent(userId)}`)
      const data = await response.json()
      
      if (data.success) {
        setStocks(data.data)
        console.log('✅ Successfully fetched stocks:', data.data.length)
      } else {
        console.error('❌ Error fetching stocks:', data.message)
        setStocks([])
      }
      
    } catch (error) {
      console.error('💥 Unexpected error:', error)
      setStocks([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteStock = async (stockId: string) => {
    if (!confirm('Are you sure you want to delete this stock?')) {
      return
    }

    setIsLoading(true)
    
    try {
      console.log('🗑️ Deleting stock...')
      
      const response = await fetch(`/api/stocks?id=${stockId}&userId=${encodeURIComponent(userId)}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        console.log('✅ Success:', data.message)
        handleGetStocks() // Refresh the list
      } else {
        console.error('❌ Error:', data.message)
        setResult(data)
      }
      
    } catch (error) {
      console.error('💥 Unexpected error:', error)
      setResult({
        success: false,
        message: 'Unexpected error occurred',
        error: error
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            📈 Stock Portfolio Manager
          </h1>
          
          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              Manage your stock portfolio. Add, view, and delete stocks for your user ID.
            </p>
            
            {/* User ID Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID:
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your user ID"
              />
            </div>
            
            {/* Stock Code Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Code:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={stockCode}
                  onChange={(e) => setStockCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., AAPL, GOOGL, MSFT"
                  maxLength={10}
                />
                <button
                  onClick={handleAddStock}
                  disabled={isLoading || !stockCode.trim()}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isLoading ? 'Adding...' : 'Add Stock'}
                </button>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleGetStocks}
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? 'Loading...' : '📖 Get My Stocks'}
              </button>
            </div>
          </div>

          {/* Result Display */}
          {result && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Result:</h2>
              <div className={`p-4 rounded-md ${
                result.success 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                <div className="font-medium mb-2">
                  {result.success ? '✅ Success' : '❌ Error'}
                </div>
                <div className="mb-2">{result.message}</div>
                {result.data && (
                  <div className="text-sm">
                    <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stocks Display */}
          {stocks.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Your Stocks ({stocks.length}):
              </h2>
              <div className="space-y-3">
                {stocks.map((stock) => (
                  <div key={stock._id} className="bg-gray-50 p-4 rounded-md border flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">
                        {stock.stockCode}
                      </div>
                      <div className="text-sm text-gray-600">
                        Added: {new Date(stock.createdAt).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {stock._id}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteStock(stock._id)}
                      disabled={isLoading}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-medium text-blue-800 mb-2">How to Test:</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>1. Enter a User ID (e.g., "user-123")</p>
              <p>2. Add stocks like "AAPL", "GOOGL", "MSFT"</p>
              <p>3. Click "Get My Stocks" to see your portfolio</p>
              <p>4. Delete stocks you no longer want</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
