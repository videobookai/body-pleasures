"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import React, { useState } from "react";

interface Category {
  id?: string | number;
  name: string;
  icon?: { url: string }[];
  subcategories?: Category[];
  parentCategory?: Category | null;
}

interface CategoryListProps {
  categoryList: Category[];
  title?: string;
}

// Helper to convert relative Strapi image URLs to absolute ones
const getImageUrl = (url?: string) => {
  if (!url) return "/placeholder.svg";
  if (url.startsWith("http")) return url;
  
  // Try to use the environment variable, otherwise fallback to localhost
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:1337";
  return `${baseUrl}${url}`;
};

const CategoryList = ({
  categoryList,
  title = "Shop by Category",
}: CategoryListProps) => {
  const [openId, setOpenId] = useState<string | number | null>(null);

  const toggleOpen = (id: string | number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  // Only render categories that do NOT have a parent (i.e. they are main categories)
  const parentCategories = categoryList
    .filter((cat) => !cat.parentCategory)
    .sort((a, b) => a.name.localeCompare(b.name));

  const activeIndex = parentCategories.findIndex(
    (cat, index) => (cat.id ?? index) === openId
  );
  
  const activeCategory = activeIndex >= 0 ? parentCategories[activeIndex] : null;

  // Calculates the CSS order needed to push the panel exactly to the end of the row
  const getPanelOrder = (index: number, cols: number) => {
    const rowEndIndex = Math.floor(index / cols) * cols + cols - 1;
    // Each standard item gets an order of (i * 10). 
    // We place the panel at (rowEnd * 10) + 5 so it appears exactly after the current row.
    return rowEndIndex * 10 + 5;
  };

  // Reusable subcategory panel to render per breakpoint
  const SubcategoryPanel = ({ cols, displayClass }: { cols: number, displayClass: string }) => {
    if (!activeCategory || !activeCategory.subcategories?.length) return null;
    
    const order = getPanelOrder(activeIndex, cols);
    
    return (
      <div
        className={`col-span-full w-full ${displayClass} overflow-hidden`}
        style={{ order }}
      >
        <div className="bg-gray-50/80 rounded-2xl p-2 md:p-4 border border-gray-100 my-4 shadow-inner animate-in slide-in-from-top-4 fade-in duration-300 relative">
          
          {/* Subtle pointer to the row above */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-50/80 border-t border-l border-gray-100 rotate-45 hidden md:block" />

          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 relative">
            {[...activeCategory.subcategories]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((sub, subIndex) => (
              <Link
                key={sub.id ?? subIndex}
                href={`/products-category/${encodeURIComponent(
                  activeCategory.name
                )}/${encodeURIComponent(sub.name)}`}
                className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all duration-300"
              >
                <div className="relative aspect-square overflow-hidden bg-white">
                  <Image
                    src={getImageUrl(sub.icon?.[0]?.url)}
                    alt={sub.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                    className="object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-3 text-center">
                  <span className="text-sm md:text-lg font-bold capitalize text-primary group-hover:text-primary transition-colors">
                    {sub.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          
        </div>
      </div>
    );
  };

  return (
    <div className="my-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col">
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 font-serif">
        {title}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {parentCategories.map((category, index) => {
          const id = category.id ?? index;
          const hasSubcategories = !!category.subcategories?.length;
          const isOpen = openId === id;

          const cardContent = (
            <div
              className={`group relative h-full flex flex-col overflow-hidden rounded-2xl bg-white border transition-all duration-300 ${
                isOpen
                  ? "ring-2 ring-primary border-primary/50 shadow-lg"
                  : "border-gray-200 hover:border-primary/50 hover:shadow-lg"
              }`}
            >
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <Image
                  src={getImageUrl(category.icon?.[0]?.url)}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 items-center justify-between p-4">
                <h3 className="font-semibold text-sm md:text-base capitalize text-primary line-clamp-1">
                  {category.name}
                </h3>
                {hasSubcategories && (
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-primary" : "group-hover:text-primary"
                    }`}
                  />
                )}
              </div>
              {/* Highlight bar for active state */}
              {isOpen && (
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-primary rounded-b-2xl animate-in fade-in" />
              )}
            </div>
          );

          return (
            <div 
              key={id} 
              className="flex flex-col h-full"
              style={{ order: index * 10 }} // Each standard grid item is spaced by 10
            >
              {hasSubcategories ? (
                <button
                  type="button"
                  onClick={() => toggleOpen(id)}
                  aria-expanded={isOpen}
                  className="text-left cursor-pointer focus:outline-none h-full"
                >
                  {cardContent}
                </button>
              ) : (
                <Link
                  href={`/products-category/${encodeURIComponent(category.name)}`}
                  className="focus:outline-none block h-full"
                >
                  {cardContent}
                </Link>
              )}
            </div>
          );
        })}

        {/* 
          We render the panel multiple times but use Tailwind's breakpoint display classes 
          (block vs hidden) so only ONE panel is visible at a time. 
          This is a completely SSR-compatible way to inject a full-width row into a 
          responsive CSS grid without relying on JS window resize listeners!
        */}
        {activeCategory && (
          <>
            <SubcategoryPanel cols={2} displayClass="block md:hidden" />
            <SubcategoryPanel cols={3} displayClass="hidden md:block lg:hidden" />
            <SubcategoryPanel cols={4} displayClass="hidden lg:block xl:hidden" />
            <SubcategoryPanel cols={5} displayClass="hidden xl:block" />
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
