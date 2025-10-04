import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.formData();

  const name = payload.get("name");
  const email = payload.get("email");
  const message = payload.get("message");

  console.log("Contact form submission", { name, email, message });

  return NextResponse.json({ received: true });
}
