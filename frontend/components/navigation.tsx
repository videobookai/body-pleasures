"use client";

import { useContext, useEffect, useState } from "react";


import { Menu, X, ShoppingBag, User, ArrowDown, ChevronDown} from "lucide-react";


import Link from "next/link";
import { UserDropdown } from "./user-dropdown";
import { UpdateCartContext } from "../app/_context/UpdateCartContext";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import GlobalApi from "../app/_utils/GlobalApi";
import { useAuth } from "@/app/_context/AuthContext";


export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryList, setCategoryList] = useState<
    Array<{ id: number; name: string }>
  >([]);


  
  const [totalCartItems, setTotalCartItems] = useState(0);
  const {updateCart, setUpdateCart} = useContext<any>(UpdateCartContext);

const [cartItemList, setCartItemList] = useState<any>([]);
const { user } = useAuth();

useEffect(() => {
  if (user) {
    getCartItems();
  } else {
    setTotalCartItems(0);
    setCartItemList([]);
  }
}, [updateCart, user]);

  useEffect(() => {
    getCategoryList();
  }, []);




  const getCategoryList = () => {
    GlobalApi.getCategory()
      .then((resp) => {
        setCategoryList(resp.data.data);
      })
      .catch((err) => {
        console.error(
          "[Navigation] getCategoryList error:",
          err?.message,
          err?.response?.status,
          err?.response?.data
        );
        setCategoryList([]);
      });
  };

  const getCartItems = async () => {
    if (!user?.id) {
      setTotalCartItems(0);
      setCartItemList([]);
      return;
    }

    try {
      const cartItemList_ = await GlobalApi.getUserCartItems();

      setTotalCartItems(cartItemList_?.length ?? 0);
      setCartItemList(cartItemList_);
    } catch (error) {
      console.error("getCartItems error:", error);
    }
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
          <div className="hidden md:flex items-center gap-8 justify-center font-serif">
            <a
              href="/shop"
              className="text-lg text-gray-600 hover:text-black transition-colors font-bold"
            >
              Shop
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <Button
                  variant="ghost"
                  className="text-lg text-gray-600 
                  hover:bg-white
                  hover:text-black transition-colors font-bold flex items-center gap-1"
                >
                  Collections <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40 z-60 overflow-y-auto h-60">
                {categoryList.length === 0 && (
                  <DropdownMenuItem asChild>
                    <div className="px-2 py-1 text-sm text-muted-foreground">
                      No categories
                    </div>
                  </DropdownMenuItem>
                )}
                {categoryList.map((category) => (
                  <DropdownMenuItem asChild key={category.id} className="cursor-pointer">
                    <Link href={`/products-category/${category.name}`}>
                      <span className="text-sm capitalize">
                        {category?.name}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <a
              href="/about"
              className="text-lg text-gray-600 hover:text-black transition-colors font-bold"
            >
              About
            </a>
            <a
              href="/contact-us"
              className="text-lg text-gray-600 hover:text-black transition-colors font-bold"
            >
              Contact
            </a>
            <div className="flex gap-2 mx-1 items-center justify-center">
                 <Link href="/cart" className="relative">
              <Button size="sm" variant="ghost">
                <ShoppingBag className="h-4 w-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
              </Button>
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {totalCartItems}
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
          <div className="md:hidden py-4 space-y-4 flex flex-col items-start justify-center">
            <a
              href="/shop"
              className="block text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              Shop
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="px-0! py-0! text-left text-sm text-gray-600 font-bold underline flex items-center gap-1"
                >
                  Collections
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40 z-60 h-52 overflow-y-auto">
                {categoryList.length === 0 && (
                  <DropdownMenuItem asChild>
                    <div className="px-2 py-1 text-sm text-muted-foreground">
                      No categories
                    </div>
                  </DropdownMenuItem>
                )}
                {categoryList.map((category) => (
                  <DropdownMenuItem asChild key={category.id} className="cursor-pointer">
                    <Link href={`/products-category/${category.name}`}>
                      <span className="text-sm capitalize">
                        {category?.name}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <a
              href="/about"
              className="block text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              About
            </a>
            <a
              href="/contact-us"
              className="block text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              Contact
            </a>
            <div className="flex gap-2 items-start flex-col justify-center">
                 <Link href="/cart" className="relative">
              <Button size="sm" variant="ghost" className="m-0! px-0! py-0!">
                <ShoppingBag className="h-4 w-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
              </Button>
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-3 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {totalCartItems}
                </span>
              )}
            </Link>
            <span className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors">
                
                <UserDropdown/>
            </span>

           
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
