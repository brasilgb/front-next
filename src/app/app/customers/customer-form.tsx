"use client"

import { DatePicker } from '@/components/date-picker';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card'; // Adicionei Header/Title se quiser usar
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toastSuccess, toastWarning } from '@/helpers/toast-messages';
import { useZipcodeAutocomplete } from '@/hooks/useZipcodeAutocomplete';
import { createCustomer, updateCustomer } from '@/lib/actions/customers';
import { maskCpfCnpj, maskPhone, maskWhatsapp, maskZipCode } from '@/lib/masks';
import { cn } from '@/lib/utils';
import { Customer } from '@/types/app-types';
import { Loader2Icon, SaveIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from "react-hook-form"

interface CustomerFormProps {
  initialData?: {
    customer?: Customer;
  }
}

// Adicionado "export default" para que a página funcione no Next.js
export default function Create({ initialData }: CustomerFormProps) {
  const router = useRouter()

  const isEdit = !!initialData

  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    control,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm<Customer>({
    defaultValues: initialData?.customer || {}
  })

  const { isZipcodeLoading } = useZipcodeAutocomplete<Customer>({
    zipcodeValue: watch("zipcode"),
    paths: {
      zipcode: "zipcode",
      state: "state",
      city: "city",
      district: "district",
      street: "street",
      complement: "complement",
    },
    setValue,
    setError,
    clearErrors,
  })

  const onSubmit: SubmitHandler<Customer> = async (data) => {
    const result = isEdit
      ? await updateCustomer(Number(initialData?.customer?.id), data)
      : await createCustomer(data)

    // Erros
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

    if (isEdit) {
      toastSuccess("Cliente alterado", "Edição realizada com sucesso")
    } else {
      toastSuccess("Cliente salvo", "Cadastro realizado com sucesso")
      reset()
      router.push("/app/customers")
    }
  }

  return (

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
            {errors.cpf && <span className="text-sm text-destructive">{errors.cpf.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="birth">Nascimento</Label>
            <Controller
              control={control}
              name="birth"
              render={({ field }) => (
                <DatePicker
                  mode="single"
                  date={field.value as any}
                  setDate={field.onChange}
                />
              )}
            />
          {errors.birth && <span className="text-sm text-destructive">{errors.birth.message}</span>}
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
            {errors.name && <span className="text-sm text-destructive">{errors.name.message}</span>}
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
            {errors.email && <span className="text-sm text-destructive">{errors.email.message}</span>}
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
                <div className='relative'>
                  <Input
                    id="zipcode"
                    {...field}
                    onChange={(e) => field.onChange(maskZipCode(e.target.value))}
                    disabled={isZipcodeLoading}
                    className={cn(
                      errors.zipcode && "border-destructive focus-visible:ring-destructive"
                    )}
                    aria-invalid={!!errors.zipcode}
                  />
                  {isZipcodeLoading && (
                    <Loader2Icon
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground"
                    />
                  )}
                </div>
              )}
            />
            {errors.zipcode && <span className="text-sm text-destructive">{errors.zipcode.message}</span>}
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
            {errors.phone && <span className="text-sm text-destructive">{errors.phone.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Whatsapp</Label>
            <Controller
              name="whatsapp"
              control={control}
              defaultValue=''
              render={({ field }) => (
                <Input
                  id="whatsapp"
                  {...field}
                  onChange={(e) => field.onChange(maskWhatsapp(e.target.value))}
                  className={cn(
                    errors.whatsapp && "border-destructive focus-visible:ring-destructive"
                  )}
                  aria-invalid={!!errors.whatsapp}
                />
              )}
            />
            {errors.whatsapp && <span className="text-sm text-destructive">{errors.whatsapp.message}</span>}
          </div>

          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="contactname">Contato</Label>
            <Input
              id="contactname"
              {...register('contactname')}
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
  )
}