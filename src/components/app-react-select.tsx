"use client"

import * as React from "react"
import Select, { Props as ReactSelectProps } from "react-select"
import { cn } from "@/lib/utils"

interface AppReactSelectProps extends ReactSelectProps {
    error?: boolean;
}

export const AppReactSelect = React.forwardRef<any, AppReactSelectProps>(({ className, classNames, error, ...props }, ref) => {
    return (
        <Select
            ref={ref}
            unstyled
            classNames={{
                control: (state) =>
                    cn(
                        "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
                        state.isFocused ? "ring-1 ring-ring" : "",
                        state.isDisabled && "cursor-not-allowed opacity-50",
                        error && "border-destructive",
                        className
                    ),
                valueContainer: () => "flex flex-1 items-center gap-1",
                singleValue: () => "text-foreground",
                input: () => "text-foreground",
                placeholder: () => "text-muted-foreground",
                menu: () => "mt-1.5 p-1 border border-border bg-popover text-popover-foreground rounded-md shadow-md z-50",
                option: (state) =>
                    cn(
                        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none",
                        state.isFocused && "bg-accent text-accent-foreground",
                        state.isSelected && "bg-primary text-primary-foreground"
                    ),
                indicatorSeparator: () => "hidden",
                dropdownIndicator: () => "text-muted-foreground opacity-50 hover:opacity-100",
                noOptionsMessage: () => "text-muted-foreground p-2",
                ...classNames,
            }}
            {...props}
        />
    )
});

AppReactSelect.displayName = "AppReactSelect"
