import Anthropic from '@anthropic-ai/sdk'

const globalForClaude = globalThis as unknown as {
  claude: Anthropic | undefined
}

/**
 * Get singleton Anthropic client instance
 * Uses ANTHROPIC_API_KEY from environment
 */
export function getClaudeClient(): Anthropic {
  if (globalForClaude.claude) {
    return globalForClaude.claude
  }

  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error('Missing ANTHROPIC_API_KEY environment variable')
  }

  const client = new Anthropic({
    apiKey,
  })

  if (process.env.NODE_ENV !== 'production') {
    globalForClaude.claude = client
  }

  return client
}
