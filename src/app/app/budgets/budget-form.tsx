"use client"

import { AppSelect } from '@/components/app-select';
// import { DatePicker } from '@/components/date-picker'; // Não estava sendo usado no trecho
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
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

export default function Create({ initialData, listbudgets }: BudgetFormProps) {

  const router = useRouter()
  const isEdit = !!initialData

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

  // Watch observa as mudanças para acionar o useEffect
  const partsValueStr = watch('part_value');
  const serviceValueStr = watch('labor_value');

  useEffect(() => {
    // Garante que se for undefined ou vazio, considera 0
    const parts = partsValueStr ? maskMoneyDot(partsValueStr) : 0;
    const service = serviceValueStr ? maskMoneyDot(serviceValueStr) : 0;
    
    const total = Number(parts) + Number(service);
    
    // Evita NaN no input
    const costFormatted = isNaN(total) ? "0.00" : total.toFixed(2);
    
    setValue('total_value', maskMoney(costFormatted));

  }, [partsValueStr, serviceValueStr, setValue]);


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
          {/* ... Código do Category e Model mantido igual ... */}
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
                  placeholder="Selecione..."
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
              className={cn(errors.service && "border-destructive")}
            />
            {errors.service && <span className="text-sm text-destructive">{errors.service.message}</span>}
          </div>

          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="model">Equipamento/Modelo</Label>
            <Input
              id="model"
              {...register('model')}
              className={cn(errors.model && "border-destructive")}
            />
             {errors.model && <span className="text-sm text-destructive">{errors.model.message}</span>}
          </div>
        </div>

        <div className='grid md:grid-cols-3 gap-4'>

          {/* CORREÇÃO AQUI: Trocado de register para Controller */}
          <div className="grid gap-2">
            <Label htmlFor="part_value">Valor em peças</Label>
            <Controller
              name="part_value"
              control={control}
              defaultValue={initialData?.part_value || 0}
              render={({ field }) => (
                <Input
                  id="part_value"
                  placeholder={'0.00'}
                  value={field.value} // Importante: Controlado pelo field.value
                  onChange={(e) => {
                    // Aplica máscara e atualiza o estado do form
                    const masked = maskMoney(e.target.value);
                    field.onChange(masked); 
                  }}
                  className={cn(errors.part_value && "border-destructive")}
                />
              )}
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
                  className={cn(errors.estimated_time && "border-destructive")}
                />
              )}
            />
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
                   onValueChange={field.onChange}
                   value={field.value}
                 />
               )}
             />
           </div>
        </div>

        <div className='grid md:grid-cols-3 gap-4'>
          <div className="grid gap-2">
            <Label htmlFor="labor_value">Valor da mão de obra</Label>
            <Controller
              name="labor_value"
              control={control}
              defaultValue={initialData?.labor_value || 0}
              render={({ field }) => (
                <Input
                  id="labor_value"
                  placeholder={'0.00'}
                  value={field.value}
                  onChange={(e) => {
                    const masked = maskMoney(e.target.value);
                    field.onChange(masked);
                  }}
                  className={cn(errors.labor_value && "border-destructive")}
                />
              )}
            />
            {errors.labor_value && <span className="text-sm text-destructive">{errors.labor_value.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="total_value">Valor Total</Label>
             {/* Total value geralmente é ReadOnly, mas mantive o controller */}
            <Controller
              name="total_value"
              control={control}
              render={({ field }) => (
                <Input
                  id="total_value"
                  placeholder={'0.00'}
                  {...field}
                  readOnly
                  className="bg-gray-100" // Visualmente indicando que é readonly
                />
              )}
            />
          </div>
        </div>
        
        {/* ... Resto do form (description, obs, botão) mantido igual ... */}
        <div className="grid gap-2">
          <Label htmlFor="description">Descrição do serviço e peças utilizadas</Label>
          <Textarea id="description" {...register('description')} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="obs">Observações</Label>
          <Textarea id="obs" {...register('obs')} />
        </div>

      </CardContent>

      <CardFooter className="flex justify-end pt-6">
        <Button type='submit' variant="default" disabled={isSubmitting}>
          {isSubmitting ? <Loader2Icon className='w-4 h-4 animate-spin' /> : <SaveIcon className='w-4 h-4' />}
          {isSubmitting ? 'Enviando...' : 'Salvar Orçamento'}
        </Button>
      </CardFooter>

    </form>
  )
}