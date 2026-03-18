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
    <div className="flex flex-col min-h-screen ">
      <Navigation />
      <div className="mt-16 grow max-w-7xl mx-auto w-full">
        <h2 className="p-3 bg-primary text-xl md:text-2xl lg:text-3xl font-bold text-white text-center">
          My Orders
        </h2>

        <div className="my-7 px-5 md:px-10 lg:px-20">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">Order History</h2>
          <div>
            {loading ? (
              <div>
                <Skeleton className="h-10 w-full my-5 max-w-350 bg-primary/30" />
                <Skeleton className="h-10 w-full my-5 max-w-350 bg-primary/30" />
                <Skeleton className="h-10 w-full my-5 max-w-350 bg-primary/30" />
                <Skeleton className="h-10 w-full my-5 max-w-[1400px] bg-primary/30" />
              </div>
            ) : (
              orderList.map((item, index) => (
                <Collapsible key={index}>
                  <CollapsibleTrigger>
                    <div className="bg-primary/20 p-3 my-5 cursor-pointer flex flex-row md:justify-between md:gap-20 gap-2 max-w-full w-[700px] lg:w-[1400px]">
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
          <div className="flex flex-row items-center md:px-10 gap-2 md:gap-4 lg:gap-6 my-10 md:my-auto mx-auto text-left px-4 justify-center lg:px-20">
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
