"use client"
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle2, HomeIcon, ListOrderedIcon } from 'lucide-react'
import React from 'react'

const OrderConfirmation = () => {
    const user = sessionStorage?.getItem("user")
    if (!user){
        window.location.href="/"
        return
    }
  return (
    <div className='flex flex-col justify-center items-center mt-20'>
        <Navigation/>
        <div className='flex justify-center items-center border shadow-md flex-col p-20 rounded-md gap-3 px-32 bg-secondary/30 h-fit md:h-[600px] max-w-2xl md:max-w-4xl lg:max-w-6xl '>
            <CheckCircle2 className='h-24 w-24 text-green-500'/>
            <h2 className='font-medium text-3xl text-primary'>
                Order Successfully placed
            </h2>
            <h2>Thank you for the order</h2>
            <div className='flex mt-6 gap-3'>
                 <Button className='px-6 cursor-pointer' onClick={()=>{
                window.location.href="/"
            }}>
                <HomeIcon/> Return Home
            </Button>
            <Button className='px-6 cursor-pointer ' 
            variant={"outline"}
            onClick={()=>{
                window.location.href="/my-orders"
            }}>
                <ListOrderedIcon/> Track Order
            </Button>
            </div>
           
        </div>
    </div>
  )
}

export default OrderConfirmation