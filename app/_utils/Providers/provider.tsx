"use client";

import { UpdateCartContext, UpdateCartContextType } from "@/app/_context/UpdateCartContext";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useState } from "react";
import { Toaster } from "sonner";


export function Providers({ children }: { children: React.ReactNode }) {
    const [updateCart, setUpdateCart] = useState(false);

    const contextValue: UpdateCartContextType = {
        updateCart,
        setUpdateCart,
    };

    const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
    currency: "USD",
    intent: "capture",
};

    return (
        <PayPalScriptProvider options={initialOptions}>
        <UpdateCartContext.Provider value={contextValue}>
            {children}
            <Toaster position="top-right" />
        </UpdateCartContext.Provider>
        </PayPalScriptProvider>
    );
}
