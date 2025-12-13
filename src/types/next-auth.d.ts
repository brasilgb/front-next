import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      tenant_id: number | null;
      token: string; // O JWT da sua API Node
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    tenant_id: number | null;
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    tenant_id: number | null;
    token: string;
  }
}