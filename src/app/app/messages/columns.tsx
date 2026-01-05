"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Message } from "@/types/app-types"
import { MessageActionsCell } from "@/components/app/message/message-actions-cell"

import { StatusBadge } from "@/components/StatusBadge"

export const messageColumns: ColumnDef<Message>[] = [
    {
        accessorKey: "message_number",
        header: "#",
    },
    {
        accessorKey: "recipient.name",
        header: "Destinatário",
        enableSorting: true,
    },
    {
        accessorKey: "title",
        header: "Título",
        enableSorting: true,
    },
    {
        accessorKey: "status",
        header: "Status",
        enableSorting: false,
        cell: ({ row }: any) => {
            const status = row.getValue("status")
            return <StatusBadge category="message" value={status} />
        },
    },
    {
        accessorKey: "created_at",
        header: "Envio",
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
                <MessageActionsCell
                    message={row.original}
                    page={pageIndex + 1}
                    pageSize={pageSize}
                    search={search}
                />
            )
        },
    },
]