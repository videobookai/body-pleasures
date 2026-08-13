import { NextRequest, NextResponse } from "next/server";
import { fetchCurrentUser, strapiFetch } from "@/lib/server/strapiClient";

const buildJsonError = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });

export async function POST(request: NextRequest) {
  try {
    const user = await fetchCurrentUser(request);

    if (!user?.id) {
      return buildJsonError("Authenticated user not found.", 401);
    }

    const cartResp = await strapiFetch(
      request,
      `/user-carts?filters[userId][$eq]=${user.id}&pagination[pageSize]=100`,
    );

    const cartData = await cartResp.json();

    if (!cartResp.ok) {
      return buildJsonError(cartData?.error || "Unable to fetch cart items.", cartResp.status);
    }

    const items = Array.isArray(cartData?.data) ? cartData.data : [];

    await Promise.all(
      items.map((item: any) =>
        strapiFetch(request, `/user-carts/${item.documentId ?? item.id}`, {
          method: "DELETE",
        }),
      ),
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to clear cart.";
    const status = error instanceof Error && error.message === "Missing authentication token." ? 401 : 500;
    return buildJsonError(message, status);
  }
}
