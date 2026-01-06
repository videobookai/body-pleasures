"use client";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { Button } from "./ui/button";

import { toast } from "sonner";
import { Loader2, ShoppingBasket } from "lucide-react";
import { useRouter } from "next/navigation";


import { set } from "date-fns";
import GlobalApi from "../app/_utils/GlobalApi";
import { UpdateCartContext } from "../app/_context/UpdateCartContext";

interface ProductItemDetailsProps {
  product: any;
}
const ProductItemDetails = ({ product }: ProductItemDetailsProps) => {
  const imageUrl = process.env.NEXT_PUBLIC_BASE_URL + product.images?.[0]?.url;
  const [loading, setLoading] = useState(false);

  const jwt = sessionStorage.getItem("authToken");
  const router = useRouter();
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  const {updateCart, setUpdateCart} = useContext<any>(UpdateCartContext);

  const [productTotalPrice, setProductTotalPrice] = useState(
    product.sellingPrice ? product.sellingPrice : product.mrp
  );
  const [quantity, setQuantity] = useState(1);
 
  const addToCart = () => {
    setLoading(true);
    if (!jwt) {
      toast.error("Please sign in to add items to your cart");
      router.push("/sign-in");

      return;
    }

    const data = {
      data: {
        quantity: quantity,
        amount: (quantity * productTotalPrice).toFixed(2),
        products: product.id,
        userId: user.id,
      },
    };
    console.log("Adding to cart:", data);

    GlobalApi.addToCart(data, jwt)
      .then((resp) => {
        console.log("Add to cart response:", resp);
        toast.success(`${quantity} × ${product.name} added to cart`);
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
    <div className="grid grid-cols-1  gap-2 md:gap-4 md:grid-cols-2 p-7 text-primary">
      <Image
        src={imageUrl}
        alt={product.name || "product-image"}
        width={300}
        height={300}
        className="bg-slate-200 h-[32opx] object-contain rounded-lg"
      />
      <div className="flex flex-col gap-2 justify-start">
        <h2 className="text-2xl md:text-3xl font-bold">{product.name}</h2>
        <h2 className="text-black/50 text-sm md:text-lg">
          {product.description}
        </h2>

        <div className="flex flex-row gap-2 items-center my-2">
          <p className="text-lg font-bold text-primary">
            ${product.sellingPrice}
          </p>
          <p>
            {product.mrp && (
              <span className="text-lg text-muted-foreground line-through mr-2">
                ${product.mrp}
              </span>
            )}
          </p>
        </div>

        <h2 className="font-medium text-lg">
          Quantity: ({product.itemQuantityType})
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

        <h2 className="text-sm  font-bold">
          Category:
          <span className="capitalize text-sm font-normal">
            {" " + product.categories?.[0].name}
          </span>
        </h2>
      </div>
    </div>
  );
};

export default ProductItemDetails;
