import React from "react";
import { Product } from "../data/products";

interface CartItem extends Product {
  quantity: number;
}

interface Props {
  isOpen: boolean;
  cartItems: CartItem[];
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartSidebar({
  isOpen,
  cartItems,
  onClose,
  onCheckout,
}: Props) {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
      <div className="cart-header">
        <h2>Your Cart</h2>
        <button className="close-cart" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="cart-items">
        {cartItems.length === 0 && (
          <p style={{ color: "rgba(255,255,255,0.7)" }}>Your cart is empty.</p>
        )}

        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image">{item.emoji}</div>
            <div className="cart-item-info">
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-price">
                ${item.price.toFixed(2)} × {item.quantity}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button className="checkout-btn" onClick={onCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
}
