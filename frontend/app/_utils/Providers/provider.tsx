"use client";


import { useState } from "react";
import { Toaster } from "sonner";
import { UpdateCartContext, UpdateCartContextType } from "../../_context/UpdateCartContext";
import { AuthProvider } from "../../_context/AuthContext";


export function Providers({ children }: { children: React.ReactNode }) {
    const [updateCart, setUpdateCart] = useState(false);

    const contextValue: UpdateCartContextType = {
        updateCart,
        setUpdateCart,
    };

    return (
      <AuthProvider>
        <UpdateCartContext.Provider value={contextValue}>
          {children}
          <Toaster position="top-right" />
        </UpdateCartContext.Provider>
      </AuthProvider>
    );
}
