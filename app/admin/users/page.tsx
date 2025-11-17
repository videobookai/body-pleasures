'use client'

import React, { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type User = { id: string; email: string; name?: string; role: string; createdAt: string }

export default function AdminUsers () {
    const [q, setQ] = useState('')
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchUsers = async (search?: string) => {
        setLoading(true)
        try {
            const url = '/api/admin/users' + (search ? `?q=${encodeURIComponent(search)}` : '')
            const res = await fetch(url)
            if (!res.ok) {
                const body = await res.json()
                setError(body.error || 'Failed to fetch users')
                setLoading(false)
                return
            }
            const data = await res.json()
            setUsers(data.users || [])
        } catch (err: any) {
            setError(err.message || 'Failed to fetch users')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchUsers() }, [])

    return (
        <div className="min-h-screen">
            <Navigation />
            <main className="max-w-4xl mx-auto py-12 px-4">
                <h1 className="text-2xl font-semibold mb-4">Users</h1>
                <div className="flex gap-2 mb-4">
                    <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by email or name" />
                    <Button onClick={() => fetchUsers(q)}>Search</Button>
                </div>
                {error && <div className="p-2 bg-red-100 text-red-800 rounded mb-4">{error}</div>}
                <div className="border rounded">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3">Email</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} className="border-t">
                                    <td className="p-3">{u.email}</td>
                                    <td className="p-3">{u.name}</td>
                                    <td className="p-3">{u.role}</td>
                                    <td className="p-3">{new Date(u.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
            <Footer />
        </div>
    )
}
