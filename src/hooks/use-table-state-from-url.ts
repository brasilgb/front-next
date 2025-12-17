"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"

interface UseTableStateFromUrlOptions {
  defaultPageSize?: number
  searchParamName?: string
}

export function useTableStateFromUrl({
  defaultPageSize = 12,
  searchParamName = "search",
}: UseTableStateFromUrlOptions = {}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // ✅ LER URL UMA ÚNICA VEZ
  const initialState = React.useRef({
    pageIndex: Math.max(
      Number(searchParams.get("page") ?? 1) - 1,
      0
    ),
    pageSize:
      Number(searchParams.get("pageSize")) || defaultPageSize,
    search: searchParams.get(searchParamName) ?? "",
  })

  const [pagination, setPagination] = React.useState({
    pageIndex: initialState.current.pageIndex,
    pageSize: initialState.current.pageSize,
  })

  const [globalFilter, setGlobalFilter] = React.useState(
    initialState.current.search
  )

  // 🔒 trava leitura da URL
  const didInit = React.useRef(false)

  // 🧠 Estado → URL
  React.useEffect(() => {
    if (!didInit.current) {
      didInit.current = true
      return
    }

    const params = new URLSearchParams()

    params.set("page", String(pagination.pageIndex + 1))
    params.set("pageSize", String(pagination.pageSize))

    if (globalFilter) {
      params.set(searchParamName, globalFilter)
    }

    const next = params.toString()
    const current = searchParams.toString()

    if (next !== current) {
      router.replace(`?${next}`, { scroll: false })
    }
  }, [pagination, globalFilter, router, searchParamName]) // ❗ NÃO usar searchParams aqui

  return {
    pagination,
    setPagination,
    globalFilter,
    setGlobalFilter,
  }
}
