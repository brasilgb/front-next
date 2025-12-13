import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

class InvalidLoginError extends CredentialsSignin {
    code = "LoginError"; // código interno
    constructor(message: string) {
        super(message);
        this.message = message; // Sobrescreve a mensagem padrão
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            // Essa função roda quando você chama signIn()
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    // Bate na sua API Node.js (Rota de Login que criamos antes)
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    const user = await res.json();

                    // Se a API retornar erro ou não tiver token
                    if (!res.ok || !user || !user.token) {
                        throw new InvalidLoginError(user.message || "Erro ao realizar login.");
                    }

                    // Retorna o objeto usuário + token para o NextAuth
                    // Supondo que sua API retorna: { user: { id, name... }, token: "..." }
                    return {
                        id: user.user.id.toString(), // NextAuth exige ID como string
                        name: user.user.name,
                        email: user.user.email,
                        tenant_id: user.user.tenant_id,
                        token: user.token,
                    };
                } catch (error) {
                    if (error instanceof InvalidLoginError) {
                        throw error;
                    }
                    // Se for erro de conexão ou outro
                    throw new InvalidLoginError("Ocorreu um erro inesperado. Tente novamente.");
                }
            },
        }),
    ],
    callbacks: {
        // 1. O JWT é gerado logo após o login
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.tenant_id = user.tenant_id;
                token.token = user.token; // Salva o JWT da API no token do NextAuth
            }
            return token;
        },
        // 2. A Sessão é montada sempre que o front pede dados do usuário
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.tenant_id = token.tenant_id as number;
                session.user.token = token.token as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login", // Sua página customizada de login
    },
});