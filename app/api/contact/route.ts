import { NextResponse } from 'next/server'

export async function POST (req: Request) {
  try {
    const payload = await req.json()
    const webhook = process.env.N8N_WEBHOOK_URL
    if (!webhook) {
      return NextResponse.json({ error: 'N8N webhook not configured (set N8N_WEBHOOK_URL)' }, { status: 500 })
    }

    // Forward to N8N webhook
    const resp = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!resp.ok) return NextResponse.json({ error: 'failed to deliver to n8n' }, { status: 502 })

    const body = await resp.text()
    return NextResponse.json({ ok: true, result: body })
  } catch (err) {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
