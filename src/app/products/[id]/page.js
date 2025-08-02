import Image from "next/image";
import { notFound } from "next/navigation";
import products from "@/data/products.json";

export default function ProductDetailPage({ params }) {
  const { id } = params;
  const product = products.find((p) => p.id === id);

  if (!product) return notFound();

  return (
    <main className="min-h-screen bg-[#fdfaf6] px-6 py-10 text-[#171717]">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="relative w-full md:w-1/2 h-80 md:h-[400px] rounded overflow-hidden shadow">
          <Image src={product.image} alt={product.name} layout="fill" objectFit="cover" />
        </div>

        <div className="flex flex-col gap-4 md:w-1/2">
          <h1 className="text-3xl font-serif text-[#8d6e63]">{product.name}</h1>
          <p className="text-lg">{product.description}</p>
          <p className="text-xl font-semibold text-[#8d6e63]">{product.price}</p>
          <p className="text-sm text-[#555]">
            Sold by: <span className="font-semibold">{product.seller}</span>
          </p>
        </div>
      </div>

      <section className="mt-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-serif text-[#8d6e63] mb-4">Reviews</h2>
        {product.reviews.length === 0 ? (
          <p className="text-[#777]">No reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {product.reviews.map((review, idx) => (
              <li key={idx} className="border-b pb-4">
                <p className="font-semibold">{review.name}</p>
                <p className="text-yellow-600">{"★".repeat(review.rating)}</p>
                <p>{review.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
