'use client'

import { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'

interface GenerationFormProps {
  onGenerate: (userInput: string) => void
  isLoading: boolean
}

const EXAMPLE_SCENARIOS = [
  "My boss keeps asking me to work weekends",
  "My friend always asks to borrow money but never pays back",
  "My family expects me to host every holiday gathering",
  "A colleague keeps interrupting me in meetings",
  "My neighbor asks me to watch their kids constantly"
]

export default function GenerationForm({ onGenerate, isLoading }: GenerationFormProps) {
  const [userInput, setUserInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userInput.trim() && !isLoading) {
      onGenerate(userInput.trim())
    }
  }

  const handleExampleClick = (example: string) => {
    setUserInput(example)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tell the Boundary Coach about your situation
        </h2>
        <p className="text-gray-600">
          Describe an event you want to decline or a request you need to reject.
          Be as specific as possible so I can give you the best boundary-setting advice.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="situation" className="block text-sm font-medium text-gray-700 mb-2">
            What situation do you need help with?
          </label>
          <textarea
            id="situation"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            placeholder="Example: My coworker keeps asking me to cover their shifts even though I already work overtime..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isLoading}
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              {userInput.length}/500 characters
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!userInput.trim() || isLoading}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              The Boundary Coach is thinking...
            </>
          ) : (
            <>
              <Send size={20} />
              Get My Boundary Options
            </>
          )}
        </button>
      </form>

      {/* Example scenarios */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Need inspiration? Try one of these common scenarios:
        </h3>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_SCENARIOS.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              disabled={isLoading}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}