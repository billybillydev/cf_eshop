import { NextResponse } from "next/server";
import { TOKEN_COOKIE_NAME } from "$config/auth";
import { CustomerRepository } from "$infrastructure/repositories/user.repository";
import { EmailObject } from "@eshop/business/domain/value-objects";
import { Dat } from "@mosidev/dat";
import z from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(request: Request) {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    return NextResponse.json(
      { success: false, error: "Missing API_URL" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const parsedBody = loginSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  const userRepository = new CustomerRepository(apiUrl);
  const res = await userRepository.login(
    new EmailObject(parsedBody.data.email),
    parsedBody.data.password
  );

  if (!res.success) {
    return NextResponse.json(
      { success: false, error: res.error },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true, token: res.token });
  response.cookies.set({
    name: TOKEN_COOKIE_NAME,
    value: res.token,
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    expires: new Dat().addDays(7).valueOf(),
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
