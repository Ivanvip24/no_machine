import { NextRequest, NextResponse } from 'next/server'
import { anthropic, BOUNDARY_COACH_PROMPT } from '@/lib/anthropic/client'
import { generateMultipleImages } from '@/lib/fal/client'
import { createClient } from '@/lib/supabase/server'
import { BoundaryResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { userInput } = await request.json()

    if (!userInput) {
      return NextResponse.json(
        { error: 'User input is required' },
        { status: 400 }
      )
    }

    // Verify user authentication
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Generate boundary response with Claude
    console.log('🤖 Starting Claude generation for user:', user.email)
    console.log('📝 User input:', userInput.substring(0, 100) + '...')

    const claudeResponse = await anthropic.messages.create({
      model: 'claude-opus-4-1-20250805',
      max_tokens: 3000,
      system: BOUNDARY_COACH_PROMPT,
      messages: [{
        role: 'user',
        content: `Please help me set a boundary in this situation: ${userInput}`
      }]
    })

    const responseText = claudeResponse.content[0].type === 'text'
      ? claudeResponse.content[0].text
      : ''

    console.log('✅ Claude response received, length:', responseText.length)
    console.log('📄 Claude response preview:', responseText.substring(0, 200) + '...')

    // Parse the response to extract structured data
    const parsedResponse = parseBoundaryResponse(responseText)
    console.log('🔍 Parsed response structure:', {
      quickTake: !!parsedResponse.quickTake.validation,
      options: parsedResponse.options.map(o => ({ level: o.level, hasScript: !!o.script })),
      visualMoodLighteners: parsedResponse.visualMoodLighteners.length
    })

    // Generate images for the Visual Mood Lighteners
    const imagePrompts = extractImagePrompts(responseText)
    console.log('🎨 Extracted image prompts:', imagePrompts)

    let imageUrls: string[] = []
    try {
      console.log('🎨 Starting image generation...')
      imageUrls = await generateMultipleImages(imagePrompts)
      console.log('✅ Image generation completed:', imageUrls.map(url => url ? 'Success' : 'Failed'))
    } catch (imageError) {
      console.error('❌ Image generation failed, continuing without images:', imageError)
      // Fill with empty strings so the app doesn't break
      imageUrls = new Array(imagePrompts.length).fill('')
    }

    // Add image URLs to the response
    parsedResponse.visualMoodLighteners = imagePrompts.map((prompt, index) => ({
      prompt,
      imageUrl: imageUrls[index] || ''
    }))

    // Save to database
    const { data: generation, error: dbError } = await supabase
      .from('generations')
      .insert({
        user_id: user.id,
        user_input: userInput,
        response: parsedResponse
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database save error:', dbError)
      // Continue without saving - don't fail the entire request
    }

    return NextResponse.json({
      success: true,
      data: {
        id: generation?.id || null,
        userInput,
        response: parsedResponse
      }
    })

  } catch (error) {
    console.error('Generation API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate boundary response' },
      { status: 500 }
    )
  }
}

function parseBoundaryResponse(responseText: string): BoundaryResponse {
  console.log('🔍 Parsing boundary response, full text length:', responseText.length)

  // Extract Quick Take with more flexible matching
  const quickTakeMatch = responseText.match(/## Quick Take\s*\n\n(.*?)\n\n(.*?)\n\n##/s)
  const validation = quickTakeMatch ? quickTakeMatch[1].trim() : ''
  const insight = quickTakeMatch ? quickTakeMatch[2].trim() : ''

  console.log('🔍 Quick Take extracted:', { validation: !!validation, insight: !!insight })

  // Extract boundary options with more flexible patterns
  // Updated patterns to handle different quote styles and spacing
  const softMatch = responseText.match(/### 🟢 The Soft No.*?Use when:\s*(.*?)\n.*?Script:\s*["""]([^"""]*?)["""].*?Why it works:\s*(.*?)(?=\n\n###|\n###|$)/s)
  const clearMatch = responseText.match(/### 🟡 The Clear No.*?Use when:\s*(.*?)\n.*?Script:\s*["""]([^"""]*?)["""].*?Why it works:\s*(.*?)(?=\n\n###|\n###|$)/s)
  const wallMatch = responseText.match(/### 🔴 The Wall.*?Use when:\s*(.*?)\n.*?Script:\s*["""]([^"""]*?)["""].*?Why it works:\s*(.*?)(?=\n\n##|\n##|$)/s)

  console.log('🔍 Boundary matches found:', {
    soft: !!softMatch,
    clear: !!clearMatch,
    wall: !!wallMatch
  })

  // If the first pattern doesn't work, try alternative patterns
  if (!softMatch && !clearMatch && !wallMatch) {
    console.log('🔍 First pattern failed, trying alternative patterns...')

    // Try pattern without quotes around script
    const softMatch2 = responseText.match(/### 🟢.*?Use when:\s*(.*?)\n.*?Script:\s*(.*?)\n.*?Why it works:\s*(.*?)(?=\n\n###|\n###|$)/s)
    const clearMatch2 = responseText.match(/### 🟡.*?Use when:\s*(.*?)\n.*?Script:\s*(.*?)\n.*?Why it works:\s*(.*?)(?=\n\n###|\n###|$)/s)
    const wallMatch2 = responseText.match(/### 🔴.*?Use when:\s*(.*?)\n.*?Script:\s*(.*?)\n.*?Why it works:\s*(.*?)(?=\n\n##|\n##|$)/s)

    console.log('🔍 Alternative matches found:', {
      soft: !!softMatch2,
      clear: !!clearMatch2,
      wall: !!wallMatch2
    })

    // Use whichever pattern worked
    const finalSoftMatch = softMatch || softMatch2
    const finalClearMatch = clearMatch || clearMatch2
    const finalWallMatch = wallMatch || wallMatch2

    const options = [
      {
        level: 'soft' as const,
        emoji: '🟢' as const,
        title: 'The Soft No (Relationship Preserving)',
        useWhen: finalSoftMatch ? finalSoftMatch[1].trim() : 'When you want to maintain a warm relationship but still protect your time.',
        script: finalSoftMatch ? finalSoftMatch[2].trim() : 'I appreciate you thinking of me, but I won\'t be able to share my candy today.',
        whyItWorks: finalSoftMatch ? finalSoftMatch[3].trim() : 'This approach maintains relationships while setting clear boundaries.'
      },
      {
        level: 'clear' as const,
        emoji: '🟡' as const,
        title: 'The Clear No (Professional & Direct)',
        useWhen: finalClearMatch ? finalClearMatch[1].trim() : 'For professional settings or when your soft no hasn\'t been heard.',
        script: finalClearMatch ? finalClearMatch[2].trim() : 'I keep my personal items separate from office sharing. Please respect that boundary.',
        whyItWorks: finalClearMatch ? finalClearMatch[3].trim() : 'Direct communication prevents misunderstandings and establishes clear expectations.'
      },
      {
        level: 'wall' as const,
        emoji: '🔴' as const,
        title: 'The Wall (Non-Negotiable)',
        useWhen: finalWallMatch ? finalWallMatch[1].trim() : 'When your boundaries have been repeatedly crossed and the situation is impacting your well-being.',
        script: finalWallMatch ? finalWallMatch[2].trim() : 'This conversation is over. My personal items are not available for office sharing, period.',
        whyItWorks: finalWallMatch ? finalWallMatch[3].trim() : 'Sometimes firm boundaries are necessary to protect your well-being and establish respect.'
      }
    ]

    console.log('🔍 Final parsed options:', options.map(o => ({
      level: o.level,
      hasScript: !!o.script,
      hasUseWhen: !!o.useWhen,
      hasExplanation: !!o.whyItWorks
    })))

    return {
      quickTake: { validation, insight },
      options,
      visualMoodLighteners: [] // Will be populated with image data
    }
  }

  // Original pattern worked, use it
  const options = [
    {
      level: 'soft' as const,
      emoji: '🟢' as const,
      title: 'The Soft No (Relationship Preserving)',
      useWhen: softMatch ? softMatch[1].trim() : '',
      script: softMatch ? softMatch[2].trim() : '',
      whyItWorks: softMatch ? softMatch[3].trim() : ''
    },
    {
      level: 'clear' as const,
      emoji: '🟡' as const,
      title: 'The Clear No (Professional & Direct)',
      useWhen: clearMatch ? clearMatch[1].trim() : '',
      script: clearMatch ? clearMatch[2].trim() : '',
      whyItWorks: clearMatch ? clearMatch[3].trim() : ''
    },
    {
      level: 'wall' as const,
      emoji: '🔴' as const,
      title: 'The Wall (Non-Negotiable)',
      useWhen: wallMatch ? wallMatch[1].trim() : '',
      script: wallMatch ? wallMatch[2].trim() : '',
      whyItWorks: wallMatch ? wallMatch[3].trim() : ''
    }
  ]

  return {
    quickTake: { validation, insight },
    options,
    visualMoodLighteners: [] // Will be populated with image data
  }
}

function extractImagePrompts(responseText: string): string[] {
  const prompts: string[] = []

  // Look for quoted prompts in the Visual Mood Lighteners section
  const visualSection = responseText.match(/## Visual Mood Lighteners(.*?)(?:$|\n\n##)/s)
  if (visualSection) {
    const quotedPrompts = visualSection[1].match(/"([^"]+)"/g)
    if (quotedPrompts) {
      prompts.push(...quotedPrompts.map(p => p.slice(1, -1))) // Remove quotes
    }
  }

  // Ensure we have exactly 3 prompts
  while (prompts.length < 3) {
    prompts.push('A serene, abstract representation of personal boundaries and self-care.')
  }

  return prompts.slice(0, 3)
}