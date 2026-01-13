'use client'

import { useState, useCallback, type FormEvent, type ChangeEvent } from 'react'

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
  onSubmit: (data: IntakeFormData) => void
  disabled?: boolean
}

const initialFormData: IntakeFormData = {
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  caseType: '',
  jurisdiction: '',
  briefDescription: '',
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function IntakeForm({ onSubmit, disabled = false }: IntakeFormProps) {
  const [formData, setFormData] = useState<IntakeFormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = useCallback((name: keyof IntakeFormData, value: string): string | undefined => {
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
  }, [])

  const validateForm = useCallback((): FormErrors => {
    const newErrors: FormErrors = {}
    const fieldsToValidate: (keyof IntakeFormData)[] = ['clientName', 'clientEmail', 'caseType', 'briefDescription']

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field])
      if (error) {
        newErrors[field as keyof FormErrors] = error
      }
    })

    return newErrors
  }, [formData, validateField])

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (touched[name]) {
      const error = validateField(name as keyof IntakeFormData, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }, [touched, validateField])

  const handleBlur = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))

    const error = validateField(name as keyof IntakeFormData, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [validateField])

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Mark all fields as touched
    setTouched({
      clientName: true,
      clientEmail: true,
      caseType: true,
      briefDescription: true,
    })

    const validationErrors = validateForm()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData)
    }
  }, [formData, validateForm, onSubmit])

  return (
    <form id="intake-form" onSubmit={handleSubmit} className="space-y-6" noValidate>
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
            value={formData.clientName}
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
            value={formData.clientEmail}
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
            value={formData.clientPhone}
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
            value={formData.caseType}
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
            value={formData.jurisdiction}
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
            value={formData.briefDescription}
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
              {formData.briefDescription.length}/1000 characters
            </p>
            {errors.briefDescription && touched.briefDescription && (
              <p id="briefDescription-error" className="text-sm text-red-600">
                {errors.briefDescription}
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}

export { CASE_TYPES }
