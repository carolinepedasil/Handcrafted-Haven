"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/db/client";
import { products } from "@/db/schema";
import { randomUUID } from "crypto";
import { put } from "@vercel/blob"; 
import path from "path";

export async function createProduct(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { ok: false, error: "Not authenticated" };
  if (session.user.role !== "seller") return { ok: false, error: "Only sellers can create products" };
  const sellerId = session.user.id;
  if (!sellerId) return { ok: false, error: "Missing user id in session" };

  const name = String(formData.get("name") || "").trim();
  const price = String(formData.get("price") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const categoriesRaw = String(formData.get("categories") || "").trim();
  const imageFile = formData.get("image") as File | null;

  if (!name || !price || !description || !imageFile) {
    return { ok: false, error: "Missing required fields" };
  }

  const categoriesArray = categoriesRaw
    ? categoriesRaw.split(",").map(s => s.trim()).filter(Boolean)
    : [];

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return { ok: false, error: "Missing BLOB_READ_WRITE_TOKEN (did you set it and restart the dev server?)" };
  }

  const ext = (imageFile.name?.split(".").pop() || "png").toLowerCase();
  const filename = `uploads/${randomUUID()}.${ext}`;
  const arrayBuffer = await imageFile.arrayBuffer();

  const { url } = await put(filename, arrayBuffer, {
    access: "public",
    token,
  });

  await db.insert(products).values({
    name,
    price,
    image: url,
    description,
    categories: JSON.stringify(categoriesArray),
    sellerId,
  } as any);

  return { ok: true };
}
