export const runtime = "edge";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function proxy(req: Request) {
  
    const session = await auth();
    const url = new URL(req.url);
    const pathname = url.pathname;

    // Rotas públicas
    if (
        pathname.startsWith("/login") ||
        pathname.startsWith("/api") ||
        pathname === "/"
    ) {
        return NextResponse.next();
    }

    // Usuário não autenticado
    if (!session?.user) {
        return NextResponse.redirect(new URL("/auth/login", url));
    }

    const tenantId = session.user.tenant_id;

    /**
     * ADMIN (tenant_id == null)
     */
    if (!tenantId) {
        // Admin tentando acessar área do app
        if (pathname.startsWith("/app")) {
            return NextResponse.redirect(new URL("/admin", url));
        }

        // Admin acessando qualquer coisa fora /admin
        if (!pathname.startsWith("/admin")) {
            return NextResponse.redirect(new URL("/admin", url));
        }

        return NextResponse.next();
    }

    /**
     * CLIENTE (tenant_id != null)
     */
    if (tenantId) {
        // Cliente tentando acessar admin
        if (pathname.startsWith("/admin")) {
            return NextResponse.redirect(new URL("/app", url));
        }

        // Cliente fora do /app
        if (!pathname.startsWith("/app")) {
            return NextResponse.redirect(new URL("/app", url));
        }
    }

    return NextResponse.next();
}


