"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

function uniqueCategories(list) {
  const set = new Set();
  for (const p of list) {
    const cats = Array.isArray(p.categories) ? p.categories : [];
    for (const c of cats) set.add(c);
  }
  return Array.from(set).sort();
}

function toNumericPrice(price) {
  if (typeof price === "number") return price;
  const s = String(price ?? "").trim();
  const cleaned = s.replace(/[^\d.,-]/g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

export default function ProductsClient({ products }) {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const initialQuery = searchParams.get("query") ?? "";
  const initialCategories = (searchParams.get("categories") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const initialMin = searchParams.get("minPrice");
  const initialMax = searchParams.get("maxPrice");

  const [query, setQuery] = useState(initialQuery);
  const [selectedCats, setSelectedCats] = useState(initialCategories);
  const [minPrice, setMinPrice] = useState(initialMin ?? "");
  const [maxPrice, setMaxPrice] = useState(initialMax ?? "");

  const normalizedProducts = useMemo(() => {
    return (products || []).map((p) => {
      if (Array.isArray(p.categories)) return p;
      if (typeof p.categories === "string" && p.categories.trim()) {
        try {
          const parsed = JSON.parse(p.categories);
          if (Array.isArray(parsed)) return { ...p, categories: parsed };
        } catch {
          const split = p.categories
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
          return { ...p, categories: split };
        }
      }
      return { ...p, categories: [] };
    });
  }, [products]);

  const allCategories = useMemo(
    () => uniqueCategories(normalizedProducts),
    [normalizedProducts]
  );

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (query) params.set("query", query);
      else params.delete("query");

      if (selectedCats.length) params.set("categories", selectedCats.join(","));
      else params.delete("categories");

      if (minPrice) params.set("minPrice", minPrice);
      else params.delete("minPrice");

      if (maxPrice) params.set("maxPrice", maxPrice);
      else params.delete("maxPrice");

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, selectedCats, minPrice, maxPrice]);

  const toggleCategory = (cat) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const clearCategories = () => setSelectedCats([]);

  const clearPrice = () => {
    setMinPrice("");
    setMaxPrice("");
  };

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    return normalizedProducts.filter((p) => {
      const matchesText =
        !term || 
        `${p.name} ${p.description ?? ""}`.toLowerCase().includes(term);

      const matchesCats =
        selectedCats.length === 0 ||
        p.categories.some((c) => selectedCats.includes(c));

      const priceNum = toNumericPrice(p.price);
      const minNum = minPrice ? parseFloat(minPrice) : null;
      const maxNum = maxPrice ? parseFloat(maxPrice) : null;

      const withinMin = minNum == null || (Number.isFinite(priceNum) && priceNum >= minNum);
      const withinMax = maxNum == null || (Number.isFinite(priceNum) && priceNum <= maxNum);

      return matchesText && matchesCats && withinMin && withinMax;
    });
  }, [query, selectedCats, minPrice, maxPrice, normalizedProducts]);

  return (
    <main className="min-h-screen bg-[#fdfaf6] px-6 py-10 text-[#171717]">
      <header className="max-w-7xl mx-auto mb-6 flex items-center justify-end">
        {status === "loading" ? null : session?.user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm">
              Logged in as{" "}
              <strong>{session.user.name || session.user.email}</strong>
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-[#8d6e63] hover:underline"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/signup"
              className="px-3 py-1 rounded border border-[#8d6e63] text-[#8d6e63] hover:bg-[#f5efec] text-sm"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="px-3 py-1 rounded bg-[#8d6e63] text-white hover:bg-[#6d534a] text-sm"
            >
              Login
            </Link>
          </div>
        )}
      </header>

      <h1 className="text-3xl font-serif text-center text-[#8d6e63] mb-6">
        Featured Handmade Products
      </h1>

      <section
        aria-label="Product filters"
        className="max-w-7xl mx-auto mb-8 space-y-4"
      >
        <div className="flex items-center justify-between gap-3 w-full flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <label htmlFor="query" className="sr-only">
              Search products
            </label>
            <input
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or description…"
              className="w-72 md:w-80 rounded-lg border border-[#d7ccc8] bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-[#8d6e63]/40"
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

            <div className="flex items-center gap-2">
              <span className="text-sm text-[#6b6b6b] mr-1">Price:</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-20 rounded-lg border border-[#d7ccc8] bg-white px-3 py-1 outline-none focus:ring-2 focus:ring-[#8d6e63]/30 text-sm"
              />
              <span className="text-sm text-[#6b6b6b]">–</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-20 rounded-lg border border-[#d7ccc8] bg-white px-3 py-1 outline-none focus:ring-2 focus:ring-[#8d6e63]/30 text-sm"
              />
              {(minPrice || maxPrice) && (
                <button
                  onClick={clearPrice}
                  className="text-xs underline text-[#8d6e63]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {session?.user?.role === "seller" && (
            <Link
              href="/products/new"
              className="px-4 py-2 rounded-lg bg-[#8d6e63] text-white hover:bg-[#6d534a]"
            >
              Add Product
            </Link>
          )}
        </div>

        <div className="flex flex-wrap gap-2 items-center mt-2">
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
          {(minPrice || maxPrice) && (
            <>
              {" "}
              in price{" "}
              <span className="font-semibold">
                {minPrice ? `$${minPrice}` : "any"} –{" "}
                {maxPrice ? `$${maxPrice}` : "any"}
              </span>
            </>
          )}
          {selectedCats.length > 0 && (
            <>
              {" "}
              under{" "}
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
                {(Array.isArray(product.categories) ? product.categories : []).map((c) => (
                  <span
                    key={c}
                    className="text-xs capitalize bg-[#fdfaf6] border border-[#d7ccc8] rounded-full px-2 py-0.5 text-[#6b6b6b]"
                  >
                    {c.replace("-", " ")}
                  </span>
                ))}
              </div>
              <span className="mt-auto text-lg font-semibold text-[#8d6e63]">
                {String(product.price).startsWith("$") ? product.price : `$${product.price}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
