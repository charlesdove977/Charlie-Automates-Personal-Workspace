'use client'

import type { ConfidenceLevel } from '@/types/case-brief'

interface ConfidenceBadgeProps {
  level: ConfidenceLevel
  className?: string
}

const confidenceConfig: Record<ConfidenceLevel, { color: string; label: string }> = {
  high: { color: 'bg-green-100 text-green-700', label: 'High confidence' },
  medium: { color: 'bg-yellow-100 text-yellow-700', label: 'Medium confidence' },
  low: { color: 'bg-red-100 text-red-700', label: 'Low confidence' },
}

export function ConfidenceBadge({ level, className = '' }: ConfidenceBadgeProps) {
  const { color, label } = confidenceConfig[level]

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${color} ${className}`}
      title={label}
    >
      {level}
    </span>
  )
}
