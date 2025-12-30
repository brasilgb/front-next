"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { ColumnDef, SortingState } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { useDebounce } from "@/hooks/use-debounce"

interface Props<T> {
  columns: ColumnDef<T, any>[]
  data: T[]
  total: number
  page: number
  pageSize: number
  search: string
}

export default function CustomersTable<T>({
  columns,
  data,
  total,
  page,
  pageSize,
  search,
}: Props<T>) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [isSearching, setIsSearching] = useState(false)

  const [value, setValue] = useState(search)
  const [isTyping, setIsTyping] = useState(false)

  const debouncedSearch = useDebounce(value, 500)

  /* ===============================
     Navegação centralizada
  =============================== */
  function navigate(params: Partial<{
    page: number
    pageSize: number
    search: string
    sortBy?: string
    sortDir?: string
  }>) {
    const query = new URLSearchParams(searchParams.toString())

    if (params.page !== undefined) query.set("page", String(params.page))
    if (params.pageSize !== undefined) query.set("pageSize", String(params.pageSize))
    if (params.search !== undefined) query.set("search", params.search)
    if (params.sortBy !== undefined) query.set("sortBy", params.sortBy)
    if (params.sortDir !== undefined) query.set("sortDir", params.sortDir)

    startTransition(() => {
      router.push(`/app/budgets?${query.toString()}`)
    })
  }

  /* ===============================
     Debounce da busca
  =============================== */
  useEffect(() => {
    if (debouncedSearch !== search) {
      setIsTyping(false)
      navigate({ page: 1, search: debouncedSearch })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      setIsSearching(false)

      startTransition(() => {
        navigate({ page: 1, search: value })
      })
    }
  }

  function handleSearchChange(val: string) {
    setIsTyping(true)
    setValue(val)
  }

  useEffect(() => {
    if (debouncedSearch !== search) {
      setIsSearching(false)

      startTransition(() => {
        navigate({ page: 1, search: debouncedSearch })
      })
    }
  }, [debouncedSearch])

  function clearSearch() {
    setValue("")
    setIsTyping(false)
    navigate({ page: 1, search: "" })
  }

  /* ===============================
     Sorting
  =============================== */
  const sorting: SortingState = searchParams.get("sortBy")
    ? [
      {
        id: searchParams.get("sortBy")!,
        desc: searchParams.get("sortDir") === "desc",
      },
    ]
    : []

  function handleSortingChange(
    updater: SortingState | ((old: SortingState) => SortingState)
  ) {
    const next =
      typeof updater === "function" ? updater(sorting) : updater

    const params = new URLSearchParams(searchParams.toString())
    params.set("page", "1")

    if (!next || next.length === 0) {
      params.delete("sortBy")
      params.delete("sortDir")
    } else {
      const sort = next[0]
      if (!sort?.id) return

      params.set("sortBy", sort.id)
      params.set("sortDir", sort.desc ? "desc" : "asc")
    }

    startTransition(() => {
      router.push(`/app/budgets?${params.toString()}`)
    })
  }

  /* ===============================
     Render
  =============================== */
  return (
    <DataTable
      columns={columns}
      data={data ?? []}
      total={total}
      page={page}
      pageSize={pageSize}
      searchValue={value}
      onSearchChange={handleSearchChange}
      onSearchKeyDown={handleKeyDown}
      onClearSearch={clearSearch}
      isLoading={isPending}
      onPageChange={(p) =>
        startTransition(() => {
          navigate({ page: p })
        })
      }
      placeholder="Pesquise por categoria e serviço"
      addButton={{
        text: "Novo Orçamento",
        url: "/app/budgets/create",
      }}
      sorting={sorting}
      onSortingChange={handleSortingChange}
    />
  )
}
