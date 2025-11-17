'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

type RecentOrder = {
    id: string
    total: number
    status: string
    createdAt: string
    shippingName: string
    shippingEmail: string
}

export default function AdminClient () {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [usersCount, setUsersCount] = useState<number>(0)
    const [ordersCount, setOrdersCount] = useState<number>(0)
    const [cartsCount, setCartsCount] = useState<number>(0)
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats')
                if (res.status === 401) {
                    // Not authenticated - redirect to login
                    router.push('/auth/login')
                    return
                }
                if (res.status === 403) {
                    setError('You do not have permission to view this page.')
                    setLoading(false)
                    return
                }
                const data = await res.json()
                if (data.error) {
                    setError(data.error)
                    setLoading(false)
                    return
                }
                setUsersCount(data.usersCount || 0)
                setOrdersCount(data.ordersCount || 0)
                setCartsCount(data.cartsCount || 0)
                setRecentOrders(data.recentOrders || [])
            } catch (err: any) {
                setError(err.message || 'Failed to load admin stats')
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [router])

    if (loading) return <div className="min-h-screen"> <Navigation /> <main className="max-w-4xl mx-auto py-24 px-4">Loading admin dashboard...</main> <Footer /></div>

    return (
        <div className="min-h-screen">
            <Navigation />
            <main className="max-w-4xl mx-auto py-12 px-4">
                <h1 className="text-3xl font-serif mb-6">Admin Dashboard</h1>
                {error ? (
                    <div className="p-4 bg-red-100 text-red-800 rounded">{error}</div>
                ) : (
                    <>
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="border rounded p-4 text-center">
                                <div className="text-sm text-gray-500">Users</div>
                                <div className="text-2xl font-semibold">{usersCount}</div>
                            </div>
                            <div className="border rounded p-4 text-center">
                                <div className="text-sm text-gray-500">Orders</div>
                                <div className="text-2xl font-semibold">{ordersCount}</div>
                            </div>
                            <div className="border rounded p-4 text-center">
                                <div className="text-sm text-gray-500">Carts</div>
                                <div className="text-2xl font-semibold">{cartsCount}</div>
                            </div>
                        </div>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">Recent Orders</h2>
                            <div className="border rounded">
                                <table className="w-full text-left table-fixed">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="p-3">ID</th>
                                            <th className="p-3">Customer</th>
                                            <th className="p-3">Total</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3">Created</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map(o => (
                                            <tr key={o.id} className="border-t">
                                                <td className="p-3 text-sm truncate max-w-[200px]">{o.id}</td>
                                                <td className="p-3 text-sm">{o.shippingName} <div className="text-xs text-gray-500">{o.shippingEmail}</div></td>
                                                <td className="p-3 text-sm">${o.total.toFixed(2)}</td>
                                                <td className="p-3 text-sm">{o.status}</td>
                                                <td className="p-3 text-sm">{new Date(o.createdAt).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <div className="mt-6 flex gap-2">
                            <Button onClick={() => router.push('/')}>View Store</Button>
                            <Button onClick={() => router.push('/admin/users')}>Users</Button>
                            <Button onClick={() => router.push('/admin/orders')}>Orders</Button>
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </div>
    )
}
