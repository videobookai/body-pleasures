import React from 'react'

interface ProductListProps {
    productList: any[];
}

const ProductList = ({productList}: ProductListProps) => {
  return (
    <div>
        <h2 className='font-bold text-primary text-2xl'>
            Our Popular Products
        </h2>
    
    </div>
  )
}

export default ProductList