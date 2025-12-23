import React from "react";
import { Card, CardFooter } from "./ui/card";
import Image from "next/image";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProductItemDetails from "./ProductItemDetails";

interface ProductItemProps {
  product: any;
}

const ProductItem = ({ product }: ProductItemProps) => {
  if (!product) return null;

  const imageUrl = process.env.NEXT_PUBLIC_BASE_URL + product.images?.[0]?.url;

  return (
    <Card
      key={product.id}
      className="pt-2 my-4 px-2 pb-2 bg-white   hover:scale-105 transition-transform duration-500   cursor-pointer flex justify-center flex-col"
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={product.name || "product-image"}
          width={500}
          height={200}
          className="w-full h-36 md:h-52 lg:h-64 object-cover rounded-lg mb-2"
        />
      ) : (
        <div className="w-full h-48 bg-muted rounded-lg mb-4" />
      )}

      <div className="flex flex-col gap-2 px-4 mb-2">
        <h3 className="text-lg font-semibold text-primary mb-2">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">
          {product.description}
        </p>
        <div className="flex flex-row gap-2 items-center">
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
      </div>

      <CardFooter className="flex items-center justify-center my-2">
        <Dialog>
          <DialogTrigger asChild className="mb-2">
          
            <Button className="cursor-pointer bg-yellow-700 hover:bg-yellow-800 w-36">
              Add to Cart
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="hidden">{product.name}</DialogTitle>
              <DialogDescription asChild>
                <div>
                  <ProductItemDetails product={product} />
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default ProductItem;
