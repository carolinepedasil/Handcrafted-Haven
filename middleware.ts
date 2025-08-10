import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isPrivate = req.nextUrl.pathname.startsWith("/dashboard");
  if (isPrivate && !token) {
    const login = new URL("/login", req.url);
    login.searchParams.set("cb", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
