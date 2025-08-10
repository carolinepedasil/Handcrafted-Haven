import React from "react";
import { redirect } from "next/navigation";
import { requireSeller } from "@/lib/auth-server";

export default async function SellPage() {
  const session = await requireSeller();
  if (!session) redirect("/login");
  return redirect("/products");
}
