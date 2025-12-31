"use server"; // Importante se for usar em formulários/Server Actions

import { apiFetch } from "@/lib/api";
import { Budget } from "@/types/app-types";

export async function listBudgets() {
  // return await apiFetch<Budget>("/budgets");
  const { data } = await apiFetch<Budget[]>("/budgets");
// console.log(data.category);

  return [...new Set(data?.map(b => b.category))];
}

// GET - Buscar todos
export async function getBudgets({ page = 1, pageSize = 11, search = "", sortBy = "", sortDir = "" } = {}) {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    search,
    sortBy,
    sortDir,
  })

  return apiFetch(`/budgets?${query.toString()}`)
}

// GET - Buscar um cliente
export async function getBudgetById(id: number) {
  return apiFetch<Budget>(`/budgets/${id}`);
}

// POST - Criar (Server Action)
export async function createBudget(data: Budget) {
  try {
    await apiFetch<Budget>("/budgets", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return { success: true }
  } catch (error: any) {
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

// PATCH - Editar (Server Action)
export async function updateBudget(id: number, data: Budget) {
  try {

    await apiFetch<Budget>(`/budgets/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
    return { success: true }
  } catch (error: any) {

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
export async function deleteBudget(id: number) {
  return apiFetch<Budget>(`/budgets/${id}`, {
    method: "DELETE"
  });
}