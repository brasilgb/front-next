"use client"

import { AppSelect } from '@/components/app-select';
// import { DatePicker } from '@/components/date-picker'; // Não estava sendo usado no trecho
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toastSuccess, toastWarning } from '@/helpers/toast-messages';
import { createProduct, updateProduct } from '@/lib/actions/products';
import { maskMoney, maskMoneyDot } from '@/lib/masks';
import { cn } from '@/lib/utils';
import { Product } from '@/types/app-types';
import { garantiaOrcamento, statusProducts } from '@/utils/app-options';
import { selectStyles } from '@/utils/selected-styles';
import { Loader2Icon, SaveIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import CreatableSelect from 'react-select/creatable';

interface ProductFormProps {
  initialData?: Product;
  listproducts?: any;
}
interface OptionType {
  value: string;
  label: string;
}

export default function Create({ initialData, listproducts }: ProductFormProps) {

  const router = useRouter()
  const isEdit = !!initialData

  const initialCategoryOptions: OptionType[] = listproducts?.map((product: any) => ({
    value: product,
    label: product,
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
  } = useForm<Product>({
    defaultValues: initialData ? {
      ...initialData,
      'sale_price': maskMoney(Number(initialData?.sale_price).toFixed(2)),
      'cost_price': maskMoney(Number(initialData?.cost_price).toFixed(2))
    } : {}
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof Product) => {
    const { value } = e.target;
    setValue(fieldName, maskMoney(value));
  };

  const onSubmit: SubmitHandler<Product> = async (data) => {
    const payload = {
      ...data,
      sale_price: maskMoneyDot(data.sale_price),
      cost_price: maskMoneyDot(data.cost_price),
    };

    const result = isEdit
      ? await updateProduct(Number(initialData?.id), payload)
      : await createProduct(payload)

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
      toastSuccess("Produto alterado", "Edição realizada com sucesso")
    } else {
      toastSuccess("Produto salvo", "Cadastro realizado com sucesso")
      reset()
      router.push("/app/products")
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
          <div className="grid gap-2">
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
                  placeholder="Selecione ou digite a nova"
                  className="shadow-xs p-0 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-9"
                  styles={selectStyles}
                />
              )}
            />
            {errors.category && <span className="text-sm text-destructive">{errors.category.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="part_number">Número da Peça/Produto</Label>
            <Input
              id="part_number"
              {...register('part_number')}
              className={cn(errors.part_number && "border-destructive")}
            />
            {errors.part_number && <span className="text-sm text-destructive">{errors.part_number.message}</span>}
          </div>

          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="name">Nome da Peça</Label>
            <Input
              id="name"
              {...register('name')}
              className={cn(errors.name && "border-destructive")}
            />
            {errors.name && <span className="text-sm text-destructive">{errors.name.message}</span>}
          </div>

          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="description">Descriçãp da Peça</Label>
            <Input
              id="description"
              {...register('description')}
              className={cn(errors.description && "border-destructive")}
            />
            {errors.description && <span className="text-sm text-destructive">{errors.description.message}</span>}
          </div>
        </div>

        <div className='grid md:grid-cols-3 gap-4'>

          {/* CORREÇÃO AQUI: Trocado de register para Controller */}
          <div className="grid gap-2">
            <Label htmlFor="manufacturer">Fabricante</Label>
            <Input
              id="manufacturer"
              {...register('manufacturer')}
              className={cn(errors.manufacturer && "border-destructive")}
            />
            {errors.manufacturer && <span className="text-sm text-destructive">{errors.manufacturer.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="model_compatibility">Modelos Compatíveis</Label>
            <Controller
              name="model_compatibility"
              control={control}
              render={({ field }) => (
                <Input
                  id="model_compatibility"
                  {...field}
                  className={cn(errors.model_compatibility && "border-destructive")}
                />
              )}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Local de Armazenamento</Label>
            <Controller
              name="location"
              control={control}
              defaultValue=''
              render={({ field }) => (
                <Input
                  id="location"
                  {...field}
                  className={cn(errors.location && "border-destructive")}
                />
              )}
            />
          </div>
        </div>

        <div className='grid md:grid-cols-4 gap-4'>
          <div className="grid gap-2">
            <Label htmlFor="cost_price">Preço de Custo</Label>
            <Controller
              name="cost_price"
              control={control}
              render={({ field }) => (
                <Input
                  id="cost_price"
                  placeholder={'0'}
                  value={field.value}
                  onChange={(e) => handleInputChange(e, "cost_price")}
                  className={cn(errors.cost_price && "border-destructive")}
                />
              )}
            />
            {errors.cost_price && <span className="text-sm text-destructive">{errors.cost_price.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sale_price">Preço de Venda</Label>
            <Controller
              name="sale_price"
              control={control}
              render={({ field }) => (
                <Input
                  id="sale_price"
                  placeholder={'0'}
                  value={field.value}
                  onChange={(e) => handleInputChange(e, "sale_price")}
                  className={cn(errors.sale_price && "border-destructive")}
                />
              )}
            />
            {errors.sale_price && <span className="text-sm text-destructive">{errors.sale_price.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantidade em Estoque</Label>
            {/* Total value geralmente é ReadOnly, mas mantive o controller */}
            <Controller
              name="quantity"
              control={control}
              render={({ field }) => (
                <Input
                  id="quantity"
                  placeholder={'0'}
                  {...field}
                  className="bg-gray-100" // Visualmente indicando que é readonly
                />
              )}
            />
            {errors.quantity && <span className="text-sm text-destructive">{errors.quantity.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="minimum_stock_level">Estoque Mínimo</Label>
            {/* Total value geralmente é ReadOnly, mas mantive o controller */}
            <Controller
              name="minimum_stock_level"
              control={control}
              render={({ field }) => (
                <Input
                  id="minimum_stock_level"
                  placeholder={'0'}
                  {...field}
                  className="bg-gray-100" // Visualmente indicando que é readonly
                />
              )}
            />
            {errors.minimum_stock_level && <span className="text-sm text-destructive">{errors.minimum_stock_level.message}</span>}
          </div>
        </div>

        <div className='grid gap-2'>
          <Label htmlFor="status">Status do Produto</Label>
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
                  {statusProducts?.map((message: any) => (
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
          {isSubmitting ? 'Enviando...' : 'Salvar Produto'}
        </Button>
      </CardFooter>

    </form>
  )
}