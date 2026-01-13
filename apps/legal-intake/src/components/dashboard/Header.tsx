import { LogoutButton } from '@/app/dashboard/logout-button'

interface HeaderProps {
  userName: string
  userRole: string
}

export function Header({ userName, userRole }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Case Inbox</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{userName}</p>
          <p className="text-xs text-gray-500 capitalize">{userRole.toLowerCase()}</p>
        </div>
        <LogoutButton />
      </div>
    </header>
  )
}
