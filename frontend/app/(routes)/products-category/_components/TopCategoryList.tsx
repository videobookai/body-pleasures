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
  const decodeCategoryName = (name: string) => {
    try {
      return decodeURIComponent(name)
    } catch {
      return name
    }
  }

  const toTitleCase = (value: string) =>
    value
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')

  return (
     <div className="mx-6 md:mx-15 mt-2 overflow-x-auto gap-4 my-4 lg:gap-10 justify-start flex items-center pl-6 lg:mx-20">
      {categoryList?.map((category, index) => {
        const decodedName = decodeCategoryName(category.name)
        const displayName = toTitleCase(decodedName)
        const categoryParam = encodeURIComponent(decodedName)

        return (
        <Link href={`/products-category/${categoryParam}`} key={category.id ?? index}>
           <div className="mb-3 p-1 border rounded-lg gap-2 w-[250px] min-w-[200px] shadow-sm hover:shadow-md cursor-pointer bg-secondary ">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}${category.icon?.[0]?.url ?? ''}`}
              width={300}
              height={280}
              alt={displayName || 'category-image'}
              className="w-full h-[280px] lg:h-[300px] object-cover rounded-lg transition-transform duration-500 hover:scale-95"
            />
            <h3 className="text-xl font-serif font-semibold my-2 text-center">{displayName}</h3>
          </div>
        </Link>
      )})}
    </div>
  )
}

export default TopCategoryList
