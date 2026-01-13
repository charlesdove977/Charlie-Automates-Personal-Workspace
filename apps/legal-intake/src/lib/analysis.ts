import { getClaudeClient } from './claude'
import type {
  CaseBrief,
  DocumentWithText,
  AnalysisMetadata,
} from '@/types/case-brief'

const MODEL = 'claude-sonnet-4-20250514'
const MAX_TOKENS = 4096

/**
 * System prompt defining AI behavior as a paralegal
 * CRITICAL: This constrains the AI to fact extraction only
 */
const SYSTEM_PROMPT = `You are a legal document analyst assistant helping attorneys review case intake documents.

YOUR ROLE:
- Act like a junior paralegal summarizing documents for attorney review
- Extract facts only - never interpret law or give legal advice
- Summarize, don't advise
- Flag anything uncertain clearly

STRICT RULES:
- NEVER recommend legal action or strategy
- NEVER interpret what the law means for this case
- NEVER predict case outcomes
- ONLY extract and organize facts from the documents
- ALWAYS flag low-confidence extractions
- When information is missing or unclear, explicitly note it

OUTPUT FORMAT:
You must respond with valid JSON matching the CaseBrief schema provided.
Every extraction must include a confidence level (high/medium/low).
Use "low" confidence for anything inferred rather than explicitly stated.
Do not include any text before or after the JSON object.`

/**
 * JSON schema description for Claude to follow
 */
const SCHEMA_DESCRIPTION = `
The output must be a JSON object with this structure:
{
  "caseType": {
    "primary": string (e.g., "Divorce", "Custody", "Child Support"),
    "secondary": string[] (optional, additional case types),
    "confidence": "high" | "medium" | "low"
  },
  "jurisdiction": {
    "state": string (optional),
    "county": string (optional),
    "confidence": "high" | "medium" | "low",
    "source": string (optional, where detected)
  },
  "parties": {
    "petitioner": { "name": string, "role": string, "details": string, "confidence": "high" | "medium" | "low" } (optional),
    "respondent": { "name": string, "role": string, "details": string, "confidence": "high" | "medium" | "low" } (optional),
    "children": [{ "name": string, "age": number, "custody": string, "confidence": "high" | "medium" | "low" }] (optional),
    "otherParties": [{ "name": string, "role": string, "details": string, "confidence": "high" | "medium" | "low" }] (optional)
  },
  "timeline": [{ "date": string, "description": string, "source": string, "confidence": "high" | "medium" | "low" }],
  "keyFacts": [{ "fact": string, "category": "financial" | "custody" | "property" | "domestic" | "procedural" | "other", "importance": "high" | "medium" | "low", "source": string, "confidence": "high" | "medium" | "low" }],
  "redFlags": [{ "issue": string, "severity": "high" | "medium" | "low", "details": string, "source": string }],
  "summary": string (2-3 sentences summarizing the case),
  "uncertainties": [{ "area": string, "reason": string, "needsHumanReview": boolean }]
}
`

/**
 * Maximum text length to send to Claude (approximately 100k tokens worth)
 */
const MAX_TEXT_LENGTH = 300000

/**
 * Analyze case documents and generate a structured brief
 */
export async function analyzeCase(
  documents: DocumentWithText[],
  caseType?: string
): Promise<CaseBrief> {
  const startTime = Date.now()
  console.log(`[analysis] Starting case analysis with ${documents.length} documents`)

  const client = getClaudeClient()

  // Prepare document text
  let combinedText = documents
    .map((doc) => `=== Document: ${doc.filename} ===\n${doc.extractedText}`)
    .join('\n\n')

  const totalTextLength = combinedText.length
  let truncated = false

  // Truncate if too long
  if (combinedText.length > MAX_TEXT_LENGTH) {
    console.log(`[analysis] Text too long (${combinedText.length} chars), truncating to ${MAX_TEXT_LENGTH}`)
    combinedText = combinedText.slice(0, MAX_TEXT_LENGTH)
    truncated = true
  }

  // Build user prompt
  const caseTypeHint = caseType ? `\nThe client indicated this is a ${caseType} case.` : ''
  const userPrompt = `Analyze the following legal documents and extract a structured case brief.
${caseTypeHint}

${SCHEMA_DESCRIPTION}

DOCUMENTS TO ANALYZE:

${combinedText}

Respond with ONLY the JSON object, no additional text.`

  try {
    console.log(`[analysis] Calling Claude API...`)

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      temperature: 0, // Consistent extraction
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    })

    const processingTime = Date.now() - startTime
    console.log(`[analysis] Claude API response received in ${processingTime}ms`)

    // Extract text content
    const textContent = response.content.find((block) => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in Claude response')
    }

    // Parse JSON response
    let brief: Omit<CaseBrief, 'analysisMetadata'>
    try {
      // Try to extract JSON from response (handle potential markdown code blocks)
      let jsonText = textContent.text.trim()
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.slice(7)
      }
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.slice(3)
      }
      if (jsonText.endsWith('```')) {
        jsonText = jsonText.slice(0, -3)
      }
      jsonText = jsonText.trim()

      brief = JSON.parse(jsonText)
    } catch (parseError) {
      console.error('[analysis] Failed to parse Claude response as JSON:', parseError)
      console.error('[analysis] Raw response:', textContent.text.slice(0, 500))

      // Return partial result with error
      return createErrorBrief(
        'Failed to parse AI response as JSON',
        documents.length,
        totalTextLength,
        processingTime
      )
    }

    // Build metadata
    const metadata: AnalysisMetadata = {
      documentCount: documents.length,
      totalTextLength,
      processingTime,
      modelUsed: MODEL,
      timestamp: new Date().toISOString(),
    }

    // Add truncation uncertainty if needed
    const uncertainties = brief.uncertainties || []
    if (truncated) {
      uncertainties.push({
        area: 'Document Coverage',
        reason: 'Some document text was truncated due to length limits',
        needsHumanReview: true,
      })
    }

    console.log(`[analysis] Analysis complete: ${brief.keyFacts?.length || 0} key facts, ${brief.redFlags?.length || 0} red flags`)

    return {
      ...brief,
      uncertainties,
      analysisMetadata: metadata,
    }
  } catch (error) {
    const processingTime = Date.now() - startTime
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[analysis] Claude API error after ${processingTime}ms:`, message)

    // Check for specific API errors
    if (message.includes('rate_limit')) {
      throw new Error('Claude API rate limit exceeded. Please try again later.')
    }
    if (message.includes('authentication') || message.includes('api_key')) {
      throw new Error('Claude API authentication failed. Check ANTHROPIC_API_KEY.')
    }

    throw new Error(`Case analysis failed: ${message}`)
  }
}

/**
 * Create an error brief when analysis fails but we want to return something
 */
function createErrorBrief(
  errorMessage: string,
  documentCount: number,
  totalTextLength: number,
  processingTime: number
): CaseBrief {
  return {
    caseType: {
      primary: 'Unknown',
      confidence: 'low',
    },
    jurisdiction: {
      confidence: 'low',
    },
    parties: {},
    timeline: [],
    keyFacts: [],
    redFlags: [],
    summary: 'Analysis failed to complete. Please review documents manually.',
    uncertainties: [
      {
        area: 'Analysis Error',
        reason: errorMessage,
        needsHumanReview: true,
      },
    ],
    analysisMetadata: {
      documentCount,
      totalTextLength,
      processingTime,
      modelUsed: MODEL,
      timestamp: new Date().toISOString(),
    },
  }
}
