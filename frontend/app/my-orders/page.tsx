"use client";
import { Navigation } from "@/components/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import GlobalApi from "../_utils/GlobalApi";
import moment from "moment";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import MyOrderItem from "./_components/MyOrderItem";
import { Skeleton } from "@/components/ui/skeleton";
import { Footer } from "@/components/footer";
import { PackageSearch } from "lucide-react";
import { useAuth } from "@/app/_context/AuthContext";

interface Order {
  createdAt: string;
  totalAmount: number;
  orderStatus: string;
  order: Array<{
    docId: string;
    productId: string;
    quantity: number;
    price: number;
    product: any;
  }>;
}

const MyOrderPage = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [orderList, setOrderList] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
      return;
    }

    if (user) {
      void getMyOrder();
    }
  }, [authLoading, router, user]);

  const getMyOrder = async () => {
    setLoading(true);
    const orderedList_ = await GlobalApi.getOrdersByUserId();

    setOrderList(orderedList_);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navigation />
      <div className="mx-auto mt-16 grow w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="p-3 bg-primary text-xl md:text-2xl lg:text-3xl font-bold text-white text-center">
          My Orders
        </h2>

        <div className="my-7 px-1 sm:px-3 md:px-6 lg:px-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">Order History</h2>
          <div>
            {loading ? (
              <div>
                <Skeleton className="my-5 h-10 w-full bg-primary/30" />
                <Skeleton className="my-5 h-10 w-full bg-primary/30" />
                <Skeleton className="my-5 h-10 w-full bg-primary/30" />
                <Skeleton className="my-5 h-10 w-full bg-primary/30" />
              </div>
            ) : (
              orderList.map((item, index) => (
                <Collapsible key={index}>
                  <CollapsibleTrigger>
                    <div className="my-5 flex w-full flex-col gap-2 rounded-md bg-primary/20 p-3 text-left sm:p-4 md:flex-row md:items-center md:justify-between md:gap-6">
                      <h2>
                        <span className="font-bold mr-1"> Order Date:</span>
                        {moment(item?.createdAt).format("MM/DD/YYYY")}
                      </h2>
                      <h2>
                        {" "}
                        <span className="font-bold mr-1">
                          Total Amount:
                        </span>{" "}
                        ${item?.totalAmount}
                      </h2>
                      <h2>
                        {" "}
                        <span className="font-bold mr-1">Status:</span>{" "}
                        {item?.orderStatus}
                      </h2>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {item.order.map((order, index_) => (
                      <div key={index_}>
                        <MyOrderItem orderItem={order} />
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))
            )}
          </div>
        </div>
        {(orderList.length === 0 && !loading) && (
          <div className="mx-auto my-10 flex flex-col items-center justify-center gap-2 px-4 text-center sm:flex-row sm:text-left md:px-10 lg:gap-6 lg:px-20">
            <PackageSearch className="text-gray-400 w-10 h-10 md:w-20 md:h-20"  />
            <h2 className="text-sm md:text-xl  text-gray-500 font-sans">
              You have not placed an order yet
            </h2>
          </div>)
        }
      </div>

      {orderList.length >= 1 && (<div className="flex justify-center mt-auto mb-10">
        <p className="font-light text-xs md:text-sm text-gray-500 font-sans text-center">
          *Total Amount contains the added tax and shipping fees
        </p>
      </div>)}
      <Footer />
    </div>
  );
};

export default MyOrderPage;
