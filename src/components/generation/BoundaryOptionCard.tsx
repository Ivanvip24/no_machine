'use client'

import { BoundaryOption } from '@/types'
import { copyToClipboard } from '@/lib/utils'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface BoundaryOptionCardProps {
  option: BoundaryOption
}

export default function BoundaryOptionCard({ option }: BoundaryOptionCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await copyToClipboard(option.script)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const colorClasses = {
    soft: 'border-green-200 bg-green-50',
    clear: 'border-yellow-200 bg-yellow-50',
    wall: 'border-red-200 bg-red-50'
  }

  const buttonClasses = {
    soft: 'bg-green-600 hover:bg-green-700',
    clear: 'bg-yellow-600 hover:bg-yellow-700',
    wall: 'bg-red-600 hover:bg-red-700'
  }

  return (
    <div className={`border-2 rounded-lg p-6 ${colorClasses[option.level]}`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{option.emoji}</span>
        <h3 className="text-lg font-semibold text-gray-900">{option.title}</h3>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Use when:</h4>
          <p className="text-gray-600 text-sm">{option.useWhen}</p>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2">Script:</h4>
          <div className="bg-white border border-gray-200 rounded p-3 relative">
            <p className="text-gray-800 italic pr-8">&ldquo;{option.script}&rdquo;</p>
            <button
              onClick={handleCopy}
              className={`absolute top-2 right-2 p-1 rounded ${buttonClasses[option.level]} text-white text-xs flex items-center gap-1 transition-colors`}
            >
              {copied ? (
                <>
                  <Check size={12} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={12} />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2">Why it works:</h4>
          <p className="text-gray-600 text-sm">{option.whyItWorks}</p>
        </div>
      </div>
    </div>
  )
}