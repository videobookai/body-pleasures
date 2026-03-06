"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import GlobalApi from "../../_utils/GlobalApi";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onRequestReset = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      const userExists = await GlobalApi.checkUserExistsByEmail(email);

      if (!userExists) {
        toast.error("No account found with this email address.");
        return;
      }

      await GlobalApi.forgotPassword(email);
      toast.success("Reset link sent successfully.");
      setEmail("");
    } catch (err: any) {
      console.error("Error requesting password reset", err);
      toast.error(
        err?.response?.data?.error?.message || "Unable to process your request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-20">
      <div className="flex flex-col items-center p-4 bg-secondary/10 shadow-lg w-fit md:w-2xl lg:w-3xl mt-4 mb-20">
        <div className="shrink-0 py-8">
          <h1 className="text-xl md:text-2xl font-serif font-semibold text-foreground">
            {"Ms V's Body Pleasures"}
          </h1>
        </div>

        <h2 className="font-bold text-2xl md:text-4xl mt-4 text-primary">
          Forgot Password
        </h2>
        <h2 className="text-gray-500 text-center">
          Enter your email address and we will send a reset link.
        </h2>

        <div className="flex flex-col w-full gap-5 mt-7 px-4">
          <Input
            type="email"
            placeholder="name@example.com"
            className="bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            className="cursor-pointer disabled:cursor-not-allowed"
            onClick={onRequestReset}
            disabled={!email || loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
          </Button>
        </div>

        <div className="flex flex-row gap-2 mt-6 items-start justify-start mb-6">
          <p>Remember your password?</p>
          <Link className="text-blue-500 underline" href="/sign-in">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
