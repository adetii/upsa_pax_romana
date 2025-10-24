import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { api } from '../../lib/api'

export default function PaymentSuccess() {
  const [params] = useSearchParams()
  const [, setStatus] = useState('Verifying your payment…')
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { 
    (async () => {
      try {
        setLoading(true)
        const ref = params.get('reference')
        if (!ref) throw new Error('Missing payment reference')
        
        const data = await api.verifyVote(ref)
        setReceipt(data)
        setStatus('Payment verified. Thank you for your vote!')
        /* no-op: no browser storage cleanup needed */
      } catch (e) {
        setError(e.message)
        setStatus(`Verification failed: ${e.message}`)
      } finally {
        setLoading(false)
      }
    })() 
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we confirm your vote...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Payment Status</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {error ? (
          /* Error State */
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            
            <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h2>
            <p className="text-gray-600 mb-8">{error}</p>
            
            <div className="space-y-4">
              <Link
                to="/vote/church"
                className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-6 rounded-xl transition-colors"
              >
                 Try Again
              </Link>
            </div>
          </div>
        ) : (
          /* Success State */
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 text-center">
              
              <h2 className="text-3xl font-bold mb-2">Vote Successful!</h2>
              <p className="text-green-100 text-lg">Your payment has been verified and your vote has been recorded.</p>
            </div>

            {/* Receipt Details */}
            {receipt && (
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Vote Receipt</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Transaction Reference</p>
                        <p className="text-lg font-bold text-gray-900 font-mono">{receipt.reference}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Amount Paid</p>
                        <p className="text-lg font-bold text-green-600">GHC {receipt.amount}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Number of Votes</p>
                        <p className="text-lg font-bold text-blue-600">{receipt.vote_count}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Date & Time</p>
                        <p className="text-lg font-bold text-gray-900">
                          {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {receipt.candidate_name && (
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-600 mb-1">Voted For</p>
                      <p className="text-xl font-bold text-blue-900">{receipt.candidate_name}</p>
                      {receipt.position_name && (
                        <p className="text-sm text-blue-700">{receipt.position_name}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Thank You Message */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8 text-center">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Thank You!</h4>
                  <p className="text-gray-700">
                    Your vote has been successfully recorded and will be counted in the final results. 
                    Thank you for participating in this democratic process.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link
                    to="/"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl text-center transition-all transform hover:scale-105"
                  >
                    Back to Home
                  </Link>
                  <Link
                    to="/"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl text-center transition-all transform hover:scale-105"
                  >
                    View Results
                  </Link>
                  <Link
                    to="/"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-xl text-center transition-all transform hover:scale-105"
                  >
                    Vote Again
                  </Link>
                </div>

                {/* Additional Info */}
                <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl">
                  <div className="flex">
                    
                    <div className="ml-3">
                      <p className="text-sm text-yellow-800">
                        <strong>Keep this receipt:</strong> Save this page or take a screenshot for your records. 
                        You can use the transaction reference for any inquiries.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}