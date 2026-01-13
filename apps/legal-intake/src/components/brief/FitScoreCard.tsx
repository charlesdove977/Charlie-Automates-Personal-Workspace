'use client'

interface FitScoreCardProps {
  score: number
}

export function FitScoreCard({ score }: FitScoreCardProps) {
  let bgColor = 'bg-red-100'
  let textColor = 'text-red-800'
  let borderColor = 'border-red-200'

  if (score >= 70) {
    bgColor = 'bg-green-100'
    textColor = 'text-green-800'
    borderColor = 'border-green-200'
  } else if (score >= 50) {
    bgColor = 'bg-yellow-100'
    textColor = 'text-yellow-800'
    borderColor = 'border-yellow-200'
  }

  return (
    <div
      className={`${bgColor} ${borderColor} border rounded-lg p-4 text-center min-w-[100px]`}
      title="Fit Score indicates how well this case matches your practice area criteria. Higher scores suggest better potential fit."
    >
      <div className={`text-3xl font-bold ${textColor}`}>{score}</div>
      <div className={`text-xs font-medium ${textColor} mt-1`}>Fit Score</div>
    </div>
  )
}
