import { useSearchParams, Link } from 'react-router-dom'
import { XCircle, ArrowLeft } from 'lucide-react'

export default function PaymentFailed() {
  const [params] = useSearchParams()
  const error = params.get('error') || 'unknown_error'

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'missing_reference':
        return 'Payment reference is missing. Please try voting again.'
      case 'payment_not_found':
        return 'Payment record not found. Please contact support if you were charged.'
      case 'payment_not_successful':
        return 'Payment was not successful. Please try again.'
      case 'verification_failed':
        return 'Payment verification failed. Please try again or contact support.'
      default:
        return 'Payment failed due to an unknown error. Please try again.'
    }
  }

  const getErrorTitle = (errorCode) => {
    switch (errorCode) {
      case 'missing_reference':
      case 'payment_not_found':
        return 'Payment Not Found'
      case 'payment_not_successful':
      case 'verification_failed':
        return 'Payment Failed'
      default:
        return 'Payment Error'
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden flex items-center justify-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-8 md:py-16 w-full">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-red-100 overflow-hidden">
            <div className="bg-linear-to-r from-red-500 to-rose-600 p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                <XCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{getErrorTitle(error)}</h2>
              <p className="text-red-50 text-lg">{getErrorMessage(error)}</p>
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
                  className="flex-1 bg-linear-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 text-center"
                >
                  Try Again
                </Link>
              </div>

              {/* Support Information */}
              <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-center" style={{ color: 'var(--sg-gray-700)' }}>
                  <strong>Need help?</strong> If the problem persists, contact our support team with the error code: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{error}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}