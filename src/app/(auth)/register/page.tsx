import AuthLayout from '@/components/auth/auth-layout'
import RegisterForm from '@/components/auth/register-form'
import React from 'react'

function Register() {
  return (
    <AuthLayout>
        <RegisterForm />
    </AuthLayout>
  )
}

export default Register