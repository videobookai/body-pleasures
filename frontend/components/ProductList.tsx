import React from 'react'
import ProductItem from './ProductItem';

interface ProductListProps {
    productList: any[];
}

const ProductList = ({productList}: ProductListProps) => {
   
  return (
    <div className='my-5 flex flex-col justify-center w-full lg:mx-auto bg-secondary/30 px-2 md:px-4 py-4 rounded-lg'>
       
        <div className="grid grid-cols-2 md:grid-cols-3 
        lg:grid-cols-4
        gap-2 md:gap-4 lg:gap-8 mx-auto w-full lg:max-w-7xl">
            {productList.map((product, index) => (
                <ProductItem product={product} key={product.id || index} />
            ))}
        </div>
    
    </div>
  )
}

export default ProductList