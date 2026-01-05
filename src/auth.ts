import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"

class InvalidLoginError extends CredentialsSignin {
    code = "LoginError"
    constructor(message: string) {
        super(message)
        this.message = message
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    providers: [
        Credentials({
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) return null

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(credentials),
                    }
                )

                const data = await res.json()

                if (!res.ok || !data?.user) {
                    throw new InvalidLoginError(
                        data?.message || "Erro ao realizar login"
                    )
                }

                return {
                    id: data.user.id.toString(),
                    name: data.user.name,
                    email: data.user.email,
                    tenant_id: data.user.tenant_id ?? null,
                    token: data.token, // opcional, mas agora propagado corretamente
                }
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.tenant_id = user.tenant_id as number | null
                token.token = user.token as string | undefined
            }
            return token
        },
        session({ session, token }) {
            session.user.id = token.sub as string
            session.user.tenant_id = token.tenant_id as number | null
            session.user.token = token.token as string | undefined
            return session
        },
    },
    pages: {
        signIn: "/login",
    },
})
