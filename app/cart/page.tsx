"use client";
import React from "react";
import { useCart } from "@/components/CartContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function CartPage() {
  const { items, removeItem, clearCart, updateItemQuantity } = useCart();

  const grandTotal = items.reduce((s, it) => s + it.price * it.quantity, 0);

  return (
    <div className="w-full  flex flex-col">

   <Navigation/>
    <div className="mx-auto p-6 w-full max-w-3xl lg:max-w-5xl mt-24 mb-10">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {items.map((it) => (
            <div key={String(it.id)} className="flex items-center gap-4 p-4 border rounded">
              {it.image ? (
                <Image src={it.image} alt={it.name} width={80} height={80} className="object-contain" />
              ) : (
                <div className="w-20 h-20 bg-slate-100" />
              )}
              <div className="flex-1">
                <h2 className="font-medium">{it.name}</h2>
                <p className="text-sm text-muted-foreground">${it.price.toFixed(2)} each</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateItemQuantity(it.id, Math.max(1, it.quantity - 1))} className="px-2 py-1 border">-</button>
                  <span className="px-3">{it.quantity}</span>
                  <button onClick={() => updateItemQuantity(it.id, it.quantity + 1)} className="px-2 py-1 border">+</button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">${(it.price * it.quantity).toFixed(2)}</p>
                <Button variant="ghost" onClick={() => removeItem(it.id)} className="mt-2">Remove</Button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between p-4 border-t">
            <div>
              <p className="text-lg font-semibold">Grand Total</p>
              <p className="text-xl font-bold">${grandTotal.toFixed(2)}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => clearCart()} variant={"outline"} className="hover:bg-white hover:text-black">Clear Cart</Button>
              <Button className="bg-yellow-700 hover:bg-yellow-800">Checkout</Button>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer/>
     </div>
  );
}
