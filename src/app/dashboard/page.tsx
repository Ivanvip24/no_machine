'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Navigation from '@/components/layout/Navigation'
import GenerationForm from '@/components/generation/GenerationForm'
import BoundaryResponseComponent from '@/components/generation/BoundaryResponse'
import { BoundaryResponse } from '@/types'

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentResponse, setCurrentResponse] = useState<{
    response: BoundaryResponse
    userInput: string
  } | null>(null)
  const [error, setError] = useState<string>('')

  const handleGenerate = async (userInput: string) => {
    setIsLoading(true)
    setError('')
    setCurrentResponse(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate boundary response')
      }

      setCurrentResponse({
        response: data.data.response,
        userInput: data.data.userInput,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to No_Machine
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your boundary-setting companion. Get personalized advice on how to decline
            events, reject requests, and protect your time with confidence and grace.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p><strong>Oops!</strong> {error}</p>
            <p className="text-sm mt-1">
              The Boundary Coach encountered an issue. Please try again.
            </p>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-8">
          {/* Generation Form */}
          <GenerationForm
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />

          {/* Response Display */}
          {currentResponse && (
            <div className="border-t-4 border-indigo-600 pt-8">
              <BoundaryResponseComponent
                response={currentResponse.response}
                userInput={currentResponse.userInput}
              />
            </div>
          )}

          {/* Getting Started Guide */}
          {!currentResponse && !isLoading && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                How No_Machine Works
              </h3>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-indigo-600">1</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Describe Your Situation</h4>
                  <p className="text-sm text-gray-600">
                    Tell us about the event you want to decline or request you need to reject
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-indigo-600">2</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Get 3 Boundary Options</h4>
                  <p className="text-sm text-gray-600">
                    Receive soft, clear, and firm boundary-setting responses with psychology insights
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-indigo-600">3</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Send with Confidence</h4>
                  <p className="text-sm text-gray-600">
                    Copy your chosen response and optional mood-lightening visuals to share
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}