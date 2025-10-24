import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MobileSearchOverlay({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  // Sample search data - in a real app, this would come from an API
  const searchData = [
    { type: 'page', title: 'Dashboard', description: 'Overview & Analytics', path: '/admin/dashboard' },
    { type: 'page', title: 'Categories', description: 'Manage Categories', path: '/admin/categories' },
    { type: 'page', title: 'Positions', description: 'Election Positions', path: '/admin/positions' },
    { type: 'page', title: 'Candidates', description: 'Manage Candidates', path: '/admin/candidates' },
    { type: 'page', title: 'Results', description: 'Election Results', path: '/admin/results' },
    { type: 'page', title: 'Transactions', description: 'Payment Records', path: '/admin/transactions' },
    { type: 'page', title: 'Settings', description: 'System Configuration', path: '/admin/settings' },
    { type: 'action', title: 'Add New Category', description: 'Create a new category', path: '/admin/categories' },
    { type: 'action', title: 'Add New Position', description: 'Create a new position', path: '/admin/positions' },
    { type: 'action', title: 'Add New Candidate', description: 'Create a new candidate', path: '/admin/candidates' },
    { type: 'action', title: 'View Live Results', description: 'Check current election results', path: '/admin/results' }
  ]

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Focus input when overlay opens
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true)
      // Simulate search delay
      const timer = setTimeout(() => {
        const filtered = searchData.filter(item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setSearchResults(filtered)
        setIsSearching(false)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setSearchResults([])
      setIsSearching(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  const handleResultClick = (result) => {
    navigate(result.path)
    onClose()
    setSearchQuery('')
  }

  const getResultIcon = (type) => {
    if (type === 'page') {
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  }

  if (!isOpen) return null

  return (
    <div className="lg:hidden fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search pages, actions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base"
            />
          </div>
          <button
            onClick={onClose}
            className="ml-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 touch-manipulation"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="text-gray-600">Searching...</span>
              </div>
            </div>
          ) : searchQuery.trim() && searchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500 text-center">Try adjusting your search terms or browse the navigation menu</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="p-4 space-y-2">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Search Results ({searchResults.length})
              </h3>
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleResultClick(result)}
                  className="w-full flex items-center p-4 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 touch-manipulation text-left"
                >
                  <div className={`p-2 rounded-lg mr-4 ${
                    result.type === 'page' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {getResultIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{result.title}</h4>
                    <p className="text-sm text-gray-500 truncate">{result.description}</p>
                    <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${
                      result.type === 'page' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {result.type === 'page' ? 'Page' : 'Action'}
                    </span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {searchData.slice(0, 6).map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleResultClick(item)}
                    className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 touch-manipulation"
                  >
                    <div className="p-3 bg-blue-500 rounded-xl mb-3">
                      {getResultIcon(item.type)}
                    </div>
                    <span className="text-sm font-medium text-gray-900 text-center">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}