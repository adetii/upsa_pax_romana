import { useSearchParams, Link } from 'react-router-dom'

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
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">❌</span>
          </div>
          
          {/* Error Title */}
          <h2 className="text-3xl font-bold text-red-600 mb-4">{getErrorTitle(error)}</h2>
          
          {/* Error Message */}
          <p className="text-gray-600 text-lg mb-8">{getErrorMessage(error)}</p>
          
          {/* Help Information */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 text-left">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-blue-400 text-xl">💡</span>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-800 mb-1">What to do next:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Check your internet connection</li>
                  <li>• Ensure you have sufficient funds</li>
                  <li>• Try using a different payment method</li>
                  <li>• Contact support if the problem persists</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-colors"
            >
              🔄 Try Voting Again
            </Link>
            <Link
              to="/"
              className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-6 rounded-xl transition-colors"
            >
              🏠 Back to Home
            </Link>
          </div>
          
          {/* Support Information */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600">
              <strong>Need help?</strong> If you continue to experience issues or were charged but your vote wasn't recorded, 
              please contact our support team with the error code: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{error}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}