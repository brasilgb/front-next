"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import { redirect } from 'next/navigation';

export type State = {
    errors?: {
        [key: string]: string[] | undefined;
    };
    message?: string | null;
};


const loginSchema = z.object({
    email: z.email("Digite um e-mail válido."),
    password: z.string().min(1, "A senha não pode ser vazia."),
});

const registerSchema = z.object({
    company: z.string().min(1, "A Razão Social não pode ser vazia."),
    cnpj: z.string().min(1, "O CNPJ não pode ser vazio."),
    fullName: z.string().min(1, "O Nome Completo não pode ser vazio."),
    email: z.email("Digite um e-mail válido."),
    phone: z.string().min(1, "O Telefone não pode ser vazio."),
    whatsapp: z.string().min(1, "O Whatsapp não pode ser vazio."),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
    passwordConfirmation: z.string()
}).refine(data => data.password === data.passwordConfirmation, {
    message: "As senhas não conferem.",
    path: ["passwordConfirmation"], // campo que receberá o erro
});

export async function authenticate(
    prevState: State | undefined,
    formData: FormData
) {
    try {
        // Converte o FormData em objeto
        const data = Object.fromEntries(formData);

        // 2. Valida os dados ANTES de chamar o signIn
        const validatedFields = loginSchema.safeParse(data);

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: 'Erro de validação. Por favor, corrija os campos destacados.',
            };
        }

        await signIn("credentials", {
            ...data,
            redirectTo: "/", // Manda pra raiz
        });
    } catch (error) {

        if ((error as Error).message.includes("NEXT_REDIRECT")) {
            throw error;
        }

        if (error instanceof AuthError) {
            // Aqui pegamos a mensagem que definimos no InvalidLoginError lá no auth.ts
            return { message: error.message };
        }

        // Erro genérico
        return { message: "Algo deu errado. Tente novamente." };
    }
}

export async function registerTenant(
    prevState: State | undefined,
    formData: FormData
) {
    
    try {
        const data = Object.fromEntries(formData);

        const validatedFields = registerSchema.safeParse(data);

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: 'Erro de validação. Por favor, corrija os campos destacados.',
            };
        }

        const { data: validatedData } = validatedFields;

        // TODO: Chamar a API de backend para registrar o tenant
        // Exemplo:
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validatedData),
        });
        if (!response.ok) {
          const errorData = await response.json();
          return { message: errorData.message || "Falha ao registrar. Verifique os dados." };
        }

    } catch (error) {
        return { message: "Algo deu errado. Tente novamente." };
    }

    // Se tudo deu certo, redireciona para a página de login.
    // O `redirect` deve ser chamado fora do bloco try/catch.
    redirect('/login?registered=true');
}