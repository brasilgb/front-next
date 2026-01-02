"use client"

import { Button } from "@/components/ui/button"
import {
    PencilIcon,
    PrinterIcon,
    Trash2Icon,
} from "lucide-react"
import { useState } from "react"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { deleteSchedule } from "@/lib/actions/schedules"
import { useRouter } from "next/navigation"
import { Schedule } from "@/types/app-types"
import Link from "next/link"
import { toastWarning } from "@/helpers/toast-messages"

interface ActionsCellProps {
    schedule: Schedule;
    page: number;
    pageSize: number;
    search?: string;
}

export function ScheduleActionsCell({
    schedule,
    page,
    pageSize,
    search }: ActionsCellProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    async function handleDelete() {
        try {
            setIsLoading(true)
            await deleteSchedule(schedule.id)
            setOpen(false)
            router.refresh()
            toastWarning('Deletar registro', 'Registro deletado com sucesso')
        } catch (error) {
            console.error("Erro ao deletar:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" size="icon" title="Verificar agendamentos">
                <PrinterIcon className="h-4 w-4 text-purple-500" />
            </Button>
            <Link
                href={{
                    pathname: `/app/schedules/edit/${schedule.id}`,
                    query: {
                        page,
                        pageSize,
                        ...(search && { search }),
                    },
                }}
                title="Editar dados do orçamento"
            >
                <Button variant="secondary" size="icon">
                    <PencilIcon className="h-4 w-4 text-yellow-600" />
                </Button>
            </Link>

            <Button
                size="icon"
                variant="secondary"
                className="text-destructive"
                onClick={() => setOpen(true)}
                disabled={isLoading}
                title="Deletar orçamento e dados"
            >
                <Trash2Icon className="h-4 w-4" />
            </Button>

            <DeleteConfirmDialog
                open={open}
                onOpenChange={setOpen}
                onConfirm={handleDelete}
            />
        </div>
    )
}
