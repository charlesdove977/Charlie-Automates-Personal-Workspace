'use client'

import type { SelectedFile } from './FileDropzone'

export interface FileWithProgress extends SelectedFile {
  progress?: number // 0-100
  uploaded?: boolean
}

interface FileListProps {
  files: FileWithProgress[]
  onRemove: (id: string) => void
  disabled?: boolean
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(mimeType: string): React.ReactNode {
  const isImage = mimeType.startsWith('image/')
  const isPdf = mimeType === 'application/pdf'

  if (isImage) {
    return (
      <svg
        className="h-5 w-5 text-zinc-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    )
  }

  if (isPdf) {
    return (
      <svg
        className="h-5 w-5 text-red-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    )
  }

  // Default document icon
  return (
    <svg
      className="h-5 w-5 text-blue-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  )
}

export function FileList({ files, onRemove, disabled = false }: FileListProps) {
  if (files.length === 0) {
    return null
  }

  return (
    <ul className="mt-4 divide-y divide-zinc-100 rounded-lg border border-zinc-200 bg-white">
      {files.map((fileItem) => {
        const { id, file, error, progress, uploaded } = fileItem
        const isUploading = typeof progress === 'number' && progress < 100 && !error
        const hasError = Boolean(error)

        return (
          <li
            key={id}
            className={`flex items-center gap-3 px-4 py-3 ${
              hasError ? 'bg-red-50' : uploaded ? 'bg-green-50' : ''
            }`}
          >
            {/* File Icon */}
            <div className="flex-shrink-0">{getFileIcon(file.type)}</div>

            {/* File Info */}
            <div className="min-w-0 flex-1">
              <p
                className={`truncate text-sm font-medium ${
                  hasError ? 'text-red-700' : 'text-zinc-700'
                }`}
              >
                {file.name}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">
                  {formatFileSize(file.size)}
                </span>
                {hasError && (
                  <span className="text-xs text-red-600">{error}</span>
                )}
                {uploaded && !hasError && (
                  <span className="text-xs text-green-600">Uploaded</span>
                )}
              </div>

              {/* Progress Bar */}
              {isUploading && (
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
                  <div
                    className="h-full rounded-full bg-zinc-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Status Icon or Remove Button */}
            <div className="flex-shrink-0">
              {isUploading ? (
                <span className="text-xs text-zinc-500">{progress}%</span>
              ) : uploaded && !hasError ? (
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Upload complete"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <button
                  type="button"
                  onClick={() => onRemove(id)}
                  disabled={disabled}
                  className={`rounded p-1 transition-colors ${
                    disabled
                      ? 'cursor-not-allowed text-zinc-300'
                      : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600'
                  }`}
                  aria-label={`Remove ${file.name}`}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
