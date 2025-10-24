import { useState, useEffect } from 'react'
import LoadingOverlay from './LoadingOverlay'

export default function AppInitializer({ children }) {
  const [isInitializing, setIsInitializing] = useState(true)
  const [initError, setInitError] = useState(null)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsInitializing(true)
        setInitError(null)

        // Removed eager CSRF initialization. CSRF will be initialized
        // on-demand by the API client for non-GET requests.
        await new Promise(resolve => setTimeout(resolve, 300))

      } catch (error) {
        console.error('App initialization failed:', error)
        setInitError(error.message || 'Failed to initialize application')
      } finally {
        setIsInitializing(false)
      }
    }

    initializeApp()
  }, [])

  if (initError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Initialization Failed</h2>
          <p className="text-gray-600 mb-4">{initError}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {children}
      <LoadingOverlay 
        visible={isInitializing} 
        message="Initializing application..." 
        center 
      />
    </>
  )
}