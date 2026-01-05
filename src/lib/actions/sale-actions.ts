// actions/sale-actions.ts
import { apiFetch } from "@/lib/api" // Seu wrapper de fetch
import { ActionResponse, CreateSaleDTO } from "@/types/app-types"
import { sanitizeSaleData } from "@/utils/sanitizers"

export async function createSale(data: CreateSaleDTO): Promise<ActionResponse> {
  try {
    // Validação prévia básica (opcional, economiza request)
    if (!data.items || data.items.length === 0) {
      return { success: false, message: "O carrinho não pode estar vazio." }
    }

    const cleanData = sanitizeSaleData(data)

    const response = await apiFetch<any>("/sales", {
      method: "POST",
      body: JSON.stringify(cleanData),
    })

    return { 
      success: true, 
      data: response // Pode retornar o ID da venda para redirecionar
    }

  } catch (error: any) {
    console.error("Erro ao criar venda:", error)

    // Tratamento de erros de validação (ex: Zod no backend retornando 400)
    if (error.status === 400 && error.fieldErrors) {
      return {
        success: false,
        fieldErrors: error.fieldErrors,
      }
    }

    // Erro genérico
    return {
      success: false,
      message: error.message || "Ocorreu um erro inesperado ao processar a venda.",
    }
  }
}