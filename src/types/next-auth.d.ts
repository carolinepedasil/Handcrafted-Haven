import "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    role?: "buyer" | "seller";
  }
  interface Session {
    user: {
      id?: string;
      role?: "buyer" | "seller";
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "buyer" | "seller";
  }
}
