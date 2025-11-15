export type Product = {
    id: number;
    name: string;
    category: string;
    price: number;
    emoji: string;
    badge?: string;
  };
  
  export const products: Product[] = [
    { id: 1, name: 'Lavender Dreams Soap', category: 'soaps', price: 12.99, emoji: '🧼', badge: 'Bestseller' },
    { id: 2, name: 'Rose Petal Body Cream', category: 'creams', price: 24.99, emoji: '🌹', badge: 'New' },
    { id: 3, name: 'Eucalyptus Mint Candle', category: 'candles', price: 32.99, emoji: '🕯️' },
    { id: 4, name: 'Cedarwood Beard Oil', category: 'beard', price: 18.99, emoji: '🧔' },
    { id: 5, name: 'Muscle Relief Balm', category: 'relief', price: 22.99, emoji: '💆', badge: 'Popular' },
    { id: 6, name: 'Vanilla Amber Body Spray', category: 'sprays', price: 16.99, emoji: '✨' },
    { id: 7, name: 'Honey Oat Soap Bar', category: 'soaps', price: 11.99, emoji: '🍯' },
    { id: 8, name: 'Shea Butter Body Cream', category: 'creams', price: 26.99, emoji: '🥥', badge: 'Bestseller' },
    { id: 9, name: 'Sandalwood Concrete Candle', category: 'candles', price: 34.99, emoji: '🌲', badge: 'New' },
    { id: 10, name: 'Beard Grooming Kit', category: 'beard', price: 45.99, emoji: '💈' },
    { id: 11, name: 'Arnica Relief Cream', category: 'relief', price: 28.99, emoji: '🌿' },
    { id: 12, name: 'Jasmine Body Oil', category: 'sprays', price: 19.99, emoji: '🌸', badge: 'Popular' }
  ];
  