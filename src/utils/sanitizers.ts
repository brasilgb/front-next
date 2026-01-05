// utils/sanitizers.ts

import { CreateSaleDTO } from "@/types/app-types";

export function sanitizeSaleData(data: CreateSaleDTO): CreateSaleDTO {
  return {
    ...data,
    // Garante que se for 0 ou undefined vire null
    customerId: data.customerId ? Number(data.customerId) : null,
    tenantId: Number(data.tenantId),
    items: data.items.map((item) => ({
      productId: Number(item.productId),
      quantity: Number(item.quantity),
      // Garante precisão decimal se vier como string
      unitPrice: Number(item.unitPrice), 
    })),
  }
}