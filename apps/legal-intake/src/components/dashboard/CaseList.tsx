'use client'

import { useState, useEffect, useCallback } from 'react'
import { CaseCard } from './CaseCard'
import { ProcessingStatus, CaseStatus } from '@prisma/client'

interface Case {
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

interface CasesResponse {
  cases: Case[]
  total: number
  limit: number
  offset: number
}

type FilterStatus = 'all' | 'PENDING' | 'ACCEPTED' | 'REJECTED'

const filterTabs: { label: string; value: FilterStatus }[] = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Accepted', value: 'ACCEPTED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'All', value: 'all' },
]

export function CaseList() {
  const [cases, setCases] = useState<Case[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterStatus>('PENDING')

  const fetchCases = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') {
        params.set('status', filter)
      }
      params.set('limit', '50')

      const response = await fetch(`/api/dashboard/cases?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch cases')
      }

      const data: CasesResponse = await response.json()
      setCases(data.cases)
      setTotal(data.total)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    setLoading(true)
    fetchCases()
  }, [fetchCases])

  // Auto-refresh if any cases are still processing
  useEffect(() => {
    const hasProcessingCases = cases.some(
      (c) => c.processingStatus !== 'COMPLETE' && c.processingStatus !== 'FAILED'
    )

    if (!hasProcessingCases) return

    const interval = setInterval(fetchCases, 5000)
    return () => clearInterval(interval)
  }, [cases, fetchCases])

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === tab.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
                <div className="h-6 bg-gray-200 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && cases.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <EmptyIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No cases found</p>
          <p className="text-sm text-gray-500 mt-1">
            {filter !== 'all'
              ? `No ${filter.toLowerCase()} cases at this time`
              : 'Cases will appear here when clients submit them'}
          </p>
        </div>
      )}

      {/* Case list */}
      {!loading && !error && cases.length > 0 && (
        <div className="space-y-3">
          {cases.map((caseItem) => (
            <CaseCard
              key={caseItem.id}
              id={caseItem.id}
              clientName={caseItem.clientName}
              clientEmail={caseItem.clientEmail}
              caseType={caseItem.caseType}
              jurisdiction={caseItem.jurisdiction}
              fitScore={caseItem.fitScore}
              processingStatus={caseItem.processingStatus}
              processingError={caseItem.processingError}
              submittedAt={caseItem.submittedAt}
              status={caseItem.status}
            />
          ))}
          {total > cases.length && (
            <p className="text-sm text-gray-500 text-center py-2">
              Showing {cases.length} of {total} cases
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function EmptyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
    </svg>
  )
}
