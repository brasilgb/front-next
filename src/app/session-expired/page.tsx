// src/app/session-expired/page.tsx
"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, ShieldAlert } from "lucide-react"; // Se tiver lucide-react, senão use ícone SVG

export default function SessionExpiredPage() {
  
  // Limpa a sessão do NextAuth no navegador assim que a tela carrega
  useEffect(() => {
    signOut({ redirect: false, callbackUrl: "/login" });
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        
        {/* Ícone Animado/Destaque */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
          <ShieldAlert className="h-10 w-10 text-orange-600" />
          {/* Se não tiver lucide-react, troque a linha acima por um <svg> ou <span>⚠️</span> */}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Sua sessão expirou
        </h1>
        
        <p className="text-gray-500 mb-8 leading-relaxed">
          Por medidas de segurança, sua conexão foi encerrada devido à inatividade ou o token expirou.
        </p>

        <Link 
          href="/login" 
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          <span>Fazer Login Novamente</span>
          <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>

        <p className="mt-6 text-xs text-gray-400">
          Caso o problema persista, entre em contato com o suporte.
        </p>
      </div>
    </div>
  );
}