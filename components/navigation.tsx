"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, ShoppingBag, User } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export function Navigation () {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const { user, loading } = useAuth()

  const fetchCartCount = async () => {
    try {
      const res = await fetch('/api/cart')
      if (!res.ok) return
      const data = await res.json()
      const items = data.items || []
      const count = items.reduce((s: number, i: any) => s + (i.quantity || 0), 0)
      setCartCount(count)
    } catch (err) {
      // ignore errors for now
      console.error('Failed to fetch cart count', err)
    }
  }

  useEffect(() => {
    fetchCartCount()

    const onFocus = () => fetchCartCount()
    const onCartUpdated = (e: Event) => {
      // If event carries details from the mutating calls, use them to update nav without refetch
      const ev: any = e as CustomEvent
      if (ev && ev.detail) {
        const detail = ev.detail
        if (typeof detail.count === 'number') {
          setCartCount(detail.count)
          return
        }
        if (Array.isArray(detail.items)) {
          const count = detail.items.reduce((s: number, i: any) => s + (i.quantity || 0), 0)
          setCartCount(count)
          return
        }
      }
      // fallback: fetch the cart
      fetchCartCount()
    }

    const onVisibility = () => { if (document.visibilityState === 'visible') fetchCartCount() }

    window.addEventListener('focus', onFocus)
    window.addEventListener('cart-updated', onCartUpdated)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('cart-updated', onCartUpdated)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            {/* Site title: clicking always navigates to home. If already on home, force a reload */}
            <Link
              href="/"
              onClick={(e) => {
                // If already on home, force a full reload to "always load" the home page
                if (typeof window !== 'undefined' && window.location.pathname === '/') {
                  e.preventDefault()
                  window.location.href = '/'
                } else {
                  // Otherwise use client navigation
                  // Allow Link to handle default navigation
                }
              }}
              className="text-xl font-serif font-semibold text-foreground"
            >
              {"Ms V's Body Pleasures"}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#shop" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Shop
            </a>
            <a href="#collections" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Collections
            </a>
            <a href="#about" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              About
            </a>
            <a href="#contact" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Contact
            </a>

            {/* Cart Icon */}
            <Button asChild size="sm" variant="ghost">
              <Link href="/cart" className="relative">
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-primary rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Auth Links */}
            {!loading && (
              <>
                {user ? (
                  <Button asChild size="sm" variant="ghost">
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="sm" variant="ghost">
                      <Link href="/auth/login">Log In</Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href="/auth/register">Sign Up</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a href="#shop" className="block text-sm text-foreground/80 hover:text-foreground transition-colors">
              Shop
            </a>
            <a href="#collections" className="block text-sm text-foreground/80 hover:text-foreground transition-colors">
              Collections
            </a>
            <a href="#about" className="block text-sm text-foreground/80 hover:text-foreground transition-colors">
              About
            </a>
            <a href="#contact" className="block text-sm text-foreground/80 hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
