import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { generateRejectionResponse } from '@/lib/responses'

export const dynamic = 'force-dynamic'

interface RouteParams {
  params: Promise<{ caseId: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await auth()

  if (!session?.user?.firmId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { caseId } = await params

  // Get case with multi-tenant isolation, including firm name for response
  const caseData = await db.case.findFirst({
    where: {
      id: caseId,
      firmId: session.user.firmId, // Multi-tenant check
    },
    include: {
      firm: {
        select: {
          name: true,
        },
      },
    },
  })

  // Return 404 if case not found or belongs to different firm
  if (!caseData) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 })
  }

  // Validate case is in PENDING status
  if (caseData.status !== 'PENDING') {
    return NextResponse.json(
      { error: 'Case has already been processed' },
      { status: 400 }
    )
  }

  // Generate rejection response
  const responseText = generateRejectionResponse({
    clientName: caseData.clientName,
    firmName: caseData.firm.name,
    caseType: caseData.caseType,
  })

  // Update case status to REJECTED and store response
  const updatedCase = await db.case.update({
    where: { id: caseId },
    data: {
      status: 'REJECTED',
      reviewedAt: new Date(),
    },
  })

  // Note: Actual email sending is out of scope for this phase
  // The response is generated and returned; email integration would be Phase 5+

  return NextResponse.json(
    {
      id: updatedCase.id,
      status: updatedCase.status,
      reviewedAt: updatedCase.reviewedAt?.toISOString(),
      responseText,
      message: 'Case rejected successfully',
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  )
}
