import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import AuthStatus from "@/components/AuthStatus";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const authed = !!session?.user;

  return (
    <main className="min-h-screen bg-[#fdfaf6] text-[#171717] flex flex-col">
      <div className="w-full relative h-[300px] sm:h-[400px] lg:h-[500px]">
        <Image
          src="/HandcraftedHaven.jpg"
          alt="Handcrafted Haven"
          fill
          priority
          className="object-cover"
        />
      </div>

      {authed && <AuthStatus />}

      <div className="flex flex-col items-center justify-center px-6 py-12 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif text-[#8d6e63] mb-6">
          Welcome to Handcrafted Haven
        </h1>

        <p className="text-lg mb-10">
          Discover beautiful, handmade products by talented artisans.
          <br />
          Shop unique creations crafted with care and intention.
        </p>

        {!authed && (
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Link
              href="/signup"
              className="bg-white text-[#8d6e63] border border-[#8d6e63] px-6 py-3 rounded-full text-lg hover:bg-[#f5efec] transition"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="bg-white text-[#8d6e63] border border-[#8d6e63] px-6 py-3 rounded-full text-lg hover:bg-[#f5efec] transition"
            >
              Login
            </Link>
          </div>
        )}

        <Link
          href="/products"
          className="bg-[#8d6e63] text-white px-6 py-3 rounded-full text-lg hover:bg-[#6d534a] transition"
        >
          {authed ? "Go to Products" : "Browse Products"}
        </Link>
      </div>
    </main>
  );
}
