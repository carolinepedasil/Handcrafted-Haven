"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await signIn("credentials", { email, password, redirect: false });
    if (!res?.error) router.push("/products");
    else alert("Invalid email or password");
  }

  return (
    <main className="min-h-screen bg-[#fdfaf6] text-[#171717] flex flex-col items-center justify-center px-6 py-12">
      <div className="bg-white border border-[#d7ccc8] rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-3xl font-serif text-[#8d6e63] mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full rounded-md border border-[#d7ccc8] p-2 outline-none focus:ring-2 focus:ring-[#8d6e63]/40" required />
          <input type="password" placeholder="Password" value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full rounded-md border border-[#d7ccc8] p-2 outline-none focus:ring-2 focus:ring-[#8d6e63]/40" required />
          <button type="submit" className="w-full bg-[#8d6e63] text-white px-4 py-2 rounded-lg hover:bg-[#6d534a] transition">
            Sign In
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Don't have an account? <Link href="/signup" className="text-[#8d6e63] underline">Sign Up</Link>
        </p>
      </div>
    </main>
  );
}
