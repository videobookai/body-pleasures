import { NextResponse } from "next/server";
import GlobalApi from "@/app/_utils/GlobalApi";

export async function POST(request: Request) {
  const data = await request.json();
  try {
    const response = await GlobalApi.createContactForm(data);
    return NextResponse.json(response);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
