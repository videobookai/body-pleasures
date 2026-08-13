import { NextRequest, NextResponse } from "next/server";
import { fetchCurrentUser } from "@/lib/server/strapiClient";

export async function GET(request: NextRequest) {
  try {
    const user = await fetchCurrentUser(request);
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
