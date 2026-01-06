"use server"; // Importante se for usar em formulários/Server Actions

import { apiFetch } from "@/lib/api";
import { Product } from "@/types/app-types";

export async function listCategories() {
  const { data } = await apiFetch<Product[]>("/products") as any;
  return [...new Set(data?.map((b: any) => b.category))];
}

export async function listProducts() {
  const { data } = await apiFetch<Product[]>("/products") as any;
  return data;
}

// GET - Buscar todos
export async function getProducts({ page = 1, pageSize = 11, search = "", sortBy = "", sortDir = "" } = {}) {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    search,
    sortBy,
    sortDir,
  })

  return apiFetch(`/products?${query.toString()}`)
}

// GET - Buscar um cliente
export async function getProductById(id: number) {
  return apiFetch<Product>(`/products/${id}`);
}

// POST - Criar (Server Action)
export async function createProduct(data: Product) {
  try {
    await apiFetch<Product>("/products", {
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
export async function updateProduct(id: number, data: Product) {
  try {

    await apiFetch<Product>(`/products/${id}`, {
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
export async function deleteProduct(id: number) {
  return apiFetch<Product>(`/products/${id}`, {
    method: "DELETE"
  });
}