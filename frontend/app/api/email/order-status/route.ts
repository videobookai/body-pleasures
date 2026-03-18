import { NextResponse } from "next/server";
import { sendOrderStatusEmail } from "@/lib/email/resend";
import type { OrderStatusEmailInput } from "@/lib/email/templates";

type RequestBody = {
  to?: string;
  payload?: OrderStatusEmailInput;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;

    if (!body.to || !body.payload?.orderStatus) {
      return NextResponse.json(
        { error: "Missing required fields: to, payload.orderStatus" },
        { status: 400 }
      );
    }

    const result = await sendOrderStatusEmail(body.to, body.payload);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
