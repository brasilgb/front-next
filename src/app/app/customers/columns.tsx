"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Customer } from "@/types/app-types"
import { CustomerActionsCell } from "@/components/app/customer/customer-actions-cell"

export const customerColumns: ColumnDef<Customer>[] = [
    {
        accessorKey: "customer_number",
        header: "#",
    },
    {
        accessorKey: "name",
        header: "Nome",
        enableSorting: true,
    },
    {
        accessorKey: "email",
        header: "Email",
        enableSorting: false,
    },
    {
        accessorKey: "cpf",
        header: "CPF/CNPJ",
        enableSorting: true,
    },
    {
        accessorKey: "phone",
        header: "Telefone",
        enableSorting: false,
    },
    {
        accessorKey: "created_at",
        header: "Data de Cadastro",
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

            return (
                <CustomerActionsCell
                    customer={row.original}
                    page={pageIndex + 1}
                    pageSize={pageSize}
                    search={search}
                />
            )
        },
    },
]