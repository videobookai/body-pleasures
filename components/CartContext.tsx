// "use client";
// import React, { createContext, useContext, useEffect, useState } from "react";

// type CartItem = {
//   id: string | number;
//   name: string;
//   price: number;
//   quantity: number;
//   image?: string;
// };

// type CartContextType = {
//   items: CartItem[];
//   addItem: (item: CartItem) => void;
//   removeItem: (id: string | number) => void;
//   clearCart: () => void;
//   updateItemQuantity: (id: string | number, quantity: number) => void;
//   totalItems: number;
// };

// const CartContext = createContext<CartContextType | undefined>(undefined);

// const LOCAL_KEY = "bp_cart_v1";

// export const CartProvider = ({ children }: { children: React.ReactNode }) => {
//   const [items, setItems] = useState<CartItem[]>([]);

//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem(LOCAL_KEY);
//       if (raw) setItems(JSON.parse(raw));
//     } catch (e) {
//       console.error("failed to read cart from storage", e);
//     }
//   }, []);

//   useEffect(() => {
//     try {
//       localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
//     } catch (e) {
//       console.error("failed to save cart to storage", e);
//     }
//   }, [items]);

//   const addItem = (item: CartItem) => {
//     setItems((prev) => {
//       const found = prev.find((p) => p.id === item.id);
//       if (found) {
//         return prev.map((p) =>
//           p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p
//         );
//       }
//       return [...prev, item];
//     });
//   };

//   const removeItem = (id: string | number) => {
//     setItems((prev) => prev.filter((p) => p.id !== id));
//   };

//   const clearCart = () => setItems([]);

//   const updateItemQuantity = (id: string | number, quantity: number) => {
//     setItems((prev) =>
//       prev
//         .map((p) => (p.id === id ? { ...p, quantity } : p))
//         .filter((p) => p.quantity > 0)
//     );
//   };

//   const totalItems = items.reduce((s, it) => s + it.quantity, 0);

//   return (
//     <CartContext.Provider value={{ items, addItem, removeItem, clearCart, updateItemQuantity, totalItems }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const ctx = useContext(CartContext);
//   if (!ctx) throw new Error("useCart must be used within CartProvider");
//   return ctx;
// };

// export default CartContext;
