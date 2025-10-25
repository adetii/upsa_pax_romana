import { useState } from 'react'
import toast from 'react-hot-toast'

export default function VoteConfirmationModal({ 
  isOpen, 
  onClose, 
  candidate, 
  position, 
  voteCount, 
  totalAmount, 
  email, 
  phone, 
  onConfirm 
}) {
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Payment initialization failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">🗳️ Confirm Your Vote</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Candidate Info */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
              {candidate?.photo ? (
                <img 
                  src={candidate.photo} 
                  alt={candidate.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                '👤'
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {candidate?.name}
            </h3>
            <p className="text-gray-600 font-medium">
              {position?.name || 'Position'}
            </p>
          </div>

          {/* Vote Details */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Number of Votes:</span>
              <span className="text-xl font-bold text-blue-600">{voteCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Cost per Vote:</span>
              <span className="text-lg font-semibold text-gray-900">GH₵ 1.00</span>
            </div>
            <hr className="border-gray-300" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total Amount:</span>
              <span className="text-2xl font-bold text-green-600">
                GH₵ {totalAmount?.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-blue-50 rounded-xl p-4 space-y-2">
            <h4 className="font-semibold text-gray-900 mb-2">📧 Contact Information</h4>
            <div className="text-sm text-gray-700">
              <p><strong>Email:</strong> {email}</p>
              {phone && <p><strong>Phone:</strong> {phone}</p>}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-8 bg-green-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">PAY</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Paystack Payment</p>
                <p className="text-sm text-gray-600">Secure payment via Paystack</p>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Once payment is completed, your vote cannot be changed or refunded. 
                  Please review your selection carefully.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              `💳 Pay GH₵ ${totalAmount?.toFixed(2)}`
            )}
          </button>
        </div>
      </div>
    </div>
  )
}