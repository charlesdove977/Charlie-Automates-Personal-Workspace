import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { jsonResponse, badRequest, notFound, errorResponse } from '@/lib/api'
import { uploadDocument, validateFile } from '@/lib/storage'

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface UploadedDocument {
  id: string
  filename: string
}

interface FailedUpload {
  filename: string
  error: string
}

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

    // Extract files from form data
    const files: File[] = []
    const filesEntry = formData.getAll('files')
    for (const entry of filesEntry) {
      if (entry instanceof File && entry.size > 0) {
        files.push(entry)
      }
    }

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

    // Validate all files before processing
    for (const file of files) {
      const validation = validateFile(file)
      if (!validation.valid) {
        return badRequest(validation.error || 'Invalid file')
      }
    }

    // Look up firm by slug
    const firm = await db.firm.findUnique({
      where: { slug: firmSlug },
    })

    if (!firm) {
      return notFound('Firm not found')
    }

    // Create Case and Documents in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create Case record
      const caseRecord = await tx.case.create({
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

      return { caseRecord }
    })

    const { caseRecord } = result

    // Upload files and create Document records
    // Done outside transaction since storage upload is external
    const uploadedDocuments: UploadedDocument[] = []
    const failedUploads: FailedUpload[] = []

    for (const file of files) {
      const uploadResult = await uploadDocument(file, firm.id, caseRecord.id)

      if (uploadResult.error) {
        failedUploads.push({
          filename: file.name,
          error: uploadResult.error,
        })
        continue
      }

      // Create Document record
      try {
        const document = await db.document.create({
          data: {
            caseId: caseRecord.id,
            filename: file.name,
            mimeType: file.type || 'application/octet-stream',
            sizeBytes: file.size,
            storageUrl: uploadResult.url,
          },
        })

        uploadedDocuments.push({
          id: document.id,
          filename: document.filename,
        })
      } catch (docError) {
        console.error('Document record creation error:', docError)
        failedUploads.push({
          filename: file.name,
          error: 'Failed to save document record',
        })
      }
    }

    // Build response
    const response: {
      caseId: string
      message: string
      documents?: UploadedDocument[]
      partialUpload?: boolean
      failedUploads?: FailedUpload[]
    } = {
      caseId: caseRecord.id,
      message: 'Case submitted successfully',
    }

    if (uploadedDocuments.length > 0) {
      response.documents = uploadedDocuments
    }

    if (failedUploads.length > 0) {
      response.partialUpload = true
      response.failedUploads = failedUploads
      response.message = 'Case submitted with some upload failures'
    }

    return jsonResponse(response, 201)
  } catch (error) {
    console.error('Case submission error:', error)
    return errorResponse('Submission failed')
  }
}
