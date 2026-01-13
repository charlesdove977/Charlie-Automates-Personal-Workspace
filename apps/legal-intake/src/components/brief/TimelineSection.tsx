'use client'

import type { TimelineEvent } from '@/types/case-brief'
import { ConfidenceBadge } from './ConfidenceBadge'

interface TimelineSectionProps {
  events: TimelineEvent[]
}

export function TimelineSection({ events }: TimelineSectionProps) {
  if (!events || events.length === 0) {
    return null
  }

  // Sort events chronologically (earliest first)
  const sortedEvents = [...events].sort((a, b) => {
    if (!a.date && !b.date) return 0
    if (!a.date) return 1
    if (!b.date) return -1
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  return (
    <section className="bg-white border border-gray-200 rounded-lg p-5">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <ClockIcon className="w-5 h-5 text-gray-500" />
        Timeline
      </h2>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-4">
          {sortedEvents.map((event, idx) => (
            <div key={idx} className="relative pl-8">
              {/* Timeline dot */}
              <div className="absolute left-0 top-1.5 w-6 h-6 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {event.date && (
                      <div className="text-sm font-medium text-blue-600 mb-1">
                        {formatDate(event.date)}
                      </div>
                    )}
                    <p className="text-sm text-gray-900">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <DocumentIcon className="w-3.5 h-3.5" />
                      <span>{event.source}</span>
                    </div>
                  </div>
                  <ConfidenceBadge level={event.confidence} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      // If not a valid date, return as-is (might be a descriptive date like "mid-2023")
      return dateStr
    }
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
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
