"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import GlobalApi from "../../_utils/GlobalApi";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");


  if (!code) {
    return (
      <div className="flex flex-col items-center gap-2 mt-20">
        <div className="flex flex-col items-center p-4 bg-secondary/10 shadow-lg w-fit md:w-2xl lg:w-3xl mt-4 mb-20">
          <div className="shrink-0 py-8">
            <h1 className="text-xl md:text-2xl font-serif font-semibold text-foreground">
              {"Ms V's Body Pleasures"}
            </h1>
          </div>

          <h2 className="font-bold text-2xl md:text-4xl mt-4 text-primary">
            Not Authorized
          </h2>
          <h2 className="text-gray-500 text-center">
            The password reset link is invalid or has expired.
          </h2>

          <div className="flex flex-row gap-2 mt-6 items-start justify-start mb-6">
            <p>Back to login?</p>
            <Link className="text-blue-500 underline" href="/sign-in">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const onResetPassword = async () => {
    if (!code) {
      toast.error("Invalid or expired reset link.");
      return;
    }

    if (!password || !confirmPassword) {
      toast.error("Please fill in both password fields.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await GlobalApi.resetPassword(code, password, confirmPassword);
      toast.success("Password reset successful. Please sign in.");
      setPassword("");
      setConfirmPassword("");
      router.push("/sign-in");
    } catch (err: any) {
      console.error("Error resetting password", err);
      toast.error(
        err?.response?.data?.error?.message || "Unable to reset password."
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
          Reset Password
        </h2>
        <h2 className="text-gray-500 text-center">
          Enter your new password below.
        </h2>

        <div className="flex flex-col w-full gap-5 mt-7 px-4">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
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
                <Eye className="cursor-pointer" />
              ) : (
                <EyeClosed className="cursor-pointer" />
              )}
            </button>
          </div>

          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm New Password"
            className="bg-white"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            className="cursor-pointer disabled:cursor-not-allowed"
            onClick={onResetPassword}
            disabled={!password || !confirmPassword || loading || !code}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Reset Password"}
          </Button>
        </div>

        <div className="flex flex-row gap-2 mt-6 items-start justify-start mb-6">
          <p>Back to login?</p>
          <Link className="text-blue-500 underline" href="/sign-in">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
