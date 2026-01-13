import { createClient } from '@supabase/supabase-js'

// Allowed file types for document uploads
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/jpg',
  'image/png',
]

// Allowed extensions (for fallback validation)
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024

const STORAGE_BUCKET = 'case-documents'

export interface UploadResult {
  url: string
  error?: string
}

export interface FileValidationResult {
  valid: boolean
  error?: string
}

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
 * Validate file type and size
 */
export function validateFile(file: File): FileValidationResult {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File "${file.name}" exceeds maximum size of 10MB`,
    }
  }

  // Validate MIME type
  if (ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: true }
  }

  // Fallback: validate by extension
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (extension && ALLOWED_EXTENSIONS.includes(extension)) {
    return { valid: true }
  }

  return {
    valid: false,
    error: `File "${file.name}" has unsupported type. Allowed: PDF, DOC, DOCX, JPG, PNG`,
  }
}

/**
 * Upload a document to Supabase Storage
 */
export async function uploadDocument(
  file: File,
  firmId: string,
  caseId: string
): Promise<UploadResult> {
  try {
    const supabase = createStorageClient()

    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const storagePath = `${firmId}/${caseId}/${timestamp}-${sanitizedFilename}`

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return {
        url: '',
        error: `Failed to upload "${file.name}": ${uploadError.message}`,
      }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath)

    return { url: publicUrl }
  } catch (error) {
    console.error('Upload error:', error)
    return {
      url: '',
      error: `Failed to upload "${file.name}"`,
    }
  }
}
