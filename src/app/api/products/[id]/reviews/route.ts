import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db/client";
import { products, reviews } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

const ReviewSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(5000),
});

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const exists = await db.select({ id: products.id }).from(products).where(eq(products.id, id));
  if (!exists.length) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const rows = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, id))
    .orderBy(desc(reviews.createdAt));

  return NextResponse.json(rows, { status: 200 });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "buyer") {
    return NextResponse.json({ error: "Only buyers can leave reviews" }, { status: 403 });
  }

  const exists = await db.select({ id: products.id }).from(products).where(eq(products.id, id));
  
  if (!exists.length) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = ReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid review data" }, { status: 400 });
  }

  const { rating, comment, name } = parsed.data;
  const row = {
    productId: id,
    userId: session.user.id ?? null,
    name: name || session.user.name || session.user.email || "Anonymous",
    rating,
    comment,
  };

  const inserted = await db
    .insert(reviews)
    .values(row)
    .returning();

  return NextResponse.json(inserted[0], { status: 201 });
}
