import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import NewProductForm from "./NewProductForm";

export const runtime = "nodejs";

export default async function NewProductPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?cb=/products/new");
  if (session.user.role !== "seller") redirect("/products");

  return (
    <main className="min-h-screen bg-[#fdfaf6] flex flex-col items-center justify-center px-6 py-10 text-[#171717]">
      <h1 className="text-3xl font-serif text-[#8d6e63] mb-6 text-center">Add New Product</h1>
      <NewProductForm />
    </main>
  );
}
