import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Rotas internas / públicas
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/redirecting"
  ) {
    return NextResponse.next()
  }

  const session = await auth()
  const tenantId = session?.user?.tenant_id ?? null

  /**
   * NÃO autenticado
   */
  if (!session) {
    if (pathname.startsWith("/app") || pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    return NextResponse.next()
  }

  /**
   * LOGADO → não pode acessar login
   */
  if (pathname === "/login") {
    return NextResponse.redirect(
      new URL(tenantId === null ? "/admin" : "/app", req.url)
    )
  }

  /**
   * ADMIN não acessa APP
   */
  if (tenantId === null && pathname.startsWith("/app")) {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  /**
   * TENANT não acessa ADMIN
   */
  if (tenantId !== null && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/app", req.url))
  }

  return NextResponse.next()
}
