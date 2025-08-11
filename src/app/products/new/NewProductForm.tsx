"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "./actions";

export default function NewProductForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const formData = new FormData(e.currentTarget);

    const res = await createProduct(formData);
    setPending(false);

    if (res.ok) {
      router.push("/products");
    } else {
      setError(res.error || "Failed to create product.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-2xl bg-white border border-[#d7ccc8] rounded-lg p-6 space-y-4"
      encType="multipart/form-data"
    >
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div>
        <label className="block text-sm mb-1">Name</label>
        <input name="name" required className="w-full border rounded p-2 border-[#d7ccc8]" />
      </div>

      <div>
        <label className="block text-sm mb-1">Price (e.g. $28)</label>
        <input name="price" required className="w-full border rounded p-2 border-[#d7ccc8]" />
      </div>

      <div>
        <label className="block text-sm mb-1">Description</label>
        <textarea name="description" rows={4} required className="w-full border rounded p-2 border-[#d7ccc8]" />
      </div>

      <div>
        <label className="block text-sm mb-1">
          Categories (comma-separated, e.g. kitchen, tableware)
        </label>
        <input name="categories" className="w-full border rounded p-2 border-[#d7ccc8]" />
      </div>

      <div>
        <label className="block text-sm mb-1">Image</label>
        <input name="image" type="file" accept="image/*" required className="block" />
        <p className="text-xs text-[#6b6b6b] mt-1">Upload a product photo (PNG/JPG/WebP).</p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className={`px-4 py-2 rounded-lg text-white ${pending ? "bg-gray-400" : "bg-[#8d6e63] hover:bg-[#6d534a]"}`}
      >
        {pending ? "Saving..." : "Create Product"}
      </button>
    </form>
  );
}
