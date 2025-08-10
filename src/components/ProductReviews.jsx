"use client";

import { useEffect, useState } from "react";

function loadLocalReviews(productId) {
  try {
    const raw = localStorage.getItem(`reviews:${productId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalReviews(productId, reviews) {
  localStorage.setItem(`reviews:${productId}`, JSON.stringify(reviews));
}

function Stars({ rating }) {
  return (
    <div className="flex" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          viewBox="0 0 20 20"
          className={`w-4 h-4 ${
            n <= rating ? "fill-[#8d6e63]" : "fill-[#d7ccc8]"
          }`}
          aria-hidden="true"
        >
          <path d="M10 1.5l2.59 5.25 5.8.84-4.2 4.09.99 5.77L10 14.9l-5.18 2.55.99-5.77-4.2-4.09 5.8-.84L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductReviews({ productId, initialReviews = [] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [form, setForm] = useState({ name: "", rating: "5", comment: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const local = loadLocalReviews(productId);
    if (local.length) {
      setReviews((prev) => {
        const combined = [...prev];
        for (const r of local) combined.push(r);
        return combined;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const name = form.name.trim() || "Anonymous";
    const rating = parseInt(form.rating, 10);
    const comment = form.comment.trim();

    if (!comment) {
      setError("Please add a short comment.");
      return;
    }
    if (Number.isNaN(rating) || rating < 1 || rating > 5) {
      setError("Rating must be between 1 and 5.");
      return;
    }

    const newReview = {
      name,
      rating,
      comment,
      date: new Date().toISOString(),
    };

    const local = loadLocalReviews(productId);
    const nextLocal = [...local, newReview];
    saveLocalReviews(productId, nextLocal);

    setReviews((prev) => [...prev, newReview]);
    setForm({ name: "", rating: "5", comment: "" });
  }

  return (
    <section aria-labelledby="reviews-heading" className="mt-10">
      <h2
        id="reviews-heading"
        className="text-2xl font-serif text-[#8d6e63] mb-4"
      >
        Reviews
      </h2>

      {reviews.length === 0 ? (
        <p className="text-sm text-[#444]">No reviews yet — be the first!</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r, idx) => (
            <li
              key={`${r.name}-${idx}-${r.date ?? idx}`}
              className="rounded-lg border border-[#d7ccc8] bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">{r.name}</p>
                <Stars rating={r.rating} />
              </div>
              <p className="mt-2 text-sm text-[#444]">{r.comment}</p>
              {r.date && (
                <p className="mt-1 text-xs text-[#777]">
                  {new Date(r.date).toLocaleDateString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-xl border border-[#d7ccc8] bg-white p-4"
      >
        <h3 className="text-lg font-serif text-[#8d6e63] mb-3">
          Leave a review
        </h3>

        {error && (
          <p className="mb-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="block text-sm mb-1">Your name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full rounded-md border border-[#d7ccc8] p-2 outline-none focus:ring-2 focus:ring-[#8d6e63]/40"
            />
          </label>

          <label className="block">
            <span className="block text-sm mb-1">Rating</span>
            <select
              name="rating"
              value={form.rating}
              onChange={handleChange}
              className="w-full rounded-md border border-[#d7ccc8] p-2 outline-none focus:ring-2 focus:ring-[#8d6e63]/40"
              aria-label="Star rating from 1 to 5"
            >
              <option value="5">★★★★★ (5)</option>
              <option value="4">★★★★☆ (4)</option>
              <option value="3">★★★☆☆ (3)</option>
              <option value="2">★★☆☆☆ (2)</option>
              <option value="1">★☆☆☆☆ (1)</option>
            </select>
          </label>
        </div>

        <label className="block mt-4">
          <span className="block text-sm mb-1">Comment</span>
          <textarea
            name="comment"
            value={form.comment}
            onChange={handleChange}
            rows={4}
            required
            className="w-full rounded-md border border-[#d7ccc8] p-2 outline-none focus:ring-2 focus:ring-[#8d6e63]/40"
            placeholder="Share your thoughts…"
          />
        </label>

        <button
          type="submit"
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-[#8d6e63] px-4 py-2 font-medium text-white hover:opacity-90"
        >
          Submit review
        </button>
      </form>
    </section>
  );
}
