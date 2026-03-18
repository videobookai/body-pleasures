import { NextRequest, NextResponse } from "next/server";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

const isProduction = process.env.NODE_ENV === "production";

const COOKIE_CONFIG = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
};

type AuthRequestBody = {
  email?: string;
  password?: string;
};

const buildResponse = (data: any, token: string) => {
  const response = NextResponse.json(data);
  response.cookies.set("authToken", token, COOKIE_CONFIG);
  return response;
};

const sendError = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });

const callStrapi = async (path: string, body: Record<string, unknown>) => {
  if (!API_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_URL environment variable.");
  }

  const url = `${API_URL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await resp.json();

  if (!resp.ok) {
    const message = json?.error?.message || json?.message || resp.statusText || "Authentication failed.";
    throw new Error(message);
  }

  return json;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AuthRequestBody;

    if (!body?.email || !body?.password) {
      return sendError("Email and password are required.");
    }

    const payload = await callStrapi("auth/local", {
      identifier: body.email,
      password: body.password,
    });

    if (!payload?.jwt) {
      return sendError("Authentication token missing from Strapi response.");
    }

    return buildResponse({ user: payload.user ?? null }, payload.jwt);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sign in.";
    return sendError(message, 500);
  }
}
