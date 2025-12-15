"use client";

import { useActionState, useEffect } from 'react'
import AuthLayout from './auth-layout';
import { registerTenant } from "@/lib/actions";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import AuthLogo from './auth-logo';
import Link from 'next/link';

function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerTenant,
    undefined
  );


  const [showPassword, setShowPassword] = useState(false)

  return (
    <AuthLayout>
      <AuthLogo />
      <Card className="border-border/50 shadow-2xl bg-card/90 backdrop-blur-md md:min-w-4xl mx-2">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-balance">Bem-vindo ao cadastro usuários</CardTitle>
          <CardDescription className="text-base text-balance">
            Digite corretamente seus dados para se cadastrar no sistema e ter acesso a todas as funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">

            {state?.message && !state?.errors && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                {state.message}
              </div>
            )}

            <div className='grid grid-cols-3 gap-4'>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="company">Razão Social</Label>
                <div className="relative">
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Nome da sua empresa"
                    disabled={isPending}
                  />
                </div>
                {state?.errors?.company && (
                  <p className="text-sm text-red-500">
                    {state.errors.company.join(', ')}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <div className="relative">
                  <Input
                    id="cnpj"
                    name="cnpj"
                    type="text"
                    placeholder="00.000.000/0000-00"
                    disabled={isPending}
                  />
                </div>
                {state?.errors?.cnpj && (
                  <p className="text-sm text-red-500">
                    {state.errors.cnpj.join(', ')}
                  </p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo</Label>
                <div className="relative">
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Seu nome completo"
                    disabled={isPending}
                  />
                </div>
                {state?.errors?.fullName && (
                  <p className="text-sm text-red-500">
                    {state.errors.fullName.join(', ')}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    disabled={isPending}
                  />
                </div>
                {state?.errors?.email && (
                  <p className="text-sm text-red-500">
                    {state.errors.email.join(', ')}
                  </p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <div className="relative">
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(99) 99999-9999"
                    disabled={isPending}
                  />
                </div>
                {state?.errors?.phone && (
                  <p className="text-sm text-red-500">
                    {state.errors.phone.join(', ')}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">Whatsapp</Label>
                <div className="relative">
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    placeholder="(99) 99999-9999"
                    disabled={isPending}
                  />
                </div>
                {state?.errors?.whatsapp && (
                  <p className="text-sm text-red-500">
                    {state.errors.whatsapp.join(', ')}
                  </p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className="relative space-y-2">
                <Lock className="absolute left-3 top-10 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  disabled={isPending}
                />
                {state?.errors?.password && (
                  <p className="text-sm text-red-500">
                    {state.errors.password.join(', ')}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isPending}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative space-y-2">
                <Label htmlFor="passwordConfirmation">Confirmar Senha</Label>
                <Lock className="absolute left-3 top-10 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  disabled={isPending}
                />
                {state?.errors?.passwordConfirmation && (
                  <p className="text-sm text-red-500">
                    {state.errors.passwordConfirmation.join(', ')}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isPending}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isPending}>
              {isPending ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Cadastrando...
                </>
              ) : (
                "Cadastrar"
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Já possuo uma conta?{" "}
              <Link href="/login" className="text-accent-foreground hover:underline font-medium">
                Login
              </Link>
            </p>

          </form>
        </CardContent >
      </Card>
    </AuthLayout >
  )
}

export default RegisterForm