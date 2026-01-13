import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import type { CaseBrief } from '@/types/case-brief'

export const dynamic = 'force-dynamic'

interface RouteParams {
  params: Promise<{ caseId: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await auth()

  if (!session?.user?.firmId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { caseId } = await params

  // Get case with multi-tenant isolation
  const caseData = await db.case.findFirst({
    where: {
      id: caseId,
      firmId: session.user.firmId, // Multi-tenant check
    },
    include: {
      documents: {
        select: {
          id: true,
          filename: true,
          mimeType: true,
          sizeBytes: true,
        },
      },
    },
  })

  // Return 404 if case not found or belongs to different firm
  if (!caseData) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 })
  }

  // Parse briefJson if present (it's stored as JSON in DB)
  let brief: CaseBrief | null = null
  if (caseData.briefJson) {
    brief = caseData.briefJson as unknown as CaseBrief
  }

  // Build response
  const response = {
    id: caseData.id,
    clientName: caseData.clientName,
    clientEmail: caseData.clientEmail,
    clientPhone: caseData.clientPhone,
    caseType: caseData.caseType,
    jurisdiction: caseData.jurisdiction,
    status: caseData.status,
    fitScore: caseData.fitScore,
    processingStatus: caseData.processingStatus,
    processingError: caseData.processingError,
    submittedAt: caseData.submittedAt.toISOString(),
    processedAt: caseData.processedAt?.toISOString() ?? null,
    reviewedAt: caseData.reviewedAt?.toISOString() ?? null,
    brief,
    documents: caseData.documents,
  }

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}
