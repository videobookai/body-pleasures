"use client"
import GlobalApi from '@/app/_utils/GlobalApi';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeClosed, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

const SignIn = () => {

     
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false)
    const router = useRouter();

    useEffect(()=>{
            const jwt = sessionStorage.getItem('authToken')

            if(jwt){
                router.push("/")
            }
    },[])

    const onSignIn =()=>{
         setLoading(true)
        GlobalApi.signIn( email, password).then(resp=>{
           
           
            sessionStorage.setItem('user', JSON.stringify(resp.data.user));
            sessionStorage.setItem('authToken', resp.data.jwt);
            toast.success("Sign In Success")
            setLoading(false)
            router.push("/")
        }, (err)=>{
            console.error("Error signing into account", err)
            toast.error(err?.response?.data?.error.message)
            setLoading(false)
        })
    }
  return (
      <div className="flex flex-col items-center gap-2  mt-20">
   
      <div className="flex flex-col items-center p-4 bg-secondary/10 shadow-lg w-fit md:w-2xl lg:w-3xl mt-4 mb-20">
        <div className="shrink-0 py-8">
          {" "}
          
            <h1 className="text-xl md:text-2xl font-serif font-semibold text-foreground">
              {"Ms V's Body Pleasures"}
            </h1>
         
        </div>
        <h2 className="font-bold text-2xl md:text-4xl mt-4 text-primary">Welcome! Sign In</h2>
        <h2 className="text-gray-500">Enter your Email and Password to proceed</h2>
        

        <div className="flex flex-col w-full gap-5 mt-7 px-4">
        
            <Input
                type="email"
                placeholder="name@example.com"
                className="bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="bg-white pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-gray-800"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? (
                        <Eye className="cursor-pointer"/>
                    ) : (
                       <EyeClosed className="cursor-pointer"/>
                    )}
                </button>
            </div>
            <Button
                className="cursor-pointer disabled:cursor-not-allowed"
                onClick={() => onSignIn()}
                disabled={!(email && password)|| loading}
            >
                {loading? <Loader2 className='animate-spin'/> : "Sign In"}
            </Button>
        </div>
         <div className="flex flex-row gap-2 mt-6 items-start justify-start mb-6">
                <p>Don't have an account?</p>
            <Link className="text-blue-500 underline" href={"/sign-up"}>Click here to sign up</Link>
            </div>
            
      </div>
   
    </div>
  )
}

export default SignIn