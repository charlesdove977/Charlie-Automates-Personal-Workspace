'use client'

import Link from 'next/link'
import { ProcessingStatus, CaseStatus } from '@prisma/client'
import { ProcessingBadge } from './ProcessingBadge'

interface CaseCardProps {
  id: string
  clientName: string
  clientEmail: string
  caseType: string | null
  jurisdiction: string | null
  fitScore: number | null
  processingStatus: ProcessingStatus
  processingError: string | null
  submittedAt: string
  status: CaseStatus
}

export function CaseCard({
  id,
  clientName,
  clientEmail,
  caseType,
  jurisdiction,
  fitScore,
  processingStatus,
  processingError,
  submittedAt,
  status,
}: CaseCardProps) {
  return (
    <Link href={`/dashboard/cases/${id}`} className="block">
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all">
        <div className="flex items-start justify-between">
          {/* Left side: Client info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {clientName}
              </h3>
              <StatusBadge status={status} />
            </div>
            <p className="text-sm text-gray-500 truncate mt-0.5">
              {clientEmail}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
              {caseType && (
                <span className="inline-flex items-center gap-1">
                  <CaseIcon className="w-3.5 h-3.5" />
                  {caseType}
                </span>
              )}
              {jurisdiction && (
                <span className="inline-flex items-center gap-1">
                  <LocationIcon className="w-3.5 h-3.5" />
                  {jurisdiction}
                </span>
              )}
            </div>
          </div>

          {/* Right side: Score and time */}
          <div className="flex flex-col items-end gap-2 ml-4">
            {processingStatus === 'COMPLETE' && fitScore !== null ? (
              <FitScoreBadge score={fitScore} />
            ) : (
              <ProcessingBadge
                status={processingStatus}
                error={processingError}
              />
            )}
            <span className="text-xs text-gray-500">
              {formatRelativeTime(submittedAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function StatusBadge({ status }: { status: CaseStatus }) {
  const styles = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    ACCEPTED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  )
}

function FitScoreBadge({ score }: { score: number }) {
  let color = 'bg-red-100 text-red-800'
  if (score >= 70) {
    color = 'bg-green-100 text-green-800'
  } else if (score >= 50) {
    color = 'bg-yellow-100 text-yellow-800'
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${color}`}>
      {score}% Fit
    </span>
  )
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`

  return date.toLocaleDateString()
}

function CaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  )
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  )
}
