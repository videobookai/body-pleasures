"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// use server-backed cart API instead of local cart context

type Product = {
  id: string
  name: string
  price: number
  image: string
  desc?: string
}

const PRODUCTS: Product[] = [
  {
    id: "artisan-soap",
    name: "Artisan Soap Collection",
    price: 6.0,
    image: "/images/design-mode/Artisan_Soap%255B1%255D.JPG.jpeg",
    desc: "Choose from over 30 unique scents and formulations",
  },
  {
    id: "beard-care",
    name: "Complete Beard Care",
    price: 5.0,
    image: "/images/design-mode/Beard_Products%255B1%255D.jpg",
    desc: "Premium oils, washes, balms, and conditioners",
  },
  { id: "body-cream", name: "Body Cream", price: 8.0, image: "/images/design-mode/Body%2520Cream.jpg" },
  { id: "relief-oil", name: "Pain Relief Oil", price: 20.0, image: "/images/design-mode/Relief_Products%255B1%255D.JPG.jpeg" },
  { id: "concrete-candles", name: "Concrete Candles", price: 15.0, image: "/images/design-mode/Concrete_Candles%255B1%255D.JPG.jpeg" },
  { id: "body-sprays", name: "Body Sprays", price: 6.0, image: "/images/design-mode/20250912_185335%255B1%255D.JPG.jpeg" },
]

function ProductCard ({ product }: { product: Product }) {
  const [qty, setQty] = useState<number>(1)
  const [added, setAdded] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: qty,
        }),
      })

      if (res.ok) {
        // Dispatch custom event to notify nav to refresh cart count
        window.dispatchEvent(new CustomEvent('cart-updated'))
        // visual feedback
        setAdded(true)
        window.setTimeout(() => setAdded(false), 800)
      }
    } catch (err) {
      console.error('Add to cart failed', err)
      // Consider showing a toast in the future
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
      <div className="aspect-square overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-4">
        <h4 className="font-medium mb-1">{product.name}</h4>
        {product.desc && <p className="text-sm text-muted-foreground mb-2">{product.desc}</p>}
        <p className="text-sm text-muted-foreground mb-3">{`$${product.price.toFixed(2)}`}</p>

        <div className="flex items-center gap-2">
          <input
            aria-label={`quantity-${product.id}`}
            className="w-20 text-center rounded-md border px-2 py-1"
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
          />
          <Button
            onClick={() => handleAdd()}
            disabled={loading}
            className={added ? 'scale-105 bg-primary/90 transform transition-all duration-300' : ''}
          >
            {added ? 'Added ✓' : loading ? 'Adding...' : 'Add to cart'}
          </Button>
        </div>
      </div>
    </Card>
  )
}

export function FeaturedProducts () {
  return (
    <section id="shop" className="py-24 px-4 sm:px-6 lg:px-8 bg-accent/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium mb-4 text-balance">{"Bestselling Products"}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            {"Our most loved products, trusted by customers for their quality and effectiveness"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {PRODUCTS.slice(0, 2).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.slice(2).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
