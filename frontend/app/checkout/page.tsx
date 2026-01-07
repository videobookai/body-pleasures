"use client";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowBigRight } from "lucide-react";
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

        GlobalApi.clearUserCart(user.id, jwt);
        setCartItemList([]);
        setTotalCartItems(0);
        setSubTotal(0);

        toast.success("Order Placed Successfully");
        router.replace("/order-confirmation")
      })
      .catch((error) => {
        console.error("Order creation failed", error);
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

  const taxPercent = 0.9;
  const deliveryCost = 5;
  const taxAmount = subTotal - taxPercent * subTotal;

  const calculateTotalAmount = () => {
    const totalAmount = subTotal + taxAmount + deliveryCost;
    return totalAmount.toFixed(2);
  };

  return (
    <div className="flex flex-col gap-2">
      <Navigation />

      <div className="mt-20 min-h-screen ">
        <h2 className="p-3 bg-primary text-xl md:text-2xl lg:text-3xl font-bold text-white text-center">
          Checkout
        </h2>
        <div className="p-5 px-5 md:px-10 grid grid-cols-1 md:grid-cols-3 py-8">
          <div className="col-span-2 mx-20">
            <h2 className="font-bold text-3xl">Billing Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-3">
              <Input
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
              />
              <div>
                <Input
                  placeholder="Email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-10 mt-3">
              <Input
                placeholder="Phone"
                onChange={(e) => setPhone(e.target.value)}
              />
              <Input
                placeholder="Zip"
                onChange={(e) => setZip(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <Input
                placeholder="Address"
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
          <div className="mx-10 border my-1 sm:my-8">
            <h2 className="p-3 bg-gray-200 font-bold text-center">
              Total Cart ({totalCartItems})
            </h2>
            <div className="p-4 flex flex-col gap-4">
              <h2 className="font-bold flex justify-between">
                Subtotal: <span>${subTotal.toFixed(2)}</span>
              </h2>
              <hr></hr>
              <h2 className="flex justify-between">
                Delivery: <span>${deliveryCost}</span>
              </h2>
              <h2 className="flex justify-between">
                Tax (9%): <span>${taxAmount.toFixed(2)}</span>
              </h2>
              <hr></hr>
              <h2 className="font-bold flex justify-between">
                Total: <span>{calculateTotalAmount()}</span>
              </h2>

              {isPending ? <div className="spinner" /> : null}

             

              <PayPalButtons style={{ layout: "horizontal" }}
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
                          currency_code: "USD"
                        }
                      }
                    ],
                    intent: "CAPTURE"
                  })
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
