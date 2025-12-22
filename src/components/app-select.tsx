import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface AppSelectProps {
    options: any[];
    placeolder?: string;
    onValueChange: (value: any) => void;
    defaultValue?: any;
}


export function AppSelect({ options, placeolder, onValueChange, defaultValue }: AppSelectProps) {
    return (
        <Select
            onValueChange={onValueChange}
            defaultValue={defaultValue}
        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeolder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
