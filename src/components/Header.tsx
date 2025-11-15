import React from 'react';

type Props = {
  onNavigate: (page: string) => void;
  onToggleCart: () => void;
  cartCount: number;
};

export default function Header({ onNavigate, onToggleCart, cartCount }: Props) {
    return (
      <header>
        <div className="header-content">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="logo"
          >
            Ms V's <span>Body Pleasures</span>
          </a>
  
          <nav>
            <a href="#" onClick={(e)=>{e.preventDefault(); onNavigate('home');}}>Home</a>
            <a href="#" onClick={(e)=>{e.preventDefault(); onNavigate('shop');}}>Shop</a>
            <a href="#" onClick={(e)=>{e.preventDefault(); onNavigate('about');}}>About</a>
            <a href="#" onClick={(e)=>{e.preventDefault(); onNavigate('contact');}}>Contact</a>
  
            <div className="cart-icon" onClick={onToggleCart}>
              🛒 <span className="cart-count" id="cartCount">{cartCount}</span>
            </div>
          </nav>
        </div>
      </header>
    );
  }
  