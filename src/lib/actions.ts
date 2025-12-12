"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const loginSchema = z.object({
    email: z.string().email("Digite um e-mail válido."),
    password: z.string().min(1, "A senha não pode ser vazia."),
});

export async function authenticate(
    prevState: string | undefined,
    formData: FormData
) {
    try {
        // Converte o FormData em objeto
        const data = Object.fromEntries(formData);

        // 2. Valida os dados ANTES de chamar o signIn
        const result = loginSchema.safeParse(data);

        if (!result.success) {
            // Retorna o erro do primeiro campo que falhar
            return result.error.errors[0].message;
        }
        
        await signIn("credentials", Object.fromEntries(formData));
    } catch (error) {

        if ((error as Error).message.includes("NEXT_REDIRECT")) {
            throw error;
        }

        if (error instanceof AuthError) {
            // Aqui pegamos a mensagem que definimos no InvalidLoginError lá no auth.ts
            // O NextAuth v5 coloca a mensagem dentro de error.cause ou error.message
            return error.message;
        }

        // Erro genérico
        return "Algo deu errado. Tente novamente.";
    }
}