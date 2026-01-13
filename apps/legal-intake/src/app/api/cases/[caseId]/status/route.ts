import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { jsonResponse, notFound, badRequest, errorResponse } from '@/lib/api'

interface RouteParams {
  params: Promise<{ caseId: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
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
        processingError: true,
        processedAt: true,
        briefJson: true,
      },
    })

    if (!caseData) {
      return notFound('Case not found')
    }

    const response = {
      caseId: caseData.id,
      status: caseData.processingStatus,
      error: caseData.processingError,
      processedAt: caseData.processedAt?.toISOString() || null,
      hasBrief: caseData.briefJson !== null,
    }

    // Prevent caching to ensure fresh status
    return jsonResponse(response, 200)
  } catch (error) {
    console.error('Status check error:', error)
    return errorResponse('Failed to check status')
  }
}
