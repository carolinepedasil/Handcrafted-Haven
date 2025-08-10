import ProductsClient from "./products-client";
import { db } from "@/db/client";
import { products as productsTable } from "@/db/schema";

export default async function ProductsPage() {
  const products = await db.select().from(productsTable);
  return <ProductsClient products={products} />;
}
