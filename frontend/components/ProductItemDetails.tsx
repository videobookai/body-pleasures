"use client";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { Button } from "./ui/button";

import { toast } from "sonner";
import { Loader2, ShoppingBasket } from "lucide-react";
import { useRouter } from "next/navigation";


import GlobalApi from "../app/_utils/GlobalApi";
import { UpdateCartContext } from "../app/_context/UpdateCartContext";
import { useAuth } from "@/app/_context/AuthContext";

interface ProductItemDetailsProps {
  product: any;
}
const ProductItemDetails = ({ product }: ProductItemDetailsProps) => {
  const imageUrl = product.images?.[0]?.url;
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { updateCart, setUpdateCart } = useContext<any>(UpdateCartContext);

  const [productTotalPrice, setProductTotalPrice] = useState(
    product.sellingPrice ? product.sellingPrice : product.mrp
  );
  const [quantity, setQuantity] = useState(1);

  const notifyCartAddedEmail = async () => {
    if (!user?.email) return;

    try {
      await fetch("/api/email/cart-added", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user.email,
          payload: {
            customerName: user.username || user.name || "Customer",
            productName: product.name,
            quantity,
            unitPrice: Number(productTotalPrice),
            lineTotal: Number((quantity * productTotalPrice).toFixed(2)),
            addedAt: new Date().toISOString(),
          },
        }),
      });
    } catch (error) {
      console.error("Cart email notification failed", error);
    }
  };
 
  const addToCart = () => {
    setLoading(true);
    if (!user) {
      setLoading(false);
      toast.error("Please sign in to add items to your cart");
      router.push("/sign-in");

      return;
    }

    const data = {
      quantity,
      amount: (quantity * productTotalPrice).toFixed(2),
      products: product.id,
    };

    GlobalApi.addToCart(data)
      .then((resp) => {
        console.log("Add to cart response:", resp);
        toast.success(`${quantity} x ${product.name} added to cart`);
        void notifyCartAddedEmail();
        setUpdateCart(!updateCart);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to add item to cart");
        console.error("Add to cart error:", err);
        setLoading(false);
      });
  };

  return (
    <div className="grid grid-cols-1  gap-2 md:gap-4 md:grid-cols-2 p-4 md:p-7 text-primary ">
      <Image
        src={imageUrl}
        alt={product.name || "product-image"}
        width={300}
        height={300}
        className="bg-secondary/10 object-contain md:object-fill rounded-lg h-38 md:h-96 w-full"
      />
      <div className="flex flex-col gap-2 justify-start overflow-y-auto px-1 md:px-4 ">
        <div className="h-30 md:h-full overflow-y-auto my-2">
        <h2 className="text-xl md:text-3xl lg:text-4xl font-bold font-serif">{product.name}</h2>
        <h2 className="text-black/50 
        text-xs
        md:text-sm
         ">
          {product.description}
        </h2>
        </div>
        

        <div className="flex flex-row gap-2 items-center my-2">
          <p className="text-sm md:text-lg font-bold text-primary ">
         Price:   ${product.sellingPrice}
          </p>
          <p>
            {product.mrp && (
              <span className="text-xs md:text-lg text-muted-foreground line-through mr-2">
                ${product.mrp}
              </span>
            )}
          </p>
        </div>

        <h2 className="font-medium md:text-lg text-sm text-left">
          Type: {product.type || "N/A"}
        </h2>

        <div className="flex flex-col items-baseline gap-3">
          <div className="flex border gap-10 items-center p-2 px-5">
            <button
              disabled={quantity == 1}
              onClick={() => {
                setQuantity(quantity - 1);
              }}
              className="cursor-pointer disabled:cursor-not-allowed"
            >
              -
            </button>
            <h2>{quantity}</h2>
            <button
              onClick={() => {
                setQuantity(quantity + 1);
              }}
              className="cursor-pointer disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
          <h2 className="font-bold text-sm md:text-lg">
            Total = ${(quantity * productTotalPrice).toFixed(2)}
          </h2>
        </div>
        <Button
          disabled={loading}
          onClick={() => addToCart()}
          className="flex gap-3 my-2 cursor-pointer items-center w-36 bg-yellow-700 hover:bg-yellow-800 rounded-none justify-center"
        >
          <ShoppingBasket className="w-12 h-12" />
          {loading ? <Loader2 className="animate-spin" /> : "Add to Cart"}
        </Button>

        <h2 className="text-xs md:text-sm text-left font-bold">
          Category:
          <span className="capitalize text-xs md:text-sm font-normal">
            {" " + product.categories?.[0].name}
          </span>
        </h2>
      </div>
    </div>
  );
};

export default ProductItemDetails;
