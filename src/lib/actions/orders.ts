"use server"; // Importante se for usar em formulários/Server Actions

import { apiFetch } from "@/lib/api";
import { Order } from "@/types/app-types";

const sanitizeOrderData = (data: Order) => ({
  ...data,
  budget_value: data.budget_value ? Number(data.budget_value) : null,
  service_value: data.service_value ? Number(data.service_value) : null,
  parts_value: data.parts_value ? Number(data.parts_value) : null,
  service_cost: data.service_cost ? Number(data.service_cost) : null,
  equipment_id: data.equipment_id ? Number(data.equipment_id) : null,
  service_status: data.service_status ? Number(data.service_status) : null,
  responsible_technician: data.responsible_technician
    ? String(data.responsible_technician)
    : "",
  services_performed: data.services_performed ?? "",
  parts: data.parts ?? "",
  feedback: !!data.feedback,
});


// GET - Buscar todos
export async function getOrders({ page = 1, pageSize = 11, search = "", sortBy = "", sortDir = "" } = {}) {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    search,
    sortBy,
    sortDir,
  })

  return apiFetch(`/orders?${query.toString()}`)
}

// GET - Buscar um ordem
export async function getOrderById(id: number) {
  return apiFetch<Order>(`/orders/${id}`);
}

// POST - Criar (Server Action)
export async function createOrder(data: Order) {
  try {
    await apiFetch<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(sanitizeOrderData(data)),
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

// PATCH - Editar (Server Action)
export async function updateOrder(id: number, data: Order) {
  try {
    const newData = sanitizeOrderData(data);
    await apiFetch<Order>(`/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify(newData),
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
export async function deleteOrder(id: number) {
  return apiFetch<Order>(`/orders/${id}`, {
    method: "DELETE"
  });
}