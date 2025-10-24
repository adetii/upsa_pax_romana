import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { toast } from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'

export default function AdminResults() {
  const [results, setResults] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState('votes')
  const [sortOrder, setSortOrder] = useState('desc')
  const [viewMode] = useState('table')
  const { user, authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && user) {
      loadResults()
    }
  }, [authLoading, user])

  async function loadResults() {
    try {
      setLoading(true)
      
      // Load results and categories
      const [resultsData, categoriesData] = await Promise.all([
        api.adminResults(),
        api.publicCategories()
      ])
      
      setResults(resultsData)
      setCategories(categoriesData)
      setError('')
    } catch (e) {
      setError(e.message)
      toast.error('Failed to load results')
    } finally {
      setLoading(false)
    }
  }

  function handleExport(format) {
    const filteredResults = getFilteredResults()
    
    if (format === 'csv') {
      const csvContent = [
        ['Position', 'Candidate', 'Votes', 'Revenue', 'Transactions'],
        ...filteredResults.map(result => [
          result.position_name,
          result.candidate_name,
          result.votes,
          result.total_revenue,
          result.transactions
        ])
      ].map(row => row.join(',')).join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'voting-results.csv'
      a.click()
      window.URL.revokeObjectURL(url)
    } else if (format === 'pdf') {
      toast.success('PDF export feature coming soon')
    }
  }

  function getFilteredResults() {
    let filtered = results
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(result => result.category_name === selectedCategory)
    }
    
    return filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'votes':
          aValue = a.votes || a.total_votes || 0
          bValue = b.votes || b.total_votes || 0
          break
        case 'candidate':
          aValue = a.candidate_name || a.candidate?.name || ''
          bValue = b.candidate_name || b.candidate?.name || ''
          break
        case 'position':
          aValue = a.position_name || a.position?.name || ''
          bValue = b.position_name || b.position?.name || ''
          break
        default:
          aValue = a.votes || a.total_votes || 0
          bValue = b.votes || b.total_votes || 0
      }
      
      if (typeof aValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    })
  }

  const getTopPerformers = () => {
    const filtered = getFilteredResults()
    return filtered.slice(0, 5)
  }

  const getCategoryStats = () => {
    const stats = {}
    results.forEach(result => {
      const category = result.category_name || 'Unknown'
      if (!stats[category]) {
        stats[category] = { votes: 0, revenue: 0, candidates: 0 }
      }
      stats[category].votes += result.votes || result.total_votes || 0
      stats[category].revenue += result.total_revenue || 0
      stats[category].candidates += 1
    })
    return Object.entries(stats).map(([name, data]) => ({ name, ...data }))
  }

  if (loading) {
    return (
     <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-400 rounded-full animate-pulse mx-auto"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading election results...</p>
        </div>
      </div>
    )
  }

  const filteredResults = getFilteredResults()
  const topPerformers = getTopPerformers()
  const categoryStats = getCategoryStats()
  const totalVotes = filteredResults.reduce((sum, result) => sum + (result.votes || result.total_votes || 0), 0)
  const totalRevenue = filteredResults.reduce((sum, result) => sum + (result.total_revenue || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-auto">
      {/* Loading Spinner */}
      {loading && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 font-medium">Loading results...</p>
          </div>
        </div>
      )}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Election Results</h1>
              <p className="mt-1 text-sm text-gray-500">
                Comprehensive analysis and visualization of voting results
              </p>
            </div>
            <div className="flex items-center space-x-3">
             
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleExport('csv')}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export CSV
                </button>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="ml-3 text-red-600 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Results</p>
                <p className="text-2xl font-bold text-gray-900">{filteredResults.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Votes</p>
                <p className="text-2xl font-bold text-gray-900">{totalVotes.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">GH₵{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="votes">Votes</option>
                <option value="candidate">Candidate Name</option>
                <option value="position">Position</option>
              </select>
            </div>

            <div className="lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            {selectedCategory !== 'all' && (
              <div className="flex items-end">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Filter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Top Performers */}
        {topPerformers.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {topPerformers.map((result, index) => (
                <div key={index} className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-sm">#{index + 1}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm truncate">
                    {result.candidate_name || result.candidate?.name}
                  </h4>
                  <p className="text-xs text-gray-600 truncate">
                    {result.position_name || result.position?.name}
                  </p>
                  <p className="text-lg font-bold text-blue-600 mt-1">
                    {(result.votes || result.total_votes || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">votes</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Performance */}
        {categoryStats.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categoryStats.map((category, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{category.name}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Candidates:</span>
                      <span className="font-medium">{category.candidates}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Votes:</span>
                      <span className="font-medium">{category.votes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Revenue:</span>
                      <span className="font-medium">GH₵{category.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Display */}
        {viewMode === 'table' ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Detailed Results</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResults.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index < 3 
                              ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {index + 1}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {result.position_name || result.position?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.candidate_name || result.candidate?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {result.category_name || result.category?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <span className="font-semibold text-lg">{(result.votes || result.total_votes || 0).toLocaleString()}</span>
                          <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ 
                                width: `${totalVotes > 0 ? ((result.votes || result.total_votes || 0) / totalVotes) * 100 : 0}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        GH₵{(result.total_revenue || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.transactions || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredResults.length === 0 && (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-500">Try adjusting your filters to see more results</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Visual Results Chart</h3>
            {filteredResults.length > 0 ? (
              <div className="space-y-4">
                {filteredResults.slice(0, 10).map((result, index) => {
                  const maxVotes = Math.max(...filteredResults.map(r => r.votes || r.total_votes || 0))
                  const percentage = maxVotes > 0 ? ((result.votes || result.total_votes || 0) / maxVotes) * 100 : 0
                  
                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-4 text-sm font-medium text-gray-600">#{index + 1}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              {result.candidate_name || result.candidate?.name}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({result.position_name || result.position?.name})
                            </span>
                          </div>
                          <span className="text-sm font-bold text-gray-900">
                            {(result.votes || result.total_votes || 0).toLocaleString()} votes
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {filteredResults.length > 10 && (
                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-500">
                      Showing top 10 results. Switch to table view to see all {filteredResults.length} results.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No data to visualize</h3>
                <p className="text-gray-500">Try adjusting your filters to see chart data</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}