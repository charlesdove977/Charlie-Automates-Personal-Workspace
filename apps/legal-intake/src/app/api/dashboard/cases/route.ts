import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { CaseStatus } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.firmId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status') as CaseStatus | 'all' | null
  const limit = parseInt(searchParams.get('limit') ?? '20', 10)
  const offset = parseInt(searchParams.get('offset') ?? '0', 10)

  // Build where clause with multi-tenant isolation
  const where: {
    firmId: string
    status?: CaseStatus
  } = {
    firmId: session.user.firmId,
  }

  // Filter by status if not 'all'
  if (status && status !== 'all') {
    where.status = status as CaseStatus
  }

  // Get cases and count in parallel
  const [cases, total] = await Promise.all([
    db.case.findMany({
      where,
      select: {
        id: true,
        clientName: true,
        clientEmail: true,
        caseType: true,
        jurisdiction: true,
        fitScore: true,
        processingStatus: true,
        processingError: true,
        submittedAt: true,
        status: true,
      },
      orderBy: {
        submittedAt: 'desc',
      },
      take: limit,
      skip: offset,
    }),
    db.case.count({ where }),
  ])

  return NextResponse.json(
    { cases, total, limit, offset },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  )
}
