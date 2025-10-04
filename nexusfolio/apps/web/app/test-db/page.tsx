'use client'

import { useState } from 'react'
// Server actions removed

export default function TestDatabasePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [stockCode, setStockCode] = useState('')
  const [deleteStockId, setDeleteStockId] = useState('')
  const [testResults, setTestResults] = useState<any[]>([])

  const addTestResult = (testName: string, result: any) => {
    const timestamp = new Date().toLocaleTimeString()
    setTestResults(prev => [...prev, { testName, result, timestamp }])
  }

  const handleTestConnection = async () => {
    setIsLoading(true)
    setResult(null)
    
    try {
      const testResult = {
        success: false,
        message: 'Server actions have been removed',
        error: 'SERVER_ACTIONS_REMOVED'
      }
      setResult(testResult)
      addTestResult('Database Connection', testResult)
    } catch (error) {
      const errorResult = {
        success: false,
        message: 'Test failed',
        error: error
      }
      setResult(errorResult)
      addTestResult('Database Connection', errorResult)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateStock = async () => {
    if (!stockCode.trim()) return
    
    setIsLoading(true)
    setResult(null)
    
    try {
      const createResult = {
        success: false,
        message: 'Server actions have been removed',
        error: 'SERVER_ACTIONS_REMOVED'
      }
      setResult(createResult)
      addTestResult('Create Stock', createResult)
    } catch (error) {
      const errorResult = {
        success: false,
        message: 'Create stock failed',
        error: error
      }
      setResult(errorResult)
      addTestResult('Create Stock', errorResult)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetStocks = async () => {
    setIsLoading(true)
    setResult(null)
    
    try {
      const stocksResult = {
        success: false,
        message: 'Server actions have been removed',
        error: 'SERVER_ACTIONS_REMOVED'
      }
      setResult(stocksResult)
      addTestResult('Get User Stocks', stocksResult)
    } catch (error) {
      const errorResult = {
        success: false,
        message: 'Get stocks failed',
        error: error
      }
      setResult(errorResult)
      addTestResult('Get User Stocks', errorResult)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteStock = async () => {
    if (!deleteStockId.trim()) return
    
    setIsLoading(true)
    setResult(null)
    
    try {
      const deleteResult = {
        success: false,
        message: 'Server actions have been removed',
        error: 'SERVER_ACTIONS_REMOVED'
      }
      setResult(deleteResult)
      addTestResult('Delete Stock', deleteResult)
    } catch (error) {
      const errorResult = {
        success: false,
        message: 'Delete stock failed',
        error: error
      }
      setResult(errorResult)
      addTestResult('Delete Stock', errorResult)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRunAllTests = async () => {
    setIsLoading(true)
    setTestResults([])
    
    // Test 1: Database Connection
    try {
      const connectionResult = {
        success: false,
        message: 'Server actions have been removed',
        error: 'SERVER_ACTIONS_REMOVED'
      }
      addTestResult('Database Connection', connectionResult)
    } catch (error) {
      addTestResult('Database Connection', { success: false, error: error })
    }

    // Test 2: Create Stock
    try {
      const createResult = {
        success: false,
        message: 'Server actions have been removed',
        error: 'SERVER_ACTIONS_REMOVED'
      }
      addTestResult('Create Stock (TEST)', createResult)
    } catch (error) {
      addTestResult('Create Stock (TEST)', { success: false, error: error })
    }

    // Test 3: Get Stocks
    try {
      const getResult = {
        success: false,
        message: 'Server actions have been removed',
        error: 'SERVER_ACTIONS_REMOVED'
      }
      addTestResult('Get User Stocks', getResult)
    } catch (error) {
      addTestResult('Get User Stocks', { success: false, error: error })
    }

    setIsLoading(false)
  }

  const clearResults = () => {
    setTestResults([])
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Supabase Database Test Suite</h1>
          <div className="flex gap-2">
            <button
              onClick={handleRunAllTests}
              disabled={isLoading}
              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Running Tests...' : '🚀 Run All Tests'}
            </button>
            <button
              onClick={clearResults}
              className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
            >
              🗑️ Clear Results
            </button>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Test Connection */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">🔌 Test Connection</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Test Supabase connection, authentication, and table access.
            </p>
            <button
              onClick={handleTestConnection}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </button>
          </div>

          {/* Create Stock */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">📝 Create Stock (Write)</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Test creating a new stock entry in the database.
            </p>
            <div className="space-y-3">
              <input
                type="text"
                value={stockCode}
                onChange={(e) => setStockCode(e.target.value.toUpperCase())}
                placeholder="Enter stock code (e.g., AAPL)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleCreateStock}
                disabled={isLoading || !stockCode.trim()}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Create Stock'}
              </button>
            </div>
          </div>

          {/* Get Stocks */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">📖 Get Stocks (Read)</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Test fetching all stocks for the current user.
            </p>
            <button
              onClick={handleGetStocks}
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {isLoading ? 'Fetching...' : 'Get Stocks'}
            </button>
          </div>

          {/* Delete Stock */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">🗑️ Delete Stock</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Test deleting a stock by ID.
            </p>
            <div className="space-y-3">
              <input
                type="text"
                value={deleteStockId}
                onChange={(e) => setDeleteStockId(e.target.value)}
                placeholder="Enter stock ID to delete"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleDeleteStock}
                disabled={isLoading || !deleteStockId.trim()}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Delete Stock'}
              </button>
            </div>
          </div>

          {/* Environment Check */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">⚙️ Environment</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Check if Supabase environment variables are set.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>SUPABASE_URL:</span>
                <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>SUPABASE_ANON_KEY:</span>
                <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">⚡ Quick Actions</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Common test scenarios.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => setStockCode('AAPL')}
                className="w-full bg-gray-100 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-200"
              >
                Set AAPL
              </button>
              <button
                onClick={() => setStockCode('GOOGL')}
                className="w-full bg-gray-100 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-200"
              >
                Set GOOGL
              </button>
              <button
                onClick={() => setStockCode('MSFT')}
                className="w-full bg-gray-100 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-200"
              >
                Set MSFT
              </button>
            </div>
          </div>
        </div>

        {/* Test History */}
        {testResults.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">📊 Test History</h2>
            <div className="space-y-3">
              {testResults.map((test, index) => (
                <div key={index} className={`p-4 rounded-md border ${
                  test.result.success 
                    ? 'bg-green-50 text-green-800 border-green-200' 
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{test.testName}</h3>
                    <span className="text-xs text-gray-500">{test.timestamp}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div><strong>Status:</strong> {test.result.success ? '✅ Success' : '❌ Failed'}</div>
                    <div><strong>Message:</strong> {test.result.message}</div>
                    {test.result.error && <div><strong>Error:</strong> {test.result.error}</div>}
                    {test.result.data && (
                      <div>
                        <strong>Data:</strong>
                        <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                          {JSON.stringify(test.result.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Result */}
        {result && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">🎯 Latest Result</h2>
            <div className={`p-4 rounded-md ${
              result.success 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              <div className="space-y-2">
                <div><strong>Success:</strong> {result.success ? '✅ Yes' : '❌ No'}</div>
                <div><strong>Message:</strong> {result.message}</div>
                {result.error && <div><strong>Error:</strong> {result.error}</div>}
                {result.data && (
                  <div>
                    <strong>Data:</strong>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Make sure you have created the <code>stocks</code> table in Supabase using the SQL script provided earlier</li>
            <li>Set your Supabase environment variables in <code>.env.local</code></li>
            <li>Start your Next.js development server: <code>npm run dev</code></li>
            <li>Navigate to <code>/test-db</code> to run these tests</li>
            <li>Check your browser console and terminal for detailed logs</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
