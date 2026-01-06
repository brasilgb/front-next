"use client"

import { useState, useMemo, useRef } from "react"
import Select from "react-select"
import { Trash2, Plus, ShoppingCart, Loader2, PackageOpen } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { createSale } from "@/lib/actions/sale-actions"
import { formatCurrency } from "@/lib/masks"
import { Customer, Product } from "@/types/app-types"
import { useReactToPrint } from "react-to-print"
import Receipt from "./receipt"
import { usePaperSize } from "@/hooks/usePaperSize"
/* ===================== STYLES ===================== */

const selectThemeStyles = {
    control: (base: any, state: any) => ({
        ...base,
        backgroundColor: "var(--background)",
        borderColor: state.isFocused ? "var(--ring)" : "var(--input)",
        borderRadius: "calc(var(--radius) - 2px)",
        boxShadow: "none",
        "&:hover": { borderColor: "var(--ring)" },
    }),
    menu: (base: any) => ({
        ...base,
        backgroundColor: "var(--background)",
        border: "1px solid var(--border)",
        zIndex: 50,
    }),
    option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isFocused ? "var(--accent)" : "transparent",
        color: state.isFocused
            ? "var(--accent-foreground)"
            : "var(--foreground)",
        cursor: "pointer",
    }),
    singleValue: (base: any) => ({ ...base, color: "var(--foreground)" }),
    input: (base: any) => ({ ...base, color: "var(--foreground)" }),
}

/* ===================== TYPES ===================== */

interface CartItem {
    productId: number
    label: string
    quantity: number
    unitPrice: number
    total: number
}

interface Props {
    customers: Customer[]
    products: Product[]
}

/* ===================== COMPONENT ===================== */

export function SalesModal({ customers, products }: Props) {
    const customerOptions = customers.map(c => ({
        value: c.id,
        label: c.name,
    }))

    const productOptions = products.map(p => ({
        value: p.id,
        label: p.name,
        price: Number(p.sale_price),
    }))

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [qty, setQty] = useState(1)
    const [items, setItems] = useState<CartItem[]>([])
    const [lastSaleId, setLastSaleId] = useState<number | null>(null)
    const [showPrintPrompt, setShowPrintPrompt] = useState(false)

    const totalSale = useMemo(
        () => items.reduce((acc, item) => acc + item.total, 0),
        [items]
    )

    /* ===================== HANDLERS ===================== */

    const handleAddItem = () => {
        if (!selectedProduct) return toast.warning("Selecione um produto")
        if (qty <= 0) return toast.warning("Quantidade inválida")

        const existing = items.find(i => i.productId === selectedProduct.value)

        if (existing) {
            setItems(prev =>
                prev.map(i =>
                    i.productId === existing.productId
                        ? {
                            ...i,
                            quantity: i.quantity + qty,
                            total: (i.quantity + qty) * i.unitPrice,
                        }
                        : i
                )
            )
        } else {
            setItems(prev => [
                ...prev,
                {
                    productId: selectedProduct.value,
                    label: selectedProduct.label,
                    quantity: qty,
                    unitPrice: selectedProduct.price,
                    total: qty * selectedProduct.price,
                },
            ])
        }

        setSelectedProduct(null)
        setQty(1)
    }

    const handleFinishSale = async () => {
        if (!selectedCustomer) return toast.error("Selecione um cliente")
        if (items.length === 0) return toast.error("Carrinho vazio")

        setLoading(true)

        const result = await createSale({
            customerId: selectedCustomer.value,
            items: items.map(i => ({
                productId: i.productId,
                quantity: i.quantity,
                unitPrice: i.unitPrice,
            })),
        })

        if (result.success) {
            toast.success("Venda realizada com sucesso!")
            setLastSaleId(result.data.id) // ou result.data.id
            setShowPrintPrompt(true)

            setItems([])
            setSelectedCustomer(null)
            setSelectedProduct(null)
            setQty(1)
        } else {
            toast.error(result.message || "Erro ao salvar")
        }

        setLoading(false)
    }

    /* ===================== RENDER ===================== */
    const paper = usePaperSize()
    const receiptRef = useRef<HTMLDivElement>(null)

    const handlePrint = useReactToPrint({
        contentRef: receiptRef,
        documentTitle: "Nota Fiscal",
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Nova Venda
                </Button>
            </DialogTrigger>

            <DialogContent className="w-[95vw] max-w-[95vw] md:max-w-7xl h-[90vh] flex flex-col p-0 overflow-hidden">
                {/* HEADER */}
                <div className="p-6 border-b">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <PackageOpen className="w-5 h-5" />
                            Frente de Caixa
                        </DialogTitle>
                        <DialogDescription>
                            Registre uma nova venda
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-3">
                            <Label>Cliente</Label>
                            <Select
                                styles={selectThemeStyles}
                                options={customerOptions}
                                value={selectedCustomer}
                                onChange={setSelectedCustomer}
                                placeholder="Selecione o cliente"
                            />
                        </div>
                    </div>
                </div>

                {/* BODY (SCROLL FUNCIONAL) */}
                <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6">
                    <div className="grid gap-4 md:grid-cols-4 items-end">
                        <div className="md:col-span-2">
                            <Label>Produto</Label>
                            <Select
                                styles={selectThemeStyles}
                                options={productOptions}
                                value={selectedProduct}
                                onChange={setSelectedProduct}
                                placeholder="Selecione o produto"
                            />
                        </div>

                        <div>
                            <Label>Qtd</Label>
                            <Input
                                type="number"
                                min={1}
                                value={qty}
                                onChange={e => setQty(Number(e.target.value))}
                            />
                        </div>

                        <Button onClick={handleAddItem}>
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar
                        </Button>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Produto</TableHead>
                                <TableHead className="text-right">Qtd</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item, i) => (
                                <TableRow key={i}>
                                    <TableCell>{item.label}</TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell className="text-right">
                                        {formatCurrency(item.total)}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() =>
                                                setItems(prev => prev.filter((_, idx) => idx !== i))
                                            }
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {showPrintPrompt && lastSaleId && (
                    <div className="px-6 py-4 border-t bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm">
                            <strong>Venda concluída.</strong>
                            <span className="ml-2 text-muted-foreground">
                                Deseja imprimir a nota fiscal?
                            </span>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowPrintPrompt(false)
                                    setLastSaleId(null)
                                }}
                            >
                                Nova venda
                            </Button>

                            <Button
                                onClick={handlePrint}
                                className="bg-black text-white px-4 py-2 rounded"
                            >
                                Imprimir NF
                            </Button>
                        </div>
                        <div className="hidden">
                            <Receipt ref={receiptRef} paper={paper} />
                        </div>
                    </div>
                )}

                {/* FOOTER */}
                {!showPrintPrompt && (
                    <DialogFooter className="p-6 border-t flex justify-between">
                        <strong>{formatCurrency(totalSale)}</strong>
                        <Button onClick={handleFinishSale} disabled={loading}>
                            Finalizar
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}
