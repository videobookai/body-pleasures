import Image from "next/image";
import React from "react";

interface OrderItem {
  docId: string;
  quantity: number;
  price: number;
  product: {
    description: string;
    images: {
      url: string;
      alternativeText: string;
    }[];
    name: string;
    sellingPrice: number;
  };
}

const MyOrderItem = ({ orderItem }: { orderItem: OrderItem }) => {
  return (
    <div className="mt-3 grid w-full grid-cols-1 gap-3 rounded-md border border-primary/10 bg-white/70 p-3 sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:items-center sm:gap-4">
      <Image
        src={orderItem?.product?.images[0]?.url}
        alt={orderItem?.product?.images[0]?.alternativeText}
        width={80}
        height={50}
        className="h-32 w-full rounded-md border bg-gray-100 object-contain  md:object-cover p-1 sm:h-24 sm:w-24"
      />

      <div className="min-w-0">
        <h2 className="break-words font-medium">{orderItem.product.name}</h2>
        <h2 className="text-sm">
          Item Price: ${orderItem.product.sellingPrice}
        </h2>
      </div>
      <h2 className="text-sm font-medium sm:text-base">Quantity: {orderItem.quantity}</h2>

      <hr className="col-span-full my-1 w-full" />
    </div>
  );
};

export default MyOrderItem;
