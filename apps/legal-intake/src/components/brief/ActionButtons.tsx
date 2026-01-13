'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

interface ActionButtonsProps {
  caseId: string
  status: string
  processingStatus: string
  clientName: string
  clientEmail: string
  reviewedAt?: string | null
}

export function ActionButtons({
  caseId,
  status,
  processingStatus,
  clientName,
  clientEmail,
  reviewedAt,
}: ActionButtonsProps) {
  const router = useRouter()
  const [showAcceptDialog, setShowAcceptDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [loading, setLoading] = useState<'accept' | 'reject' | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Only show action buttons for pending cases that are fully processed
  const canTakeAction = status === 'PENDING' && processingStatus === 'COMPLETE'

  const handleAccept = async () => {
    setLoading('accept')
    setError(null)

    try {
      const response = await fetch(`/api/dashboard/cases/${caseId}/accept`, {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to accept case')
      }

      // Success - redirect to inbox
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept case')
      setShowAcceptDialog(false)
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async () => {
    setLoading('reject')
    setError(null)

    try {
      const response = await fetch(`/api/dashboard/cases/${caseId}/reject`, {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to reject case')
      }

      // Success - redirect to inbox
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject case')
      setShowRejectDialog(false)
    } finally {
      setLoading(null)
    }
  }

  // If not pending, show status badge instead
  if (status !== 'PENDING') {
    const reviewedDate = reviewedAt
      ? new Date(reviewedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : null

    if (status === 'ACCEPTED') {
      return (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
          <CheckIcon className="w-5 h-5" />
          <span className="font-medium">
            Accepted{reviewedDate && ` on ${reviewedDate}`}
          </span>
        </div>
      )
    }

    if (status === 'REJECTED') {
      return (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg">
          <XIcon className="w-5 h-5" />
          <span className="font-medium">
            Rejected{reviewedDate && ` on ${reviewedDate}`}
          </span>
        </div>
      )
    }

    return null
  }

  // Case is still processing
  if (!canTakeAction) {
    return null
  }

  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowAcceptDialog(true)}
          disabled={loading !== null}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === 'accept' ? (
            <LoadingSpinner className="w-4 h-4" />
          ) : (
            <CheckIcon className="w-4 h-4" />
          )}
          Accept Case
        </button>

        <button
          onClick={() => setShowRejectDialog(true)}
          disabled={loading !== null}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === 'reject' ? (
            <LoadingSpinner className="w-4 h-4" />
          ) : (
            <XIcon className="w-4 h-4" />
          )}
          Reject Case
        </button>
      </div>

      {/* Accept Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showAcceptDialog}
        title="Accept Case"
        message={`Accept this case and schedule a consultation with ${clientName}?`}
        confirmText="Accept & Schedule"
        confirmColor="green"
        onConfirm={handleAccept}
        onCancel={() => setShowAcceptDialog(false)}
      />

      {/* Reject Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showRejectDialog}
        title="Reject Case"
        message={`Reject this case? An automated response will be sent to ${clientEmail}.`}
        confirmText="Reject & Send Response"
        confirmColor="red"
        onConfirm={handleReject}
        onCancel={() => setShowRejectDialog(false)}
      />
    </>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  )
}

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}
