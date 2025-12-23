import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Category {
  id?: string | number
  name: string
  icon?: { url?: string }[]
}

interface TopCategoryListProps {
  categoryList?: Category[]
}

const TopCategoryList: React.FC<TopCategoryListProps> = ({ categoryList = [] }) => {
  return (
     <div className="mx-6 md:mx-15 mt-2 overflow-x-auto gap-4 my-4 lg:gap-10 justify-start flex items-center pl-6 lg:mx-20">
      {categoryList?.map((category, index) => (
        <Link href={`/products-category/${category.name}`} key={category.id ?? index}>
           <div className="mb-3 p-1 border rounded-lg gap-2 w-[250px] min-w-[200px] shadow-sm hover:shadow-md cursor-pointer bg-secondary ">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}${category.icon?.[0]?.url ?? ''}`}
              width={300}
              height={280}
              alt={category.name ?? 'category-image'}
              className="w-full h-[280px] lg:h-[300px] object-cover rounded-lg transition-transform duration-500 hover:scale-95"
            />
            <h3 className="text-xl font-semibold my-2 capitalize text-center">{category.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default TopCategoryList