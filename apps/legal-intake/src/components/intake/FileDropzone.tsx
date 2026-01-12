'use client'

import { useCallback, useState, useRef } from 'react'

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
]

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export interface SelectedFile {
  id: string
  file: File
  error?: string
}

interface FileDropzoneProps {
  onFilesSelected: (files: SelectedFile[]) => void
  disabled?: boolean
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

function validateFile(file: File): string | undefined {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return `File exceeds 10MB limit (${(file.size / 1024 / 1024).toFixed(1)}MB)`
  }

  // Check file type
  const extension = `.${file.name.split('.').pop()?.toLowerCase()}`
  const isValidExtension = ALLOWED_EXTENSIONS.includes(extension)
  const isValidType = ALLOWED_TYPES.includes(file.type)

  if (!isValidExtension && !isValidType) {
    return `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`
  }

  return undefined
}

export function FileDropzone({ onFilesSelected, disabled = false }: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || disabled) return

      const selectedFiles: SelectedFile[] = Array.from(fileList).map((file) => ({
        id: generateId(),
        file,
        error: validateFile(file),
      }))

      onFilesSelected(selectedFiles)
    },
    [onFilesSelected, disabled]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files)
      // Reset input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [handleFiles]
  )

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }, [disabled])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
        e.preventDefault()
        fileInputRef.current?.click()
      }
    },
    [disabled]
  )

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center
        rounded-lg border-2 border-dashed p-8 transition-colors
        ${
          disabled
            ? 'cursor-not-allowed border-zinc-200 bg-zinc-100'
            : isDragOver
              ? 'border-zinc-400 bg-zinc-100'
              : 'border-zinc-300 bg-white hover:border-zinc-400 hover:bg-zinc-50'
        }
      `}
      aria-label="Drop files here or click to select"
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ALLOWED_EXTENSIONS.join(',')}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
        aria-hidden="true"
      />

      {/* Document Icon */}
      <svg
        className={`mb-4 h-12 w-12 ${disabled ? 'text-zinc-300' : 'text-zinc-400'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>

      <p className={`text-base font-medium ${disabled ? 'text-zinc-400' : 'text-zinc-700'}`}>
        {isDragOver ? 'Drop files here' : 'Drag and drop files here'}
      </p>

      <p className={`mt-1 text-sm ${disabled ? 'text-zinc-400' : 'text-zinc-500'}`}>
        or click to select files
      </p>

      {/* File type and size info */}
      <div className="mt-4 text-center">
        <p className="text-xs text-zinc-400">
          Accepted formats: PDF, DOC, DOCX, JPG, PNG
        </p>
        <p className="mt-1 text-xs text-zinc-400">
          Maximum file size: 10MB per file
        </p>
      </div>
    </div>
  )
}
