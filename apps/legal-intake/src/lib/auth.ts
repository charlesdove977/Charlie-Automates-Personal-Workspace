import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { db } from './db'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        const user = await db.user.findUnique({
          where: { email },
          include: { firm: true },
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isValid = await compare(password, user.passwordHash)

        if (!isValid) {
          return null
        }

        // Return user object for session
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
