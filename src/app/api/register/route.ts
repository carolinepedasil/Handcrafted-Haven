export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(120),
  password: z.string().min(8),
  role: z.enum(["buyer", "seller"]),
});

export async function POST(req: Request) {
  try {
    if (!process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
      console.error("Missing POSTGRES_URL or DATABASE_URL");
      return NextResponse.json({ error: "DB not configured" }, { status: 500 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { email, name, password, role } = parsed.data;

    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await db.insert(users).values({ email, name, passwordHash, role });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
