"use client"

import AppLayout from '@/components/app/app-layout';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card'; // Adicionei Header/Title se quiser usar
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toastSuccess, toastWarning } from '@/helpers/toast-messages';
import { createCustomer } from '@/lib/actions/customers';
import { maskCpfCnpj, maskPhone, maskZipCode } from '@/lib/masks';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, Customer } from '@/types/app-types';
import { ArrowLeftCircle, Loader2Icon, SaveIcon, Users2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { required } from 'node_modules/zod/v4/core/util.cjs';
import { useState } from 'react';
import { useForm, SubmitHandler, Controller } from "react-hook-form"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: "/app",
  },
  {
    title: 'Clientes',
    href: "/app/customers",
  },
  {
    title: 'Novo Cliente',
    href: "#",
  },
];

// Adicionado "export default" para que a página funcione no Next.js
export default function Create() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors, isSubmitting }
  } = useForm<Customer>()

  const onSubmit: SubmitHandler<Customer> = async (data) => {
    const result = await createCustomer(data)

    if (result.success) {
      toastSuccess("Cliente salvo", "Cadastro realizado com sucesso")
      reset()
      router.push("/app/customers")
    }

    if (!result.success) {

      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, message]) => {
          setError(field as any, {
            type: "server",
            message: message as string,
          })
        })
        return
      }

      toastWarning("Erro ao salvar", result.message)

      return
    }

  };

  return (
    <AppLayout
      bredcrumbData={breadcrumbs}
      title="Novo Cliente"
      icon={<Icon iconNode={Users2Icon} className='w-8 h-8' />}
    >
      <div className='mb-4'>
        <Link href="/app/customers">
          <Button variant={'outline'}>
            <ArrowLeftCircle className='w-4 h-4 mr-2' /> Voltar
          </Button>
        </Link>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>

          <CardContent className="pt-6 grid gap-4">

            <div className='grid md:grid-cols-6 gap-4'>

              <div className="grid gap-2">
                <Label htmlFor="cpf">CPF/CNPJ</Label>
                <Controller
                  name="cpf"
                  control={control}
                  defaultValue=''
                  render={({ field }) => (
                    <Input
                      id="cpf"
                      {...field}
                      onChange={(e) => field.onChange(maskCpfCnpj(e.target.value))}
                      className={cn(
                        errors.cpf && "border-destructive focus-visible:ring-destructive"
                      )}
                      aria-invalid={!!errors.cpf}
                    />
                  )}
                />
                {errors.cpf && <span className="text-red-500 text-sm">{errors.cpf.message}</span>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="birth">Nascimento</Label>
                <Input
                  id="birth"
                  {...register('birth')}
                />
              </div>

              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  {...register('name')}
                  className={cn(
                    errors.name && "border-destructive focus-visible:ring-destructive"
                  )}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
              </div>

              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  {...register('email')}
                  className={cn(
                    errors.email && "border-destructive focus-visible:ring-destructive"
                  )}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
              </div>

            </div>

            <div className='grid md:grid-cols-6 gap-4'>

              <div className="grid gap-2">
                <Label htmlFor="zipcode">CEP</Label>
                <Controller
                  name="zipcode"
                  control={control}
                  defaultValue=''
                  render={({ field }) => (
                    <Input
                      id="zipcode"
                      {...field}
                      onChange={(e) => field.onChange(maskZipCode(e.target.value))}
                    />
                  )}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="state">UF</Label>
                <Input
                  id="state"
                  {...register('state')}
                />
              </div>

              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  {...register('city')}
                />
              </div>

              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="district">Bairro</Label>
                <Input
                  id="district"
                  {...register('district')}
                />
              </div>

            </div>

            <div className='grid md:grid-cols-4 gap-4'>

              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="street">Logradouro</Label>
                <Input
                  id="street"
                  {...register('street')}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  {...register('complement')}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  {...register('number')}
                />
              </div>

            </div>

            <div className='grid md:grid-cols-5 gap-4'>

              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone</Label>
                <Controller
                  name="phone"
                  control={control}
                  defaultValue=''
                  render={({ field }) => (
                    <Input
                      id="phone"
                      {...field}
                      onChange={(e) => field.onChange(maskPhone(e.target.value))}
                      className={cn(
                        errors.phone && "border-destructive focus-visible:ring-destructive"
                      )}
                      aria-invalid={!!errors.phone}
                    />
                  )}
                />
                {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="whatsapp">Whatsapp</Label>
                <Input
                  id="whatsapp"
                  {...register('whatsapp')}
                  className={cn(
                    errors.whatsapp && "border-destructive focus-visible:ring-destructive"
                  )}
                  aria-invalid={!!errors.whatsapp}
                />
                {errors.whatsapp && <span className="text-red-500 text-sm">{errors.whatsapp?.message}</span>}
              </div>

              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="city">Contato</Label>
                <Input
                  id="city"
                  {...register('city')}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contactphone">Telefone</Label>
                <Controller
                  name="contactphone"
                  control={control}
                  defaultValue=''
                  render={({ field }) => (
                    <Input
                      id="contactphone"
                      {...field}
                      onChange={(e) => field.onChange(maskPhone(e.target.value))}
                    />
                  )}
                />
              </div>

            </div>
            <div className="grid gap-2">
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                {...register('observations')}
              />
            </div>

          </CardContent>

          <CardFooter className="flex justify-end pt-6">
            <Button
              type='submit'
              variant="default"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2Icon className='w-4 h-4 animate-spin' /> : <SaveIcon className='w-4 h-4' />}
              {isSubmitting ? 'Enviando...' : 'Salvar Cliente'}
            </Button>
          </CardFooter>

        </form>
      </Card>
    </AppLayout>
  )
}