import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, signToken, isValidEmail } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST (req: Request) {
  try {
    const { email, password } = await req.json()

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      console.log('❌ User not found:', email)
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }
    console.log('✅ User found:', user.email)

    // Verify password
    let isValid: boolean
    try {
      isValid = await comparePassword(password, user.passwordHash)
      console.log('✅ Password comparison complete, match:', isValid)
    } catch (compareErr) {
      console.error('❌ Password comparison failed:', compareErr)
      return NextResponse.json({ error: 'Password verification failed' }, { status: 500 })
    }

    if (!isValid) {
      console.log('❌ Password mismatch for user:', email)
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Sign JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Create response with httpOnly cookie
    // Merge any anonymous cart into the user's cart so carts persist across login
    try {
      const cookieStore = await cookies()
      const anonSession = cookieStore.get('sessionId')?.value
      const userSession = `user:${user.id}`

      // If there's an anon session different from the user's session, merge
      if (anonSession && anonSession !== userSession) {
        const anonCart = await prisma.cart.findUnique({ where: { sessionId: anonSession }, include: { items: true } })
        if (anonCart && anonCart.items.length > 0) {
          // ensure user cart exists
          let userCart = await prisma.cart.findUnique({ where: { sessionId: userSession }, include: { items: true } })
          if (!userCart) {
            userCart = await prisma.cart.create({ data: { sessionId: userSession }, include: { items: true } })
          }

          // merge items: sum quantities for identical product/variant
          for (const item of anonCart.items) {
            const existing = userCart.items.find((i: any) => i.productId === item.productId && i.variantId === item.variantId)
            if (existing) {
              await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + item.quantity } })
            } else {
              await prisma.cartItem.create({ data: { cartId: userCart.id, productId: item.productId, variantId: item.variantId || null, name: item.name, price: item.price, quantity: item.quantity, image: item.image || null } })
            }
          }

          // remove anon items and anon cart
          await prisma.cartItem.deleteMany({ where: { cartId: anonCart.id } })
          await prisma.cart.delete({ where: { id: anonCart.id } })
        }
      }
      // ensure the response will set the session cookie to the user's sessionId
    } catch (mergeErr) {
      console.error('Error merging carts on login', mergeErr)
    }

    const response = NextResponse.json(
      {
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        token,
      },
      { status: 200 }
    )

    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    // Also set sessionId cookie to user's sessionId so subsequent cart calls use the user cart
    response.cookies.set('sessionId', `user:${user.id}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    })

    return response
  } catch (err) {
    console.error('❌ Login error:', err)
    const message = err instanceof Error ? err.message : JSON.stringify(err)
    return NextResponse.json({ error: 'Login failed: ' + message }, { status: 500 })
  }
}
