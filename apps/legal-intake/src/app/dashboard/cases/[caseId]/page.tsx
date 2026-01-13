'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ProcessingStatus } from '@prisma/client'
import type { CaseBrief } from '@/types/case-brief'
import { ProcessingBadge } from '@/components/dashboard/ProcessingBadge'
import { BriefDisplay } from '@/components/brief/BriefDisplay'
import { FitScoreCard } from '@/components/brief/FitScoreCard'

interface CaseDetail {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string | null
  caseType: string | null
  jurisdiction: string | null
  status: string
  fitScore: number | null
  processingStatus: ProcessingStatus
  processingError: string | null
  submittedAt: string
  processedAt: string | null
  brief: CaseBrief | null
  documents: {
    id: string
    filename: string
    mimeType: string
    sizeBytes: number
  }[]
}

export default function CaseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const caseId = params.caseId as string

  const [caseData, setCaseData] = useState<CaseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCase() {
      try {
        const response = await fetch(`/api/dashboard/cases/${caseId}`)

        if (!response.ok) {
          if (response.status === 404) {
            setError('Case not found')
          } else if (response.status === 401) {
            router.push('/dashboard/login')
            return
          } else {
            setError('Failed to load case')
          }
          setLoading(false)
          return
        }

        const data = await response.json()
        setCaseData(data)
        setLoading(false)
      } catch {
        setError('Failed to load case')
        setLoading(false)
      }
    }

    fetchCase()
  }, [caseId, router])

  // Auto-refresh while processing
  useEffect(() => {
    if (!caseData) return
    if (caseData.processingStatus === 'COMPLETE' || caseData.processingStatus === 'FAILED') {
      return
    }

    // Refresh every 5 seconds while processing
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/dashboard/cases/${caseId}`)
        if (response.ok) {
          const data = await response.json()
          setCaseData(data)
        }
      } catch {
        // Ignore refresh errors
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [caseId, caseData?.processingStatus])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-8" />
        <div className="h-64 bg-gray-200 rounded" />
      </div>
    )
  }

  if (error || !caseData) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-medium mb-2">
          {error || 'Case not found'}
        </div>
        <p className="text-gray-500 mb-4">
          The case you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <BackArrow className="w-4 h-4" />
          Back to inbox
        </Link>
      </div>
    )
  }

  const submittedDate = new Date(caseData.submittedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <div>
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <BackArrow className="w-4 h-4" />
        Back to inbox
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {caseData.clientName}
          </h1>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
            <span>{caseData.clientEmail}</span>
            {caseData.clientPhone && <span>{caseData.clientPhone}</span>}
          </div>
          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
            {caseData.caseType && (
              <span className="inline-flex items-center gap-1">
                <CaseIcon className="w-4 h-4" />
                {caseData.caseType}
              </span>
            )}
            {caseData.jurisdiction && (
              <span className="inline-flex items-center gap-1">
                <LocationIcon className="w-4 h-4" />
                {caseData.jurisdiction}
              </span>
            )}
            <span>Submitted {submittedDate}</span>
          </div>
        </div>

        {/* Fit score or processing status */}
        <div className="flex-shrink-0">
          {caseData.processingStatus === 'COMPLETE' && caseData.fitScore !== null ? (
            <FitScoreCard score={caseData.fitScore} />
          ) : (
            <div className="text-right">
              <ProcessingBadge
                status={caseData.processingStatus}
                error={caseData.processingError}
              />
            </div>
          )}
        </div>
      </div>

      {/* Content based on processing status */}
      {caseData.processingStatus === 'FAILED' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <ErrorIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">Analysis Failed</h3>
              <p className="text-red-700 mt-1">
                {caseData.processingError || 'An error occurred during document analysis.'}
              </p>
              <p className="text-red-600 text-sm mt-2">
                Please review the documents manually or try reprocessing.
              </p>
            </div>
          </div>
        </div>
      )}

      {caseData.processingStatus !== 'COMPLETE' && caseData.processingStatus !== 'FAILED' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
            <div>
              <h3 className="font-medium text-blue-800">Analysis in Progress</h3>
              <p className="text-blue-700 text-sm mt-0.5">
                Documents are being processed. This page will update automatically.
              </p>
            </div>
          </div>
        </div>
      )}

      {caseData.processingStatus === 'COMPLETE' && caseData.brief && (
        <BriefDisplay brief={caseData.brief} />
      )}

      {/* Documents list */}
      {caseData.documents.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents</h2>
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
            {caseData.documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <DocumentIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-900">{doc.filename}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatFileSize(doc.sizeBytes)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function BackArrow({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  )
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

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  )
}

function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  )
}
