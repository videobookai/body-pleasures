import { NextRequest, NextResponse } from "next/server";
import { strapiFetch } from "@/lib/server/strapiClient";

const buildJsonError = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const { documentId } = await params;

  if (!documentId) {
    return buildJsonError("documentId is required.", 400);
  }

  try {
    const resp = await strapiFetch(request, `/user-carts/${documentId}`, {
      method: "DELETE",
    });

    const contentType = resp.headers.get("content-type") ?? "";
    const hasJsonBody = contentType.includes("application/json");
    const data = hasJsonBody ? await resp.json().catch(() => null) : null;

    if (!resp.ok) {
      return buildJsonError(data?.error || "Unable to delete cart item.", resp.status);
    }

    return NextResponse.json(data ?? { success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete cart item.";
    const status = error instanceof Error && error.message === "Missing authentication token." ? 401 : 500;
    return buildJsonError(message, status);
  }
}
