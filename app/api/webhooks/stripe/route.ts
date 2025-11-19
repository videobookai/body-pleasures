import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { triggerOrderWebhook } from '@/lib/webhook-triggers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export async function POST (req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') || ''
  const secret = process.env.STRIPE_WEBHOOK_SECRET || ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as Stripe.PaymentIntent
    const metadata = intent.metadata || {}
    const { sessionId, shippingName, shippingEmail, shippingAddress, shippingCity, shippingState, shippingZip, shippingCountry } = metadata

    // Get cart items and create order
    const cart = await prisma.cart.findUnique({
      where: { sessionId: String(sessionId) },
      include: { items: true },
    })

    if (cart) {
      const subtotal = cart.items.reduce((s: number, i: any) => s + i.price * i.quantity, 0)
      const tax = 0
      const shippingCost = 0
      const total = subtotal + tax + shippingCost

      await prisma.order.create({
        data: {
          sessionId: String(sessionId),
          items: JSON.stringify(cart.items),
          subtotal,
          tax,
          shipping: shippingCost,
          total,
          shippingName: String(shippingName),
          shippingEmail: String(shippingEmail),
          shippingAddress: String(shippingAddress),
          shippingCity: String(shippingCity),
          shippingState: String(shippingState),
          shippingZip: String(shippingZip),
          shippingCountry: String(shippingCountry),
          paymentMethod: 'stripe',
          stripeIntentId: intent.id,
          status: 'completed',
        },
      })

      try {
        const orderPayload = {
          id: `stripe_${intent.id}`,
          shippingName: String(shippingName),
          shippingEmail: String(shippingEmail),
          total,
          items: cart.items.map((i: any) => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
          status: 'completed',
          shippingAddress: String(shippingAddress),
          createdAt: new Date().toISOString(),
        }
        const webhookUrl = 'https://oyedey-bootcamp.app.n8n.cloud/webhook-test/orders/new'
        console.log('[StripeWebhook] triggering order webhook to', webhookUrl, 'payload id=', orderPayload.id)
        await triggerOrderWebhook(orderPayload as any, webhookUrl)
        console.log('[StripeWebhook] order webhook triggered for', orderPayload.id)
      } catch (err) {
        console.error('Failed to trigger order webhook (stripe):', err)
      }

      // Clear cart
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
    }
  }

  return NextResponse.json({ received: true })
}
