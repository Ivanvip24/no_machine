import { fal } from '@fal-ai/client'

// Configure FAL client
fal.config({
  credentials: process.env.FAL_API_KEY!,
})

export interface FalImageResponse {
  images: Array<{
    url: string
    width: number
    height: number
  }>
}

export async function generateImage(prompt: string): Promise<string> {
  try {
    console.log('🎨 FAL.ai: Starting image generation with prompt:', prompt.substring(0, 100) + '...')

    const result = await fal.subscribe('fal-ai/flux/dev', {
      input: {
        prompt,
        image_size: 'landscape_4_3',
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        enable_safety_checker: true,
        safety_tolerance: 2,
      },
      logs: false,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS') {
          console.log('Image generation in progress...')
        }
      },
    })

    // Debug: Log the complete response structure
    console.log('🔍 FAL.ai response structure:', JSON.stringify(result, null, 2))

    // Handle different possible response formats
    if (result && typeof result === 'object') {
      // Check for different possible property names
      const imageUrl =
        result.data?.images?.[0]?.url ||     // FAL.ai nested format (CORRECT!)
        result.images?.[0]?.url ||           // Standard format
        result.data?.[0]?.url ||             // Alternative format 1
        result.image?.url ||                 // Alternative format 2
        result.url ||                        // Direct URL format
        result.output?.url ||                // Output wrapper format
        result.result?.images?.[0]?.url ||   // Nested result format
        '';

      if (imageUrl) {
        console.log('✅ FAL.ai: Successfully generated image URL:', imageUrl.substring(0, 50) + '...')
        return imageUrl
      } else {
        console.error('❌ FAL.ai: No image URL found in response. Available properties:', Object.keys(result))
        throw new Error('No image URL found in FAL.ai response')
      }
    } else {
      console.error('❌ FAL.ai: Invalid response format:', typeof result, result)
      throw new Error('Invalid response format from FAL.ai')
    }
  } catch (error) {
    console.error('💥 FAL.ai image generation error:', error)
    console.error('Error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack?.split('\n')[0]
    })
    throw new Error(`Failed to generate image: ${error?.message || 'Unknown error'}`)
  }
}

export async function generateMultipleImages(prompts: string[]): Promise<string[]> {
  try {
    console.log(`🎨 FAL.ai: Starting generation of ${prompts.length} images...`)

    // Generate images one by one to avoid overwhelming the API
    const results: string[] = []

    for (let i = 0; i < prompts.length; i++) {
      console.log(`🎨 FAL.ai: Generating image ${i + 1} of ${prompts.length}`)
      try {
        const imageUrl = await generateImage(prompts[i])
        results.push(imageUrl)
        console.log(`✅ FAL.ai: Successfully generated image ${i + 1}`)
      } catch (error) {
        console.error(`❌ FAL.ai: Failed to generate image ${i + 1}:`, error)
        // Add empty string for failed images to maintain array structure
        results.push('')
      }

      // Add small delay between requests to be API-friendly
      if (i < prompts.length - 1) {
        console.log('⏳ FAL.ai: Waiting 1 second before next image...')
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    console.log(`✅ FAL.ai: Completed batch generation. Success: ${results.filter(r => r).length}/${prompts.length}`)
    return results
  } catch (error) {
    console.error('💥 FAL.ai multiple image generation error:', error)
    throw new Error('Failed to generate images')
  }
}