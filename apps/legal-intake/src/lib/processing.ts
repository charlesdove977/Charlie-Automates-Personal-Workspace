import { db } from './db'
import { extractTextFromDocument } from './extraction'
import { analyzeCase } from './analysis'
import type { CaseBrief } from '@/types/case-brief'

/**
 * Calculate a basic fit score from the case brief
 * - Count high-importance key facts (+10 each)
 * - Count medium-importance key facts (+5 each)
 * - Subtract points for high-severity red flags (-15 each)
 * - Subtract points for medium-severity red flags (-5 each)
 * - Clamp to 0-100 range
 *
 * Note: This is a basic implementation. Phase 5 will add firm-specific criteria.
 */
function calculateBasicFitScore(brief: CaseBrief): number {
  let score = 50 // Start at baseline

  // Add points for key facts
  for (const fact of brief.keyFacts || []) {
    if (fact.importance === 'high') {
      score += 10
    } else if (fact.importance === 'medium') {
      score += 5
    }
  }

  // Subtract points for red flags
  for (const flag of brief.redFlags || []) {
    if (flag.severity === 'high') {
      score -= 15
    } else if (flag.severity === 'medium') {
      score -= 5
    }
  }

  // Clamp to 0-100
  return Math.max(0, Math.min(100, score))
}

/**
 * Process a case through the full AI pipeline:
 * 1. Extract text from all documents
 * 2. Run AI analysis on extracted text
 * 3. Calculate fit score
 * 4. Update case with results
 *
 * Updates processingStatus throughout to allow status tracking.
 */
export async function processCase(caseId: string): Promise<void> {
  const startTime = Date.now()
  console.log(`[processing] Starting processing for case ${caseId}`)

  try {
    // Mark as EXTRACTING
    await db.case.update({
      where: { id: caseId },
      data: { processingStatus: 'EXTRACTING' },
    })
    console.log(`[processing] Case ${caseId} status: EXTRACTING`)

    // Get case with documents
    const caseData = await db.case.findUnique({
      where: { id: caseId },
      include: { documents: true },
    })

    if (!caseData) {
      throw new Error(`Case ${caseId} not found`)
    }

    console.log(`[processing] Found ${caseData.documents.length} documents`)

    // Extract text from each document that doesn't already have extracted text
    for (const doc of caseData.documents) {
      if (!doc.extractedText) {
        console.log(`[processing] Extracting text from: ${doc.filename}`)
        const result = await extractTextFromDocument(doc.storageUrl, doc.mimeType)

        if (result.text) {
          await db.document.update({
            where: { id: doc.id },
            data: { extractedText: result.text },
          })
          console.log(`[processing] Extracted ${result.text.length} chars from ${doc.filename}`)
        } else if (result.error) {
          console.warn(`[processing] Extraction failed for ${doc.filename}: ${result.error}`)
        }
      } else {
        console.log(`[processing] Skipping ${doc.filename} - already has extracted text`)
      }
    }

    // Mark as ANALYZING
    await db.case.update({
      where: { id: caseId },
      data: { processingStatus: 'ANALYZING' },
    })
    console.log(`[processing] Case ${caseId} status: ANALYZING`)

    // Reload documents with extracted text
    const updatedCase = await db.case.findUnique({
      where: { id: caseId },
      include: { documents: true },
    })

    if (!updatedCase) {
      throw new Error(`Case ${caseId} not found after extraction`)
    }

    // Filter to documents with extracted text
    const docsWithText = updatedCase.documents
      .filter((d) => d.extractedText)
      .map((d) => ({
        id: d.id,
        filename: d.filename,
        extractedText: d.extractedText as string,
      }))

    console.log(`[processing] ${docsWithText.length} documents have extracted text`)

    if (docsWithText.length > 0) {
      // Run AI analysis
      console.log(`[processing] Running AI analysis...`)
      const brief = await analyzeCase(docsWithText, updatedCase.caseType || undefined)

      // Calculate basic fit score
      const fitScore = calculateBasicFitScore(brief)
      console.log(`[processing] Calculated fit score: ${fitScore}`)

      // Update case with results
      await db.case.update({
        where: { id: caseId },
        data: {
          briefJson: brief as object,
          fitScore,
          processingStatus: 'COMPLETE',
          processedAt: new Date(),
        },
      })

      const duration = Date.now() - startTime
      console.log(`[processing] Case ${caseId} processing COMPLETE in ${duration}ms`)
    } else {
      // No text to analyze
      await db.case.update({
        where: { id: caseId },
        data: {
          processingStatus: 'COMPLETE',
          processedAt: new Date(),
          processingError: 'No extractable text in documents',
        },
      })

      const duration = Date.now() - startTime
      console.log(`[processing] Case ${caseId} COMPLETE (no text) in ${duration}ms`)
    }
  } catch (error) {
    const duration = Date.now() - startTime
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[processing] Case ${caseId} FAILED after ${duration}ms:`, message)

    // Update with failure status
    await db.case.update({
      where: { id: caseId },
      data: {
        processingStatus: 'FAILED',
        processingError: message,
      },
    })

    throw error
  }
}
