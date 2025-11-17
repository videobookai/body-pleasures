import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET (req: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('authToken')?.value
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    if (decoded.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const q = new URL(req.url).searchParams.get('q') || undefined

    const users = await prisma.user.findMany({
      where: q ? {
        OR: [
          { email: { contains: q } },
          { name: { contains: q } },
        ],
      } : undefined,
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json({ users })
  } catch (err) {
    console.error('[admin/users] Error:', err)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
