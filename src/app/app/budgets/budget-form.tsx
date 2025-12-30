"use client"

import { DatePicker } from '@/components/date-picker';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card'; // Adicionei Header/Title se quiser usar
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toastSuccess, toastWarning } from '@/helpers/toast-messages';
import { createBudget, updateBudget } from '@/lib/actions/budgets';
import { maskCpfCnpj, maskPhone, maskWhatsapp, maskZipCode } from '@/lib/masks';
import { cn } from '@/lib/utils';
import { Budget } from '@/types/app-types';
import { selectStyles } from '@/utils/selected-styles';
import { Loader2Icon, SaveIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import CreatableSelect from 'react-select/creatable';

interface BudgetFormProps {
  initialData?: Budget;
  listbudgets?: any;
}
interface OptionType {
  value: string;
  label: string;
}
// Adicionado "export default" para que a página funcione no Next.js
export default function Create({ initialData, listbudgets }: BudgetFormProps) {
  const router = useRouter()

  const isEdit = !!initialData


  // --- Lógica para o Select 'Category' (Criação/Seleção) ---
  const initialCategoryOptions: OptionType[] = listbudgets?.map((budget: any) => ({
    value: budget,
    label: budget,
  })) || [];

  const [categoryOptions, setCategoryOptions] = useState<OptionType[]>(initialCategoryOptions);
  const [selectedCategory, setSelectedCategory] = useState<OptionType | null>(null);

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
  } = useForm<Budget>({
    defaultValues: initialData || {}
  })

  const onSubmit: SubmitHandler<Budget> = async (data) => {
    const result = isEdit
      ? await updateBudget(Number(initialData?.id), data)
      : await createBudget(data)

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
      toastSuccess("Orçamento alterado", "Edição realizada com sucesso")
    } else {
      toastSuccess("Orçamento salvo", "Cadastro realizado com sucesso")
      reset()
      router.push("/app/budgets")
    }
  }

  // --- Handlers para Category ---
  const changeCategory = (selected: OptionType | null) => {
    setSelectedCategory(selected);
    setValue('category', selected ? selected.value : '');
  };

  const handleCreateCategory = (inputValue: string) => {
    const newOption: OptionType = {
      label: inputValue,
      value: inputValue,
    };

    setCategoryOptions((prevOptions) => [...prevOptions, newOption]);
    setSelectedCategory(newOption);
    setValue('category', newOption.value);
  };

  return (

    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="pt-6 grid gap-4">

        <div className='grid md:grid-cols-6 gap-4'>

          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="order_id">Cliente</Label>
            <Controller
              name="category"
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <CreatableSelect
                  id="category"
                  value={selectedCategory}
                  options={categoryOptions}
                  onCreateOption={handleCreateCategory}
                  onChange={changeCategory}
                  isClearable
                  placeholder="Selecione ou digite para criar a categoria"
                  className="shadow-xs p-0 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-9"
                  styles={selectStyles}
                />
              )}
            />
            {errors.category && <span className="text-sm text-destructive">{errors.category.message}</span>}
          </div>

          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="service">Serviço</Label>
            <Input
              id="service"
              {...register('service')}
              className={cn(
                errors.service && "border-destructive focus-visible:ring-destructive"
              )}
              aria-invalid={!!errors.service}
            />
            {errors.service && <span className="text-sm text-destructive">{errors.service.message}</span>}
          </div>

          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="model">Modelo</Label>
            <Input
              id="model"
              {...register('model')}
              className={cn(
                errors.model && "border-destructive focus-visible:ring-destructive"
              )}
              aria-invalid={!!errors.model}
            />
            {errors.model && <span className="text-sm text-destructive">{errors.model.message}</span>}
          </div>

        </div>

        <div className='grid md:grid-cols-6 gap-4'>

          <div className="grid gap-2">
            <Label htmlFor="part_value">Valor em peças</Label>
            <Input
              id="part_value"
              {...register('part_value')}
            />
          </div>

          

        </div>


        {/* <div className='grid md:grid-cols-5 gap-4'>
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
        </div> */}

        <div className="grid gap-2">
          <Label htmlFor="obs">Observações</Label>
          <Textarea
            id="obs"
            {...register('obs')}
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
          {isSubmitting ? 'Enviando...' : 'Salvar Orçamento'}
        </Button>
      </CardFooter>

    </form>
  )
}