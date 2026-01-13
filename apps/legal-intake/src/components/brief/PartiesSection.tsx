'use client'

import { useState } from 'react'
import type { PartyInfo, ChildInfo } from '@/types/case-brief'
import { ConfidenceBadge } from './ConfidenceBadge'

interface PartiesSectionProps {
  petitioner?: PartyInfo
  respondent?: PartyInfo
  children?: ChildInfo[]
  otherParties?: PartyInfo[]
}

export function PartiesSection({
  petitioner,
  respondent,
  children,
  otherParties,
}: PartiesSectionProps) {
  // If no parties data, don't render
  if (!petitioner && !respondent && (!children || children.length === 0) && (!otherParties || otherParties.length === 0)) {
    return null
  }

  return (
    <section className="bg-white border border-gray-200 rounded-lg p-5">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <UsersIcon className="w-5 h-5 text-gray-500" />
        Parties
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {petitioner && (
          <PartyCard
            title="Petitioner"
            party={petitioner}
          />
        )}
        {respondent && (
          <PartyCard
            title="Respondent"
            party={respondent}
          />
        )}
      </div>

      {children && children.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Children</h3>
          <div className="space-y-2">
            {children.map((child, idx) => (
              <ChildCard key={idx} child={child} />
            ))}
          </div>
        </div>
      )}

      {otherParties && otherParties.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Other Parties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {otherParties.map((party, idx) => (
              <PartyCard key={idx} title={party.role} party={party} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function PartyCard({ title, party }: { title: string; party: PartyInfo }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {title}
        </span>
        <ConfidenceBadge level={party.confidence} />
      </div>
      <div className="mt-2">
        <span className="font-medium text-gray-900">
          {party.name || 'Unknown'}
        </span>
        <span className="text-sm text-gray-600 ml-2">
          ({party.role})
        </span>
      </div>
      {party.details && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-blue-600 hover:text-blue-700 mt-2"
          >
            {expanded ? 'Hide details' : 'Show details'}
          </button>
          {expanded && (
            <p className="text-sm text-gray-600 mt-2">
              {party.details}
            </p>
          )}
        </>
      )}
    </div>
  )
}

function ChildCard({ child }: { child: ChildInfo }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-900">
          {child.name || 'Unnamed child'}
        </span>
        {child.age !== undefined && (
          <span className="text-xs text-gray-500">
            Age {child.age}
          </span>
        )}
        {child.custody && (
          <span className="text-xs text-gray-600 bg-gray-200 px-1.5 py-0.5 rounded">
            {child.custody}
          </span>
        )}
      </div>
      <ConfidenceBadge level={child.confidence} />
    </div>
  )
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  )
}
