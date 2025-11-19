import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { triggerOrderWebhook } from '@/lib/webhook-triggers'

export async function POST (req: Request) {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('sessionId')?.value
    if (!sessionId) return NextResponse.json({ error: 'no session' }, { status: 400 })

    const body = await req.json()
    // Basic validation
    if (!body) return NextResponse.json({ error: 'invalid payload' }, { status: 400 })

    // Get cart items
    const cart = await prisma.cart.findUnique({ where: { sessionId }, include: { items: true } })
    if (!cart || cart.items.length === 0) return NextResponse.json({ error: 'cart empty' }, { status: 400 })

    const { shippingName, shippingEmail, shippingPhone, shippingAddress, shippingCity, shippingState, shippingZip, shippingCountry } = body

    // compute subtotal
    const subtotal = cart.items.reduce((s: number, i: any) => s + i.price * i.quantity, 0)
    const tax = body.tax ?? 0
    const shipping = body.shipping ?? 0
    const total = body.total ?? subtotal + tax + shipping

    // Create order in DB (test mode)
    const order = await prisma.order.create({
      data: {
        userId: sessionId && sessionId.startsWith('user:') ? sessionId.replace('user:', '') : null,
        sessionId,
        items: JSON.stringify(cart.items),
        subtotal,
        tax,
        shipping,
        total,
        shippingName: shippingName || 'Test User',
        shippingEmail: shippingEmail || 'test@example.com',
        shippingPhone: shippingPhone || '',
        shippingAddress: shippingAddress || '123 Test St',
        shippingCity: shippingCity || 'Testville',
        shippingState: shippingState || 'TS',
        shippingZip: shippingZip || '00000',
        shippingCountry: shippingCountry || 'US',
        paymentMethod: 'test',
        status: 'completed',
      },
    })

    // Clear cart items
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })

    // Trigger external webhook (n8n) with order details (non-blocking)
    try {
      const orderPayload = {
        id: order.id,
        shippingName: order.shippingName,
        shippingEmail: order.shippingEmail,
        total: order.total,
        items: cart.items.map((i: any) => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
        status: order.status,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt?.toISOString?.() || new Date().toISOString(),
      }
      // Provided webhook URL
      const webhookUrl = 'https://oyedey-bootcamp.app.n8n.cloud/webhook-test/orders/new'
      console.log('[Checkout] triggering order webhook to', webhookUrl, 'payload id=', orderPayload.id)
      await triggerOrderWebhook(orderPayload as any, webhookUrl)
      console.log('[Checkout] order webhook triggered for', orderPayload.id)
    } catch (err) {
      console.error('Failed to trigger order webhook:', err)
    }

    return NextResponse.json({ ok: true, id: order.id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
