import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

function getSessionId (cookieStore: Awaited<ReturnType<typeof cookies>>) {
  // Prefer authenticated user's id when present so carts persist across devices
  const authToken = cookieStore.get('authToken')?.value
  if (authToken) {
    const payload = verifyToken(authToken)
    if (payload && payload.userId) return `user:${payload.userId}`
  }

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

  const id = params?.id
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  // Ensure the cart exists for this session
  const cart = await prisma.cart.findUnique({ where: { sessionId }, include: { items: true } })
  if (!cart) return NextResponse.json({ error: 'cart not found' }, { status: 404 })

  // Ensure the cart item belongs to this cart/session
  const existing = await prisma.cartItem.findUnique({ where: { id } })
  if (!existing || existing.cartId !== cart.id) {
    return NextResponse.json({ error: 'item not found' }, { status: 404 })
  }

  let responseData: any = {}

  if (quantity <= 0) {
    // Delete item
    await prisma.cartItem.delete({ where: { id } })
    // recompute subtotal and return deleted id
    const remaining = await prisma.cartItem.findMany({ where: { cartId: cart.id } })
    const subtotal = remaining.reduce((s: number, i: any) => s + i.price * i.quantity, 0)
    responseData = { sessionId, deletedId: id, subtotal, items: remaining }
  } else {
    const updated = await prisma.cartItem.update({ where: { id }, data: { quantity } })
    const updatedItems = await prisma.cartItem.findMany({ where: { cartId: cart.id } })
    const subtotal = updatedItems.reduce((s: number, i: any) => s + i.price * i.quantity, 0)
    responseData = { sessionId, item: updated, subtotal, items: updatedItems }
  }

  const response = NextResponse.json(responseData)

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
  const id = params?.id
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  // Ensure the cart exists for this session
  const cart = await prisma.cart.findUnique({ where: { sessionId }, include: { items: true } })
  if (!cart) return NextResponse.json({ error: 'cart not found' }, { status: 404 })

  // Ensure the cart item belongs to this cart/session
  const existing = await prisma.cartItem.findUnique({ where: { id } })
  if (!existing || existing.cartId !== cart.id) {
    return NextResponse.json({ error: 'item not found' }, { status: 404 })
  }

  // Delete cart item
  await prisma.cartItem.delete({ where: { id } })

  // Fetch updated cart items and subtotal
  const remaining = await prisma.cartItem.findMany({ where: { cartId: cart.id } })
  const subtotal = remaining.reduce((s: number, i: any) => s + i.price * i.quantity, 0)

  const response = NextResponse.json({ deletedId: id, subtotal, items: remaining })

  // Persist sessionId cookie
  response.cookies.set('sessionId', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  })

  return response
}

