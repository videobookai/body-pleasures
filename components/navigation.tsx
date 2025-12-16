"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/components/CartContext";
import GlobalApi from "@/app/_utils/GlobalApi";
import Link from "next/link";
import { UserDropdown } from "./user-dropdown";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryList, setCategoryList] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const { totalItems } = useCart();

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = () => {
    GlobalApi.getCategory().then((resp) => {
      setCategoryList(resp.data.data);
      console.log("getCategoryList response:", resp.data.data);
      console.log("categoryList state:", categoryList);
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md border-b border-border ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="shrink-0">
            {" "}
            <Link href={"/"}>
              <h1 className="text-xl font-serif font-semibold text-foreground">
                {"Ms V's Body Pleasures"}
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 justify-center">
            <a
              href="#shop"
              className="text-lg text-gray-600 hover:text-black transition-colors font-bold"
            >
              Shop
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-lg text-gray-600 
                  hover:bg-white
                  hover:text-black transition-colors font-bold"
                >
                  Collections
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40 z-60">
                {categoryList.length === 0 && (
                  <DropdownMenuItem asChild>
                    <div className="px-2 py-1 text-sm text-muted-foreground">
                      No categories
                    </div>
                  </DropdownMenuItem>
                )}
                {categoryList.map((category, index) => (
                  <Link
                    href={`/products-category/${category.name}`}
                    key={category.id}
                  >
                    <DropdownMenuItem key={index} className="cursor-pointer">
                      <span className="text-sm capitalize">
                        {category?.name}
                      </span>
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <a
              href="#about"
              className="text-lg text-gray-600 hover:text-black transition-colors font-bold"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-lg text-gray-600 hover:text-black transition-colors font-bold"
            >
              Contact
            </a>
            <div className="flex gap-2 mx-1 items-center justify-center">
                 <Link href="/cart" className="relative">
              <Button size="sm" variant="ghost">
                <ShoppingBag className="h-4 w-4" />
              </Button>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            <UserDropdown/>
            </div>
           
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a
              href="#shop"
              className="block text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              Shop
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="text-lg text-gray-600 hover:text-black transition-colors font-bold"
                >
                  Collections
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40 z-60">
                {categoryList.length === 0 && (
                  <DropdownMenuItem asChild>
                    <div className="px-2 py-1 text-sm text-muted-foreground">
                      No categories
                    </div>
                  </DropdownMenuItem>
                )}
                {categoryList.map((category, index) => (
                  <Link
                    href={`/products-category/${category.name}`}
                    key={category.id}
                  >
                    <DropdownMenuItem key={index} className="cursor-pointer">
                      <span className="text-sm capitalize">
                        {category?.name}
                      </span>
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <a
              href="#about"
              className="block text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              About
            </a>
            <a
              href="#contact"
              className="block text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              Contact
            </a>
            <UserDropdown/>
          </div>
        )}
      </div>
    </nav>
  );
}
