import { db } from '@/lib/db'
import { notFound, errorResponse, badRequest } from '@/lib/api'
import { extractTextFromDocument, type ExtractionResult } from '@/lib/extraction'
import { NextResponse } from 'next/server'

interface ExtractionDocResult {
  documentId: string
  filename: string
  success: boolean
  error?: string
  pageCount?: number
}

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

    // Filter documents without extracted text
    const documentsToProcess = caseRecord.documents.filter(
      (doc) => doc.extractedText === null
    )

    if (documentsToProcess.length === 0) {
      const response = NextResponse.json({
        extracted: 0,
        failed: 0,
        message: 'All documents already have extracted text',
        results: [],
      })
      response.headers.set('Cache-Control', 'no-store')
      return response
    }

    console.log(`[extract] Processing ${documentsToProcess.length} documents for case ${caseId}`)

    // Process each document
    const results: ExtractionDocResult[] = []
    let extractedCount = 0
    let failedCount = 0

    for (const document of documentsToProcess) {
      console.log(`[extract] Processing document: ${document.filename} (${document.mimeType})`)

      const extractionResult: ExtractionResult = await extractTextFromDocument(
        document.storageUrl,
        document.mimeType
      )

      if (extractionResult.text) {
        // Update document with extracted text
        await db.document.update({
          where: { id: document.id },
          data: { extractedText: extractionResult.text },
        })

        extractedCount++
        results.push({
          documentId: document.id,
          filename: document.filename,
          success: true,
          pageCount: extractionResult.pageCount,
        })
      } else {
        failedCount++
        results.push({
          documentId: document.id,
          filename: document.filename,
          success: false,
          error: extractionResult.error || 'Unknown extraction error',
        })
      }
    }

    console.log(`[extract] Extraction complete: ${extractedCount} succeeded, ${failedCount} failed`)

    const response = NextResponse.json({
      extracted: extractedCount,
      failed: failedCount,
      results,
    })
    response.headers.set('Cache-Control', 'no-store')
    return response
  } catch (error) {
    console.error('[extract] Extraction error:', error)
    return errorResponse('Failed to extract documents')
  }
}
