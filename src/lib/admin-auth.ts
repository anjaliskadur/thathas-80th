import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "admin_session";
const MAX_AGE_SEC = 7 * 24 * 60 * 60;

function passcode(): string | undefined {
  return process.env.ADMIN_PASSCODE;
}

function sign(payload: string): string {
  const secret = passcode();
  if (!secret) throw new Error("ADMIN_PASSCODE is not set");
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

function verifyToken(token: string): boolean {
  const secret = passcode();
  if (!secret) return false;

  const lastDot = token.lastIndexOf(".");
  if (lastDot <= 0) return false;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  if (!payload || !sig) return false;

  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }

  const expMatch = /^exp:(\d+)$/.exec(payload);
  if (!expMatch) return false;
  const exp = Number(expMatch[1]);
  return Number.isFinite(exp) && Date.now() < exp;
}

export function checkAdminPassword(password: string): boolean {
  const expected = passcode();
  if (!expected || !password) return false;
  try {
    const a = Buffer.from(password);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function createAdminSessionValue(): string {
  const exp = Date.now() + MAX_AGE_SEC * 1000;
  return sign(`exp:${exp}`);
}

export function adminCookieOptions(maxAge = MAX_AGE_SEC) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return verifyToken(token);
}

export async function requireAdmin(): Promise<boolean> {
  return isAdminAuthenticated();
}
