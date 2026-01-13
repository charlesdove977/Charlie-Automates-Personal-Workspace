import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard')
  const isOnLoginPage = req.nextUrl.pathname === '/dashboard/login'

  // If on dashboard but not logged in, redirect to login
  if (isOnDashboard && !isLoggedIn && !isOnLoginPage) {
    return NextResponse.redirect(new URL('/dashboard/login', req.url))
  }

  // If on login page but already logged in, redirect to dashboard
  if (isOnLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/dashboard/:path*'],
}
