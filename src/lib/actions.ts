"use server";

import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import { redirect } from 'next/navigation';
import { signOut } from "@/auth"

export type State = {
    fieldErrors?: {
        [key: string]: string[] | undefined;
    };
    formError?: string | null;   // erro geral do formulário
    success?: boolean;
};


const loginSchema = z.object({
    email: z.email("Digite um e-mail válido."),
    password: z.string().min(1, "A senha não pode ser vazia."),
});

const registerSchema = z.object({
    company: z.string().min(1, "A Razão Social não pode ser vazia."),
    cnpj: z.string().min(1, "O CNPJ não pode ser vazio."),
    name: z.string().min(1, "O Nome Completo não pode ser vazio."),
    email: z.email("Digite um e-mail válido."),
    phone: z.string().min(1, "O Telefone não pode ser vazio."),
    whatsapp: z.string().min(1, "O Whatsapp não pode ser vazio."),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
    password_confirmation: z.string()
}).refine(data => data.password === data.password_confirmation, {
    message: "As senhas não conferem.",
    path: ["password_confirmation"], // campo que receberá o erro
});

export async function authenticate(
    _prevState: State | undefined | void,
    formData: FormData
): Promise<State | void> {
    try {
        const data = Object.fromEntries(formData);

        const validated = loginSchema.safeParse(data);
        if (!validated.success) {
            return {
                fieldErrors: validated.error.flatten().fieldErrors,
                formError: "Corrija os campos destacados.",
            };
        }

        /**
         * 1. Login SEM redirect automático
         */
        await signIn("credentials", {
            ...validated.data,
            redirectTo: "/redirecting",
        });

        /**
         * 2. Buscar sessão já criada
         */
        const session = await auth();

        const tenantId = session?.user?.tenant_id ?? null;

        const callbackUrl = (data as any).callbackUrl as string | undefined;

        if (callbackUrl) return redirect(callbackUrl);

        /**
         * 3. Decidir destino
         */
        if (tenantId === null) {
            redirect("/admin");
        }

        redirect("/app");
    } catch (error) {
        if ((error as Error).message.includes("NEXT_REDIRECT")) {
            throw error;
        }

        if (error instanceof AuthError) {
            return {
                formError: "E-mail ou senha inválidos.",
            };
        }

        return {
            formError: "Erro inesperado. Tente novamente.",
        };
    }
}

export async function registerTenant(
    _prevState: State | undefined | void,
    formData: FormData
): Promise<State | void> {
    try {
        const data = Object.fromEntries(formData);

        const validated = registerSchema.safeParse(data);
        if (!validated.success) {
            return {
                fieldErrors: validated.error.flatten().fieldErrors,
                formError: "Corrija os campos destacados.",
            };
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(validated.data),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return {
                formError: errorData.message ?? "Não foi possível concluir o cadastro.",
            };
        }

    } catch {
        return {
            formError: "Erro inesperado ao registrar.",
        };
    }

    redirect("/login?registered=true");
}


export async function logoutAction() {
    await signOut({
        redirectTo: "/login",
    })
}