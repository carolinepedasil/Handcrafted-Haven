import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

export async function requireSeller() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/sell");
  }
  if (session.user.role !== "seller") {
    redirect("/products");
  }
  return session;
}
