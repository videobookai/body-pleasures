import { NextResponse } from "next/server";

const isProduction = process.env.NODE_ENV === "production";

const COOKIE_CONFIG = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 0,
};

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("authToken", "", COOKIE_CONFIG);
  return response;
}
