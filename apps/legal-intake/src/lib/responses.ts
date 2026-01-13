/**
 * Response generation utilities for case actions
 */

interface RejectionResponseParams {
  clientName: string
  firmName: string
  caseType: string | null
}

/**
 * Generate a professional, empathetic rejection response
 * Uses a template-based approach (no AI call needed for MVP)
 */
export function generateRejectionResponse({
  clientName,
  firmName,
  caseType,
}: RejectionResponseParams): string {
  const matterDescription = caseType
    ? `your ${caseType.toLowerCase()} matter`
    : 'your legal matter'

  return `Dear ${clientName},

Thank you for contacting ${firmName} regarding ${matterDescription}.

After reviewing your submission, we have determined that we are unable to take on your case at this time. This decision is based on our current capacity and case selection criteria, and is not a reflection of the merits of your situation.

We recommend consulting with other qualified attorneys in your area who may be better positioned to assist you.

We wish you the best in resolving your legal matter.

Sincerely,
${firmName}`
}
