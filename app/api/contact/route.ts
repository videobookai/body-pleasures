import { NextResponse } from 'next/server'
import { triggerWebhook } from '@/lib/webhook-triggers'

export async function POST (req: Request) {
  try {
    const payload = await req.json()
    // Basic payload normalization
    const contact = {
      name: payload.name || payload.fullName || '',
      email: payload.email || '',
      subject: payload.subject || '',
      message: payload.message || payload.msg || '',
      createdAt: new Date().toISOString(),
    }

    const webhookUrl = 'https://oyedey-bootcamp.app.n8n.cloud/webhook-test/contact-form'

    try {
      console.log('[Contact] triggering contact webhook to', webhookUrl, 'payload name=', contact.name)
      await triggerWebhook('contact.submitted', { contact } as any, webhookUrl)
      console.log('[Contact] contact webhook triggered for', contact.email)
    } catch (err) {
      console.error('[Contact] failed to deliver contact webhook', err)
      // fallthrough: still return success to client but note delivery failure in logs
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Contact] error', err)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
