"use client";

import { useSession, signOut } from "next-auth/react";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading" || !session?.user) return null;

  return (
    <header className="w-full bg-[#fdfaf6] px-6 py-4 flex justify-end">
      <div className="flex items-center gap-3">
        <span className="text-sm">
          Logged in as <strong>{session.user.name || session.user.email}</strong>
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm text-[#8d6e63] hover:underline"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
