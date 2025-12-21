"use client";

import { UpdateCartContext, UpdateCartContextType } from "@/app/_context/UpdateCartContext";
import { useState } from "react";
import { Toaster } from "sonner";


export function Providers({ children }: { children: React.ReactNode }) {
    const [updateCart, setUpdateCart] = useState(false);

    const contextValue: UpdateCartContextType = {
        updateCart,
        setUpdateCart,
    };

    return (
        <UpdateCartContext.Provider value={contextValue}>
            {children}
            <Toaster position="top-right" />
        </UpdateCartContext.Provider>
    );
}
