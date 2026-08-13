import { NextRequest, NextResponse } from "next/server";
import { fetchCurrentUser, strapiFetch } from "@/lib/server/strapiClient";

const buildJsonError = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });

export async function GET(request: NextRequest) {
  try {
    const user = await fetchCurrentUser(request);
    const userId = user?.id;

    if (!userId) {
      return buildJsonError("Authenticated user not found.", 401);
    }

    const resp = await strapiFetch(
      request,
      `/user-carts?filters[userId][$eq]=${userId}&populate[products][populate]=*`,
    );

    const data = await resp.json();

    if (!resp.ok) {
      return buildJsonError(data?.error || "Unable to fetch cart items.", resp.status);
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cart fetch failed.";
    const status =
      error instanceof Error && error.message === "Missing authentication token."
        ? 401
        : 500;
    return buildJsonError(message, status);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = await fetchCurrentUser(request);

    if (!user?.id) {
      return buildJsonError("Authenticated user not found.", 401);
    }

    const resolvePayloadData = (value: any) => {
      if (value && typeof value === "object") {
        return value.data && typeof value.data === "object" ? value.data : value;
      }
      return {};
    };

    const payload = {
      data: {
        ...resolvePayloadData(body),
        userId: user.id,
      },
    };

    const resp = await strapiFetch(request, "/user-carts", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await resp.json();

    if (!resp.ok) {
      return buildJsonError(data?.error || "Unable to add to cart.", resp.status);
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add to cart.";
    const status =
      error instanceof Error && error.message === "Missing authentication token."
        ? 401
        : 500;
    return buildJsonError(message, status);
  }
}
