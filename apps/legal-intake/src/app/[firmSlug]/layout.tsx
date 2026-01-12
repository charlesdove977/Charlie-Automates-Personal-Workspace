import { notFound } from 'next/navigation'
import { db } from '@/lib/db'

interface FirmLayoutProps {
  children: React.ReactNode
  params: Promise<{ firmSlug: string }>
}

export default async function FirmLayout({ children, params }: FirmLayoutProps) {
  const { firmSlug } = await params

  const firm = await db.firm.findUnique({
    where: { slug: firmSlug },
  })

  if (!firm) {
    notFound()
  }

  return (
    <div
      className="min-h-screen bg-zinc-50"
      style={{
        '--firm-primary': firm.primaryColor
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
