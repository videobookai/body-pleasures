import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CategoryListProps {
  categoryList: any[];
  title?: string;
}

const CategoryList = ({ categoryList, title = "Shop by Collections" }: CategoryListProps) => {
  return (
    <div className="my-5 max-w-4xl md:max-w-4xl lg:max-w-7xl flex flex-col justify-center w-full mx-3 lg:mx-auto">
      <h2 className="text-xl font-bold md:text-3xl  text-primary mb-4 ml-4 lg:ml-0 md:ml-6 font-serif">
        {title}
      </h2>
      
      
      <div className="mx-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4 lg:gap-8 justify-center lg:mx-auto">
        {categoryList.map((category, index) => (
          <Link
            href={`/products-category/${encodeURIComponent(category.name)}`}
            key={category.id ?? index}
            className="block h-full"
          >
          <div
            className="mb-3 h-full p-1 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer bg-white flex flex-col"
          >
            <Image
              src={ category.icon?.[0]?.url}
              width={800}
              height={800}
              alt="category-image"
              className="w-full h-32 md:h-70 lg:h-80 object-cover rounded-lg hover:scale-95 hover:transition-all hover:duration-500"
            />
            <h3 className="flex flex-1 items-center justify-center px-1 text-center text-sm md:text-lg font-semibold my-2 capitalize text-primary min-h-10 md:min-h-14">
              {category.name}
            </h3>
          </div>
          </Link>
        ))}
      </div>
      
    </div>
  );
};

export default CategoryList;
