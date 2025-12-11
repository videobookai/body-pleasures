import Image from 'next/image';
import React from 'react'

interface CategoryListProps {
        categoryList: any[];
}

const CategoryList = ({categoryList}: CategoryListProps) => {

   
  return (
    <div className="my-5 max-w-4xl md:max-w-4xl lg:max-w-7xl flex flex-col justify-center w-full mx-3 lg:mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-4 ml-4 lg:ml-0 md:ml-6"> Shop by Collections</h2>
        <div className='mx-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4 lg:gap-8 justify-center lg:mx-auto'>
{categoryList.map((category, index) => (
    <div key={category.id || index} className="mb-3 p-1 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer bg-secondary">
        
        <Image src={process.env.NEXT_PUBLIC_BASE_URL + category.icon?.[0]?.url} width={1000} height={800} alt='category-image' className='w-[300px] h-[280px] lg:w-[500px] lg:h-[400px] object-cover rounded-lg hover:scale-95 hover:transition-all hover:duration-500'/>
        <h3 className="text-xl font-semibold my-2 capitalize text-center">{category.name}</h3>
       
    </div>
))}
        </div>

    </div>
  )
}

export default CategoryList