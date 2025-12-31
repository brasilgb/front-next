"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Order } from "@/types/app-types"
import { OrderActionsCell } from "@/components/app/orders/order-actions-cell"
import { StatusBadge } from "@/components/StatusBadge"

export const orderColumns: ColumnDef<Order>[] = [
    {
        accessorKey: "order_number",
        header: "#",
    },
    {
        accessorKey: "customers.name",
        header: "Nome",
        enableSorting: true,
    },
    {
        accessorKey: "customers.phone",
        header: "Telefone",
        enableSorting: false,
    },
    {
        accessorKey: "created_at",
        header: "Recebimento",
        enableSorting: true,
        cell: ({ row }: any) => {
            const date = new Date(row.getValue("created_at"))
            return date.toLocaleDateString("pt-BR")
        },
    },
    {
        accessorKey: "equipment.equipment",
        header: "Equipamento",
        enableSorting: false,
    },
    {
        accessorKey: "model",
        header: "Modelo",
        enableSorting: false,
    },
    {
        accessorKey: "service_status",
        header: "Status",
        enableSorting: false,
        cell: ({ row }: any) => {
            const status = row.getValue("service_status")
            return <StatusBadge category="ordem" value={status} />
        },
    },
    {
        accessorKey: "delivery_date",
        header: "Entrega",
        enableSorting: true,
        cell: ({ row }: any) => {
            const date = new Date(row.getValue("created_at"))
            return date.toLocaleDateString("pt-BR")
        },
    },
    {
        accessorKey: "feedback",
        header: "Feedback",
        enableSorting: false,
    },
    {
        id: "actions",
        header: "",
        cell: ({ row, table }) => {
            const { pageIndex, pageSize } = table.getState().pagination
            const search = table.getState().globalFilter as string

            return (
                <OrderActionsCell
                    order={row.original}
                    page={pageIndex + 1}
                    pageSize={pageSize}
                    search={search}
                />
            )
        },
    },
]