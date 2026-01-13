import OpenAI from 'openai'

const globalForOpenAI = globalThis as unknown as {
  openai: OpenAI | undefined
}

/**
 * Get singleton OpenAI client instance
 * Uses OPENAI_API_KEY from environment
 */
export function getOpenAIClient(): OpenAI {
  if (globalForOpenAI.openai) {
    return globalForOpenAI.openai
  }

  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY environment variable')
  }

  const client = new OpenAI({
    apiKey,
    organization: process.env.OPENAI_ORG_ID,
  })

  if (process.env.NODE_ENV !== 'production') {
    globalForOpenAI.openai = client
  }

  return client
}
