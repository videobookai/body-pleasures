import React from 'react'
import ProductItem from './ProductItem';

interface ProductListProps {
    productList: any[];
}

const ProductList = ({productList}: ProductListProps) => {
    console.log("Product List:", productList);
  return (
    <div className='my-5 flex flex-col justify-center w-full lg:mx-auto bg-secondary/30 px-4 py-6'>
        <h2 className='text-2xl font-bold text-primary mb-4 ml-4 lg:ml-72 md:ml-6'>
            Our Popular Products
        </h2>
        <div className="mx-6 grid grid-cols-1 md:grid-cols-2 
        lg:grid-cols-3
        gap-4 my-4 lg:gap-8 justify-center lg:mx-auto w-full md:max-w-4xl lg:max-w-7xl">
            {productList.map((product, index) => (
                <ProductItem product={product} key={product.id || index} />
            ))}
        </div>
    
    </div>
  )
}

export default ProductList