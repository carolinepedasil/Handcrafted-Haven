"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });

  const router = useRouter();

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email format";
    if (form.password.length < 8)
      e.password = "Password must be at least 8 characters";
    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const login = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (login?.error) {
        alert("Account created, but auto-login failed. Please sign in.");
        router.push("/login");
      } else {
        router.push("/products");
      }
    } else {
      const data = await res.json();
      alert(data.error || "Sign up failed");
    }
  }

  return (
    <main className="min-h-screen bg-[#fdfaf6] text-[#171717] flex flex-col items-center justify-center px-6 py-12">
      <div className="bg-white border border-[#d7ccc8] rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-3xl font-serif text-[#8d6e63] mb-6 text-center">
          Sign Up
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              className="w-full rounded-md border border-[#d7ccc8] p-2 outline-none focus:ring-2 focus:ring-[#8d6e63]/40"
            />
            {touched.name && errors.name && (
              <p className="text-red-600 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              className="w-full rounded-md border border-[#d7ccc8] p-2 outline-none focus:ring-2 focus:ring-[#8d6e63]/40"
            />
            {touched.email && errors.email && (
              <p className="text-red-600 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              className="w-full rounded-md border border-[#d7ccc8] p-2 outline-none focus:ring-2 focus:ring-[#8d6e63]/40"
            />
            {touched.password && errors.password && (
              <p className="text-red-600 text-sm">{errors.password}</p>
            )}
          </div>

          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full rounded-md border border-[#d7ccc8] p-2 outline-none focus:ring-2 focus:ring-[#8d6e63]/40"
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>

          <button
            type="submit"
            disabled={!isValid}
            className={`w-full px-4 py-2 rounded-lg transition ${
              isValid
                ? "bg-[#8d6e63] text-white hover:bg-[#6d534a]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-[#8d6e63] underline">
            Log In
          </Link>
        </p>
      </div>
    </main>
  );
}
