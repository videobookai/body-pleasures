"use client"

import React, { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

type Order = {
    id: string
    items: any[]
    total: number
    customer?: { name?: string; email?: string }
    method?: string
    createdAt?: string
}

export default function SuccessPage () {
    const [orders, setOrders] = useState<Order[]>([])

    useEffect(() => {
        try {
            const raw = localStorage.getItem('orders')
            if (raw) setOrders(JSON.parse(raw))
        } catch { }
    }, [])

    if (orders.length === 0) {
        return (
            <>
                <Navigation />
                <main className="max-w-3xl mx-auto py-24 px-4">
                    <h1 className="text-3xl font-serif mb-6">No recent orders</h1>
                    <p>There are no completed orders in your local session.</p>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Navigation />
            <main className="max-w-4xl mx-auto py-24 px-4">
                <h1 className="text-3xl font-serif mb-6">Order history</h1>
                <div className="space-y-6">
                    {orders.map((o) => (
                        <div key={o.id} className="border rounded p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <div className="font-medium">Order {o.id}</div>
                                    <div className="text-sm text-muted-foreground">{o.customer?.email || '—'}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-semibold">{`$${o.total.toFixed(2)}`}</div>
                                    <div className="text-sm text-muted-foreground">{o.createdAt}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {o.items.map((it: any) => (
                                    <div key={it.id} className="flex items-center gap-3">
                                        {it.image && <img src={it.image} className="w-16 h-16 object-cover rounded" />}
                                        <div>
                                            <div className="font-medium">{it.name}</div>
                                            <div className="text-sm text-muted-foreground">{`${it.quantity} x $${it.price.toFixed(2)}`}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    )
}
