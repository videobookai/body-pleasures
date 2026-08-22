"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

interface Category {
  id?: string | number;
  name: string;
  icon?: { url: string }[];
  subcategories?: Category[];
}

interface CategoryListProps {
  categoryList: Category[];
  title?: string;
}

const CategoryList = ({
  categoryList,
  title = "Shop by Collections",
}: CategoryListProps) => {
  const [openId, setOpenId] = useState<string | number | null>(null);

  const toggleOpen = (id: string | number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const subcategoryNames = new Set<string>();
  categoryList.forEach((cat) => {
    cat.subcategories?.forEach((sub) => {
      subcategoryNames.add(sub.name);
    });
  });

  const parentCategories = categoryList.filter(
    (cat) => !subcategoryNames.has(cat.name)
  );

  return (
    <div className="my-3 max-w-4xl md:max-w-4xl lg:max-w-7xl flex flex-col justify-center w-full mx-3 lg:mx-auto">
      <h2 className="text-xl font-bold md:text-3xl text-primary mb-4 ml-4 lg:ml-0 md:ml-6 font-serif">
        {title}
      </h2>

      <div className="mx-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 my-4 lg:gap-5 justify-center lg:mx-auto">
        {parentCategories.map((category, index) => {
          const id = category.id ?? index;
          const hasSubcategories = !!category.subcategories?.length;
          const isOpen = openId === id;

          const cardContent = (
            <div className="mb-3 h-full p-1 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-white flex flex-col relative">
              <Image
                src={category.icon?.[0]?.url || "/placeholder.svg"}
                width={800}
                height={800}
                alt={category.name}
                className="w-full h-32 md:h-70 lg:h-80 object-contain rounded-lg hover:scale-95 hover:transition-all hover:duration-500"
              />
              <div className="flex flex-1 items-center justify-center gap-1 px-1 text-center my-2 min-h-10 md:min-h-14">
                <h3 className="text-sm md:text-lg font-semibold capitalize text-primary">
                  {category.name}
                </h3>
                {hasSubcategories && (
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-primary transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
              </div>
            </div>
          );

          return (
            <div key={id} className="flex flex-col">
              {hasSubcategories ? (
                <button
                  type="button"
                  onClick={() => toggleOpen(id)}
                  aria-expanded={isOpen}
                  className="block h-full text-left cursor-pointer"
                >
                  {cardContent}
                </button>
              ) : (
                <Link
                  href={`/products-category/${encodeURIComponent(category.name)}`}
                  className="block h-full cursor-pointer"
                >
                  {cardContent}
                </Link>
              )}

              {hasSubcategories && (
                <div
                  className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col gap-1 border rounded-lg bg-secondary/30 p-2">
                      {category.subcategories!.map((sub, subIndex) => (
                        <Link
                          key={sub.id ?? subIndex}
                          href={`/products-category/${encodeURIComponent(
                            category.name
                          )}/${encodeURIComponent(sub.name)}`}
                          className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-secondary transition-colors duration-200"
                        >
                          <Image
                            src={sub.icon?.[0]?.url || "/placeholder.svg"}
                            width={40}
                            height={40}
                            alt={sub.name}
                            className="w-8 h-8 object-contain rounded shrink-0"
                          />
                          <span className="text-xs md:text-sm capitalize text-primary truncate">
                            {sub.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList;