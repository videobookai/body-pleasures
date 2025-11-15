import React, { useMemo, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Newsletter from './components/Newsletter';
import About from './components/About';
import Contact from './components/Contact';
import CartSidebar from './components/CartSidebar';
import Footer from './components/Footer';
import { products as allProducts, Product } from './data/products';

import N8NChat from './components/N8NChat';



type Page = 'home' | 'shop' | 'about' | 'contact';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [cart, setCart] = useState<Product[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const featured = allProducts.slice(0, 6);
  const filtered = useMemo(() => (filter === 'all' ? allProducts : allProducts.filter(p => p.category === filter)), [filter]);

  function addToCart(id: number) {
    const p = allProducts.find(x => x.id === id);
    if (!p) return;
    setCart(prev => [...prev, p]);
  }

  function handleNavigate(p: Page) {
    setPage(p);
    window.scrollTo(0, 0);
  }

  function handleFilter(cat: string) {
    setFilter(cat);
  }



  function checkout() {
    if (cart.length === 0) {
      alert('Your cart is empty. Add some products first!');
      return;
    }
    alert('Checkout feature coming soon! Thank you for your interest.');
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white" style={{ fontFamily: "'Lato', sans-serif" }}>
      <Header onNavigate={(p) => handleNavigate(p as Page)} onToggleCart={() => setCartOpen(v => !v)} cartCount={cart.length} />
      <main className="pt-28">
        {page === 'home' && (
          <>
            <Hero onShop={() => handleNavigate('shop')} />
            <section className="px-6 py-16 max-w-[1200px] mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold" style={{ fontFamily: "'Playfair Display', serif" }}>Featured Collections</h2>
                <p className="text-white/80">Discover our handcrafted wellness essentials</p>
              </div>
              <div className="mb-12">
                <ProductGrid products={featured} onAdd={addToCart} />
              </div>
            </section>

            <Newsletter />
          </>
        )}

        {page === 'shop' && (
          <section className="px-6 pt-16 pb-24 max-w-[1200px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold" style={{ fontFamily: "'Playfair Display', serif" }}>Our Collection</h2>
              <p className="text-white/80">Explore our full range of artisan wellness products</p>
            </div>

            <div className="flex gap-4 justify-center flex-wrap mb-8">
              {['all','soaps','creams','candles','beard','relief','sprays'].map(cat => (
                <button key={cat} className={`px-6 py-2 rounded-full border ${filter === cat ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black border-yellow-400' : 'bg-[rgba(26,26,26,0.6)] border-[rgba(255,215,0,0.3)] text-white'}`} onClick={() => handleFilter(cat)}>
                  {cat === 'all' ? 'All Products' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            <ProductGrid products={filtered} onAdd={addToCart} />
          </section>
        )}

        {page === 'about' && <About />}

        {page === 'contact' && <Contact/>}

        <Footer />
      </main>

      <CartSidebar isOpen={cartOpen} cartItems={cart.map((item) => ({ ...item, quantity: 1 }))} onClose={() => setCartOpen(false)} onCheckout={checkout} />
      
      
      <N8NChat />

    </div>
  );
}

export default App;
