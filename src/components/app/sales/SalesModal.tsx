"use client"

import { useState, useMemo } from "react"
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
import { maskMoney } from "@/lib/masks"

// Action e Formatters


// --- DADOS MOCK (Substitua pela sua API) ---
const mockCustomers = [
    { value: 1, label: "João da Silva" },
    { value: 2, label: "Empresa XPTO Ltda" },
]

const mockProducts = [
    { value: 101, label: "Mouse Logitech M170", price: 65.00 },
    { value: 102, label: "Teclado Mecânico RGB", price: 250.00 },
    { value: 103, label: "Monitor Dell 24'", price: 1200.00 },
    { value: 104, label: "Cabo HDMI 2.0 2m", price: 35.00 },
]

// --- ESTILOS DO REACT-SELECT (THEME AWARE) ---
// Usamos as variáveis CSS do shadcn (hsl) para garantir que funcione no Dark/Light
const selectThemeStyles = {
    control: (base: any, state: any) => ({
        ...base,
        // Força a cor de fundo usando a variável do shadcn
        backgroundColor: "hsl(var(--background))",
        borderColor: state.isFocused ? "hsl(var(--ring))" : "hsl(var(--input))",
        borderRadius: "calc(var(--radius) - 2px)",
        padding: "1px",
        boxShadow: "none",
        // Garante que o texto não fique transparente
        color: "hsl(var(--foreground))",
        "&:hover": { borderColor: "hsl(var(--accent))" },
    }),
    menu: (base: any) => ({
        ...base,
        // O menu dropdown precisa ser sólido (geralmente popover ou background)
        backgroundColor: "hsl(var(--popover))",
        border: "1px solid hsl(var(--border))",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow)",
        zIndex: 9999, // Garante que fique acima de tudo
    }),
    option: (base: any, state: any) => ({
        ...base,
        // Fundo muda no hover/focus
        backgroundColor: state.isFocused ? "hsl(var(--accent))" : "transparent",
        color: state.isFocused ? "hsl(var(--accent-foreground))" : "hsl(var(--foreground))",
        cursor: "pointer",
    }),
    singleValue: (base: any) => ({
        ...base,
        color: "hsl(var(--foreground))",
    }),
    input: (base: any) => ({
        ...base,
        color: "hsl(var(--foreground))",
    }),
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
}

interface CartItem {
    productId: number
    label: string
    quantity: number
    unitPrice: number
    total: number
}

export function SalesModal() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    // Estados principais
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
    const [items, setItems] = useState<CartItem[]>([])

    // Estados do formulário de adição
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [qty, setQty] = useState<number>(1)

    const totalSale = useMemo(() => items.reduce((acc, item) => acc + item.total, 0), [items])

    const handleAddItem = () => {
        if (!selectedProduct) return toast.warning("Selecione um produto")
        if (qty <= 0) return toast.warning("Quantidade inválida")

        const newItem: CartItem = {
            productId: selectedProduct.value,
            label: selectedProduct.label,
            quantity: qty,
            unitPrice: selectedProduct.price,
            total: qty * selectedProduct.price,
        }

        const existingIndex = items.findIndex(i => i.productId === newItem.productId)

        if (existingIndex >= 0) {
            const updatedItems = [...items]
            updatedItems[existingIndex].quantity += qty
            updatedItems[existingIndex].total += newItem.total
            setItems(updatedItems)
        } else {
            setItems([...items, newItem])
        }

        setSelectedProduct(null)
        setQty(1)
    }

    const handleRemoveItem = (index: number) => {
        setItems(prev => prev.filter((_, i) => i !== index))
    }

    const handleFinishSale = async () => {
        if (!selectedCustomer) return toast.error("Selecione um cliente")
        if (items.length === 0) return toast.error("O carrinho está vazio")

        setLoading(true)

        const payload = {
            tenantId: 1,
            customerId: selectedCustomer.value,
            items: items.map(i => ({
                productId: i.productId,
                quantity: i.quantity,
                unitPrice: i.unitPrice
            }))
        }

        const result = await createSale(payload)

        if (result.success) {
            toast.success("Venda realizada com sucesso!")
            setOpen(false)
            setItems([])
            setSelectedCustomer(null)
        } else {
            toast.error(result.message || "Erro ao salvar")
        }

        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="gap-2 shadow-md">
                    <ShoppingCart className="w-5 h-5" />
                    Nova Venda
                </Button>
            </DialogTrigger>

            {/* AQUI MUDAMOS A LARGURA: 
         - max-w-7xl (Bem largo)
         - w-[95%] (Ocupa quase toda tela em mobile/tablet)
      */}
            <DialogContent
                className="w-[95vw] max-w-[95vw] md:max-w-7xl h-[90vh] flex flex-col p-0"
                onInteractOutside={(e) => e.preventDefault()} // Opcional: evita fechar ao clicar fora sem querer
            >

                {/* Header Fixo */}
                <div className="p-6 pb-2 border-b bg-background z-10">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <PackageOpen className="w-6 h-6 text-primary" />
                            Frente de Caixa
                        </DialogTitle>
                        <DialogDescription>
                            Preencha os dados abaixo para registrar uma nova venda.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Seleção de Cliente (Fica no topo) */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-3">
                            <Label className="mb-2 block">Cliente</Label>
                            <Select
                                options={mockCustomers}
                                value={selectedCustomer}
                                onChange={setSelectedCustomer}
                                placeholder="Busque o cliente..."
                                styles={selectThemeStyles} // Estilo Dark/Light
                                menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                                className="text-sm"
                            />
                        </div>
                        <div className="flex items-center justify-end h-10 pb-1">
                            <span className="text-sm text-muted-foreground">
                                Data: {new Date().toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Conteúdo Rolável (Items e Tabela) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Caixa de Adição (Usando bg-muted para contraste suave em ambos temas) */}
                    <div className="bg-muted/40 p-5 rounded-xl border border-border grid gap-4">
                        <div className="flex flex-col xl:flex-row gap-4 items-end">

                            <div className="flex-1 w-full min-w-75">
                                <Label className="text-xs mb-1.5 block font-semibold text-muted-foreground">PRODUTO</Label>
                                <Select
                                    options={mockProducts}
                                    value={selectedProduct}
                                    onChange={setSelectedProduct}
                                    placeholder="Selecione ou digite o código..."
                                    styles={selectThemeStyles}
                                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                                    className="text-sm"
                                />
                            </div>

                            <div className="w-full xl:w-32">
                                <Label className="text-xs mb-1.5 block font-semibold text-muted-foreground">QUANTIDADE</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={qty}
                                    onChange={(e) => setQty(Number(e.target.value))}
                                    className="bg-background"
                                />
                            </div>

                            <div className="w-full xl:w-40">
                                <Label className="text-xs mb-1.5 block font-semibold text-muted-foreground">PREÇO UN.</Label>
                                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted text-muted-foreground text-sm flex items-center">
                                    {selectedProduct ? maskMoney(selectedProduct.price) : "R$ 0,00"}
                                </div>
                            </div>

                            <Button onClick={handleAddItem} type="button" size="default" className="w-full xl:w-auto min-w-[120px]">
                                <Plus className="w-4 h-4 mr-2" />
                                Adicionar
                            </Button>
                        </div>
                    </div>

                    {/* Tabela de Itens */}
                    <div className="rounded-md border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[50%]">Produto</TableHead>
                                    <TableHead className="text-right">Qtd</TableHead>
                                    <TableHead className="text-right">Unitário</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2">
                                                <ShoppingCart className="w-8 h-8 opacity-20" />
                                                <p>Carrinho vazio</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    items.map((item, index) => (
                                        <TableRow key={`${item.productId}-${index}`}>
                                            <TableCell className="font-medium text-foreground">{item.label}</TableCell>
                                            <TableCell className="text-right text-muted-foreground">{item.quantity}</TableCell>
                                            <TableCell className="text-right text-muted-foreground">{maskMoney(item.unitPrice)}</TableCell>
                                            <TableCell className="text-right font-bold text-foreground">{maskMoney(item.total)}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleRemoveItem(index)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Footer Fixo */}
                <DialogFooter className="p-6 border-t bg-muted/20 flex flex-col sm:flex-row gap-4 items-center justify-between z-10">
                    <div className="flex flex-col items-start gap-1">
                        <span className="text-sm font-medium text-muted-foreground">VALOR TOTAL</span>
                        <span className="text-3xl font-bold text-primary tracking-tight">
                            {maskMoney(totalSale)}
                        </span>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">
                        <Button variant="outline" size="lg" onClick={() => setOpen(false)} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button size="lg" onClick={handleFinishSale} disabled={loading || items.length === 0} className="px-8">
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Finalizar Venda
                        </Button>
                    </div>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}