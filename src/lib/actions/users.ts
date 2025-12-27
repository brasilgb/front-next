"use server"; // Importante se for usar em formulários/Server Actions

import { apiFetch } from "@/lib/api";
import { User } from "@/types/app-types";


// GET - Buscar todos
export async function getUsers({ page = 1, pageSize = 11, search = "", sortBy = "", sortDir = "" } = {}) {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    search,
    sortBy,
    sortDir,
  })

  return apiFetch(`/users?${query.toString()}`)
}

// GET - Buscar um usuario
export async function getUserById(id: number) {
  return apiFetch<User>(`/users/${id}`);
}

// POST - Criar (Server Action)
export async function createUser(data: User) {
  try {
    await apiFetch<User>("/users", {
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

// PATCH - Editar (Server Action)
export async function updateUser(id: number, data: User) {
  try {
    await apiFetch<User>(`/users/${id}`, {
      method: "PATCH",
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
export async function deleteUser(id: number) {
  return apiFetch<User>(`/users/${id}`, {
    method: "DELETE"
  });
}

export async function listUsers() {
  const  { users: data }  = await apiFetch<User>("/users");
  return data;
}