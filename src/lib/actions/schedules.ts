"use server"; // Importante se for usar em formulários/Server Actions

import { apiFetch } from "@/lib/api";
import { Schedule } from "@/types/app-types";

export async function listSchedules() {
  const { data } = await apiFetch<Schedule[]>("/schedules") as any;

  return [...new Set(data?.map((b: any) => b.category))];
}

// GET - Buscar todos
export async function getSchedules({ page = 1, pageSize = 11, search = "", sortBy = "", sortDir = "" } = {}) {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    search,
    sortBy,
    sortDir,
  })

  return apiFetch(`/schedules?${query.toString()}`)
}

// GET - Buscar um cliente
export async function getScheduleById(id: number) {
  return apiFetch<Schedule>(`/schedules/${id}`);
}

// POST - Criar (Server Action)
export async function createSchedule(data: Schedule) {
console.log(data);

  try {
    await apiFetch<Schedule>("/schedules", {
      method: "POST",
      body: JSON.stringify(data)
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
export async function updateSchedule(id: number, data: Schedule) {
  try {

    await apiFetch<Schedule>(`/schedules/${id}`, {
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
export async function deleteSchedule(id: number) {
  return apiFetch<Schedule>(`/schedules/${id}`, {
    method: "DELETE"
  });
}