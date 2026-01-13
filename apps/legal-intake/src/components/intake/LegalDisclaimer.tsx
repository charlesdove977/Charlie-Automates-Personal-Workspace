'use client'

import { useCallback, useId, type ChangeEvent } from 'react'

interface LegalDisclaimerProps {
  firmName: string
  accepted: boolean
  onAcceptedChange: (accepted: boolean) => void
  disabled?: boolean
}

export function LegalDisclaimer({
  firmName,
  accepted,
  onAcceptedChange,
  disabled = false,
}: LegalDisclaimerProps) {
  const checkboxId = useId()

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onAcceptedChange(e.target.checked)
    },
    [onAcceptedChange]
  )

  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium text-zinc-900">Legal Disclaimers</h3>

      {/* Scrollable Disclaimer Container */}
      <div className="max-h-48 overflow-y-auto rounded-lg border border-zinc-300 bg-zinc-100 p-4">
        <ul className="space-y-3 text-sm text-zinc-700">
          <li className="flex items-start">
            <span className="mr-2 mt-0.5 flex-shrink-0 text-zinc-400">1.</span>
            <span>
              <strong>No Attorney-Client Relationship:</strong> This intake form does not
              create an attorney-client relationship.
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 mt-0.5 flex-shrink-0 text-zinc-400">2.</span>
            <span>
              <strong>Review Purpose:</strong> The information you provide will be reviewed
              by {firmName} to determine if they can assist you.
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 mt-0.5 flex-shrink-0 text-zinc-400">3.</span>
            <span>
              <strong>No Guarantee:</strong> Submitting this form does not guarantee legal
              representation.
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 mt-0.5 flex-shrink-0 text-zinc-400">4.</span>
            <span>
              <strong>Sensitive Information:</strong> Do not include sensitive information
              you would not want shared with this law firm.
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 mt-0.5 flex-shrink-0 text-zinc-400">5.</span>
            <span>
              <strong>Consent:</strong> By submitting, you consent to {firmName} reviewing
              your information and documents.
            </span>
          </li>
        </ul>
      </div>

      {/* Required Acceptance Checkbox */}
      <div className="flex items-start">
        <div className="flex h-6 items-center">
          <input
            id={checkboxId}
            type="checkbox"
            checked={accepted}
            onChange={handleChange}
            disabled={disabled}
            className={`h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 ${
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            }`}
            aria-describedby={`${checkboxId}-description`}
          />
        </div>
        <label
          htmlFor={checkboxId}
          className={`ml-3 text-sm ${
            disabled ? 'cursor-not-allowed text-zinc-400' : 'cursor-pointer text-zinc-700'
          }`}
        >
          <span className="font-medium">
            I have read and understand the above disclaimers
          </span>{' '}
          <span className="text-red-500">*</span>
          <p
            id={`${checkboxId}-description`}
            className="mt-0.5 text-xs text-zinc-500"
          >
            You must accept the disclaimers to submit your intake form.
          </p>
        </label>
      </div>
    </div>
  )
}
