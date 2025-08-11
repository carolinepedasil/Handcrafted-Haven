import { db } from "@/db/client";
import { reviews } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getReviewsByProduct(productId) {
  return await db.select().from(reviews).where(eq(reviews.productId, productId)).orderBy(reviews.createdAt);
}
