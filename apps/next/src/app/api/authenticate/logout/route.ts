import { NextResponse } from "next/server";
import { TOKEN_COOKIE_NAME } from "$config/auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: TOKEN_COOKIE_NAME,
    value: "",
    path: "/",
    maxAge: 0,
  });
  return response;
}
