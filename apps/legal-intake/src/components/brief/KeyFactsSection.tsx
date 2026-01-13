'use client'

import { useState } from 'react'
import type { KeyFact } from '@/types/case-brief'
import { ConfidenceBadge } from './ConfidenceBadge'

interface KeyFactsSectionProps {
  facts: KeyFact[]
}

const categoryConfig: Record<string, { label: string; color: string }> = {
  financial: { label: 'Financial', color: 'bg-emerald-100 text-emerald-700' },
  custody: { label: 'Custody', color: 'bg-purple-100 text-purple-700' },
  property: { label: 'Property', color: 'bg-blue-100 text-blue-700' },
  domestic: { label: 'Domestic', color: 'bg-rose-100 text-rose-700' },
  procedural: { label: 'Procedural', color: 'bg-gray-100 text-gray-700' },
  other: { label: 'Other', color: 'bg-slate-100 text-slate-700' },
}

const importanceConfig: Record<string, { label: string; style: string }> = {
  high: { label: 'High', style: 'bg-red-50 border-l-red-500' },
  medium: { label: 'Medium', style: 'bg-yellow-50 border-l-yellow-500' },
  low: { label: 'Low', style: 'bg-gray-50 border-l-gray-300' },
}

export function KeyFactsSection({ facts }: KeyFactsSectionProps) {
  if (!facts || facts.length === 0) {
    return null
  }

  // Group facts by category
  const grouped = facts.reduce((acc, fact) => {
    const cat = fact.category || 'other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(fact)
    return acc
  }, {} as Record<string, KeyFact[]>)

  // Sort categories by importance (most important facts first)
  const sortedCategories = Object.entries(grouped).sort(([, a], [, b]) => {
    const aHigh = a.filter((f) => f.importance === 'high').length
    const bHigh = b.filter((f) => f.importance === 'high').length
    return bHigh - aHigh
  })

  return (
    <section className="bg-white border border-gray-200 rounded-lg p-5">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <ListIcon className="w-5 h-5 text-gray-500" />
        Key Facts
        <span className="text-sm font-normal text-gray-500">({facts.length})</span>
      </h2>

      <div className="space-y-4">
        {sortedCategories.map(([category, categoryFacts]) => (
          <CategoryGroup
            key={category}
            category={category}
            facts={categoryFacts}
          />
        ))}
      </div>
    </section>
  )
}

function CategoryGroup({
  category,
  facts,
}: {
  category: string
  facts: KeyFact[]
}) {
  const [expanded, setExpanded] = useState(true)
  const config = categoryConfig[category] || categoryConfig.other

  // Sort by importance (high first)
  const sortedFacts = [...facts].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return order[a.importance] - order[b.importance]
  })

  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 text-xs font-medium rounded ${config.color}`}>
            {config.label}
          </span>
          <span className="text-sm text-gray-600">
            {facts.length} fact{facts.length !== 1 ? 's' : ''}
          </span>
        </div>
        <ChevronIcon className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="divide-y divide-gray-100">
          {sortedFacts.map((fact, idx) => (
            <FactItem key={idx} fact={fact} />
          ))}
        </div>
      )}
    </div>
  )
}

function FactItem({ fact }: { fact: KeyFact }) {
  const impConfig = importanceConfig[fact.importance] || importanceConfig.low

  return (
    <div className={`border-l-4 ${impConfig.style} px-4 py-3`}>
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-gray-900 flex-1">
          {fact.fact}
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-500">
            {impConfig.label}
          </span>
          <ConfidenceBadge level={fact.confidence} />
        </div>
      </div>
      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
        <DocumentIcon className="w-3 h-3" />
        <span>{fact.source}</span>
      </div>
    </div>
  )
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
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
