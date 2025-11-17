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

export async function GET (req: Request) {
  const cookieStore = await cookies()
  const sessionId = getSessionId(cookieStore)

  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: true },
  })

  const response = NextResponse.json({
    sessionId,
    items: cart?.items || [],
    subtotal: cart ? cart.items.reduce((s: number, i: any) => s + i.price * i.quantity, 0) : 0,
  })

  // Ensure sessionId is set as a persistent cookie
  response.cookies.set('sessionId', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  return response
}

export async function POST (req: Request) {
  // Add item to cart
  const cookieStore = await cookies()
  const sessionId = getSessionId(cookieStore)
  const { productId, variantId, name, price, quantity, image } = await req.json()

  if (!productId || !name || price === undefined || !quantity) {
    return NextResponse.json({ error: 'invalid item' }, { status: 400 })
  }

  let cart = await prisma.cart.findUnique({ where: { sessionId }, include: { items: true } })
  if (!cart) {
    cart = await prisma.cart.create({ data: { sessionId }, include: { items: true } })
  }

  // Check if item already exists
  const existing = cart.items.find((i: any) => i.productId === productId && i.variantId === variantId)
  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    })
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
        name,
        price,
        quantity,
        image: image || null,
      },
    })
  }

  const updated = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: true },
  })
  const subtotal = updated!.items.reduce((s: number, i: any) => s + i.price * i.quantity, 0)

  const response = NextResponse.json({ items: updated!.items, subtotal }, { status: 201 })

  // Ensure sessionId is set as a persistent cookie
  response.cookies.set('sessionId', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  return response
}
