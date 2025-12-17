import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      tenant_id: number | null
      token?: string
    }
  }

  interface User {
    tenant_id: number | null
    token?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    tenant_id: number | null
    token?: string
  }
}

