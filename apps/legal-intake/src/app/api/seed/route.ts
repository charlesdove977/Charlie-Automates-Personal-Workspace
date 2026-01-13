import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { db } from '@/lib/db'

// Temporary seed endpoint - remove before production
export async function POST() {
  try {
    const firm = await db.firm.upsert({
      where: { slug: 'johnson-associates' },
      update: {},
      create: {
        name: 'Johnson & Associates',
        slug: 'johnson-associates',
        primaryColor: '#1a365d',
      },
    })

    // Create test user with password "test123"
    const passwordHash = await hash('test123', 10)
    const user = await db.user.upsert({
      where: { email: 'attorney@test.com' },
      update: { passwordHash },
      create: {
        email: 'attorney@test.com',
        name: 'Test Attorney',
        passwordHash,
        role: 'ATTORNEY',
        firmId: firm.id,
      },
    })

    return NextResponse.json({
      success: true,
      firm,
      user: { email: user.email, name: user.name },
      credentials: { email: 'attorney@test.com', password: 'test123' }
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}
