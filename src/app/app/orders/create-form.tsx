"use client"

import { AppSelect } from '@/components/app-select';
import { AppReactSelect } from '@/components/app-react-select';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card'; // Adicionei Header/Title se quiser usar
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toastSuccess, toastWarning } from '@/helpers/toast-messages';
import { createOrder } from '@/lib/actions/orders';
import { cn } from '@/lib/utils';
import { Customer, Order } from '@/types/app-types';
import { Loader2Icon, SaveIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { statusOrcamento } from '@/utils/app-options';

interface OrderFormProps {
  initialData?: {
    order?: Order;
  };
  customers?: Customer[];
}

// Adicionado "export default" para que a página funcione no Next.js
export default function CreateForm({ initialData, customers }: OrderFormProps) {
  const customerOptions = customers?.map((customer: Customer) => ({
    value: customer.id,
    label: customer.name,
  }));

  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    control,
    setValue,
    getValues,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm<Order>({
    defaultValues: initialData?.order || {}
  })

  const onSubmit: SubmitHandler<Order> = async (data) => {

    const result = await createOrder(data)

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

    toastSuccess("Ordem salva", "Cadastro realizado com sucesso")
    reset()
    router.push("/app/orders")
  }

  return (

    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="pt-6 grid gap-4">

        <div className='grid md:grid-cols-8 gap-4'>

          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="order_id">Cliente</Label>
            <Controller
              name="customer_id"
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <AppReactSelect
                  ref={ref}
                  options={customerOptions}
                  value={customerOptions?.find(c => c.value === value)}
                  onChange={(val: any) => onChange(val?.value)}
                  onBlur={onBlur}
                  placeholder="Selecione um cliente"
                  error={!!errors.customer_id}
                />
              )}
            />
            {errors.customer_id && <span className="text-sm text-destructive">{errors.customer_id.message}</span>}
          </div>

          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="equipment_id">Equipamento</Label>
            <Input
              id="equipment_id"
              {...register('equipment_id')}
            />
            {errors.equipment_id && <span className="text-sm text-destructive">{errors.equipment_id.message}</span>}
          </div>

          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="model">Modelo</Label>
            <Input
              id="model"
              {...register('model')}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              {...register('password')}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="delivery_date">Previsão de entrega</Label>
            <Input
              id="delivery_date"
              {...register('delivery_date')}
            />
          </div>

        </div>

        <div className='grid md:grid-cols-3 gap-4'>
          <div className="grid gap-2">
            <Label htmlFor="defect">Defeito Relatado</Label>
            <Textarea
              id="defect"
              {...register('defect')}
            />
            {errors.defect && <span className="text-sm text-destructive">{errors.defect.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="state_conservation">Estado de Conservação</Label>
            <Textarea
              id="state_conservation"
              {...register('state_conservation')}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="accessories">Acessórios</Label>
            <Textarea
              id="accessories"
              {...register('accessories')}
            />
          </div>

        </div>

        <div className='grid md:grid-cols-4 gap-4'>

          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="street">Descrição pré-orçamento</Label>
            <Textarea
              id="budget_description"
              {...register('budget_description')}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="budget_value">Descrição pré-orçamento</Label>
            <Input
            defaultValue={0.00}
              id="budget_value"
              {...register('budget_value')}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="service_status">Status Orçamento</Label>
            <AppSelect
              options={statusOrcamento}
              {...register('service_status')}
              defaultValue={1}
              // placeolder='Selecione uma opção'
              onValueChange={(value) => {
                setValue('service_status', value);
              }}
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
          {isSubmitting ? 'Enviando...' : 'Salvar Ordem'}
        </Button>
      </CardFooter>

    </form>
  )
}