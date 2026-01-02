"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Schedule } from "@/types/app-types"
import { ScheduleActionsCell } from "@/components/app/schedule/schedule-actions-cell"

import moment from "moment"
import { StatusBadge } from "@/components/StatusBadge"

export const scheduleColumns: ColumnDef<Schedule>[] = [
    {
        accessorKey: "schedules_number",
        header: "#",
    },
    {
        accessorKey: "customers.name",
        header: "Cliente",
        enableSorting: true,
    },
    {
        accessorKey: "customers.phone",
        header: "Telefone",
        enableSorting: true,
    },
    {
        accessorKey: "schedules",
        header: "Horário da visita",
        enableSorting: false,
        cell: ({ row }: any) => {
            const date = new Date(row.getValue("schedules"))
            return moment(date).format("DD/MM/YYYY H:mm");
        },
    },
    {
        accessorKey: "service",
        header: "Serviço",
        enableSorting: false,
    },
    {
        accessorKey: "status",
        header: "Status",
        enableSorting: false,
        cell: ({ row }: any) => {
            const status = row.getValue("status")
            return <StatusBadge category="agenda" value={status} />
        },
    },
    {
        accessorKey: "users.name",
        header: "Técnico",
        enableSorting: false,
    },
    {
        accessorKey: "created_at",
        header: "Solicitação",
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
                <ScheduleActionsCell
                    schedule={row.original}
                    page={pageIndex + 1}
                    pageSize={pageSize}
                    search={search}
                />
            )
        },
    },
]