"use client"

import { Button } from "@/components/ui/button"
import {
    PencilIcon,
    PrinterIcon,
    Trash2Icon,
} from "lucide-react"
import { useState } from "react"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { deleteProduct } from "@/lib/actions/products"
import { useRouter } from "next/navigation"
import { Product } from "@/types/app-types"
import Link from "next/link"
import { toastWarning } from "@/helpers/toast-messages"

interface ActionsCellProps {
    product: Product;
    page: number;
    pageSize: number;
    search?: string;
}

export function ProductActionsCell({
    product,
    page,
    pageSize,
    search }: ActionsCellProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    async function handleDelete() {
        try {
            setIsLoading(true)
            await deleteProduct(product.id)
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
            <Link
                href={{
                    pathname: `/app/products/edit/${product.id}`,
                    query: {
                        page,
                        pageSize,
                        ...(search && { search }),
                    },
                }}
                title="Editar dados do produto"
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
                title="Deletar produto e dados"
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
