import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET () {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('authToken')?.value
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    // Ensure admin role
    if (decoded.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const [usersCount, ordersCount, cartsCount] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.cart.count(),
    ])

    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true,
        shippingName: true,
        shippingEmail: true,
      },
    })

    return NextResponse.json({ usersCount, ordersCount, cartsCount, recentOrders })
  } catch (err) {
    console.error('[admin/stats] Error:', err)
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 })
  }
}
