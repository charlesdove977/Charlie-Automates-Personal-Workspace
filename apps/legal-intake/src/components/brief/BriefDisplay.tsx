'use client'

import type { CaseBrief } from '@/types/case-brief'
import { PartiesSection } from './PartiesSection'
import { TimelineSection } from './TimelineSection'
import { KeyFactsSection } from './KeyFactsSection'
import { RedFlagsSection } from './RedFlagsSection'
import { UncertaintiesSection } from './UncertaintiesSection'

interface BriefDisplayProps {
  brief: CaseBrief
}

export function BriefDisplay({ brief }: BriefDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <section className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <SummaryIcon className="w-5 h-5 text-gray-500" />
          Summary
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {brief.summary || 'No summary available.'}
        </p>

        {/* Case type and jurisdiction */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
          {brief.caseType && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Case Type</span>
              <span className="font-medium text-gray-900">{brief.caseType.primary}</span>
              {brief.caseType.secondary && brief.caseType.secondary.length > 0 && (
                <span className="text-sm text-gray-600">
                  ({brief.caseType.secondary.join(', ')})
                </span>
              )}
            </div>
          )}
          {brief.jurisdiction && (brief.jurisdiction.state || brief.jurisdiction.county) && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Jurisdiction</span>
              <span className="font-medium text-gray-900">
                {[brief.jurisdiction.county, brief.jurisdiction.state]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Red Flags - most important, show first */}
      {brief.redFlags && brief.redFlags.length > 0 && (
        <RedFlagsSection flags={brief.redFlags} />
      )}

      {/* Uncertainties - important warnings */}
      {brief.uncertainties && brief.uncertainties.length > 0 && (
        <UncertaintiesSection uncertainties={brief.uncertainties} />
      )}

      {/* Parties */}
      <PartiesSection
        petitioner={brief.parties?.petitioner}
        respondent={brief.parties?.respondent}
        children={brief.parties?.children}
        otherParties={brief.parties?.otherParties}
      />

      {/* Key Facts */}
      {brief.keyFacts && brief.keyFacts.length > 0 && (
        <KeyFactsSection facts={brief.keyFacts} />
      )}

      {/* Timeline */}
      {brief.timeline && brief.timeline.length > 0 && (
        <TimelineSection events={brief.timeline} />
      )}

      {/* Analysis Metadata */}
      {brief.analysisMetadata && (
        <section className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Analysis Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Documents Analyzed</span>
              <p className="font-medium text-gray-900">
                {brief.analysisMetadata.documentCount}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Processing Time</span>
              <p className="font-medium text-gray-900">
                {formatProcessingTime(brief.analysisMetadata.processingTime)}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Model</span>
              <p className="font-medium text-gray-900">
                {brief.analysisMetadata.modelUsed}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Analyzed</span>
              <p className="font-medium text-gray-900">
                {formatDate(brief.analysisMetadata.timestamp)}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

function formatProcessingTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  const secs = Math.round(ms / 1000)
  if (secs < 60) return `${secs}s`
  const mins = Math.floor(secs / 60)
  const remainingSecs = secs % 60
  return `${mins}m ${remainingSecs}s`
}

function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return isoString
  }
}

function SummaryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
    </svg>
  )
}
