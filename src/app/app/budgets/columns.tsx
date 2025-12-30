"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Budget } from "@/types/app-types"

export const budgetColumns: ColumnDef<Budget>[] = [
    {
        accessorKey: "budget_number",
        header: "#",
    },
    {
        accessorKey: "category",
        header: "Categoria",
        enableSorting: true,
    },
    {
        accessorKey: "service",
        header: "Serviço",
        enableSorting: false,
    },
    {
        accessorKey: "estimated_time",
        header: "Tempo estimado",
        enableSorting: false,
    },
    {
        accessorKey: "total_value",
        header: "Valor Total",
        enableSorting: false,
    },
    {
        accessorKey: "created_at",
        header: "Data de Geração",
        enableSorting: true,
        cell: ({ row }: any) => {
            const date = new Date(row.getValue("created_at"))
            return date.toLocaleDateString("pt-BR")
        },
    },
    {
        id: "actions",
        header: "",
        cell: ({ row, table }) => {
            const { pageIndex, pageSize } = table.getState().pagination
            const search = table.getState().globalFilter as string

            // return (
                // <BudgetActionsCell
                //     customer={row.original}
                //     page={pageIndex + 1}
                //     pageSize={pageSize}
                //     search={search}
                // />
            // )
        },
    },
]