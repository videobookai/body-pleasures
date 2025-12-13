import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'
import React from 'react'


const ProductCategory = ({params}: {params: {categoryName: string}}) => {
  return (
    <div className='mt-24 flex flex-col'>
            <Navigation />
            <Footer/>
    </div>
  )
}

export default ProductCategory