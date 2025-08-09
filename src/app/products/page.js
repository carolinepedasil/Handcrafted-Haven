import { Suspense } from "react";
import ProductsClient from "./products-client";

export const metadata = {
  title: "Handcrafted Haven — Products",
  description: "Browse our handmade products.",
};

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#fdfaf6] px-6 py-10 text-[#171717]">
          <h1 className="text-3xl font-serif text-center text-[#8d6e63] mb-6">
            Featured Handmade Products
          </h1>
          <p className="max-w-7xl mx-auto text-[#555]">Loading products…</p>
        </main>
      }
    >
      <ProductsClient />
    </Suspense>
  );
}
