"use client"

import { AppReactSelect } from '@/components/app-react-select';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
// AppSelect removido pois não estava em uso
import { toastSuccess, toastWarning } from '@/helpers/toast-messages';
import { createMessage, updateMessage } from '@/lib/actions/messages';
// maskMoney removido
import { cn } from '@/lib/utils';
import { Message, User } from '@/types/app-types';
import { statusMessage } from '@/utils/app-options';
import { Loader2Icon, SaveIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from "react-hook-form"

interface MessageFormProps {
  initialData?: Message;
  listmessages?: any;
  users?: User[];
  sender?: string;
}

interface OptionType {
  value: string;
  label: string;
}

export default function Create({ initialData, users, sender }: MessageFormProps) {

  const router = useRouter()
  const isEdit = !!initialData

  const recipientOptions: OptionType[] = users?.filter(fil => fil.id !== Number(sender)).map((user: any) => ({
    value: user.id,
    label: user.name,
  })) || [];

  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors, isSubmitting }
  } = useForm<Message>({
    defaultValues: initialData || {}
  })

  const onSubmit: SubmitHandler<Message> = async (data) => {
    const payload = {
      ...data,
      sender_id: Number(sender)
    }
    const result = isEdit
      ? await updateMessage(Number(initialData?.id), payload)
      : await createMessage(payload)

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
      toastSuccess("Mensagem alterada", "Edição realizada com sucesso")
    } else {
      toastSuccess("Mensagem salva", "Cadastro realizado com sucesso")
      reset()
      router.push("/app/messages")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="pt-6 grid gap-4">

        <div className='grid md:grid-cols-2 gap-4'>

          <div className="grid gap-2">
            <Label htmlFor="recipient_id">Destinatário</Label>
            <Controller
              name="recipient_id"
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <AppReactSelect
                  ref={ref}
                  options={recipientOptions}
                  value={recipientOptions?.find(c => String(c.value) === String(value))}
                  onChange={(val: any) => onChange(val?.value)}
                  onBlur={onBlur}
                  placeholder="Selecione o destinatário"
                  error={!!errors.recipient_id}
                />
              )}
            />
            {errors.recipient_id && <span className="text-sm text-destructive">{errors.recipient_id.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Controller
              name="title"
              control={control}
              defaultValue={initialData?.title || ''}
              render={({ field }) => (
                <Input
                  id="title"
                  {...field}
                  className={cn(errors.title && "border-destructive")}
                />
              )}
            />
            {errors.title && <span className="text-sm text-destructive">{errors.title.message}</span>}
          </div>

        </div>

        <div className="grid gap-2">
          <Label htmlFor="message">Mensagem</Label>
          <Controller
            name='message'
            control={control}
            defaultValue={initialData?.message || ''}
            render={({ field }) => (
              <Textarea
                id="message"
                {...field}
                className={cn(errors.message && "border-destructive")}
              />
            )}
          />
          {errors.message && <span className="text-sm text-destructive">{errors.message.message}</span>}
        </div>

        <div className='grid gap-2'>
          <Label htmlFor="status">Status da mensagem</Label>
          <Controller
            name='status'
            control={control}
            defaultValue={initialData?.status ?? 0}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value?.toString()}
                defaultValue={field.value?.toString()}
              >
                <SelectTrigger className="w-45">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  {statusMessage?.map((message: any) => (
                    <SelectItem key={message.value} value={String(message.value)}>{message.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

      </CardContent>

      <CardFooter className="flex justify-end pt-6">
        <Button type='submit' variant="default" disabled={isSubmitting}>
          {isSubmitting ? <Loader2Icon className='w-4 h-4 animate-spin' /> : <SaveIcon className='w-4 h-4' />}
          {isSubmitting ? 'Enviando...' : 'Salvar Mensagem'}
        </Button>
      </CardFooter>

    </form>
  )
}