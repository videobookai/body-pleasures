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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const MyOrderItem = ({ orderItem }: { orderItem: OrderItem }) => {
  return (
    <div className="w-full grid grid-cols-5 mt-3 items-center">
      <Image
        src={baseUrl + orderItem?.product?.images[0]?.url}
        alt={orderItem?.product?.images[0]?.alternativeText}
        width={80}
        height={50}
        className="bg-gray-100 p-1 rounded-md border object-cover w-full h-20 md:h-32 lg:h-40 lg:w-52"
      />

      <div className="col-span-2 ml-24 lg:ml-36">
        <h2>{orderItem.product.name}</h2>
        <h2 className="text-sm">
          Item Price: ${orderItem.product.sellingPrice}
        </h2>
      </div>
      <h2>Quantity: {orderItem.quantity}</h2>

      <hr className="col-span-5 my-2 w-[90%]" />
    </div>
  );
};

export default MyOrderItem;
