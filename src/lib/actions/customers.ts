"use server"; // Importante se for usar em formulários/Server Actions

import { apiFetch, ApiValidationError } from "@/lib/api";
import { Customer } from "@/types/app-types";


// GET - Buscar todos
export async function getCustomers({ page = 1, pageSize = 11, search = "", sortBy = "", sortDir = "" } = {}) {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    search,
    sortBy,
    sortDir,
  })

  return apiFetch(`/customers?${query.toString()}`)
}

// GET - Buscar um
export async function getCustomerById(id: number) {
  return apiFetch<Customer>(`/customers/${id}`);
}

// POST - Criar (Server Action)
export async function createCustomer(data: any) {
  try {
    await apiFetch<Customer>("/customers", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return { success: true }
  } catch (error: any) {
    console.log(error);
    
    if (error.status === 400 && error.fieldErrors) {
      return {
        success: false,
        fieldErrors: error.fieldErrors,
      }
    }

    return {
      success: false,
      message: error.message ?? "Erro inesperado",
    }
  }
}

// DELETE - Deletar (Server Action)
export async function deleteCustomer(id: number) {
  return apiFetch<Customer>(`/customers/${id}`, {
    method: "DELETE"
  });
}