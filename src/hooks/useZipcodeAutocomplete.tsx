"use client"

import { useEffect, useRef, useState } from "react"
import {
  FieldValues,
  UseFormSetValue,
  UseFormSetError,
  UseFormClearErrors,
  Path,
} from "react-hook-form"

interface ZipcodePaths<T extends FieldValues> {
  zipcode: Path<T>
  state: Path<T>
  city: Path<T>
  district: Path<T>
  street: Path<T>
  complement: Path<T>
}

interface ZipcodeResponse {
  cep: string
  uf: string
  localidade: string
  bairro: string
  logradouro: string
  complemento: string
  erro?: boolean
}

interface Params<T extends FieldValues> {
  zipcodeValue: string
  paths: ZipcodePaths<T>
  setValue: UseFormSetValue<T>
  setError: UseFormSetError<T>
  clearErrors: UseFormClearErrors<T>
  debounceMs?: number
}

export function useZipcodeAutocomplete<T extends FieldValues>({
  zipcodeValue,
  paths,
  setValue,
  setError,
  clearErrors,
  debounceMs = 500,
}: Params<T>) {
  const [isZipcodeLoading, setIsZipcodeLoading] = useState(false)
  const lastCepRef = useRef<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const cleanCep = zipcodeValue?.replace(/\D/g, "")

    if (!cleanCep || cleanCep.length !== 8) return
    if (lastCepRef.current === cleanCep) return

    lastCepRef.current = cleanCep

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      setIsZipcodeLoading(true)
      clearErrors(paths.zipcode)

      const controller = new AbortController()
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
          signal: controller.signal,
        })
        const data: ZipcodeResponse = await res.json()

        if (data.erro) {
          setError(paths.zipcode, {
            type: "manual",
            message: "CEP não encontrado",
          })
          return
        }

        setValue(paths.state, data.uf as any)
        setValue(paths.city, data.localidade as any)
        setValue(paths.district, data.bairro as any)
        setValue(paths.street, data.logradouro as any)
        setValue(paths.complement, data.complemento as any)
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(paths.zipcode, {
            type: "manual",
            message: "Erro ao buscar CEP",
          })
        }
      } finally {
        setIsZipcodeLoading(false)
      }
    }, debounceMs)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [zipcodeValue])

  return { isZipcodeLoading }
}
