import AuthLayout from '@/components/auth/auth-layout'
import LoginForm from '@/components/auth/login-form'

async function Login({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
    const { callbackUrl } = await searchParams
    return (
        <AuthLayout>
            <LoginForm callbackUrl={callbackUrl} />
        </AuthLayout>
    )
}

export default Login