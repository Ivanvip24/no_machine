'use client'

import { BoundaryResponse } from '@/types'
import BoundaryOptionCard from './BoundaryOptionCard'
import VisualMoodLightener from './VisualMoodLightener'
import { BookOpen, Heart, Lightbulb } from 'lucide-react'

interface BoundaryResponseProps {
  response: BoundaryResponse
  userInput: string
}

export default function BoundaryResponseComponent({ response, userInput }: BoundaryResponseProps) {
  return (
    <div className="space-y-8">
      {/* User's Original Request */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <BookOpen size={20} />
          Your Situation
        </h3>
        <p className="text-gray-700 italic">&ldquo;{userInput}&rdquo;</p>
      </div>

      {/* Quick Take */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Heart size={24} className="text-indigo-600" />
          Quick Take
        </h2>

        <div className="space-y-3">
          <p className="text-gray-800 text-lg leading-relaxed">
            {response.quickTake.validation}
          </p>
          <p className="text-indigo-800 font-medium text-lg leading-relaxed">
            {response.quickTake.insight}
          </p>
        </div>
      </div>

      {/* Boundary Options */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Lightbulb size={24} className="text-yellow-600" />
          Your 3 Boundary Options
        </h2>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {response.options.map((option, index) => (
            <BoundaryOptionCard key={index} option={option} />
          ))}
        </div>
      </div>

      {/* Visual Mood Lighteners */}
      {response.visualMoodLighteners.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Visual Mood Lighteners 🎨
          </h2>
          <p className="text-gray-600 mb-6">
            Because setting boundaries can be tough, here are some delightfully absurd visuals
            to remind you that you've got this! Share these with your message to add some
            levity to serious conversations.
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {response.visualMoodLighteners.map((lightener, index) => (
              <VisualMoodLightener
                key={index}
                prompt={lightener.prompt}
                imageUrl={lightener.imageUrl || ''}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-indigo-600 text-white rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold mb-2">
          You've Got This! 💪
        </h3>
        <p className="text-indigo-100">
          Remember: Setting boundaries isn't mean, it's necessary.
          You're not responsible for managing other people's emotions about your limits.
        </p>
      </div>
    </div>
  )
}