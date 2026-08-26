import { jwtVerify, SignJWT } from "jose";
import { deleteCookie, setCookie } from "@std/http/cookie";
import { getConfig, IS_WORKERS } from "@/lib/config.ts";

const COOKIE_NAME = "auth_token";

export async function createToken(): Promise<string> {
  const { JWT_SECRET, JWT_EXPIRY_HOURS } = await getConfig();
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not configured");
  const secret = new TextEncoder().encode(JWT_SECRET);
  return await new SignJWT()
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("admin")
    .setIssuedAt()
    .setExpirationTime(`${JWT_EXPIRY_HOURS}h`)
    .sign(secret);
}

export async function validateToken(
  token: string | undefined | null,
): Promise<boolean> {
  if (!token) return false;

  try {
    const { JWT_SECRET } = await getConfig();
    if (!JWT_SECRET) return false;
    const secret = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

export async function setAuthCookie(headers: Headers, token: string) {
  const { JWT_EXPIRY_HOURS } = await getConfig();
  setCookie(headers, {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: IS_WORKERS, // HTTPS only in production; local dev runs over plain http
    sameSite: "Lax", // CSRF protection
    maxAge: JWT_EXPIRY_HOURS * 60 * 60,
    path: "/",
  });
}

export function clearAuthCookie(headers: Headers) {
  deleteCookie(headers, COOKIE_NAME, { path: "/" });
}

export { COOKIE_NAME };
