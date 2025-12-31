"use client"

import { AppSelect } from '@/components/app-select';
import { DatePicker } from '@/components/date-picker';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card'; // Adicionei Header/Title se quiser usar
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toastSuccess, toastWarning } from '@/helpers/toast-messages';
import { createBudget, updateBudget } from '@/lib/actions/budgets';
import { maskMoney, maskMoneyDot } from '@/lib/masks';
import { cn } from '@/lib/utils';
import { Budget } from '@/types/app-types';
import { garantiaOrcamento } from '@/utils/app-options';
import { selectStyles } from '@/utils/selected-styles';
import { Loader2Icon, SaveIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
    formState: { errors, isSubmitting }
  } = useForm<Budget>({
    defaultValues: initialData || {}
  })

  const partsValueStr = watch('part_value');
  const serviceValueStr = watch('labor_value');

  useEffect(() => {
    const parts = maskMoneyDot(partsValueStr);
    const service = maskMoneyDot(serviceValueStr);
    const total = Number(parts) + Number(service);
    const costFormatted = total.toFixed(2);
    setValue('total_value', maskMoney(costFormatted));

  }, [partsValueStr, serviceValueStr, setValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof Budget) => {
    const { value } = e.target;
    setValue(fieldName, maskMoney(value));
  };

  const onSubmit: SubmitHandler<Budget> = async (data) => {
    const payload = {
      ...data,
      part_value: maskMoneyDot(data.part_value),
      labor_value: maskMoneyDot(data.labor_value),
      total_value: maskMoneyDot(data.total_value),
    };
    const result = isEdit
      ? await updateBudget(Number(initialData?.id), payload)
      : await createBudget(payload)

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
            <Label htmlFor="order_id">Categoria (ou criar nova)</Label>
            <Controller
              name="category"
              control={control}
              defaultValue={initialData?.category || ""}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <CreatableSelect
                  id="category"
                  value={value ? categoryOptions.find(opt => opt.value === value) || { label: value, value } : null} options={categoryOptions}
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
            <Label htmlFor="model">Equipamento/Modelo</Label>
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

        <div className='grid md:grid-cols-3 gap-4'>

          <div className="grid gap-2">
            <Label htmlFor="part_value">Valor em peças</Label>
            <Input
              id="part_value"
              placeholder={'0.00'}
              {...register('part_value')}
              onChange={(e) => handleInputChange(e, "part_value")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="estimated_time">Tempo Estimado(h)</Label>
            <Controller
              name="estimated_time"
              control={control}
              defaultValue=''
              render={({ field }) => (
                <Input
                  id="estimated_time"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                  className={cn(
                    errors.estimated_time && "border-destructive focus-visible:ring-destructive"
                  )}
                  aria-invalid={!!errors.estimated_time}
                />
              )}
            />
            {errors.estimated_time && <span className="text-sm text-destructive">{errors.estimated_time.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="warranty">Garantia(meses)</Label>
            <Controller
              name="warranty"
              control={control}
              render={({ field }) => (
                <AppSelect
                  options={garantiaOrcamento}
                  placeholder="Selecione uma opção"
                  onValueChange={field.onChange} // O Controller cuida da atualização
                  value={field.value}          // O Controller fornece o valor atualizado
                />
              )}
            />
            {errors.warranty && <span className="text-sm text-destructive">{errors.warranty.message}</span>}
          </div>

        </div>

        <div className='grid md:grid-cols-3 gap-4'>
          <div className="grid gap-2">
            <Label htmlFor="labor_value">Valor da mão de obra</Label>
            <Controller
              name="labor_value"
              control={control}
              render={({ field }) => (
                <Input
                  id="labor_value"
                  placeholder={'0.00'}
                  {...field}
                  className={cn(
                    errors.labor_value && "border-destructive focus-visible:ring-destructive"
                  )}
                  aria-invalid={!!errors.labor_value}
                  onChange={(e) => handleInputChange(e, "labor_value")}
                />
              )}
            />
            {errors.labor_value && <span className="text-sm text-destructive">{errors.labor_value.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="total_value">Valor Total</Label>
            <Controller
              name="total_value"
              control={control}
              render={({ field }) => (
                <Input
                  id="total_value"
                  placeholder={'0.00'}
                  {...field}
                  onChange={(e) => field.onChange((e.target.value))}
                  className={cn(
                    errors.total_value && "border-destructive focus-visible:ring-destructive"
                  )}
                  aria-invalid={!!errors.total_value}
                  readOnly
                />
              )}
            />
            {errors.total_value && <span className="text-sm text-destructive">{errors.total_value.message}</span>}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Descrição do serviço e peças utilizadas</Label>
          <Controller
            name="description"
            control={control}
            defaultValue=''
            render={({ field }) => (
              <Textarea
                id="description"
                {...field}
                onChange={(e) => field.onChange(e.target.value)}
                className={cn(
                  errors.description && "border-destructive focus-visible:ring-destructive"
                )}
                aria-invalid={!!errors.description}
              />
            )}
          />
          {errors.description && <span className="text-sm text-destructive">{errors.description.message}</span>}
        </div>

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