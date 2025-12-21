"use client";
import React, { useEffect, useState } from "react";
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
import { set } from "date-fns";
import { toast } from "sonner";

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
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(sessionStorage.getItem("user") as string);
      const jwt = sessionStorage.getItem("authToken");

      if (!user || !jwt) {
        console.log("User or JWT not found. Aborting fetch.");
        setLoading(false);
        return;
      }

      const cartItems = await GlobalApi.getUserCartItems(user.id, jwt);
      console.log("Fetched cart items:", cartItems);

      setItems(cartItems);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return { items, setItems, loading, refetch: fetchCartItems };
};

export default function CartPage() {
  const { items, setItems, loading, refetch } = useUserCart();

  const [loadingAction, setLoadingAction] = useState(false);

  const [subTotal, setSubTotal] = useState(0);

  useEffect(() => {
    const total = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setSubTotal(total);
  }, [items]);

  const removeItem = async (documentId: string | number) => {
    setLoadingAction(true);
    const jwt = sessionStorage.getItem("authToken");
    if (!jwt) {
      setLoadingAction(false);
      return;
    }

    // Keep a copy of the original items in case we need to revert
    const originalItems = [...items];

    // Optimistically update the UI by removing the item
    setItems(items.filter((item) => item.documentId !== documentId));

    try {
      // Make the API call to delete the item from the backend
      await GlobalApi.deleteCartItem(String(documentId), jwt);
      toast.success("Item removed from cart");
      
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Failed to remove item from cart");
      // If the API call fails, revert the UI to the original state
      setItems(originalItems);
    } finally {
      setLoadingAction(false);
    }
  };

  const clearCart = async () => {
    const jwt = sessionStorage.getItem("authToken");
    if (!jwt) return;

    try {
      await Promise.all(
        items.map((item) =>
          GlobalApi.deleteCartItem(String(item.documentId), jwt)
        )
      );
      refetch(); // Refetch cart items after clearing
    } catch (error) {
      console.error("Failed to clear cart:", error);
      toast.error("Failed to clear cart");
    }
  };

  if (loading) {
    return (
      <div className="w-full flex flex-col min-h-screen">
        <Navigation />
        <div className="flex-grow flex items-center justify-center gap-2">
          <p>Loading your cart</p>
          <Loader2 className="animate-spin" />
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
          <p>Your cart is empty.</p>
        ) : (
          <Table>
            <TableCaption>Quality Guaranteed</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Product</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {items.map((item) => (
                <TableRow key={String(item.id)}>
                  <TableCell>
                    <Image
                      src={
                        process.env?.NEXT_PUBLIC_BASE_URL! + item.image ||
                        "/placeholder.svg"
                      }
                      alt={item.name}
                      width={100}
                      height={100}
                      className="object-cover rounded w-10 h-10 md:w-16 md:h-16"
                    />
                  </TableCell>
                  <TableCell className="font-bold">{item.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{item.quantity}</span>
                    </div>
                  </TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell className="font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      disabled={loadingAction}
                      variant="ghost"
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
                <TableCell colSpan={4} className="text-lg font-bold">
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
                      className="hover:bg-white hover:text-black"
                    >
                      Clear Cart
                    </Button>
                    <Button className="bg-yellow-700 hover:bg-yellow-800">
                      Checkout
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </div>
      <Footer />
    </div>
  );
}
