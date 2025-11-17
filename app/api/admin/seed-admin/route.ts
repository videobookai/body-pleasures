import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

// Dev-only endpoint to create a temporary admin user
export async function POST () {
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 })
    }

    const email = process.env.DEV_ADMIN_EMAIL || 'admin@example.com'
    const password = process.env.DEV_ADMIN_PASSWORD || Math.random().toString(36).slice(2, 10)
    const name = 'Dev Admin'

    const passwordHash = await hashPassword(password)

    const user = await prisma.user.upsert({
      where: { email },
      update: { passwordHash, name, role: 'admin' },
      create: { email, passwordHash, name, role: 'admin' },
    })

    return NextResponse.json({ message: 'Admin seeded', user: { id: user.id, email: user.email, name: user.name }, password }, { status: 201 })
  } catch (err) {
    console.error('[admin/seed-admin] Error:', err)
    return NextResponse.json({ error: 'Failed to seed admin' }, { status: 500 })
  }
}
