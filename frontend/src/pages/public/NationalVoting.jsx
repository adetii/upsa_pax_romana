import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, getImageUrl } from '../../lib/api'
import toast from 'react-hot-toast'

export default function NationalVoting() {
  const [positions, setPositions] = useState([])
  const [candidates, setCandidates] = useState({})
  const [expandedPositions, setExpandedPositions] = useState(new Set())
  const [loadingPositions, setLoadingPositions] = useState(new Set())
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [voteCounts, setVoteCounts] = useState({})
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedPosition, setSelectedPosition] = useState('')
  const [votingStatus, setVotingStatus] = useState(null)
  const [votingLocked, setVotingLocked] = useState(false)

  useEffect(() => {
    loadInitialData()
    checkVotingStatus()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      
      const allCategories = await api.categories()
      const nationalCategory = allCategories.find(cat => cat.name === 'National')
      
      if (!nationalCategory) {
        toast.error('National category not found')
        return
      }
      
      // Only set the National category in the categories state
      setCategories([nationalCategory])
      
      const categoryPositions = await api.positionsByCategory(nationalCategory.id)
      const positionsWithCategory = categoryPositions.map(position => ({
        ...position,
        category_name: nationalCategory.name,
        category_id: nationalCategory.id
      }))
      
      setPositions(positionsWithCategory)
      
    } catch (error) {
      console.error('Failed to load initial data:', error)
      toast.error('Failed to load voting data')
    } finally {
      setLoading(false)
    }
  }

  const checkVotingStatus = async () => {
    try {
      const status = await api.getVotingStatus()
      setVotingStatus(status)
      setVotingLocked(!status?.national_voting?.active)
    } catch (error) {
      console.error('Failed to check voting status:', error)
      // Default to locked if we can't check status
      setVotingLocked(true)
    }
  }

  const loadCandidatesForPosition = async (position) => {
    if (candidates[position.id] || loadingPositions.has(position.id)) {
      return
    }

    try {
      setLoadingPositions(prev => new Set([...prev, position.id]))
      
      const positionCandidates = await api.candidatesByPosition(position.id)
      const candidatesWithDetails = positionCandidates.map(candidate => ({
        ...candidate,
        position_name: position.name,
        position_id: position.id,
        category_name: position.category_name,
        category_id: position.category_id
      }))
      
      setCandidates(prev => ({
        ...prev,
        [position.id]: candidatesWithDetails
      }))
      
    } catch (error) {
      console.warn(`Failed to load candidates for position ${position.id}:`, error)
      toast.error(`Failed to load candidates for ${position.name}`)
    } finally {
      setLoadingPositions(prev => {
        const newSet = new Set(prev)
        newSet.delete(position.id)
        return newSet
      })
    }
  }

  // Filtering logic
  const filteredPositions = positions.filter(position => {
    if (selectedCategory && position.category_id !== selectedCategory) {
      return false
    }
    if (selectedPosition && position.name !== selectedPosition) {
      return false
    }
    return true
  })

  // Get positions for the selected category
  const getPositionsForCategory = () => {
    if (!selectedCategory) return positions
    return positions.filter(position => position.category_id === selectedCategory)
  }

  const togglePosition = async (position) => {
    const isExpanded = expandedPositions.has(position.id)
    
    if (isExpanded) {
      setExpandedPositions(prev => {
        const newSet = new Set(prev)
        newSet.delete(position.id)
        return newSet
      })
    } else {
      setExpandedPositions(prev => new Set([...prev, position.id]))
      await loadCandidatesForPosition(position)
    }
  }

  const updateVoteCount = (candidateId, count) => {
    setVoteCounts(prev => ({
      ...prev,
      [candidateId]: Math.max(1, count)
    }))
  }

  const handleVote = async (candidate) => {
    // Check if voting is locked
    if (votingLocked) {
      toast.error(votingStatus?.national_voting?.lock_message || 'National voting is currently not available. Please check back later.')
      return
    }

    const voteCount = voteCounts[candidate.id] || 1
    const amount = voteCount * 1.0

    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    if (voteCount < 1) {
      toast.error('Please select at least 1 vote')
      return
    }

    setLoading(true)
    toast.loading('Initializing payment...')
    
    try {
      const resp = await api.initializeVote({
        candidate_id: Number(candidate.id),
        position_id: Number(candidate.position_id),
        vote_count: Number(voteCount),
        amount: amount,
        email,
        phone,
      })
      
      // eslint-disable-next-line no-unused-vars
      const { authorization_url, reference } = resp
      if (!authorization_url) throw new Error('Payment initialization failed')
      
      // Rely on payment gateway callback to include 'reference' param
      window.location.href = authorization_url
    } catch (e) {
      toast.dismiss()
      toast.error(e.message || 'Payment initialization failed')
    } finally {
      setLoading(false)
    }
  }

  const CandidateSkeleton = () => (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-gray-100 animate-pulse">
      <div className="h-64 bg-gray-200"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
    </div>
  )

  if (loading && positions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading voting data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                National Elections
              </h1>
              <p className="text-gray-600 mt-1">Cast your vote • GHC 1 per vote</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Voting Lock Message */}
        {votingLocked && (
          <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">
                  National Voting Currently Unavailable
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    {votingStatus?.national_voting?.lock_message || 'National voting is currently not available. Please check back later.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-blue-600">🔍</span>
            Filter Candidates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value)
                  setSelectedPosition('') // Reset position when category changes
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Position Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Position
              </label>
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">All Positions</option>
                {getPositionsForCategory().map((position) => (
                  <option key={position.id} value={position.name}>
                    {position.name} ({position.category_name})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Clear Filters */}
          {(selectedCategory || selectedPosition) && (
            <div className="mt-4">
              <button
                onClick={() => {
                  setSelectedCategory('')
                  setSelectedPosition('')
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Voter Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Voter Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Positions */}
        {filteredPositions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-purple-100">
            <div className="text-6xl mb-4">🗳️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {positions.length === 0 ? 'No Positions Yet' : 'No Matching Positions'}
            </h3>
            <p className="text-gray-600">
              {positions.length === 0 
                ? 'National positions will be added soon.' 
                : 'Try adjusting your filters to see more positions.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPositions.map((position) => {
              const isExpanded = expandedPositions.has(position.id)
              const isLoading = loadingPositions.has(position.id)
              const positionCandidates = candidates[position.id] || []

              return (
                <div key={position.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  {/* Position Header - Clickable */}
                  <button
                    onClick={() => togglePosition(position)}
                    className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-900">{position.name}</h2>
                        {positionCandidates.length > 0 && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-semibold rounded-full">
                            {positionCandidates.length} candidate{positionCandidates.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {isLoading && (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-600 border-t-transparent"></div>
                        )}
                        <svg 
                          className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2 text-sm">
                      Click to {isExpanded ? 'hide' : 'view'} candidates
                    </p>
                  </button>

                  {/* Candidates Section */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 p-6">
                      {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {[1, 2, 3].map((i) => (
                            <CandidateSkeleton key={i} />
                          ))}
                        </div>
                      ) : positionCandidates.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="text-4xl mb-4"></div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Candidates Yet</h3>
                          <p className="text-gray-600">Candidates will be added soon.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {positionCandidates.map((candidate) => {
                            const voteCount = voteCounts[candidate.id] || 1
                            const totalCost = voteCount * 1.0

                            return (
                              <div
                                key={candidate.id}
                                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-blue-200 group"
                              >
                                {/* Candidate Photo */}
                                <div className="relative h-64 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden">
                                  {candidate.photo_url ? (
                                    <img
                                      src={getImageUrl(candidate.photo_url)}
                                      alt={candidate.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      onError={(e) => {
                                        e.target.style.display = 'none'
                                        e.target.nextSibling.style.display = 'flex'
                                      }}
                                    />
                                  ) : null}
                                  <div 
                                    className={`absolute inset-0 flex items-center justify-center ${candidate.photo_url ? 'hidden' : 'flex'}`}
                                    style={{ display: candidate.photo_url ? 'none' : 'flex' }}
                                  >
                                    <div className="text-center">
                                      <div className="text-6xl mb-2">👤</div>
                                      <p className="text-gray-600 font-medium">{candidate.name}</p>
                                    </div>
                                  </div>
                                  {/* Vote Count Badge */}
                                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                                    <span className="text-sm font-bold text-blue-600">{candidate.vote_count || 0} votes</span>
                                  </div>
                                </div>

                                {/* Candidate Info */}
                                <div className="p-6">
                                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                    {candidate.name}
                                  </h3>
                                  {candidate.bio && (
                                    <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed">{candidate.bio}</p>
                                  )}
                                  
                                  {/* Category Badge */}
                                  <div className="mb-4">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                                      {candidate.category_name}
                                    </span>
                                  </div>

                                  {/* Vote Count Selector */}
                                  <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                      How many votes?
                                    </label>
                                    <div className="flex items-center gap-3">
                                      <button
                                        onClick={() => updateVoteCount(candidate.id, voteCount - 1)}
                                        className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors flex items-center justify-center text-xl"
                                      >
                                        −
                                      </button>
                                      <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={voteCount}
                                        onChange={(e) => updateVoteCount(candidate.id, parseInt(e.target.value) || 1)}
                                        className="flex-1 h-12 px-4 border-2 border-gray-200 rounded-xl text-center font-bold text-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      />
                                      <button
                                        onClick={() => updateVoteCount(candidate.id, voteCount + 1)}
                                        className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors flex items-center justify-center text-xl"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>

                                  {/* Quick Select */}
                                  <div className="flex gap-2 mb-4">
                                    {[1, 5, 10, 25].map((count) => (
                                      <button
                                        key={count}
                                        onClick={() => updateVoteCount(candidate.id, count)}
                                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                                          voteCount === count
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                      >
                                        {count}
                                      </button>
                                    ))}
                                  </div>

                                  {/* Total Cost */}
                                  <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-4 text-center mb-4">
                                    <p className="text-sm text-gray-600 mb-1">Total Cost</p>
                                    <p className="text-3xl font-bold text-blue-700">GH₵{totalCost.toFixed(2)}</p>
                                  </div>

                                  {/* Vote Button */}
                                  <button
                                    onClick={() => handleVote(candidate)}
                                    disabled={loading || !email || voteCount < 1 || votingLocked}
                                    className={`w-full font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg text-lg ${
                                      votingLocked 
                                        ? 'bg-gray-400 text-gray-700' 
                                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                                    }`}
                                  >
                                    {votingLocked ? (
                                      <span className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Voting Locked
                                      </span>
                                    ) : loading ? (
                                      <span className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        Processing...
                                      </span>
                                    ) : (
                                      <span className="flex items-center justify-center gap-2">
                                        Vote Now
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                      </span>
                                    )}
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
    