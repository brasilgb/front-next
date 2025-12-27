import * as React from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface AppSelectProps {
    options: { value: string | number; label: string }[]; // Melhorando a tipagem
    placeholder?: string; // Corrigido o erro de digitação
    onValueChange: (value: string) => void;
    value?: string; // Adicionado para tornar o componente "controlled"
    defaultValue?: string;
}

export function AppSelect({ options, placeholder, onValueChange, value, defaultValue }: AppSelectProps) {
    return (
        <Select
            onValueChange={onValueChange}
            defaultValue={defaultValue}
            value={value} // Agora o componente aceita controle externo
        >
            <SelectTrigger className="w-full">
                {/* Corrigido: placeholder */}
                <SelectValue placeholder={placeholder} /> 
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options.map((option) => (
                        <SelectItem 
                            key={String(option.value)} 
                            value={String(option.value)} // Garante que o valor seja string
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}