'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Navigation from '@/components/layout/Navigation'
import BoundaryResponseComponent from '@/components/generation/BoundaryResponse'
import { Generation } from '@/types'
import { formatDate } from '@/lib/utils'
import { History, Search, Trash2, Eye, EyeOff, Calendar } from 'lucide-react'

export default function HistoryPage() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const supabase = createClient()

  const fetchGenerations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('generations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setGenerations(data || [])
    } catch (err) {
      console.error('Error fetching generations:', err)
      setError('Failed to load your boundary history')
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchGenerations()
  }, [fetchGenerations])

  const deleteGeneration = async (id: string) => {
    if (!confirm('Are you sure you want to delete this boundary response?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('generations')
        .delete()
        .eq('id', id)

      if (error) throw error

      setGenerations(prev => prev.filter(g => g.id !== id))
      if (selectedGeneration?.id === id) {
        setSelectedGeneration(null)
      }
    } catch (err) {
      console.error('Error deleting generation:', err)
      setError('Failed to delete the boundary response')
    }
  }

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const filteredGenerations = generations.filter(gen =>
    gen.userInput && gen.userInput.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (selectedGeneration) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={() => setSelectedGeneration(null)}
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2"
            >
              ← Back to History
            </button>
            <div className="mt-2 text-sm text-gray-500">
              Generated on {formatDate(selectedGeneration.createdAt)}
            </div>
          </div>

          <BoundaryResponseComponent
            response={selectedGeneration.response}
            userInput={selectedGeneration.userInput || 'No input recorded'}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <History size={32} />
            Your Boundary History
          </h1>
          <p className="text-gray-600 mt-2">
            Review and reuse your previous boundary-setting responses
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search your boundary situations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading your boundary history...</p>
          </div>
        ) : filteredGenerations.length === 0 ? (
          <div className="text-center py-12">
            <History size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No matching boundary responses found' : 'No boundary history yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? 'Try a different search term or clear the search to see all responses'
                : 'Start creating boundary responses to see them here'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Create Your First Boundary Response
              </button>
            )}
          </div>
        ) : (
          /* History List */
          <div className="space-y-4">
            {filteredGenerations.map((generation) => {
              const isExpanded = expandedItems.has(generation.id)
              return (
                <div key={generation.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <Calendar size={14} />
                          {formatDate(generation.createdAt)}
                        </div>
                        <p className="text-gray-800 font-medium">
                          {generation.userInput && generation.userInput.length > 150 && !isExpanded
                            ? `${generation.userInput.substring(0, 150)}...`
                            : (generation.userInput || 'No input recorded')
                          }
                        </p>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => toggleExpanded(generation.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                          title={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          {isExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          onClick={() => setSelectedGeneration(generation)}
                          className="p-2 text-indigo-600 hover:text-indigo-800 rounded-md hover:bg-indigo-50"
                          title="View full response"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => deleteGeneration(generation.id)}
                          className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Quick preview of boundary options */}
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      {generation.response.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <span>{option.emoji}</span>
                          <span className="truncate text-xs text-gray-600">
                            {option.script.length > 30
                              ? `${option.script.substring(0, 30)}...`
                              : option.script
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}