import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db/client";
import { reviews, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

const postSchema = z.object({
  name: z.string().trim().max(120).optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(1).max(1000),
});

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const productId = params.id;
  const exists = await db.select({ id: products.id }).from(products).where(eq(products.id, productId));
  if (!exists.length) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const rows = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, productId))
    .orderBy(reviews.createdAt);

  return NextResponse.json({ reviews: rows });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const productId = params.id;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const exists = await db.select({ id: products.id }).from(products).where(eq(products.id, productId));
  if (!exists.length) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const { rating, comment } = parsed.data;
  const name = parsed.data.name?.trim() || session.user.name || session.user.email || "Anonymous";
  const userId = (session.user as any).id || null;

  const [inserted] = await db
    .insert(reviews)
    .values({ productId, userId, name, rating, comment })
    .returning();

  return NextResponse.json({ review: inserted }, { status: 201 });
}
