import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { jsonResponse, badRequest, notFound, errorResponse } from '@/lib/api'

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    // Parse multipart/form-data
    const formData = await request.formData()

    // Extract fields
    const firmSlug = formData.get('firmSlug') as string | null
    const clientName = formData.get('clientName') as string | null
    const clientEmail = formData.get('clientEmail') as string | null
    const clientPhone = formData.get('clientPhone') as string | null
    const caseType = formData.get('caseType') as string | null
    const jurisdiction = formData.get('jurisdiction') as string | null
    const briefDescription = formData.get('briefDescription') as string | null

    // Validate required fields
    if (!firmSlug) {
      return badRequest('Firm slug is required')
    }
    if (!clientName) {
      return badRequest('Client name is required')
    }
    if (!clientEmail) {
      return badRequest('Client email is required')
    }
    if (!caseType) {
      return badRequest('Case type is required')
    }

    // Validate email format
    if (!EMAIL_REGEX.test(clientEmail)) {
      return badRequest('Invalid email format')
    }

    // Look up firm by slug
    const firm = await db.firm.findUnique({
      where: { slug: firmSlug },
    })

    if (!firm) {
      return notFound('Firm not found')
    }

    // Create Case record
    const caseRecord = await db.case.create({
      data: {
        firmId: firm.id,
        clientName,
        clientEmail,
        clientPhone: clientPhone || null,
        caseType,
        jurisdiction: jurisdiction || null,
        briefJson: briefDescription
          ? { description: briefDescription }
          : Prisma.JsonNull,
      },
    })

    return jsonResponse(
      {
        caseId: caseRecord.id,
        message: 'Case submitted successfully',
      },
      201
    )
  } catch (error) {
    console.error('Case submission error:', error)
    return errorResponse('Submission failed')
  }
}
