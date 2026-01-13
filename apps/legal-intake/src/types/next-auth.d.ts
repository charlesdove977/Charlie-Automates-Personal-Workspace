import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    role: string
    firmId: string
    firmSlug: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      firmId: string
      firmSlug: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    firmId: string
    firmSlug: string
  }
}
