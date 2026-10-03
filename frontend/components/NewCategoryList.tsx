"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Maximize2 } from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

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
  // Only render categories that do NOT have a parent (i.e. they are main categories)
  const parentCategories = categoryList
    .filter((cat) => !cat.parentCategory)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="my-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col">
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 font-serif">
        {title}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {parentCategories.map((category, index) => {
          const id = category.id ?? index;
          const hasSubcategories = !!category.subcategories?.length;

          const cardContent = (
            <div
              className="group relative h-full flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-200 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
            >
                 {hasSubcategories && (
                <div className="absolute top-2 right-2 z-10 flex items-center justify-center m-1 transition-transform duration-300 group-hover:translate-x-1">
                     <Maximize2
                    aria-hidden="true"
                    className="w-5 h-5 shrink-0 text-gray-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary"
                  />
                </div>
                 
                )}
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <Image
                  src={getImageUrl(category.icon?.[0]?.url)}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 items-center text-center justify-center p-4">
                <h3 className="font-semibold text-sm md:text-base capitalize text-primary line-clamp-1">
                  {category.name}
                </h3>
             
              </div>
            </div>
          );

          return (
            <div key={id} className="flex h-full flex-col">
              {hasSubcategories ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="h-full w-full cursor-pointer rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      {cardContent}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-primary text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                        {category.name}
                      </DialogTitle>
                      <DialogDescription>
                        Subcategories
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-5">
                      {[...(category.subcategories ?? [])]
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((sub, subIndex) => (
                          <Link
                            key={sub.id ?? subIndex}
                            href={`/products-category/${encodeURIComponent(
                              category.name
                            )}/${encodeURIComponent(sub.name)}`}
                            className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
                              <span className="text-sm font-bold capitalize text-primary transition-colors md:text-base">
                                {sub.name}
                              </span>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <Link
                  href={`/products-category/${encodeURIComponent(category.name)}`}
                  className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {cardContent}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList;
