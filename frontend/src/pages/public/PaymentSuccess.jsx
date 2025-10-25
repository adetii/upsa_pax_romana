import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle, Download, ArrowLeft, TrendingUp, Clock } from 'lucide-react'
import { api } from '../../lib/api'

export default function PaymentSuccess() {
  const [params] = useSearchParams()
  const [, setStatus] = useState('Verifying your payment…')
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => { 
    (async () => {
      try {
        setLoading(true)
        const ref = params.get('reference')
        if (!ref) throw new Error('Missing payment reference')
        
        const data = await api.verifyVote(ref)
        setReceipt(data)
        setStatus('Payment verified. Thank you for your vote!')
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
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
      <div className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Verifying payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && !error && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#818cf8', '#c084fc', '#f472b6', '#fbbf24'][Math.floor(Math.random() * 4)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="relative max-w-4xl mx-auto px-4 py-8 md:py-16">
        {error ? (
          /* Error State */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-red-100 overflow-hidden">
              <div className="bg-linear-to-r from-red-500 to-rose-600 p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                  <XCircle className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Payment Failed</h2>
                <p className="text-red-50 text-lg">{error}</p>
              </div>
              
              <div className="p-8 md:p-12">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
                  <p className="text-red-800 text-center">
                    Don't worry! Your payment was not processed. You can try again below.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/"
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Home
                  </Link>
                  <Link
                    to="/vote/church"
                    className="flex-1 bg-linear-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 text-center"
                  >
                    Try Again
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Success State */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              {/* Success Header with Icon */}
              <div className="bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 p-8 md:p-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent)]"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
                    <CheckCircle className="w-16 h-16 text-white" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">Vote Successful!</h2>
                  <p className="text-green-50 text-lg md:text-xl max-w-2xl mx-auto">
                    Your payment has been verified and your vote has been securely recorded.
                  </p>
                </div>
              </div>

              {/* Receipt Details */}
              {receipt && (
                <div className="p-6 md:p-12">
                  {/* Candidate Card */}
                  {receipt.candidate_name && (
                    <div className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-xl transform hover:scale-[1.02] transition-transform">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-indigo-100 text-sm font-medium mb-2">You Voted For</p>
                          <h3 className="text-3xl md:text-4xl font-bold">{receipt.candidate_name}</h3>
                          {receipt.position_name && (
                            <p className="text-indigo-200 text-lg mt-2">{receipt.position_name}</p>
                          )}
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                          <CheckCircle className="w-12 h-12" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Transaction Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-gray-600 text-sm font-medium mb-2">Transaction Reference</p>
                          <p className="text-gray-900 font-mono font-bold text-lg break-all">{receipt.reference}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-shadow">
                      <p className="text-green-700 text-sm font-medium mb-2">Amount Paid</p>
                      <p className="text-green-600 font-bold text-3xl">GH₵ {receipt.amount}</p>
                    </div>

                    <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-shadow">
                      <p className="text-blue-700 text-sm font-medium mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Number of Votes
                      </p>
                      <p className="text-blue-600 font-bold text-3xl">{receipt.vote_count}</p>
                    </div>

                    <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-shadow">
                      <p className="text-purple-700 text-sm font-medium mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Date & Time
                      </p>
                      <p className="text-purple-900 font-bold text-lg">
                        {new Date().toLocaleDateString()}
                      </p>
                      <p className="text-purple-600 text-sm mt-1">
                        {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {/* Thank You Card */}
                  <div className="bg-linear-to-r from-amber-50 via-orange-50 to-pink-50 rounded-2xl p-8 mb-8 border border-amber-200 text-center">
                    <h4 className="text-2xl font-bold text-gray-900 mb-3">Thank You for Voting!</h4>
                    <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                      Your vote has been successfully recorded. 
                      Thank you for participating in this process.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <Link
                      to="/results"
                      className="flex items-center justify-center gap-2 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <TrendingUp className="w-5 h-5" />
                      Results
                    </Link>
                    <Link
                      to="/"
                      className="flex items-center justify-center gap-2 bg-linear-to-r r from-blue-600 to-indigo-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Vote Again
                    </Link>
                  </div>

                  {/* Info Banner */}
                  <div className="bg-linear-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 rounded-r-2xl p-6 flex gap-4">
                    <div className="shrink-0">
                      <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Download className="w-5 h-5 text-yellow-900" />
                      </div>
                    </div>
                    <div>
                      <p className="text-yellow-900 font-semibold mb-1">Keep this receipt</p>
                      <p className="text-yellow-800 text-sm">
                        Save this page or take a screenshot for your records. 
                        You can use the transaction reference for any inquiries.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}