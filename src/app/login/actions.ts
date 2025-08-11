"use server";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

export async function doLogin(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const cb = String(formData.get("cb") || "/dashboard");
  await signIn("credentials", { email, password, callbackUrl: cb });
}
