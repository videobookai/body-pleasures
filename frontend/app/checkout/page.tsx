"use client";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GlobalApi from "../_utils/GlobalApi";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "sonner";

const CheckoutPage = () => {
  const [totalCartItems, setTotalCartItems] = useState(0);
  const [cartItemList, setCartItemList] = useState<any[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");
  const [emailError, setEmailError] = useState("");

  const jwt = sessionStorage?.getItem("authToken");
  const router = useRouter()

  const userString = sessionStorage?.getItem("user");
  if (!userString || !jwt) {
    window.location.href = "/";

    return;
  }
  const user = JSON.parse(userString);
  const [{ isPending }] = usePayPalScriptReducer();

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setEmailError("Invalid email format");
      return false;
    }
    setEmailError("");
    return true;
  };

  const sendOrderStatusNotification = async ({
    orderStatus,
    failureReason,
    orderId,
    createdAt,
  }: {
    orderStatus: string;
    failureReason?: string;
    orderId?: string;
    createdAt?: string;
  }) => {
    if (!email) return;

    try {
      await fetch("/api/email/order-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          payload: {
            customerName: name || user?.username || "Customer",
            orderId,
            orderStatus,
            totalAmount: Number(calculateTotalAmount()),
            paymentId: "N/A",
            createdAt: createdAt || new Date().toISOString(),
            shippingAddress: address,
            failureReason,
            items: cartItemList.map((item) => ({
              name: item.name || `Product #${item.product}`,
              quantity: Number(item.quantity || 1),
              price: Number(item.price || 0),
            })),
          },
        }),
      });
    } catch (error) {
      console.error("Order status email notification failed", error);
    }
  };

  const onApprove = (data: any) => {
    console.log(data);

    // Validate required fields
    if (!name || !email || !phone || !address || !zip) {
      toast.error("Please fill in all billing details");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Invalid email format");
      return;
    }

    const emailItems = cartItemList.map((item) => ({
      name: item.name || `Product #${item.product}`,
      quantity: Number(item.quantity || 1),
      price: Number(item.price || 0),
    }));
    const checkoutTotal = Number(calculateTotalAmount());

    // Send only necessary fields
    const orderItems = cartItemList.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price,
      docId:item.documentId
    }));
    console.log("Order Items", orderItems);
    const payload = {
      data: {
        paymentId: data.paymentId.toString(),
        userId: user?.id,
        username: name,
        address: address,
        totalAmount: calculateTotalAmount(),
        email: email,
        phone: phone,
        zip: zip,
        order: orderItems,
      },
    };

    console.log("Order payload", payload);

    GlobalApi.createOrder(payload, jwt)
      .then(async (resp) => {
        console.log(resp);
        const createdOrder = resp?.data?.data;
        const paymentId =
          createdOrder?.paymentId?.toString() || data?.paymentId?.toString() || "N/A";

        GlobalApi.clearUserCart(user.id, jwt);
        setCartItemList([]);
        setTotalCartItems(0);
        setSubTotal(0);
        void fetch("/api/email/order-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: email,
            payload: {
              customerName: name || user?.username || "Customer",
              orderId:
                createdOrder?.documentId?.toString() ||
                createdOrder?.id?.toString() ||
                "N/A",
              orderStatus: createdOrder?.orderStatus || "success",
              totalAmount: checkoutTotal,
              paymentId,
              createdAt: createdOrder?.createdAt || new Date().toISOString(),
              shippingAddress: address,
              items: emailItems,
            },
          }),
        });

        toast.success("Order Placed Successfully");
        router.replace("/order-confirmation")
      })
      .catch((error) => {
        console.error("Order creation failed", error);
        void sendOrderStatusNotification({
          orderStatus: "failed",
          failureReason: "Order creation failed after payment capture.",
          createdAt: new Date().toISOString(),
        });
        toast.error("Failed to place order. Please try again.");
      });
  };

  useEffect(() => {
    getCartItems();
  }, []);

  useEffect(() => {
    if (cartItemList) {
      const total = cartItemList.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setSubTotal(total);
    }
  }, [cartItemList]);

  const getCartItems = async () => {
    // Ensure we have a user id and token before calling API
    if (!user) {
      return;
    }

    const token =
      typeof window !== "undefined"
        ? sessionStorage.getItem("authToken")
        : null;
    if (!token) {
      console.warn(
        "No auth token found in sessionStorage; skipping cart fetch."
      );

      return;
    }

    try {
      const resp = await GlobalApi.getUserCartItems(user.id, token);
      // Support different response shapes (service might return array or { data: [...] })
      const cartItemList_ = resp?.data?.data ?? resp?.data ?? resp;
      console.log(cartItemList_)

      setTotalCartItems(cartItemList_?.length);
      setCartItemList(cartItemList_);
    } catch (error) {
      console.error("getCartItems error:", error);
    }
  };

  const taxPercent = 0.1;
  // const deliveryCost = 5;
  const taxAmount = subTotal * taxPercent;

  const calculateTotalAmount = () => {
    const totalAmount = subTotal + taxAmount
    return totalAmount.toFixed(2);
  };

  return (
    <div className="flex flex-col gap-2">
      <Navigation />

      <div className="mt-20 min-h-screen">
        <div className="p-3 bg-primary text-xl md:text-2xl lg:text-3xl font-bold text-white text-center">
          Checkout
        </div>
        <div className="p-5 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-6 py-8 max-w-5xl mx-auto">
          <div className="col-span-2 space-y-6">
            <h2 className="font-semibold text-2xl md:text-3xl text-center md:text-left">
              Billing Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Name</label>
                <Input
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                  className="text-xs md:text-base"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Email</label>
                <Input
                  placeholder="Email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                    
                  }}
                  className="text-xs md:text-base"
                />
                {emailError && (
                  <p className="text-red-500 text-xs mt-1">{emailError}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Phone</label>
                <Input
                  placeholder="Phone"
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-xs md:text-base"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Zip</label>
                <Input
                  placeholder="Zip"
                  onChange={(e) => setZip(e.target.value)}
                  className="text-xs md:text-base"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Address</label>
              <Input
                placeholder="Address"
                onChange={(e) => setAddress(e.target.value)}
                className="text-xs md:text-base"
              />
            </div>
          </div>
          <div className="mx-auto w-full max-w-lg border rounded-xl shadow-sm bg-white">
            <h2 className="p-3 bg-gray-200 font-semibold text-center">
              Total Cart ({totalCartItems})
            </h2>
            <div className="p-4 flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subTotal.toFixed(2)}</span>
              </div>
              <div className="border-t" />
              {/* <div className="flex justify-between">
                <span>Delivery</span>
                <span>${deliveryCost}</span>
              </div> */}
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t" />
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>{calculateTotalAmount()}</span>
              </div>
              {isPending ? <div className="spinner" /> : null}
              <div className="w-full">
                <PayPalButtons
                  style={{ layout: "horizontal" }}
                  disabled={!name || !email || !phone || !address || !zip || !!emailError}
                  onApprove={async (data, actions) => {
                    const order = await actions.order?.capture();
                    console.log("order", order);
                    onApprove(data);
                  }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: calculateTotalAmount(),
                            currency_code: "USD",
                          },
                        },
                      ],
                      intent: "CAPTURE",
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

};

export default CheckoutPage;
