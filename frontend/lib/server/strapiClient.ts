import { NextRequest } from "next/server";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

if (!API_URL) {
  throw new Error("Missing NEXT_PUBLIC_API_URL environment variable.");
}

const normalizePath = (path: string) => `${API_URL}/${path.replace(/^\/+/, "")}`;

const getAuthToken = (request: NextRequest) => {
  const token = request.cookies.get("authToken")?.value;
  if (!token) {
    throw new Error("Missing authentication token.");
  }
  return token;
};

export const strapiFetch = async (
  request: NextRequest,
  path: string,
  options: RequestInit = {},
): Promise<Response> => {
  const token = getAuthToken(request);
  const url = normalizePath(path);

  const headers = new Headers(options.headers ?? {});
  headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, {
    ...options,
    headers,
  });
};

export const fetchCurrentUser = async (request: NextRequest) => {
  const response = await strapiFetch(request, "/users/me", { method: "GET" });
  if (!response.ok) {
    throw new Error("Unable to fetch authenticated user.");
  }
  return response.json();
};
