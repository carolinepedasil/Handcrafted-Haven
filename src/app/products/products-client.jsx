"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import products from "@/data/products.json";

function uniqueCategories(list) {
  const set = new Set();
  for (const p of list) for (const c of p.categories || []) set.add(c);
  return Array.from(set).sort();
}

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const initialQuery = searchParams.get("query") ?? "";
  const initialCategories = (searchParams.get("categories") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const [query, setQuery] = useState(initialQuery);
  const [selectedCats, setSelectedCats] = useState(initialCategories);

  const allCategories = useMemo(() => uniqueCategories(products), []);

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) params.set("query", query);
      else params.delete("query");

      if (selectedCats.length) params.set("categories", selectedCats.join(","));
      else params.delete("categories");

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, selectedCats]);

  const toggleCategory = (cat) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const clearCategories = () => setSelectedCats([]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    return products.filter((p) => {
      const matchesText =
        !term ||
        `${p.name} ${p.description}`.toLowerCase().includes(term);

      const matchesCats =
        selectedCats.length === 0 ||
        (p.categories || []).some((c) => selectedCats.includes(c));

      return matchesText && matchesCats;
    });
  }, [query, selectedCats]);

  return (
    <main className="min-h-screen bg-[#fdfaf6] px-6 py-10 text-[#171717]">
      <h1 className="text-3xl font-serif text-center text-[#8d6e63] mb-6">
        Featured Handmade Products
      </h1>

      <section
        aria-label="Product filters"
        className="max-w-7xl mx-auto mb-8 space-y-4"
      >
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="query" className="sr-only">
            Search products
          </label>
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
              className="text-sm underline text-[#8d6e63]"
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-[#6b6b6b] mr-1">Categories:</span>
          <button
            onClick={clearCategories}
            className={`px-3 py-1 rounded-full border transition
              ${
                selectedCats.length === 0
                  ? "bg-[#8d6e63] text-white border-[#8d6e63]"
                  : "bg-white text-[#8d6e63] border-[#d7ccc8] hover:border-[#8d6e63]"
              }`}
            aria-pressed={selectedCats.length === 0}
          >
            All
          </button>

          {allCategories.map((cat) => {
            const active = selectedCats.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1 rounded-full border transition capitalize
                  ${
                    active
                      ? "bg-[#8d6e63] text-white border-[#8d6e63]"
                      : "bg-white text-[#8d6e63] border-[#d7ccc8] hover:border-[#8d6e63]"
                  }`}
                aria-pressed={active}
              >
                {cat.replace("-", " ")}
              </button>
            );
          })}
        </div>
      </section>

      {filtered.length === 0 ? (
        <p className="max-w-7xl mx-auto text-[#555]">
          No results
          {query && (
            <>
              {" "}
              for <span className="font-semibold">&quot;{query}&quot;</span>
            </>
          )}
          {selectedCats.length > 0 && (
            <>
              {" "}
              in{" "}
              <span className="font-semibold">
                {selectedCats.map((c) => c.replace("-", " ")).join(", ")}
              </span>
            </>
          )}
          . Try adjusting your filters.
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
              <p className="text-sm text-[#444] mt-1 mb-2">
                {product.description}
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                {(product.categories || []).map((c) => (
                  <span
                    key={c}
                    className="text-xs capitalize bg-[#fdfaf6] border border-[#d7ccc8] rounded-full px-2 py-0.5 text-[#6b6b6b]"
                  >
                    {c.replace("-", " ")}
                  </span>
                ))}
              </div>
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
