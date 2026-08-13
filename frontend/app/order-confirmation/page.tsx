"use client"
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle2, HomeIcon, ListOrderedIcon } from 'lucide-react'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/_context/AuthContext'

const OrderConfirmation = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [authLoading, router, user]);

  return (
    <div className="flex min-h-screen flex-col items-center px-4 pb-10 pt-20 sm:px-6">
      <Navigation />
      <div className="flex w-full max-w-3xl flex-1 items-center justify-center">
        <div className="flex w-full flex-col items-center justify-center gap-3 rounded-md border bg-secondary/30 px-5 py-10 text-center shadow-md sm:px-8 md:min-h-[600px] md:px-16">
          <CheckCircle2 className="h-20 w-20 text-green-500 sm:h-24 sm:w-24" />
          <h2 className="text-2xl font-medium text-primary sm:text-3xl">
            Order Successfully placed
          </h2>
          <h2 className="text-sm sm:text-base">Thank you for the order</h2>
          <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button
              className="w-full cursor-pointer sm:w-auto sm:px-6"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              <HomeIcon /> Return Home
            </Button>
            <Button
              className="w-full cursor-pointer sm:w-auto sm:px-6"
              variant={"outline"}
              onClick={() => {
                window.location.href = "/my-orders";
              }}
            >
              <ListOrderedIcon /> Track Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation
