"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import GlobalApi from "../_utils/GlobalApi";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_context/AuthContext";

// Define the CartItem type
type CartItem = {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  documentId: string | number;
};

// Custom hook for fetching and managing user cart data
const useUserCart = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = useCallback(async () => {
    if (!user?.id) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const cartItems = await GlobalApi.getUserCartItems();
      console.log("Fetched cart items:", cartItems);

      setItems(cartItems);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void fetchCartItems();
  }, [fetchCartItems]);

  return { items, setItems, loading, refetch: fetchCartItems };
};

export default function CartPage() {
  const { items, setItems, loading, refetch } = useUserCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    setJwt(sessionStorage.getItem("authToken"));
  }, []);

  const [subTotal, setSubTotal] = useState(0);

  useEffect(() => {
    const total = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    setSubTotal(total);
  }, [items]);

  const removeItem = async (documentId: string | number) => {
    if (!user) {
      toast.error("Please sign in to manage your cart.");
      router.push("/sign-in");
      return;
    }

    setLoadingAction(true);

    const originalItems = [...items];
    setItems(items.filter((item) => item.documentId !== documentId));

    try {
      await GlobalApi.deleteCartItem(String(documentId));
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Failed to remove item from cart");
      setItems(originalItems);
    } finally {
      setLoadingAction(false);
    }
  };

  const clearCart = async () => {
    if (!user) {
      toast.error("Please sign in to manage your cart.");
      router.push("/sign-in");
      return;
    }

    try {
      await GlobalApi.clearUserCart();
      refetch(); // Refetch cart items after clearing
    } catch (error) {
      console.error("Failed to clear cart:", error);
      toast.error("Failed to clear cart");
    }
  };

  if (loading || authLoading) {
    return (
      <div className="w-full flex flex-col min-h-screen">
        <Navigation />
        <div className="grow flex items-center justify-center gap-2">
          <p>Loading your cart</p>
          <Loader2 className="animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full flex flex-col min-h-screen">
        <Navigation />
        <div className="grow flex flex-col items-center justify-center gap-4">
          <p className="text-lg font-semibold text-center">
            Please sign in to view and manage your cart.
          </p>
          <Button onClick={() => router.push("/sign-in")}>Sign In</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <Navigation />
      <div className="mx-auto p-6 w-full max-w-3xl lg:max-w-5xl mt-24 mb-10 min-h-screen">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-center">
          My Cart
        </h1>
        {items.length === 0 ? (
          <p className="text-base">Your cart is empty.</p>
        ) : (
          <>
            <div className="hidden md:block">
              <div className="overflow-x-auto rounded border border-slate-200 shadow-sm">
                <Table>
                  <TableCaption className="text-sm my-2">
                    Quality Guaranteed
                  </TableCaption>
                  <TableHeader className="text-xs sm:text-sm">
                    <TableRow>
                      <TableHead className="w-[150px]">Product</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-white text-sm">
                    {items.map((item) => (
                      <TableRow key={String(item.id)}>
                        <TableCell>
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={100}
                            height={100}
                            className="object-contain rounded w-16 h-16"
                          />
                        </TableCell>
                        <TableCell className="font-semibold  text-base">
                          {item.name}
                        </TableCell>
                        <TableCell>
                          <span className="text-base">{item.quantity}</span>
                        </TableCell>
                        <TableCell className="text-base">
                          ${item.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="font-semibold text-base">
                          ${(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            disabled={loadingAction}
                            className=""
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.documentId)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-lg font-bold text-slate-900"
                      >
                        Grand Total
                      </TableCell>
                      <TableCell className="text-xl font-bold">
                        ${subTotal.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            onClick={clearCart}
                            variant={"outline"}
                            className="hover:bg-white  hover:text-black"
                          >
                            Clear Cart
                          </Button>
                          <Button
                            onClick={() =>
                              router.push(user ? "/checkout" : "/sign-in")
                            }
                            className="bg-yellow-700 hover:bg-yellow-800"
                          >
                            Checkout
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </div>
            {/* Mobile view */}
            <div className="flex flex-col gap-4 md:hidden">
              {items.map((item) => (
                <div
                  key={String(item.id)}
                  className="bg-white shadow rounded-lg p-4 flex gap-4 text-sm"
                >
                  <div className="flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="object-contain rounded w-20 h-20"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between gap-2">
                    <div>
                      <p className="font-semibold text-base">{item.name}</p>
                      <p className="text-slate-500 text-xs sm:text-sm">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-slate-600 text-xs sm:text-sm">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm sm:text-base">
                      <span className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <Button
                        disabled={loadingAction}
                        variant="ghost"
                        size="sm"
                        className="mx-2 border!"
                        onClick={() => removeItem(item.documentId)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between text-base font-semibold">
                  <span>Grand Total</span>
                  <span>${subTotal.toFixed(2)}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={clearCart}
                    variant={"outline"}
                    className="hover:bg-white hover:text-black"
                  >
                    Clear Cart
                  </Button>
                  <Button
                    onClick={() => router.push(user ? "/checkout" : "/sign-in")}
                    className="bg-yellow-700 hover:bg-yellow-800"
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
