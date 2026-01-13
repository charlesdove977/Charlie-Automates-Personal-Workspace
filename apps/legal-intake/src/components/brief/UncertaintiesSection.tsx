'use client'

import type { Uncertainty } from '@/types/case-brief'

interface UncertaintiesSectionProps {
  uncertainties: Uncertainty[]
}

export function UncertaintiesSection({ uncertainties }: UncertaintiesSectionProps) {
  if (!uncertainties || uncertainties.length === 0) {
    return null
  }

  // Sort with needsHumanReview first
  const sortedUncertainties = [...uncertainties].sort((a, b) => {
    if (a.needsHumanReview && !b.needsHumanReview) return -1
    if (!a.needsHumanReview && b.needsHumanReview) return 1
    return 0
  })

  const reviewNeededCount = uncertainties.filter((u) => u.needsHumanReview).length

  return (
    <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
      <h2 className="text-lg font-semibold text-yellow-800 mb-1 flex items-center gap-2">
        <QuestionIcon className="w-5 h-5 text-yellow-600" />
        Areas of Uncertainty
        <span className="text-sm font-normal text-yellow-600">({uncertainties.length})</span>
      </h2>
      {reviewNeededCount > 0 && (
        <p className="text-xs text-yellow-700 mb-4">
          {reviewNeededCount} item{reviewNeededCount !== 1 ? 's' : ''} flagged for human review
        </p>
      )}

      <div className="space-y-3">
        {sortedUncertainties.map((uncertainty, idx) => (
          <UncertaintyItem key={idx} uncertainty={uncertainty} />
        ))}
      </div>
    </section>
  )
}

function UncertaintyItem({ uncertainty }: { uncertainty: Uncertainty }) {
  return (
    <div className={`rounded-lg p-4 ${
      uncertainty.needsHumanReview
        ? 'bg-yellow-100 border border-yellow-300'
        : 'bg-white border border-yellow-200'
    }`}>
      <div className="flex items-start gap-3">
        {uncertainty.needsHumanReview ? (
          <EyeIcon className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
        ) : (
          <InfoIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900">
              {uncertainty.area}
            </span>
            {uncertainty.needsHumanReview && (
              <span className="px-2 py-0.5 text-xs font-medium rounded bg-yellow-200 text-yellow-800">
                Needs review
              </span>
            )}
          </div>
          <p className="text-sm text-gray-700">
            {uncertainty.reason}
          </p>
        </div>
      </div>
    </div>
  )
}

function QuestionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
    </svg>
  )
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  )
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
  )
}
