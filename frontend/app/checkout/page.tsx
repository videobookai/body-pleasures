"use client";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GlobalApi from "../_utils/GlobalApi";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { useAuth } from "@/app/_context/AuthContext";
import { Loader2 } from "lucide-react";

const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim() || "";

type PayPalCheckoutButtonsProps = {
  disabled: boolean;
  totalAmount: string;
  onApprove: (data: any, capturedOrder?: any) => void;
};

function PayPalCheckoutButtons({
  disabled,
  totalAmount,
  onApprove,
}: PayPalCheckoutButtonsProps) {
  const [{ isPending }] = usePayPalScriptReducer();

  return (
    <>
      {isPending ? <div className="spinner" /> : null}
      <div className="w-full">
        <PayPalButtons
          style={{ layout: "horizontal" }}
          disabled={disabled}
          onApprove={async (data, actions) => {
            const capturedOrder = await actions.order?.capture();
            console.log("capturedOrder", capturedOrder);
            onApprove(data, capturedOrder);
          }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: totalAmount,
                    currency_code: "USD",
                  },
                },
              ],
              intent: "CAPTURE",
            });
          }}
        />
      </div>
    </>
  );
}

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
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

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

  const onApprove = (data: any, capturedOrder?: any) => {
    console.log("paypal approval data", data);
    console.log("paypal captured order", capturedOrder);

    if (!user?.id) {
      toast.error("Please sign in to place an order.");
      return;
    }

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

    const paypalOrderId =
      data?.orderID?.toString() ||
      capturedOrder?.id?.toString() ||
      data?.paymentId?.toString();

    if (!paypalOrderId) {
      console.error("Missing PayPal order ID", { data, capturedOrder });
      toast.error("Unable to verify PayPal payment. Please contact support.");
      return;
    }

    setIsProcessingOrder(true);

    console.log("Order Items", orderItems);
    const payload = {
      data: {
        paymentId: paypalOrderId,
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

    GlobalApi.createOrder(payload)
      .then(async (resp) => {
        console.log(resp);
        const createdOrder = resp?.data?.data;
        const paymentId =
          createdOrder?.paymentId?.toString() || paypalOrderId || "N/A";

        await GlobalApi.clearUserCart();
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
      })
      .finally(() => {
        setIsProcessingOrder(false);
      });
  };

  useEffect(() => {
    if (user) {
      getCartItems();
    } else {
      setCartItemList([]);
      setTotalCartItems(0);
    }
  }, [user]);

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
    if (!user) {
      return;
    }

    try {
      const cartItemList_ = await GlobalApi.getUserCartItems();
      console.log(cartItemList_);

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
              {isProcessingOrder ? (
                <div className="rounded-md border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
                  Processing your payment and creating your order. Please wait... <Loader2 className="ml-2 animate-spin" />
                </div>
              ) : null}
              {paypalClientId ? (
                <PayPalScriptProvider
                  options={{
                    clientId: paypalClientId,
                    currency: "USD",
                    intent: "capture",
                  }}
                >
                  <PayPalCheckoutButtons
                    disabled={
                      isProcessingOrder ||
                      !name ||
                      !email ||
                      !phone ||
                      !address ||
                      !zip ||
                      !!emailError
                    }
                    totalAmount={calculateTotalAmount()}
                    onApprove={onApprove}
                  />
                </PayPalScriptProvider>
              ) : (
                <p className="text-sm text-red-600">
                  PayPal checkout is unavailable. Set
                  {" "}
                  <code>NEXT_PUBLIC_PAYPAL_CLIENT_ID</code>
                  {" "}
                  in
                  {" "}
                  <code>frontend/.env.local</code>
                  {" "}
                  and restart the frontend.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

};

export default CheckoutPage;
