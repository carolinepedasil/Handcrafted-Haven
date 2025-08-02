import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fdfaf6] text-[#171717] flex flex-col items-center justify-center px-6 py-12 text-center">
      <h1 className="text-4xl font-serif text-[#8d6e63] mb-6">
        Welcome to Handcrafted Haven
      </h1>
      <p className="text-lg max-w-xl mb-10">
        Discover beautiful, handmade products by talented artisans.
        <br />
        Shop unique creations crafted with care and intention.
      </p>
      <Link
        href="/products"
        className="bg-[#8d6e63] text-white px-6 py-3 rounded-full text-lg hover:bg-[#6d534a] transition"
      >
        Browse Products
      </Link>
    </main>
  );
}
