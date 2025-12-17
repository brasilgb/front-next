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
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "cpf",
        header: "CPF/CNPJ",
    },
    {
        accessorKey: "phone",
        header: "Telefone",
    },
    {
        accessorKey: "created_at",
        header: "Data de Cadastro",
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