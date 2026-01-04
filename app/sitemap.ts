import { MetadataRoute } from 'next'
import { audioSetsData } from '@/lib/audio-sets-data'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gabe-audio.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const audioSetUrls = audioSetsData.map((set) => ({
    url: `${baseUrl}/sets/${set.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/games`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/games/random-country`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...audioSetUrls,
  ]
}

