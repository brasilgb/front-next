"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Product } from "@/types/app-types"
import { ProductActionsCell } from "@/components/app/product/product-actions-cell"
import { maskMoney } from "@/lib/masks"

export const productColumns: ColumnDef<Product>[] = [
    {
        accessorKey: "product_number",
        header: "#",
    },
    {
        accessorKey: "category",
        header: "Categoria",
        enableSorting: true,
    },
    {
        accessorKey: "manufacturer",
        header: "Nome do produto",
        enableSorting: true,
    },
    {
        accessorKey: "sale_price",
        header: "Preço de Venda",
        enableSorting: false,
        cell: ({ row }: any) => {
            return 'R$ '+ maskMoney(Number(row.getValue("sale_price")).toFixed(2))
        }
    },
    {
        accessorKey: "minimum_stock_level",
        header: "Estoque Mínimo",
        enableSorting: false,
    },
    {
        accessorKey: "quantity",
        header: "Estoque",
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
                <ProductActionsCell
                    product={row.original}
                    page={pageIndex + 1}
                    pageSize={pageSize}
                    search={search}
                />
            )
        },
    },
]