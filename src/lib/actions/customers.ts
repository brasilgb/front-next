"use server"; // Importante se for usar em formulários/Server Actions

import { apiFetch } from "@/lib/api";

// Tipagem (opcional, mas recomendada)
interface Customer {
  id: number;
  name: string;
  email: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

interface GetCustomersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: string;
}

// GET - Buscar todos
export async function getCustomers({
  page = 1,
  pageSize = 12,
  search = "",
  sortBy,
  sortDir
}: GetCustomersParams) {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    search,
  });

  return apiFetch<PaginatedResponse<Customer>>(
    `/customers?${query.toString()}`,
    {
      next: { tags: ["customers"] },
    }
  );
}

// GET - Buscar um
export async function getCustomerById(id: number) {
  return apiFetch<Customer>(`/customers/${id}`);
}

// POST - Criar (Server Action)
export async function createCustomer(data: any) {
  return apiFetch<Customer>("/customers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// DELETE - Deletar (Server Action)
export async function deleteCustomer(id: number) {
  return apiFetch<Customer>(`/customers/${id}`, {
    method: "DELETE"
  });
}