import { db } from '@/lib/db'
import { notFound, errorResponse, badRequest } from '@/lib/api'
import { analyzeCase } from '@/lib/analysis'
import type { DocumentWithText } from '@/types/case-brief'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  const { caseId } = await params

  // Validate caseId
  if (!caseId || typeof caseId !== 'string') {
    return badRequest('Invalid case ID')
  }

  try {
    // Look up Case with Documents
    const caseRecord = await db.case.findUnique({
      where: { id: caseId },
      include: {
        documents: true,
      },
    })

    if (!caseRecord) {
      return notFound('Case not found')
    }

    // Check for documents with extracted text
    const documentsWithText = caseRecord.documents.filter(
      (doc) => doc.extractedText !== null && doc.extractedText.trim().length > 0
    )

    if (documentsWithText.length === 0) {
      return badRequest(
        'No extracted text available. Run document extraction first (POST /api/cases/[caseId]/extract)'
      )
    }

    console.log(
      `[analyze] Analyzing case ${caseId} with ${documentsWithText.length} documents`
    )

    // Prepare documents for analysis
    const analysisInput: DocumentWithText[] = documentsWithText.map((doc) => ({
      id: doc.id,
      filename: doc.filename,
      extractedText: doc.extractedText as string,
    }))

    // Call analysis service
    const brief = await analyzeCase(analysisInput, caseRecord.caseType ?? undefined)

    // Store brief in database (serialize to plain JSON for Prisma)
    await db.case.update({
      where: { id: caseId },
      data: {
        briefJson: JSON.parse(JSON.stringify(brief)),
      },
    })

    console.log(`[analyze] Analysis complete for case ${caseId}`)

    const response = NextResponse.json({
      success: true,
      brief,
    })
    response.headers.set('Cache-Control', 'no-store')
    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[analyze] Analysis failed for case ${caseId}:`, message)

    // Return specific error messages for known issues
    if (message.includes('rate limit')) {
      return errorResponse(message, 429)
    }
    if (message.includes('authentication') || message.includes('API key')) {
      return errorResponse('AI service configuration error', 500)
    }

    return errorResponse(`Case analysis failed: ${message}`)
  }
}
