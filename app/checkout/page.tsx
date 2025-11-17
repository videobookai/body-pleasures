"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { loadStripe, Stripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

let stripePromise: Promise<Stripe | null>

function getStripe () {
    if (!stripePromise) {
        stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '')
    }
    return stripePromise
}

function CheckoutForm () {
    const stripe = useStripe()
    const elements = useElements()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [items, setItems] = useState<any[]>([])
    const [shippingName, setShippingName] = useState("")
    const [shippingEmail, setShippingEmail] = useState("")
    const [shippingPhone, setShippingPhone] = useState("")
    const [shippingAddress, setShippingAddress] = useState("")
    const [shippingCity, setShippingCity] = useState("")
    const [shippingState, setShippingState] = useState("")
    const [shippingZip, setShippingZip] = useState("")
    const [shippingCountry, setShippingCountry] = useState("US")

    useEffect(() => {
        const fetchCart = async () => {
            const res = await fetch('/api/cart')
            const data = await res.json()
            setItems(data.items)
            setTotal(data.subtotal)
        }
        fetchCart()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!stripe || !elements) return
        setLoading(true)
        try {
            const intentRes = await fetch('/api/stripe-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shippingName, shippingEmail, shippingPhone, shippingAddress, shippingCity, shippingState, shippingZip, shippingCountry,
                    subtotal: total, tax: 0, shipping: 0, total,
                }),
            })
            const { clientSecret } = await intentRes.json()
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                    billing_details: { name: shippingName, email: shippingEmail },
                },
            })
            if (result.paymentIntent?.status === 'succeeded') {
                router.push('/checkout/success')
            } else {
                alert(`Payment failed: ${result.error?.message}`)
            }
        } catch (err) {
            console.error(err)
            alert('Error processing payment')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Navigation />
            <main className="max-w-3xl mx-auto py-24 px-4">
                <h1 className="text-3xl font-serif mb-6">Checkout</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                        <div className="border rounded p-4 space-y-2">
                            {items.map((it: any) => (
                                <div key={it.id} className="flex justify-between">
                                    <span>{it.name} x{it.quantity}</span>
                                    <span>${(it.price * it.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="border-t pt-2 font-semibold flex justify-between">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Shipping</h2>
                            <div className="space-y-3">
                                <input className="w-full border rounded px-3 py-2" placeholder="Full Name" value={shippingName} onChange={(e) => setShippingName(e.target.value)} required />
                                <input className="w-full border rounded px-3 py-2" type="email" placeholder="Email" value={shippingEmail} onChange={(e) => setShippingEmail(e.target.value)} required />
                                <input className="w-full border rounded px-3 py-2" placeholder="Phone" value={shippingPhone} onChange={(e) => setShippingPhone(e.target.value)} />
                                <input className="w-full border rounded px-3 py-2" placeholder="Address" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} required />
                                <div className="grid grid-cols-2 gap-2">
                                    <input className="w-full border rounded px-3 py-2" placeholder="City" value={shippingCity} onChange={(e) => setShippingCity(e.target.value)} required />
                                    <input className="w-full border rounded px-3 py-2" placeholder="State" value={shippingState} onChange={(e) => setShippingState(e.target.value)} required />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <input className="w-full border rounded px-3 py-2" placeholder="ZIP" value={shippingZip} onChange={(e) => setShippingZip(e.target.value)} required />
                                    <input className="w-full border rounded px-3 py-2" placeholder="Country" value={shippingCountry} onChange={(e) => setShippingCountry(e.target.value)} required />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Payment</h2>
                            <div className="border rounded p-4 bg-gray-50">
                                <CardElement options={{ hidePostalCode: true }} />
                            </div>
                        </div>
                        <Button type="submit" disabled={loading || !stripe} className="w-full">
                            {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                        </Button>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default function CheckoutPage () {
    return (
        <Elements stripe={getStripe()}>
            <CheckoutForm />
        </Elements>
    )
}
