import { NextResponse } from "next/server";
import { sendCartAddedEmail } from "@/lib/email/resend";
import type { CartAddedEmailInput } from "@/lib/email/templates";

type RequestBody = {
  to?: string;
  payload?: CartAddedEmailInput;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;

    if (!body.to || !body.payload?.productName || !body.payload?.quantity) {
      return NextResponse.json(
        { error: "Missing required fields: to, payload.productName, payload.quantity" },
        { status: 400 }
      );
    }

    const result = await sendCartAddedEmail(body.to, body.payload);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
