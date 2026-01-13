'use client'

import { ProcessingStatus } from '@prisma/client'

interface ProcessingBadgeProps {
  status: ProcessingStatus
  error?: string | null
}

const statusConfig: Record<ProcessingStatus, { color: string; label: string; showSpinner: boolean }> = {
  QUEUED: { color: 'bg-gray-100 text-gray-700', label: 'Queued', showSpinner: false },
  EXTRACTING: { color: 'bg-blue-100 text-blue-700', label: 'Extracting...', showSpinner: true },
  ANALYZING: { color: 'bg-blue-100 text-blue-700', label: 'Analyzing...', showSpinner: true },
  COMPLETE: { color: 'bg-green-100 text-green-700', label: 'Ready', showSpinner: false },
  FAILED: { color: 'bg-red-100 text-red-700', label: 'Failed', showSpinner: false },
}

export function ProcessingBadge({ status, error }: ProcessingBadgeProps) {
  const { color, label, showSpinner } = statusConfig[status]

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${color}`}
      title={status === 'FAILED' && error ? error : undefined}
    >
      {showSpinner && <Spinner />}
      {label}
      {status === 'FAILED' && error && (
        <ErrorIcon className="w-3 h-3 ml-0.5" />
      )}
    </span>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
    </svg>
  )
}
