"use server";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export async function doLogin(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const cb = String(formData.get("cb") || "/dashboard");
  await signIn("credentials", { email, password, redirect: false });
  redirect(cb);
}
