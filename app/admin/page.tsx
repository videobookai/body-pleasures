import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminClient from './admin-client'

// Server-side admin gate: redirect non-admins to login
export default function AdminPage () {
    // cookies() sometimes has different typing in this environment; cast to any to avoid type errors
    const cookieStore: any = cookies()
    const token = cookieStore?.get?.('authToken')?.value || cookieStore?.get('authToken')?.value
    if (!token) redirect('/auth/login')

    const decoded = verifyToken(token)
    if (!decoded) redirect('/auth/login')
    if (decoded.role !== 'admin') redirect('/')

    // Render client-side admin app which will fetch admin APIs
    return <AdminClient />
}
