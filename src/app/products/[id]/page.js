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
  const product = await getProductById(Number(params.id));
  if (!product) return notFound();

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

          <div className="mt-4 flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-white border border-[#d7ccc8] px-3 py-1 text-sm">
              Seller: <span className="ml-1 font-medium">{product.seller}</span>
            </span>
            {Array.isArray(product.categories) && product.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.categories.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-white border border-[#d7ccc8] px-3 py-1 text-xs"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6">
            <span className="text-2xl font-semibold text-[#8d6e63]">
              {product.price}
            </span>
          </div>

          <ProductReviews
            productId={product.id}
            initialReviews={product.reviews || []}
          />
        </div>
      </div>
    </main>
  );
}
