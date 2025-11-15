import React from 'react';
import { Product } from '../data/products';
import ProductCard from './ProductCard';

type Props = {
  products: Product[];
  onAdd: (id: number) => void;
};

export default function ProductGrid({ products, onAdd }: Props) {
  return (
    <div className="product-grid">
      {products.map(p => <ProductCard key={p.id} product={p} onAdd={onAdd} />)}
    </div>
  );
  
}
