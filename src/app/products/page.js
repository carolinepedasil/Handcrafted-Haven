import ProductsClient from "./products-client";
import { db } from "@/db/client";
import { products as productsTable } from "@/db/schema";

export default async function ProductsPage() {
  const rows = await db.select().from(productsTable);

  const products = rows.map((p) => {
    let cats = [];
    if (Array.isArray(p.categories)) {
      cats = p.categories;
    } else if (typeof p.categories === "string" && p.categories.trim()) {
      try {
        const parsed = JSON.parse(p.categories);
        if (Array.isArray(parsed)) cats = parsed;
      } catch {
        cats = p.categories.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }
    return { ...p, categories: cats };
  });

  return <ProductsClient products={products} />;
}
