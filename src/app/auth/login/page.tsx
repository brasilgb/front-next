import AuthLayout from '@/components/auth/auth-layout'
import LoginForm from '@/components/auth/login-form'
import React from 'react'

function Login() {
    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    )
}

export default Login