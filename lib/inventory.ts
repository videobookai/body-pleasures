import { readJSON, writeJSON } from './storage'

type Variant = {
  id: string
  name?: string
  sku?: string
  price?: number
  stock: number
  lowStockThreshold?: number
}

type Product = {
  id: string
  name: string
  description?: string
  price?: number
  sku?: string
  weight?: number
  variants?: Variant[]
}

const PRODUCTS_FILE = 'products.json'

export function listProducts(): Product[] {
  return (readJSON<Product[]>(PRODUCTS_FILE) || [])
}

export function getProduct(id: string): Product | undefined {
  return listProducts().find((p) => p.id === id)
}

export function saveProducts(products: Product[]) {
  writeJSON(PRODUCTS_FILE, products)
}

export function upsertProduct(prod: Product) {
  const products = listProducts()
  const idx = products.findIndex((p) => p.id === prod.id)
  if (idx === -1) products.push(prod)
  else products[idx] = prod
  saveProducts(products)
  return prod
}

export function deleteProduct(id: string) {
  const products = listProducts().filter((p) => p.id !== id)
  saveProducts(products)
}

// Decrement stock for an ordered item. Returns array of low-stock alerts triggered.
export async function decrementStock(productId: string, variantId: string | null, qty: number) {
  const products = listProducts()
  const pIdx = products.findIndex((p) => p.id === productId)
  if (pIdx === -1) throw new Error('product not found')
  const product = products[pIdx]

  // if variants exist, operate on variant
  if (product.variants && product.variants.length > 0) {
    if (!variantId) throw new Error('variant required')
    const vIdx = product.variants.findIndex((v) => v.id === variantId)
    if (vIdx === -1) throw new Error('variant not found')
    const variant = product.variants[vIdx]
    if (variant.stock < qty) throw new Error('insufficient stock')
    variant.stock = variant.stock - qty
    products[pIdx].variants![vIdx] = variant
    saveProducts(products)

    const alerts: any[] = []
    if (typeof variant.lowStockThreshold === 'number' && variant.stock <= variant.lowStockThreshold) {
      alerts.push({ productId, variantId, stock: variant.stock })
      await triggerLowStockWebhook({ product, variant })
    }
    return alerts
  }

  // no variants: use product-level stock field (treat as variantless)
  // We'll assume product has a 'stock' field stored in variants for consistency
  throw new Error('product has no variants; implement variantless stock if needed')
}

export async function revertStock(productId: string, variantId: string | null, qty: number) {
  const products = listProducts()
  const pIdx = products.findIndex((p) => p.id === productId)
  if (pIdx === -1) throw new Error('product not found')
  const product = products[pIdx]
  if (product.variants && product.variants.length > 0) {
    if (!variantId) throw new Error('variant required')
    const vIdx = product.variants.findIndex((v) => v.id === variantId)
    if (vIdx === -1) throw new Error('variant not found')
    const variant = product.variants[vIdx]
    variant.stock = variant.stock + qty
    products[pIdx].variants![vIdx] = variant
    saveProducts(products)
    return
  }
  throw new Error('product has no variants; implement variantless stock if needed')
}

async function triggerLowStockWebhook(payload: { product: Product; variant: Variant }) {
  try {
    const url = process.env.N8N_WEBHOOK_URL
    if (!url) {
      // no webhook configured — nothing to do
      console.warn('N8N_WEBHOOK_URL not set, skipping low-stock webhook')
      return
    }
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'low-stock', product: { id: payload.product.id, name: payload.product.name }, variant: { id: payload.variant.id, name: payload.variant.name }, stock: payload.variant.stock }),
    })
  } catch (err) {
    console.error('failed to call low-stock webhook', err)
  }
}
