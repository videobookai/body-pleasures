"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const MyOrdersPage = () => {
    const jwt = sessionStorage.getItem("authToken")
    const router = useRouter();

    useEffect(()=>{
        if(!jwt){
            router.replace("/")
        }
    },[])


  return (
    <div>
        
    </div>
  )
}

export default MyOrdersPage