import { db } from "@/db/client";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAllProducts() {
  return await db.select().from(products);
}

export async function getProductById(id) {
  const rows = await db.select().from(products).where(eq(products.id, id));
  return rows[0] || null;
}
