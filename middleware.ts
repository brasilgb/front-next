import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/login");

  // Se estiver na página de login e já estiver logado, manda pra dashboard
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Se não estiver logado e tentar acessar rota protegida
  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

// Configuração para o middleware não rodar em arquivos estáticos/imagens
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};