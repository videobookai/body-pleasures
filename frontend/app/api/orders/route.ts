import { NextRequest, NextResponse } from "next/server";
import { fetchCurrentUser, strapiFetch } from "@/lib/server/strapiClient";

const buildJsonError = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });

export async function GET(request: NextRequest) {
  try {
    const user = await fetchCurrentUser(request);

    if (!user?.id) {
      return buildJsonError("Authenticated user not found.", 401);
    }

    const resp = await strapiFetch(
      request,
      `/orders?filters[userId][$eq]=${user.id}&populate[order][populate][product][populate]=images`,
    );

    const data = await resp.json();

    if (!resp.ok) {
      return buildJsonError(data?.error || "Unable to fetch orders.", resp.status);
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Order fetch failed.";
    const status = error instanceof Error && error.message === "Missing authentication token." ? 401 : 500;
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

    const payload = {
      data: {
        ...(body?.data ?? {}),
        userId: user.id,
      },
    };

    const resp = await strapiFetch(request, "/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await resp.json();

    if (!resp.ok) {
      return buildJsonError(data?.error || "Unable to create order.", resp.status);
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Order creation failed.";
    const status = error instanceof Error && error.message === "Missing authentication token." ? 401 : 500;
    return buildJsonError(message, status);
  }
}
