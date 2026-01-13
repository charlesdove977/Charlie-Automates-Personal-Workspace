import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Double-check auth (middleware should handle this, but just in case)
  if (!session?.user) {
    redirect('/dashboard/login')
  }

  // Get firm name for sidebar
  const firm = await db.firm.findUnique({
    where: { id: session.user.firmId },
    select: { name: true },
  })

  const firmName = firm?.name ?? 'Unknown Firm'

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar firmName={firmName} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          userName={session.user.name ?? 'Unknown'}
          userRole={session.user.role ?? 'ATTORNEY'}
        />

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
