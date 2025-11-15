import { NextResponse } from 'next/server'

export async function POST (req: Request) {
  try {
    const body = await req.json()
    // Basic validation
    if (!body || !body.items) return NextResponse.json({ error: 'invalid payload' }, { status: 400 })

    // Simulate payment processing. In a real app, call Stripe/PayPal/etc.
    const orderId = `order_${Date.now()}`

    // Return success with an id - client stores order locally in this demo.
    return NextResponse.json({ ok: true, id: orderId })
  } catch (err) {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
