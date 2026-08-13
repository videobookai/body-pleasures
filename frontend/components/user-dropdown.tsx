"use client";

import { CircleUserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useAuth } from "@/app/_context/AuthContext";

export function UserDropdown() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-auto w-auto p-0">
          <CircleUserRound className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 cursor-pointer" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {user ? (
          <>
            <DropdownMenuItem>
              <Link href="/my-orders">My Orders</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem>
              <Link href="/sign-in">Login</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/sign-up">Sign Up</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
