"use client"

import { Button } from "@/components/ui/button"
import {
    CalendarDaysIcon,
    PencilIcon,
    Trash2Icon,
    WrenchIcon
} from "lucide-react"
import { useState } from "react"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { deleteCustomer } from "@/lib/actions/customers"
import { useRouter } from "next/navigation"
import { Customer } from "@/types/app-types"
import { IoLogoWhatsapp } from 'react-icons/io'
import Link from "next/link"

interface ActionsCellProps {
    customer: Customer;
    page: number;
    pageSize: number;
    search?: string;
}

export function CustomerActionsCell({
    customer,
    page,
    pageSize,
    search }: ActionsCellProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    async function handleDelete() {
        try {
            setIsLoading(true)
            await deleteCustomer(customer.id)
            setOpen(false)
            router.refresh()
        } catch (error) {
            console.error("Erro ao deletar:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" size="icon" title="Enviar whatsapp">
                <IoLogoWhatsapp size={24} color="#25D366" />
            </Button>
            <Button variant="secondary" size="icon" title="Verificar agendamentos">
                <CalendarDaysIcon className="h-4 w-4 text-purple-500" />
            </Button>
            <Button variant="secondary" size="icon" title="Verificar ordens de serviço">
                <WrenchIcon className="h-4 w-4 text-sky-600" />
            </Button>

            <Link
                href={{
                    pathname: `/app/customers/edit/${customer.id}`,
                    query: {
                        page,
                        pageSize,
                        ...(search && { search }),
                    },
                }} 
                title="Editar dados do cliente"
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
                title="Deletar cliente e dados"
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
