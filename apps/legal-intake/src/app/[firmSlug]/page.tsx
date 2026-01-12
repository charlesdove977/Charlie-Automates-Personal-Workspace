import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'

interface FirmPageProps {
  params: Promise<{ firmSlug: string }>
}

export default async function FirmPage({ params }: FirmPageProps) {
  const { firmSlug } = await params

  const firm = await db.firm.findUnique({
    where: { slug: firmSlug },
  })

  if (!firm) {
    notFound()
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center">
        {/* Firm Logo */}
        {firm.logo && (
          <div className="mb-8 flex justify-center">
            <Image
              src={firm.logo}
              alt={`${firm.name} logo`}
              width={180}
              height={60}
              className="h-auto max-h-16 w-auto"
              priority
            />
          </div>
        )}

        {/* Firm Name */}
        <h1 className="text-3xl font-semibold text-zinc-900 sm:text-4xl">
          {firm.name}
        </h1>

        {/* Divider */}
        <div
          className="mx-auto mt-6 h-1 w-16 rounded"
          style={{ backgroundColor: firm.primaryColor }}
        />

        {/* Main Heading */}
        <h2 className="mt-8 text-xl font-medium text-zinc-700 sm:text-2xl">
          Begin Your Case Intake
        </h2>

        {/* Introduction Text */}
        <p className="mt-4 text-zinc-600 leading-relaxed">
          Thank you for considering {firm.name} for your legal needs.
          Our secure intake process allows you to submit your case details
          and supporting documents for review by our legal team.
        </p>

        <p className="mt-3 text-sm text-zinc-500">
          All information submitted is confidential and protected by
          attorney-client privilege.
        </p>

        {/* CTA Button */}
        <Link
          href={`/${firmSlug}/intake`}
          className="mt-10 inline-flex items-center justify-center rounded-md px-8 py-3 text-base font-medium text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            backgroundColor: firm.primaryColor,
            boxShadow: `0 1px 2px 0 rgb(0 0 0 / 0.05)`,
          }}
        >
          Start Intake Form
        </Link>

        {/* Footer Note */}
        <p className="mt-8 text-xs text-zinc-400">
          This process typically takes 10-15 minutes to complete.
        </p>
      </div>
    </main>
  )
}
