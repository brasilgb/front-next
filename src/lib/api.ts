import { auth } from "@/auth";
import { redirect } from "next/navigation";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

interface FetchOptions extends RequestInit {
    // Você pode adicionar opções extras aqui se precisar
}

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const session = await auth() as any;

    // Garante que o endpoint comece com /
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`, // Injeta o token automaticamente
            ...options.headers,
        },
    });

    if (res.status === 401) {
        // Em vez de mandar pro login direto, manda pra tela de aviso
        redirect("/session-expired");
    }

    // Tratamento centralizado de erros
    if (!res.ok) {
        // Se o token expirou (401), você pode tratar aqui ou lançar erro
        const errorBody = await res.text();
        console.error(`Erro na API [${endpoint}]:`, errorBody);
        throw new Error(`Erro API: ${res.statusText}`);
    }

    // Se a resposta for 204 (No Content), retorna null
    if (res.status === 204) return null as T;

    return res.json();
}