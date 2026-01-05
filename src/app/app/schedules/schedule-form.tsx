"use client"

import { AppReactSelect } from '@/components/app-react-select';
// AppSelect removido pois não estava em uso
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toastSuccess, toastWarning } from '@/helpers/toast-messages';
import { createSchedule, updateSchedule } from '@/lib/actions/schedules';
// maskMoney removido
import { cn } from '@/lib/utils';
import { Customer, Schedule, User } from '@/types/app-types';
import { statusAgenda } from '@/utils/app-options'; // garantiaOrcamento removido
import { Loader2Icon, SaveIcon } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from "react-hook-form"

interface ScheduleFormProps {
  initialData?: Schedule;
  listschedules?: any;
  customers?: Customer[];
  users?: User[];
}

interface OptionType {
  value: string;
  label: string;
}

export default function Create({ initialData, customers, users }: ScheduleFormProps) {

  const router = useRouter()
  const isEdit = !!initialData

  const customerOptions: OptionType[] = customers?.map((customer: any) => ({
    value: customer.id,
    label: customer.name,
  })) || [];

  const userOptions: OptionType[] = users?.map((user: any) => ({
    value: user.id,
    label: user.name,
  })) || [];

  const dataFormatada = moment(initialData?.schedules).format("YYYY-MM-DDTHH:mm");

  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors, isSubmitting }
  } = useForm<Schedule>({
    defaultValues: initialData
      ? { ...initialData, schedules: dataFormatada }
      : {}
  } as any)

  const onSubmit: SubmitHandler<Schedule> = async (data) => {

    const payload = {
      ...data,
      schedules: moment.utc(data.schedules).toISOString(),
      status: data.status as number
    } as any
    const result = isEdit
      ? await updateSchedule(Number(initialData?.id), payload)
      : await createSchedule(payload)

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
      toastSuccess("Agendamento alterado", "Edição realizada com sucesso")
    } else {
      toastSuccess("Agendamento salvo", "Cadastro realizado com sucesso")
      reset()
      router.push("/app/schedules")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="pt-6 grid gap-4">

        <div className='grid md:grid-cols-2 gap-4'>

          <div className="grid gap-2">
            <Label htmlFor="customer_id">Cliente</Label>
            <Controller
              name="customer_id"
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <AppReactSelect
                  ref={ref}
                  options={customerOptions}
                  value={customerOptions?.find(c => String(c.value) === String(value))}
                  onChange={(val: any) => onChange(val?.value)}
                  onBlur={onBlur}
                  placeholder="Selecione um cliente"
                  error={!!errors.customer_id}
                />
              )}
            />
            {errors.customer_id && <span className="text-sm text-destructive">{errors.customer_id.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="schedules">Horário da visita</Label>
            <Input
              type='datetime-local'
              id="schedules"
              {...register('schedules')}
              className={cn(errors.schedules && "border-destructive")}
            />
            {errors.schedules && <span className="text-sm text-destructive">{errors.schedules.message}</span>}
          </div>

        </div>

        <div className='grid md:grid-cols-2 gap-4'>

          <div className="grid gap-2">
            <Label htmlFor="service">Serviços requisitados</Label>
            <Controller
              name="service"
              control={control}
              defaultValue={initialData?.service || ''}
              render={({ field }) => (
                <Textarea
                  id="service"
                  {...field} // <--- CORREÇÃO CRÍTICA: Passando as props do field
                  className={cn(errors.service && "border-destructive")}
                />
              )}
            />
            {errors.service && <span className="text-sm text-destructive">{errors.service.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="details">Detalhes do serviço</Label>
            <Controller
              name="details"
              control={control}
              defaultValue={initialData?.details || ''}
              render={({ field }) => (
                <Textarea
                  id="details"
                  {...field} // <--- CORREÇÃO CRÍTICA: Passando as props do field
                  className={cn(errors.details && "border-destructive")}
                />
              )}
            />
            {errors.details && <span className="text-sm text-destructive">{errors.details.message}</span>}
          </div>
        </div>

        <div className='grid md:grid-cols-2 gap-4'>
          <div className="grid gap-2">
            <Label htmlFor="user_id">Técnico</Label>
            <Controller
              name="user_id"
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <AppReactSelect
                  ref={ref}
                  options={userOptions}
                  value={userOptions?.find(c => String(c.value) === String(value))}
                  onChange={(val: any) => onChange(val?.value)}
                  onBlur={onBlur}
                  placeholder="Selecione um técnico"
                  error={!!errors.user_id}
                />
              )}
            />
            {errors.user_id && <span className="text-sm text-destructive">{errors.user_id.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <AppReactSelect
                  ref={ref}
                  options={statusAgenda}
                  value={statusAgenda?.find(c => String(c.value) === String(value))}
                  onChange={(val: any) => onChange(val?.value)}
                  onBlur={onBlur}
                  placeholder="Selecione um status"
                  error={!!errors.status}
                />
              )}
            />
            {errors.status && <span className="text-sm text-destructive">{errors.status.message}</span>}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="obs">Observações</Label>
          <Textarea id="obs" {...register('observations')} />
        </div>

      </CardContent>

      <CardFooter className="flex justify-end pt-6">
        <Button type='submit' variant="default" disabled={isSubmitting}>
          {isSubmitting ? <Loader2Icon className='w-4 h-4 animate-spin' /> : <SaveIcon className='w-4 h-4' />}
          {isSubmitting ? 'Enviando...' : 'Salvar Agendamento'}
        </Button>
      </CardFooter>

    </form>
  )
}