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
    const where = q ? {
      OR: [
        { id: { contains: q } },
        { shippingName: { contains: q } },
        { shippingEmail: { contains: q } },
      ],
    } : undefined

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: { id: true, total: true, status: true, createdAt: true, shippingName: true, shippingEmail: true },
    })

    return NextResponse.json({ orders })
  } catch (err) {
    console.error('[admin/orders/search] Error:', err)
    return NextResponse.json({ error: 'Failed to search orders' }, { status: 500 })
  }
}
