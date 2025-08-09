"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import products from "@/data/products.json";

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const initialQuery = searchParams.get("query") ?? "";
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) params.set("query", query);
      else params.delete("query");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return products;
    return products.filter((p) => {
      const hay = `${p.name} ${p.description}`.toLowerCase();
      return hay.includes(term);
    });
  }, [query]);

  return (
    <main className="min-h-screen bg-[#fdfaf6] px-6 py-10 text-[#171717]">
      <h1 className="text-3xl font-serif text-center text-[#8d6e63] mb-6">
        Featured Handmade Products
      </h1>

      <div className="max-w-7xl mx-auto mb-8">
        <label htmlFor="query" className="sr-only">Search products</label>
        <input
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or description…"
          className="w-full md:w-96 rounded-lg border border-[#d7ccc8] bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-[#8d6e63]/40"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="ml-3 text-sm underline text-[#8d6e63]"
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="max-w-7xl mx-auto text-[#555]">
          No results for <span className="font-semibold">&quot;{query}&quot;</span>. Try a different keyword.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md border border-[#d7ccc8] p-4 flex flex-col"
            >
              <div className="relative w-full h-52 mb-4 rounded overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <Link href={`/products/${product.id}`}>
                <h2 className="text-xl font-serif text-[#8d6e63] hover:underline cursor-pointer">
                  {product.name}
                </h2>
              </Link>
              <p className="text-sm text-[#444] mt-1 mb-2">{product.description}</p>
              <span className="mt-auto text-lg font-semibold text-[#8d6e63]">
                {product.price}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
