import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  checkAdminPassword,
  createAdminSessionValue,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  if (!process.env.ADMIN_PASSCODE) {
    return NextResponse.json(
      { message: "Admin passcode is not configured." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!checkAdminPassword(password)) {
    return NextResponse.json({ message: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createAdminSessionValue(), adminCookieOptions());
  return response;
}
