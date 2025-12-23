"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useCart } from "./CartContext";
import { toast } from "sonner";
import { ShoppingBasket } from "lucide-react";
interface ProductItemDetailsProps {
  product: any;
}
const ProductItemDetails = ({ product }: ProductItemDetailsProps) => {
  const imageUrl = process.env.NEXT_PUBLIC_BASE_URL + product.images?.[0]?.url;

  const [productTotalPrice, setProductTotalPrice] = useState(
    product.sellingPrice ? product.sellingPrice : product.mrp
  );
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
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
          onClick={() => {
            const id = product.id ?? product._id ?? product.name;
            const price = product.sellingPrice ?? product.mrp ?? 0;
            const image = product.images?.[0]?.url
              ? process.env.NEXT_PUBLIC_BASE_URL + product.images[0].url
              : undefined;
            addItem({ id, name: product.name, price: Number(price), quantity, image });
            toast.success(`${quantity} × ${product.name} added to cart`);
          }}
          className="flex gap-3 my-2 cursor-pointer items-center w-36 bg-yellow-700 hover:bg-yellow-800 rounded-none justify-center"
        >
          <ShoppingBasket className="w-12 h-12" />
          Add to Cart
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
