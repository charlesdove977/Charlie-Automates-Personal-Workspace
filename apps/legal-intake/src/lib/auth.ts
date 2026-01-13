import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

// Note: db and bcryptjs are dynamically imported in authorize() to avoid
// loading Node.js crypto module in Edge runtime (middleware uses this file)

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('[auth] authorize called with:', credentials?.email)

        if (!credentials?.email || !credentials?.password) {
          console.log('[auth] Missing credentials')
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        // Dynamic imports to avoid Edge runtime crypto issues
        const { db } = await import('./db')

        const user = await db.user.findUnique({
          where: { email },
          include: { firm: true },
        })

        console.log('[auth] User found:', !!user, user?.email)

        if (!user || !user.passwordHash) {
          console.log('[auth] No user or no passwordHash')
          return null
        }

        const { compare } = await import('bcryptjs')
        const isValid = await compare(password, user.passwordHash)
        console.log('[auth] Password valid:', isValid)

        if (!isValid) {
          return null
        }

        // Return user object for session
        console.log('[auth] Returning user:', user.email)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          firmId: user.firmId,
          firmSlug: user.firm.slug,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On sign in, add custom fields to token
      if (user) {
        token.id = user.id
        token.role = user.role
        token.firmId = user.firmId
        token.firmSlug = user.firmSlug
      }
      return token
    },
    async session({ session, token }) {
      // Add custom fields to session
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.firmId = token.firmId as string
        session.user.firmSlug = token.firmSlug as string
      }
      return session
    },
  },
  pages: {
    signIn: '/dashboard/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
})
