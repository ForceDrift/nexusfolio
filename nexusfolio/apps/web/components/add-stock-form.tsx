'use client'

import { useState } from 'react'
// Server actions removed

export function AddStockForm() {
  const [stockCode, setStockCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!stockCode.trim()) {
      setMessage('Please enter a stock code')
      setMessageType('error')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      // Server actions removed - placeholder response
      const result = {
        success: false,
        message: 'Server actions have been removed. Please implement your own stock creation logic.'
      }
      
      setMessage(result.message)
      setMessageType('error')
    } catch (error) {
      setMessage('An unexpected error occurred')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Stock to Portfolio</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="stockCode" className="block text-sm font-medium text-gray-700 mb-2">
            Stock Code
          </label>
          <input
            type="text"
            id="stockCode"
            value={stockCode}
            onChange={(e) => setStockCode(e.target.value.toUpperCase())}
            placeholder="e.g., AAPL, GOOGL, MSFT"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
            maxLength={10}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !stockCode.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Adding...' : 'Add Stock'}
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded-md ${
          messageType === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}
    </div>
  )
}
