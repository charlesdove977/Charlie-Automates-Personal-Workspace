import { NextRequest } from 'next/server'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { jsonResponse, notFound, badRequest, errorResponse } from '@/lib/api'
import { processCase } from '@/lib/processing'

interface RouteParams {
  params: Promise<{ caseId: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { caseId } = await params

    if (!caseId) {
      return badRequest('Case ID is required')
    }

    const caseData = await db.case.findUnique({
      where: { id: caseId },
      select: {
        id: true,
        processingStatus: true,
      },
    })

    if (!caseData) {
      return notFound('Case not found')
    }

    // Reset processing state
    await db.case.update({
      where: { id: caseId },
      data: {
        processingStatus: 'QUEUED',
        processingError: null,
        briefJson: Prisma.JsonNull, // Clear to force fresh analysis
        fitScore: null,
        processedAt: null,
      },
    })

    // Also clear extracted text from documents to force re-extraction
    await db.document.updateMany({
      where: { caseId: caseId },
      data: { extractedText: null },
    })

    // Trigger processing (fire and forget)
    processCase(caseId).catch((error) => {
      console.error(`[reprocess] Background processing failed for case ${caseId}:`, error)
    })

    return jsonResponse(
      {
        message: 'Reprocessing started',
        caseId: caseId,
        processingStatus: 'QUEUED',
      },
      200
    )
  } catch (error) {
    console.error('Reprocess error:', error)
    return errorResponse('Failed to reprocess case')
  }
}
