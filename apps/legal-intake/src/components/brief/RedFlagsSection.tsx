'use client'

import type { RedFlag } from '@/types/case-brief'

interface RedFlagsSectionProps {
  flags: RedFlag[]
}

const severityConfig: Record<string, { label: string; bg: string; border: string; icon: string }> = {
  high: {
    label: 'High',
    bg: 'bg-red-50',
    border: 'border-red-300',
    icon: 'text-red-600',
  },
  medium: {
    label: 'Medium',
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    icon: 'text-orange-600',
  },
  low: {
    label: 'Low',
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    icon: 'text-yellow-600',
  },
}

export function RedFlagsSection({ flags }: RedFlagsSectionProps) {
  if (!flags || flags.length === 0) {
    return null
  }

  // Sort by severity (high first)
  const sortedFlags = [...flags].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return order[a.severity] - order[b.severity]
  })

  const highCount = flags.filter((f) => f.severity === 'high').length
  const mediumCount = flags.filter((f) => f.severity === 'medium').length

  return (
    <section className="bg-red-50 border-2 border-red-200 rounded-lg p-5">
      <h2 className="text-lg font-semibold text-red-800 mb-1 flex items-center gap-2">
        <AlertIcon className="w-5 h-5 text-red-600" />
        Red Flags
        <span className="text-sm font-normal text-red-600">({flags.length})</span>
      </h2>
      <p className="text-xs text-red-600 mb-4">
        {highCount > 0 && `${highCount} high severity`}
        {highCount > 0 && mediumCount > 0 && ', '}
        {mediumCount > 0 && `${mediumCount} medium severity`}
      </p>

      <div className="space-y-3">
        {sortedFlags.map((flag, idx) => (
          <RedFlagItem key={idx} flag={flag} />
        ))}
      </div>
    </section>
  )
}

function RedFlagItem({ flag }: { flag: RedFlag }) {
  const config = severityConfig[flag.severity] || severityConfig.low

  return (
    <div className={`${config.bg} border ${config.border} rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <WarningIcon className={`w-5 h-5 ${config.icon} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900">
              {flag.issue}
            </span>
            <span className={`px-2 py-0.5 text-xs font-medium rounded ${
              flag.severity === 'high'
                ? 'bg-red-200 text-red-800'
                : flag.severity === 'medium'
                  ? 'bg-orange-200 text-orange-800'
                  : 'bg-yellow-200 text-yellow-800'
            }`}>
              {config.label} severity
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-2">
            {flag.details}
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <DocumentIcon className="w-3 h-3" />
            <span>Source: {flag.source}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  )
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
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
