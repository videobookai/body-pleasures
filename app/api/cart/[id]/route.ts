import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

function getSessionId (cookieStore: Awaited<ReturnType<typeof cookies>>) {
  let sid = cookieStore.get('sessionId')?.value
  if (!sid) {
    sid = `session_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
  }
  return sid
}

export async function PATCH (req: Request, context: any) {
  const { params } = context || {}
  const cookieStore = await cookies()
  const sessionId = getSessionId(cookieStore)

  // Update cart item quantity
  const { quantity } = await req.json()
  if (quantity === undefined) {
    return NextResponse.json({ error: 'quantity required' }, { status: 400 })
  }

  if (quantity <= 0) {
    // Delete item
    await prisma.cartItem.delete({ where: { id: params?.id } })
  } else {
    await prisma.cartItem.update({
      where: { id: params?.id },
      data: { quantity },
    })
  }

  // Fetch updated cart
  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: true },
  })

  const response = NextResponse.json({
    items: cart?.items || [],
    subtotal: cart ? cart.items.reduce((s: number, i: any) => s + i.price * i.quantity, 0) : 0,
  })

  // Persist sessionId cookie
  response.cookies.set('sessionId', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  })

  return response
}

export async function DELETE (req: Request, context: any) {
  const { params } = context || {}
  const cookieStore = await cookies()
  const sessionId = getSessionId(cookieStore)

  // Delete cart item
  await prisma.cartItem.delete({ where: { id: params?.id } })

  // Fetch updated cart
  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: true },
  })

  const response = NextResponse.json({
    items: cart?.items || [],
    subtotal: cart ? cart.items.reduce((s: number, i: any) => s + i.price * i.quantity, 0) : 0,
  })

  // Persist sessionId cookie
  response.cookies.set('sessionId', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  })

  return response
}

