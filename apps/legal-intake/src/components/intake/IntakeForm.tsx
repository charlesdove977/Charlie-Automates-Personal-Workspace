'use client'

import { useCallback, type ChangeEvent } from 'react'

const CASE_TYPES = [
  'Divorce',
  'Child Custody',
  'Child Support',
  'Spousal Support/Alimony',
  'Property Division',
  'Modification of Existing Order',
  'Other Family Law Matter',
] as const

export interface IntakeFormData {
  clientName: string
  clientEmail: string
  clientPhone: string
  caseType: string
  jurisdiction: string
  briefDescription: string
}

interface FormErrors {
  clientName?: string
  clientEmail?: string
  caseType?: string
  briefDescription?: string
}

interface IntakeFormProps {
  data: IntakeFormData
  onChange: (data: IntakeFormData) => void
  errors: FormErrors
  touched: Record<string, boolean>
  onBlur: (field: string) => void
  disabled?: boolean
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateField(name: keyof IntakeFormData, value: string): string | undefined {
  switch (name) {
    case 'clientName':
      if (!value.trim()) return 'Full name is required'
      if (value.trim().length < 2) return 'Name must be at least 2 characters'
      return undefined
    case 'clientEmail':
      if (!value.trim()) return 'Email address is required'
      if (!validateEmail(value)) return 'Please enter a valid email address'
      return undefined
    case 'caseType':
      if (!value) return 'Please select a case type'
      return undefined
    case 'briefDescription':
      if (value.length > 1000) return 'Description must be 1000 characters or less'
      return undefined
    default:
      return undefined
  }
}

export function validateForm(data: IntakeFormData): FormErrors {
  const errors: FormErrors = {}
  const fieldsToValidate: (keyof IntakeFormData)[] = ['clientName', 'clientEmail', 'caseType', 'briefDescription']

  fieldsToValidate.forEach((field) => {
    const error = validateField(field, data[field])
    if (error) {
      errors[field as keyof FormErrors] = error
    }
  })

  return errors
}

export function IntakeForm({ data, onChange, errors, touched, onBlur, disabled = false }: IntakeFormProps) {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    onChange({ ...data, [name]: value })
  }, [data, onChange])

  const handleBlur = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    onBlur(e.target.name)
  }, [onBlur])

  return (
    <div className="space-y-6">
      {/* Contact Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-zinc-900">Contact Information</h3>

        {/* Full Name */}
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-zinc-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={data.clientName}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            className={`mt-1 block w-full rounded-md border px-3 py-2 text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm ${
              errors.clientName && touched.clientName
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500'
            } ${disabled ? 'cursor-not-allowed bg-zinc-100' : 'bg-white'}`}
            placeholder="Enter your full legal name"
            aria-describedby={errors.clientName && touched.clientName ? 'clientName-error' : undefined}
            aria-invalid={errors.clientName && touched.clientName ? 'true' : 'false'}
          />
          {errors.clientName && touched.clientName && (
            <p id="clientName-error" className="mt-1 text-sm text-red-600">
              {errors.clientName}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label htmlFor="clientEmail" className="block text-sm font-medium text-zinc-700">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="clientEmail"
            name="clientEmail"
            value={data.clientEmail}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            className={`mt-1 block w-full rounded-md border px-3 py-2 text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm ${
              errors.clientEmail && touched.clientEmail
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500'
            } ${disabled ? 'cursor-not-allowed bg-zinc-100' : 'bg-white'}`}
            placeholder="you@example.com"
            aria-describedby={errors.clientEmail && touched.clientEmail ? 'clientEmail-error' : undefined}
            aria-invalid={errors.clientEmail && touched.clientEmail ? 'true' : 'false'}
          />
          {errors.clientEmail && touched.clientEmail && (
            <p id="clientEmail-error" className="mt-1 text-sm text-red-600">
              {errors.clientEmail}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="clientPhone" className="block text-sm font-medium text-zinc-700">
            Phone Number <span className="text-zinc-400">(optional)</span>
          </label>
          <input
            type="tel"
            id="clientPhone"
            name="clientPhone"
            value={data.clientPhone}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            className={`mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-0 sm:text-sm ${
              disabled ? 'cursor-not-allowed bg-zinc-100' : 'bg-white'
            }`}
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      {/* Case Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-zinc-900">Case Details</h3>

        {/* Case Type */}
        <div>
          <label htmlFor="caseType" className="block text-sm font-medium text-zinc-700">
            Type of Case <span className="text-red-500">*</span>
          </label>
          <select
            id="caseType"
            name="caseType"
            value={data.caseType}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            className={`mt-1 block w-full rounded-md border px-3 py-2 text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm ${
              errors.caseType && touched.caseType
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500'
            } ${disabled ? 'cursor-not-allowed bg-zinc-100' : 'bg-white'}`}
            aria-describedby={errors.caseType && touched.caseType ? 'caseType-error' : undefined}
            aria-invalid={errors.caseType && touched.caseType ? 'true' : 'false'}
          >
            <option value="">Select a case type</option>
            {CASE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.caseType && touched.caseType && (
            <p id="caseType-error" className="mt-1 text-sm text-red-600">
              {errors.caseType}
            </p>
          )}
        </div>

        {/* Jurisdiction */}
        <div>
          <label htmlFor="jurisdiction" className="block text-sm font-medium text-zinc-700">
            State/County <span className="text-zinc-400">(optional)</span>
          </label>
          <input
            type="text"
            id="jurisdiction"
            name="jurisdiction"
            value={data.jurisdiction}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            className={`mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-0 sm:text-sm ${
              disabled ? 'cursor-not-allowed bg-zinc-100' : 'bg-white'
            }`}
            placeholder="e.g., California, Los Angeles County"
          />
        </div>

        {/* Brief Description */}
        <div>
          <label htmlFor="briefDescription" className="block text-sm font-medium text-zinc-700">
            Brief Description of Your Case <span className="text-zinc-400">(optional)</span>
          </label>
          <textarea
            id="briefDescription"
            name="briefDescription"
            rows={4}
            value={data.briefDescription}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            maxLength={1000}
            className={`mt-1 block w-full rounded-md border px-3 py-2 text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm ${
              errors.briefDescription && touched.briefDescription
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500'
            } ${disabled ? 'cursor-not-allowed bg-zinc-100' : 'bg-white'}`}
            placeholder="Please provide a brief summary of your situation..."
            aria-describedby={errors.briefDescription && touched.briefDescription ? 'briefDescription-error' : 'briefDescription-hint'}
            aria-invalid={errors.briefDescription && touched.briefDescription ? 'true' : 'false'}
          />
          <div className="mt-1 flex items-center justify-between">
            <p id="briefDescription-hint" className="text-xs text-zinc-400">
              {data.briefDescription.length}/1000 characters
            </p>
            {errors.briefDescription && touched.briefDescription && (
              <p id="briefDescription-error" className="text-sm text-red-600">
                {errors.briefDescription}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export { CASE_TYPES }
