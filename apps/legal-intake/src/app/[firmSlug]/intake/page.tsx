'use client'

import { useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { IntakeForm, type IntakeFormData } from '@/components/intake/IntakeForm'
import { FileDropzone, type SelectedFile } from '@/components/intake/FileDropzone'
import { FileList, type FileWithProgress } from '@/components/intake/FileList'
import { LegalDisclaimer } from '@/components/intake/LegalDisclaimer'

type Step = 'contact' | 'case' | 'documents' | 'review'

const STEPS: { id: Step; label: string; number: number }[] = [
  { id: 'contact', label: 'Contact Info', number: 1 },
  { id: 'case', label: 'Case Details', number: 2 },
  { id: 'documents', label: 'Documents', number: 3 },
  { id: 'review', label: 'Review & Submit', number: 4 },
]

export default function IntakePage() {
  const params = useParams()
  const firmSlug = params.firmSlug as string
  const [currentStep, setCurrentStep] = useState<Step>('contact')
  const [formData, setFormData] = useState<IntakeFormData | null>(null)
  const [files, setFiles] = useState<FileWithProgress[]>([])
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleFormSubmit = useCallback((data: IntakeFormData) => {
    setFormData(data)
    setCurrentStep('documents')
  }, [])

  const handleFilesSelected = useCallback((newFiles: SelectedFile[]) => {
    setFiles(prev => [...prev, ...newFiles.map(f => ({ ...f, progress: undefined, uploaded: false }))])
  }, [])

  const handleFileRemove = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }, [])

  const handleDisclaimerChange = useCallback((accepted: boolean) => {
    setDisclaimerAccepted(accepted)
  }, [])

  const handleFinalSubmit = useCallback(async () => {
    if (!formData || !disclaimerAccepted) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Build FormData for multipart submission
      const submitData = new FormData()
      submitData.append('firmSlug', firmSlug)
      submitData.append('clientName', formData.clientName)
      submitData.append('clientEmail', formData.clientEmail)
      submitData.append('clientPhone', formData.clientPhone)
      submitData.append('caseType', formData.caseType)
      submitData.append('jurisdiction', formData.jurisdiction)
      submitData.append('briefDescription', formData.briefDescription)

      // Append files
      for (const file of files) {
        submitData.append('files', file.file)
      }

      const response = await fetch('/api/cases/submit', {
        method: 'POST',
        body: submitData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Submission failed')
      }

      setIsSubmitted(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred while submitting your intake form.'
      setSubmitError(message)
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, disclaimerAccepted, firmSlug, files])

  const goToStep = useCallback((step: Step) => {
    setCurrentStep(step)
  }, [])

  const goBack = useCallback(() => {
    switch (currentStep) {
      case 'case':
        setCurrentStep('contact')
        break
      case 'documents':
        setCurrentStep('case')
        break
      case 'review':
        setCurrentStep('documents')
        break
    }
  }, [currentStep])

  const goNext = useCallback(() => {
    switch (currentStep) {
      case 'contact':
        setCurrentStep('case')
        break
      case 'case':
        setCurrentStep('documents')
        break
      case 'documents':
        setCurrentStep('review')
        break
    }
  }, [currentStep])

  // Get current step index for progress display
  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep)

  if (isSubmitted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-zinc-900 sm:text-3xl">
            Intake Form Submitted
          </h1>
          <p className="mt-4 text-zinc-600 leading-relaxed">
            Thank you for submitting your information. Our legal team will review your
            case details and documents, and will contact you within 1-2 business days.
          </p>
          <p className="mt-4 text-sm text-zinc-500">
            A confirmation email has been sent to {formData?.clientEmail}.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Progress Indicator */}
        <nav aria-label="Progress" className="mb-8">
          <ol className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const isActive = step.id === currentStep
              const isCompleted = index < currentStepIndex

              return (
                <li key={step.id} className="relative flex flex-1 flex-col items-center">
                  {/* Connector Line */}
                  {index < STEPS.length - 1 && (
                    <div
                      className={`absolute left-1/2 top-4 h-0.5 w-full ${
                        isCompleted ? 'bg-zinc-600' : 'bg-zinc-200'
                      }`}
                      aria-hidden="true"
                    />
                  )}

                  {/* Step Circle */}
                  <div className="relative z-10 flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => isCompleted && goToStep(step.id)}
                      disabled={!isCompleted && !isActive}
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-zinc-900 text-white'
                          : isCompleted
                            ? 'cursor-pointer bg-zinc-600 text-white hover:bg-zinc-700'
                            : 'cursor-not-allowed bg-zinc-200 text-zinc-500'
                      }`}
                      aria-current={isActive ? 'step' : undefined}
                    >
                      {isCompleted ? (
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        step.number
                      )}
                    </button>
                    <span
                      className={`mt-2 text-xs font-medium ${
                        isActive ? 'text-zinc-900' : isCompleted ? 'text-zinc-600' : 'text-zinc-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                </li>
              )
            })}
          </ol>
        </nav>

        {/* Form Content */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Step 1 & 2: Contact Info and Case Details (combined in IntakeForm) */}
          {(currentStep === 'contact' || currentStep === 'case') && (
            <div>
              <h2 className="mb-6 text-xl font-semibold text-zinc-900">
                {currentStep === 'contact' ? 'Contact Information' : 'Case Details'}
              </h2>
              <IntakeForm
                onSubmit={handleFormSubmit}
                disabled={isSubmitting}
              />

              {/* Navigation for Contact step */}
              {currentStep === 'contact' && (
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('case')}
                    className="inline-flex items-center justify-center rounded-md px-6 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ backgroundColor: 'var(--firm-primary, #1a365d)' }}
                  >
                    Continue
                  </button>
                </div>
              )}

              {/* Navigation for Case step */}
              {currentStep === 'case' && (
                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-6 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    form="intake-form"
                    className="inline-flex items-center justify-center rounded-md px-6 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ backgroundColor: 'var(--firm-primary, #1a365d)' }}
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Documents */}
          {currentStep === 'documents' && (
            <div>
              <h2 className="mb-2 text-xl font-semibold text-zinc-900">
                Upload Documents
              </h2>
              <p className="mb-6 text-sm text-zinc-600">
                Upload any relevant documents such as court orders, financial statements,
                or other legal documents related to your case. This step is optional.
              </p>

              <FileDropzone
                onFilesSelected={handleFilesSelected}
                disabled={isSubmitting}
              />

              {files.length > 0 && (
                <FileList
                  files={files}
                  onRemove={handleFileRemove}
                  disabled={isSubmitting}
                />
              )}

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-6 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center justify-center rounded-md px-6 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ backgroundColor: 'var(--firm-primary, #1a365d)' }}
                >
                  Continue to Review
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 'review' && formData && (
            <div>
              <h2 className="mb-6 text-xl font-semibold text-zinc-900">
                Review & Submit
              </h2>

              {/* Review Summary */}
              <div className="space-y-6">
                {/* Contact Info Summary */}
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-zinc-900">Contact Information</h3>
                    <button
                      type="button"
                      onClick={() => goToStep('contact')}
                      className="text-sm text-zinc-600 underline hover:text-zinc-900"
                    >
                      Edit
                    </button>
                  </div>
                  <dl className="mt-3 space-y-1 text-sm">
                    <div className="flex">
                      <dt className="w-24 flex-shrink-0 text-zinc-500">Name:</dt>
                      <dd className="text-zinc-900">{formData.clientName}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-24 flex-shrink-0 text-zinc-500">Email:</dt>
                      <dd className="text-zinc-900">{formData.clientEmail}</dd>
                    </div>
                    {formData.clientPhone && (
                      <div className="flex">
                        <dt className="w-24 flex-shrink-0 text-zinc-500">Phone:</dt>
                        <dd className="text-zinc-900">{formData.clientPhone}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Case Details Summary */}
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-zinc-900">Case Details</h3>
                    <button
                      type="button"
                      onClick={() => goToStep('case')}
                      className="text-sm text-zinc-600 underline hover:text-zinc-900"
                    >
                      Edit
                    </button>
                  </div>
                  <dl className="mt-3 space-y-1 text-sm">
                    <div className="flex">
                      <dt className="w-24 flex-shrink-0 text-zinc-500">Type:</dt>
                      <dd className="text-zinc-900">{formData.caseType}</dd>
                    </div>
                    {formData.jurisdiction && (
                      <div className="flex">
                        <dt className="w-24 flex-shrink-0 text-zinc-500">Location:</dt>
                        <dd className="text-zinc-900">{formData.jurisdiction}</dd>
                      </div>
                    )}
                    {formData.briefDescription && (
                      <div className="flex">
                        <dt className="w-24 flex-shrink-0 text-zinc-500">Details:</dt>
                        <dd className="text-zinc-900">{formData.briefDescription}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Documents Summary */}
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-zinc-900">Documents</h3>
                    <button
                      type="button"
                      onClick={() => goToStep('documents')}
                      className="text-sm text-zinc-600 underline hover:text-zinc-900"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-zinc-600">
                    {files.length === 0
                      ? 'No documents uploaded'
                      : `${files.length} document${files.length === 1 ? '' : 's'} ready to upload`}
                  </p>
                </div>

                {/* Legal Disclaimer */}
                <LegalDisclaimer
                  firmName="this law firm"
                  accepted={disclaimerAccepted}
                  onAcceptedChange={handleDisclaimerChange}
                  disabled={isSubmitting}
                />

                {/* Error Message */}
                {submitError && (
                  <div className="rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-700">{submitError}</p>
                  </div>
                )}

                {/* Submit */}
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-6 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={!disclaimerAccepted || isSubmitting}
                    className="inline-flex items-center justify-center rounded-md px-8 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ backgroundColor: 'var(--firm-primary, #1a365d)' }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="mr-2 h-4 w-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit Intake Form'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Privacy Note */}
        <p className="mt-6 text-center text-xs text-zinc-400">
          Your information is encrypted and transmitted securely.
        </p>
      </div>
    </main>
  )
}
