"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type Toast = {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "error" | "info";
  duration?: number;
};

type ToastContextType = {
  showToast: (t: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    // clean-up on unmount
    return () => setToasts([]);
  }, []);

  const remove = (id: string) => setToasts((s) => s.filter((t) => t.id !== id));

  const showToast = ({ title, description, type = "info", duration = 3000 }: Omit<Toast, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const toast: Toast = { id, title, description, type, duration };
    setToasts((s) => [toast, ...s]);
    if (duration > 0) setTimeout(() => remove(id), duration);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
        {toasts.map((t) => (
          <div key={t.id} className={`max-w-xs w-full px-4 py-3 rounded shadow-lg text-white ${t.type === "success" ? "bg-green-600" : t.type === "error" ? "bg-red-600" : "bg-slate-800"}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{t.title}</div>
                {t.description && <div className="text-sm opacity-90">{t.description}</div>}
              </div>
              <button onClick={() => remove(t.id)} className="ml-2 text-xs opacity-80">✕</button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

export default ToastContext;
