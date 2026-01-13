import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

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

  // Get case with multi-tenant isolation
  const caseData = await db.case.findFirst({
    where: {
      id: caseId,
      firmId: session.user.firmId, // Multi-tenant check
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

  // Update case status to ACCEPTED
  const updatedCase = await db.case.update({
    where: { id: caseId },
    data: {
      status: 'ACCEPTED',
      reviewedAt: new Date(),
    },
  })

  // Future: This would trigger calendar booking flow
  // For now, just mark as accepted

  return NextResponse.json(
    {
      id: updatedCase.id,
      status: updatedCase.status,
      reviewedAt: updatedCase.reviewedAt?.toISOString(),
      message: 'Case accepted successfully',
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  )
}
