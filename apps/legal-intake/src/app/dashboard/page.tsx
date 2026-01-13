import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/dashboard/login')
  }

  return (
    <div>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Welcome, {session.user.name}
        </h2>
        <p className="text-gray-600">
          Your case inbox will appear here. This dashboard is under construction.
        </p>
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Session Info</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li><strong>Email:</strong> {session.user.email}</li>
            <li><strong>Role:</strong> {session.user.role}</li>
            <li><strong>Firm ID:</strong> {session.user.firmId}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
