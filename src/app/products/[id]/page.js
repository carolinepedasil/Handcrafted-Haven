import Image from "next/image";
import { notFound } from "next/navigation";
import ProductReviews from "@/components/ProductReviews";
import { getProductById } from "@/lib/products";

export async function generateStaticParams() {
  const { getAllProducts } = await import("@/lib/products");
  const products = await getAllProducts();
  return products.map((p) => ({ id: String(p.id) }));
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return notFound();

  let categories = [];
  if (Array.isArray(product.categories)) categories = product.categories;
  else if (typeof product.categories === "string" && product.categories.trim()) {
    try {
      const parsed = JSON.parse(product.categories);
      if (Array.isArray(parsed)) categories = parsed;
    } catch {
      categories = product.categories.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }

  return (
    <main className="min-h-screen bg-[#fdfaf6] px-6 py-10 text-[#171717]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-[#d7ccc8] bg-white">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col">
          <h1 className="text-3xl font-serif text-[#8d6e63]">{product.name}</h1>
          <p className="mt-2 text-sm text-[#444]">{product.description}</p>

          {categories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((c) => (
                <span 
                  key={c} 
                  className="rounded-full bg-white border border-[#d7ccc8] px-3 py-1 text-xs capitalize"
                >
                  {c.replace("-", " ")}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6">
            <span className="text-2xl font-semibold text-[#8d6e63]">
              ${product.price}
            </span>
          </div>

          <ProductReviews productId={product.id} />
        </div>
      </div>
    </main>
  );
}
