'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Download, Share2, Copy, Check } from 'lucide-react'
import { copyToClipboard } from '@/lib/utils'

interface VisualMoodLightenerProps {
  prompt: string
  imageUrl: string
  index: number
}

export default function VisualMoodLightener({ prompt, imageUrl, index }: VisualMoodLightenerProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [copiedPrompt, setCopiedPrompt] = useState(false)

  const handleCopyPrompt = async () => {
    await copyToClipboard(prompt)
    setCopiedPrompt(true)
    setTimeout(() => setCopiedPrompt(false), 2000)
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `boundary-mood-lightener-${index + 1}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to download image:', error)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Visual Mood Lightener',
          text: prompt,
          url: imageUrl,
        })
      } catch (error) {
        console.error('Failed to share:', error)
      }
    } else {
      // Fallback: copy image URL to clipboard
      await copyToClipboard(imageUrl)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        {imageError || !imageUrl ? (
          <div className="aspect-[4/3] bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <p className="text-gray-500 text-center p-4">
              {!imageUrl
                ? "Image generation in progress... The boundary energy is building! 🌟"
                : "Image couldn't load, but the boundary energy is still strong! 💪"
              }
            </p>
          </div>
        ) : (
          <>
            {!imageLoaded && (
              <div className="aspect-[4/3] bg-gray-200 animate-pulse flex items-center justify-center">
                <p className="text-gray-400">Loading mood lightener...</p>
              </div>
            )}
            <Image
              src={imageUrl}
              alt={`Visual mood lightener: ${prompt}`}
              width={400}
              height={300}
              className={`aspect-[4/3] w-full object-cover transition-opacity ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        )}

        {/* Action buttons overlay */}
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={handleDownload}
            className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            title="Download image"
            disabled={imageError}
          >
            <Download size={16} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            title="Share image"
            disabled={imageError}
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm text-gray-600 flex-1">{prompt}</p>
          <button
            onClick={handleCopyPrompt}
            className="flex-shrink-0 p-1 bg-gray-100 hover:bg-gray-200 rounded text-xs flex items-center gap-1 transition-colors"
            title="Copy prompt"
          >
            {copiedPrompt ? (
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
    </div>
  )
}