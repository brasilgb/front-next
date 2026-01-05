"use server"; // Importante se for usar em formulários/Server Actions

import { apiFetch } from "@/lib/api";
import { Message } from "@/types/app-types";

export async function listMessages() {
  const { data } = await apiFetch<Message[]>("/messages") as any;

  return [...new Set(data?.map((b: any) => b.category))];
}

// GET - Buscar todos
export async function getMessages({ page = 1, pageSize = 11, search = "", sortBy = "", sortDir = "" } = {}) {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    search,
    sortBy,
    sortDir,
  })

  return apiFetch(`/messages?${query.toString()}`)
}

// GET - Buscar um cliente
export async function getMessageById(id: number) {
  return apiFetch<Message>(`/messages/${id}`);
}

// POST - Criar (Server Action)
export async function createMessage(data: Message) {

  try {
    await apiFetch<Message>("/messages", {
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
export async function updateMessage(id: number, data: Message) {
  try {

    await apiFetch<Message>(`/messages/${id}`, {
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
export async function deleteMessage(id: number) {
  return apiFetch<Message>(`/messages/${id}`, {
    method: "DELETE"
  });
}