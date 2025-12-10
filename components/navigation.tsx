"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ShoppingBag } from "lucide-react";
import GlobalApi from "@/app/_utils/GlobalApi";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryList, setCategoryList] = useState<
    Array<{ id:number ; name: string }>
  >([]);

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
            <h1 className="text-xl font-serif font-semibold text-foreground">
              {"Ms V's Body Pleasures"}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#shop"
              className="text-lg text-gray-600 hover:text-black transition-colors font-bold"
            >
              Shop
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-lg text-gray-600 hover:text-black transition-colors font-bold">
                  Collections
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40 z-60">
                {categoryList.length === 0 && (
                  <DropdownMenuItem asChild>
                    <div className="px-2 py-1 text-sm text-muted-foreground">No categories</div>
                  </DropdownMenuItem>
                )}
                {categoryList.map((category, index) => (
                  <DropdownMenuItem key={index} className="cursor-pointer">
                    <span className="text-sm capitalize">{category?.name}</span>
                  </DropdownMenuItem>
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
            <Button size="sm" variant="ghost">
              <ShoppingBag className="h-4 w-4" />
            </Button>
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
                <button className="text-lg text-gray-600 hover:text-black transition-colors font-bold">
                  Collections
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40 z-60">
                {categoryList.length === 0 && (
                  <DropdownMenuItem asChild>
                    <div className="px-2 py-1 text-sm text-muted-foreground">No categories</div>
                  </DropdownMenuItem>
                )}
               {categoryList.map((category, index) => (
  <DropdownMenuItem key={index} className="cursor-pointer">
    <span className="text-sm">{category.name}</span>
  </DropdownMenuItem>
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
          </div>
        )}
      </div>
    </nav>
  );
}
