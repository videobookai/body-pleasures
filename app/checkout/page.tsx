"use client"

import React, { useState } from "react"
import { useCart } from "@/components/cart-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function CheckoutPage () {
    const { items, total, clear } = useCart()
    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [method, setMethod] = useState("card")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (items.length === 0) return alert('Cart is empty')
        setLoading(true)

        try {
            const resp = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items, total, customer: { name, email }, method }),
            })
            if (!resp.ok) throw new Error('payment failed')
            const data = await resp.json()

            // store order locally (simple demo). In real app this would be persisted server-side.
            try {
                const raw = localStorage.getItem('orders')
                const existing = raw ? JSON.parse(raw) : []
                const order = { id: data.id || `local-${Date.now()}`, items, total, customer: { name, email }, method, createdAt: new Date().toISOString() }
                localStorage.setItem('orders', JSON.stringify([order, ...existing]))
            } catch { }

            clear()
            router.push('/checkout/success')
        } catch (err) {
            console.error(err)
            alert('Payment failed. This is a demo implementation.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Navigation />
            <main className="max-w-3xl mx-auto py-24 px-4">
                <h1 className="text-3xl font-serif mb-6">Checkout</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm mb-1">Full name</label>
                        <input className="w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input className="w-full border rounded px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Payment method</label>
                        <select className="w-full border rounded px-3 py-2" value={method} onChange={(e) => setMethod(e.target.value)}>
                            <option value="card">Card</option>
                            <option value="paypal">PayPal</option>
                            <option value="crypto">Fiat Crypto</option>
                        </select>
                    </div>

                    {method === 'card' && (
                        <div>
                            <label className="block text-sm mb-1">Card number (demo)</label>
                            <input className="w-full border rounded px-3 py-2" placeholder="4242 4242 4242 4242" />
                        </div>
                    )}

                    <div className="border-t pt-4 flex items-center justify-between">
                        <div>
                            <div className="text-sm text-muted-foreground">Total</div>
                            <div className="text-2xl font-semibold">{`$${total.toFixed(2)}`}</div>
                        </div>
                        <div>
                            <Button type="submit" disabled={loading}>{loading ? 'Processing...' : 'Pay now'}</Button>
                        </div>
                    </div>
                </form>
            </main>
            <Footer />
        </>
    )
}
