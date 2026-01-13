import { PDFParse } from 'pdf-parse'
import mammoth from 'mammoth'
import { createClient } from '@supabase/supabase-js'

export interface ExtractionResult {
  text: string | null
  error?: string
  pageCount?: number
}

const STORAGE_BUCKET = 'case-documents'

/**
 * Create a Supabase client with service role key for storage operations
 */
function createStorageClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase configuration for storage')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Extract storage path from a Supabase public URL
 */
function extractStoragePath(publicUrl: string): string | null {
  // URL format: https://xxx.supabase.co/storage/v1/object/public/case-documents/path/to/file
  const match = publicUrl.match(/\/storage\/v1\/object\/public\/case-documents\/(.+)$/)
  return match ? match[1] : null
}

/**
 * Extract text from a PDF buffer
 */
export async function extractFromPdf(buffer: Buffer): Promise<ExtractionResult> {
  const startTime = Date.now()
  console.log('[extraction] Starting PDF extraction...')

  let parser: PDFParse | null = null

  try {
    // Convert Buffer to Uint8Array for pdf-parse v2
    const data = new Uint8Array(buffer)
    parser = new PDFParse({ data })

    const result = await parser.getText()
    const duration = Date.now() - startTime
    console.log(`[extraction] PDF extraction complete in ${duration}ms, ${result.total} pages`)

    return {
      text: result.text.trim() || null,
      pageCount: result.total,
    }
  } catch (error) {
    const duration = Date.now() - startTime
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[extraction] PDF extraction failed after ${duration}ms:`, message)

    // Handle common PDF errors
    if (message.includes('password')) {
      return {
        text: null,
        error: 'PDF is password-protected',
      }
    }

    return {
      text: null,
      error: `Failed to extract PDF text: ${message}`,
    }
  } finally {
    // Clean up parser resources
    if (parser) {
      await parser.destroy().catch(() => {})
    }
  }
}

/**
 * Extract text from a DOCX buffer
 */
export async function extractFromDocx(buffer: Buffer): Promise<ExtractionResult> {
  const startTime = Date.now()
  console.log('[extraction] Starting DOCX extraction...')

  try {
    const result = await mammoth.extractRawText({ buffer })
    const duration = Date.now() - startTime
    console.log(`[extraction] DOCX extraction complete in ${duration}ms`)

    if (result.messages.length > 0) {
      console.log('[extraction] DOCX extraction messages:', result.messages)
    }

    return {
      text: result.value.trim() || null,
    }
  } catch (error) {
    const duration = Date.now() - startTime
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[extraction] DOCX extraction failed after ${duration}ms:`, message)

    return {
      text: null,
      error: `Failed to extract DOCX text: ${message}`,
    }
  }
}

/**
 * Extract text from a document URL based on its MIME type
 * Uses signed URLs to access private Supabase storage
 */
export async function extractTextFromDocument(
  url: string,
  mimeType: string
): Promise<ExtractionResult> {
  const startTime = Date.now()
  console.log(`[extraction] Fetching document from URL, mimeType: ${mimeType}`)

  try {
    // Extract storage path from public URL
    const storagePath = extractStoragePath(url)
    if (!storagePath) {
      console.error(`[extraction] Invalid storage URL format: ${url}`)
      return {
        text: null,
        error: 'Invalid storage URL format',
      }
    }

    // Create signed URL for private bucket access
    const supabase = createStorageClient()
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(storagePath, 60) // 60 seconds expiry

    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.error(`[extraction] Failed to create signed URL:`, signedUrlError)
      return {
        text: null,
        error: `Failed to create signed URL: ${signedUrlError?.message || 'Unknown error'}`,
      }
    }

    console.log(`[extraction] Created signed URL for path: ${storagePath}`)

    // Fetch document using signed URL
    const response = await fetch(signedUrlData.signedUrl)

    if (!response.ok) {
      console.error(`[extraction] Failed to fetch document: ${response.status}`)
      return {
        text: null,
        error: `Failed to fetch document: HTTP ${response.status}`,
      }
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const fetchDuration = Date.now() - startTime
    console.log(`[extraction] Document fetched in ${fetchDuration}ms, size: ${buffer.length} bytes`)

    // Route by MIME type
    if (mimeType === 'application/pdf') {
      return extractFromPdf(buffer)
    }

    if (
      mimeType === 'application/msword' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return extractFromDocx(buffer)
    }

    if (mimeType.startsWith('image/')) {
      console.log('[extraction] Image OCR not implemented')
      return {
        text: null,
        error: 'Image OCR not implemented',
      }
    }

    console.log(`[extraction] Unsupported MIME type: ${mimeType}`)
    return {
      text: null,
      error: `Unsupported file type: ${mimeType}`,
    }
  } catch (error) {
    const duration = Date.now() - startTime
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[extraction] Document extraction failed after ${duration}ms:`, message)

    return {
      text: null,
      error: `Failed to extract document text: ${message}`,
    }
  }
}
