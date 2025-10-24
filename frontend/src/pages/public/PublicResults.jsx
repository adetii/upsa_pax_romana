import { useEffect, useState, useMemo, useCallback } from 'react'
import { api } from '../../lib/api'

export default function PublicResults() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedPosition, setSelectedPosition] = useState('')
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState('votes_desc')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  const normalize = useCallback((data) => {
    if (!Array.isArray(data)) return []
    return data.map(d => ({
      category: (d.category_name ?? (typeof d.category === 'string' ? d.category : d.category?.name)) || 'Uncategorized',
      position: (d.position_name ?? (typeof d.position === 'string' ? d.position : d.position?.name)) || 'Unknown Position',
      candidate: (d.candidate_name ?? (typeof d.candidate === 'string' ? d.candidate : d.candidate?.name)) || 'Unknown',
      votes: typeof d.votes === 'number' ? d.votes : (typeof d.total_votes === 'number' ? d.total_votes : 0)
    }))
  }, [])

  const loadResults = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true)
        setError('')
      }
      const data = await api.publicResults()
      const normalized = normalize(data)
      setResults(normalized)
      setLastUpdated(new Date())
    } catch (e) {
      setError(e.message || 'Failed to load results')
    } finally {
      setLoading(false)
    }
  }, [normalize])

  useEffect(() => { loadResults() }, [loadResults])

  useEffect(() => {
    if (!autoRefresh) return
    const id = setInterval(() => loadResults(true), 10000)
    return () => clearInterval(id)
  }, [autoRefresh, loadResults])

  const categories = useMemo(() => [...new Set(results.map(r => r.category).filter(Boolean))], [results])
  const positions = useMemo(() => [...new Set(results.map(r => r.position).filter(Boolean))], [results])
  const candidatesCount = useMemo(() => new Set(results.map(r => r.candidate)).size, [results])
  const totalVotesSum = useMemo(() => results.reduce((sum, r) => sum + (r.votes || 0), 0), [results])

  const filtered = useMemo(() => {
    return results.filter(r =>
      (!selectedCategory || r.category === selectedCategory) &&
      (!selectedPosition || r.position === selectedPosition) &&
      (!search || r.candidate.toLowerCase().includes(search.toLowerCase()))
    )
  }, [results, selectedCategory, selectedPosition, search])

  const groupedResults = useMemo(() => {
    const byPos = {}
    filtered.forEach(r => {
      const key = r.position
      if (!byPos[key]) byPos[key] = { position: key, category: r.category, candidates: [], totalVotes: 0 }
      byPos[key].candidates.push(r)
      byPos[key].totalVotes += r.votes || 0
    })
    const groups = Object.values(byPos)
    groups.forEach(g => {
      g.candidates.sort((a, b) => {
        if (sortOrder === 'alpha') return a.candidate.localeCompare(b.candidate)
        if (sortOrder === 'votes_asc') return (a.votes || 0) - (b.votes || 0)
        return (b.votes || 0) - (a.votes || 0)
      })
    })
    return groups.sort((a, b) => b.totalVotes - a.totalVotes)
  }, [filtered, sortOrder])

  const handleResetFilters = () => {
    setSelectedCategory('')
    setSelectedPosition('')
    setSearch('')
    setSortOrder('votes_desc')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Hero Skeleton */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="animate-pulse">
                <div className="h-10 w-64 bg-white/20 rounded-xl mb-4"></div>
                <div className="h-6 w-48 bg-white/10 rounded-lg"></div>
              </div>
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                  <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-20 bg-gray-100 rounded"></div>
                </div>
              ))}
            </div>

            {/* Results Skeleton */}
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
                  <div className="h-8 w-48 bg-gray-200 rounded-xl mb-6"></div>
                  <div className="space-y-4">
                    {[...Array(3)].map((__, j) => (
                      <div key={j} className="h-20 bg-gray-100 rounded-xl"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Public Results Unavailable</h3>
          <p className="text-gray-600 mb-6">Results will be displayed after the voting process.</p>
          <div className="flex flex-col sm:flex-row gap-3">
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
            <div className="absolute top-0 right-0 -mt-8 -mr-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
            
            <div className="relative p-8 md:p-12">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-3 h-3 rounded-full animate-pulse shadow-lg ${autoRefresh ? 'bg-green-400 shadow-green-400/50' : 'bg-gray-400'}`}></div>
                    <span className="text-blue-100 text-sm font-semibold uppercase tracking-wider">
                      {autoRefresh ? 'Live Updates' : 'Manual Mode'}
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                    Election Results
                  </h1>
                  <p className="text-xl text-blue-100">
                    Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => loadResults()}
                    className="group flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-xl border border-white/20 hover:border-white/30"
                  >
                    <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Refresh</span>
                  </button>
                  
                  <button
                    onClick={() => setAutoRefresh(a => !a)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                      autoRefresh 
                        ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25' 
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {autoRefresh ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                    <span>Auto: {autoRefresh ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100 hover:border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{categories.length}</div>
              <div className="text-sm font-medium text-gray-500">Categories</div>
            </div>

            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100 hover:border-green-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-green-100 rounded-xl group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{positions.length}</div>
              <div className="text-sm font-medium text-gray-500">Positions</div>
            </div>

            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100 hover:border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-purple-100 rounded-xl group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{candidatesCount}</div>
              <div className="text-sm font-medium text-gray-500">Candidates</div>
            </div>

            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100 hover:border-orange-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-orange-100 rounded-xl group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{totalVotesSum.toLocaleString()}</div>
              <div className="text-sm font-medium text-gray-500">Total Votes</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Filter Results</h2>
              {(selectedCategory || selectedPosition || search) && (
                <button
                  onClick={handleResetFilters}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Clear All</span>
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Position</label>
                <select
                  value={selectedPosition}
                  onChange={e => setSelectedPosition(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">All Positions</option>
                  {positions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search Candidate</label>
                <div className="relative">
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Type a name..."
                    className="w-full px-4 py-3 pl-11 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="votes_desc">Votes: High → Low</option>
                  <option value="votes_asc">Votes: Low → High</option>
                  <option value="alpha">Name: A → Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          {groupedResults.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Results Found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
              <button
                onClick={handleResetFilters}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-all transform hover:scale-105"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedResults.map((group, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                  {/* Position Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 md:p-8 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{group.position}</h2>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <span className="font-medium">{group.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-3xl md:text-4xl font-bold text-blue-600">{group.totalVotes.toLocaleString()}</div>
                          <div className="text-sm text-gray-500 font-medium">Total Votes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl md:text-4xl font-bold text-purple-600">{group.candidates.length}</div>
                          <div className="text-sm text-gray-500 font-medium">Candidates</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Candidates */}
                  <div className="p-6 md:p-8">
                    <div className="space-y-6">
                      {group.candidates.map((r, i) => {
                        const percentage = group.totalVotes > 0 ? (r.votes / group.totalVotes) * 100 : 0
                        const isLeading = i === 0 && r.votes > 0 && sortOrder !== 'votes_asc'
                        const rankColors = [
                          { bg: 'bg-gradient-to-br from-yellow-400 to-yellow-500', text: 'text-yellow-900', bar: 'bg-gradient-to-r from-yellow-400 to-yellow-500', glow: 'shadow-yellow-500/25' },
                          { bg: 'bg-gradient-to-br from-gray-300 to-gray-400', text: 'text-gray-900', bar: 'bg-gradient-to-r from-gray-400 to-gray-500', glow: 'shadow-gray-500/25' },
                          { bg: 'bg-gradient-to-br from-orange-400 to-orange-500', text: 'text-orange-900', bar: 'bg-gradient-to-r from-orange-400 to-orange-500', glow: 'shadow-orange-500/25' },
                        ]
                        const colorScheme = rankColors[i] || { bg: 'bg-gradient-to-br from-blue-400 to-blue-500', text: 'text-blue-900', bar: 'bg-gradient-to-r from-blue-400 to-blue-500', glow: 'shadow-blue-500/25' }

                        return (
                          <div key={i} className={`group relative bg-gray-50 rounded-2xl p-6 hover:shadow-xl transition-all border-2 ${isLeading ? 'border-green-200 bg-green-50/50' : 'border-transparent'}`}>
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-4 flex-1">
                                <div className={`w-14 h-14 ${colorScheme.bg} rounded-xl flex items-center justify-center text-xl font-bold ${colorScheme.text} shadow-lg ${colorScheme.glow} group-hover:scale-110 transition-transform flex-shrink-0`}>
                                  {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center flex-wrap gap-2 mb-1">
                                    <h3 className="text-xl font-bold text-gray-900">{r.candidate}</h3>
                                    {isLeading && (
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white shadow-lg shadow-green-500/25">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        LEADING
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-500">Candidate #{i + 1}</p>
                                </div>
                              </div>
                              <div className="text-right ml-4 flex-shrink-0">
                                <div className="text-2xl font-bold text-gray-900 mb-1">{r.votes.toLocaleString()}</div>
                                <div className="text-sm font-semibold text-gray-500">votes</div>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="relative">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-600">Vote Share</span>
                                <span className="text-lg font-bold text-gray-900">{percentage.toFixed(1)}%</span>
                              </div>
                              <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                                <div
                                  className={`h-4 ${colorScheme.bar} rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden`}
                                  style={{ width: `${percentage}%` }}
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Results update every 10 seconds when auto-refresh is enabled
                  </p>
                  <p className="text-xs text-gray-600">Last updated: {lastUpdated?.toLocaleString() || 'Never'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="font-medium">Verified & Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}