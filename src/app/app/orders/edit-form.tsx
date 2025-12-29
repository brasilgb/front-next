"use client"

import { AppSelect } from '@/components/app-select';
import { AppReactSelect } from '@/components/app-react-select';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card'; // Adicionei Header/Title se quiser usar
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toastSuccess, toastWarning } from '@/helpers/toast-messages';
import { updateOrder } from '@/lib/actions/orders';
import { Customer, Order, User } from '@/types/app-types';
import { Loader2Icon, SaveIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { statusServico } from '@/utils/app-options';
import { DatePicker } from '@/components/date-picker';
import { useEffect } from 'react';
import { maskMoney, maskMoneyDot } from '@/lib/masks';

interface OrderFormProps {
  initialData?: Order;
  customers?: Customer[];
  users: User[];
}

// Adicionado "export default" para que a página funcione no Next.js
export default function EditForm({ initialData, customers, users }: OrderFormProps) {
  const router = useRouter()

  const customerOptions = customers?.map((customer: Customer) => ({
    value: customer.id,
    label: customer.name,
  }));

  const userOptions = users?.filter((user: any) => (user.roles === 3)).map((user: User) => ({
    value: user.id,
    label: user.name,
  })) || [];

  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<Order>({
    defaultValues: initialData
  })

  // 1. "Assistindo" os valores em tempo real
  const partsValueStr = watch('parts_value');
  const serviceValueStr = watch('service_value');

  useEffect(() => {
    const parts = maskMoneyDot(partsValueStr);
    const service = maskMoneyDot(serviceValueStr);
    const total = Number(parts) + Number(service);
    const costFormatted = total.toFixed(2);

    setValue('service_cost', maskMoney(costFormatted));

  }, [partsValueStr, serviceValueStr, setValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof Order) => {
    const { value } = e.target;
    console.log(value);
    setValue(fieldName, maskMoney(value));
  };

  const onSubmit: SubmitHandler<Order> = async (data) => {
    const payload = {
      ...data,
      parts_value: maskMoneyDot(data.parts_value),
      service_value: maskMoneyDot(data.service_value),
      service_cost: maskMoneyDot(data.service_cost),
    };

    const result = await updateOrder(initialData?.id as number, payload)

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
            <Label htmlFor="delivery_forecast">Previsão de entrega</Label>
            <Controller
              control={control}
              name="delivery_forecast"
              render={({ field }) => (
                <DatePicker
                  mode="single"
                  date={field.value as any}
                  setDate={field.onChange}
                />
              )}
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

        <div className='grid md:grid-cols-3 gap-4'>
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="street">Descrição Orçamento</Label>
            <Textarea
              id="budget_description"
              {...register('budget_description')}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="budget_value">Valor Orçamento</Label>
            <Input
              defaultValue={0.00}
              id="budget_value"
              {...register('budget_value')}
            />
          </div>
        </div>

        <div className='grid grid-cols-3 gap-4'>

          <div className="grid gap-2">
            <Label htmlFor="parts_value">Valor das Peças</Label>
            <Input
              defaultValue={0.00}
              id="parts_value"
              {...register('parts_value')}
              placeholder="0,00"
              onChange={(e) => handleInputChange(e, "parts_value")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="service_value">Valor do Serviço</Label>
            <Input
              defaultValue={0.00}
              id="service_value"
              {...register('service_value')}
              placeholder="0,00"
              onChange={(e) => handleInputChange(e, "service_value")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="service_cost">Valor Total</Label>
            <Input
              defaultValue={0.00}
              id="service_cost"
              {...register('service_cost')}
              readOnly
            />
          </div>

        </div>

        <div className='grid md:grid-cols-2 gap-4'>
          <div className="grid gap-2">
            <Label htmlFor="responsible_technician">Técnico Responsável</Label>
            <Controller
              name="responsible_technician"
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <AppReactSelect
                  ref={ref}
                  options={userOptions}
                  value={userOptions?.find(c => String(c.value) === String(value))}
                  onChange={(val: any) => onChange(Number(val?.value))}
                  onBlur={onBlur}
                  placeholder="Selecione o técnico"
                  error={!!errors.responsible_technician}
                />
              )}
            />
            {errors.responsible_technician && <span className="text-sm text-destructive">{errors.responsible_technician.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="service_status">Status do Serviço</Label>
            <Controller
              name="service_status"
              control={control}
              render={({ field }) => (
                <AppSelect
                  options={statusServico}
                  placeholder="Selecione uma opção"
                  onValueChange={field.onChange} // O Controller cuida da atualização
                  value={field.value.toString() || ""}           // O Controller fornece o valor atualizado
                  defaultValue={field.value.toString() || ""}
                />
              )}
            />
          </div>
        </div>

        <div className='grid md:grid-cols-2 gap-4'>
          <div className="grid gap-2">
            <Label htmlFor="services_performed">Serviços executados</Label>
            <Textarea
              id="services_performed"
              {...register('services_performed')}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              {...register('observations')}
            />
          </div>
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