import React from 'react'

export default function LoadingOverlay({ visible, message = 'Loading...', center = false, position = 'top-right' }) {
  if (!visible) return null

  if (center) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm pointer-events-none">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-400 rounded-full animate-pulse mx-auto"></div>
          </div>
          <p className="text-gray-600 font-medium">{message}</p>
        </div>
      </div>
    )
  }

  const posClass = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  }[position] || 'top-right'

  return (
    <div className={`fixed ${posClass} z-50 pointer-events-none`}> 
      <div className="flex items-center gap-2 bg-white/90 border border-gray-200 shadow-lg rounded-xl px-3 py-2">
        <div className="relative">
          <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-6 h-6 border-4 border-transparent border-r-blue-400 rounded-full animate-pulse"></div>
        </div>
        <p className="text-gray-700 text-sm font-medium">{message}</p>
      </div>
    </div>
  )
}